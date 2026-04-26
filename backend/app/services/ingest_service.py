import json

from datetime import datetime
from pathlib import Path
from sqlalchemy.orm import Session
from time import perf_counter

from app.db.session import SessionLocal
from app.repositories.news_repository import save_news_items
from app.services.feed_service import parse_feeds
from app.services.raw_backup_service import backup_entries, is_raw_backup_enabled
from app.services.source_loader import load_sources
from app.services.summarize_service import summary_entries


def _project_root() -> Path:
    return Path(__file__).resolve().parents[3]


def _attach_source_name(entries: list[dict], sources: list[dict]) -> list[dict]:
    """
    根据 category 回填 source 名称，便于后续落库展示。
    """

    category_to_name = {
        (src.get("category") or ""): (src.get("name") or "")
        for src in sources
    }

    return [
        {
            **item,
            "source": category_to_name.get(item.get("category", ""), item.get("category", "")),
        }
        for item in entries
    ]


def _collect_summarized_entries(max_entries: int = 20) -> tuple[list[dict], list[dict], dict]:
    if max_entries < 1:
        raise ValueError("max_entries 必须 >= 1")

    print("📦 正在加载 feed 源配置...")
    sources = load_sources()
    print(f"✅ 已加载 {len(sources)} 个源（每源最多抓取 {max_entries} 条）")

    print("🌐 正在抓取并解析 RSS...")
    raw_entries = parse_feeds(sources, max_entries=max_entries)
    print(f"✅ 抓取完成，共 {len(raw_entries)} 条")

    print("🤖 正在调用 AI 生成摘要（这一步可能较慢）...")
    raw_entries = _attach_source_name(raw_entries, sources)
    summarized_entries = summary_entries(raw_entries)
    print(f"✅ 摘要完成，共 {len(summarized_entries)} 条")

    if is_raw_backup_enabled():
        print("💾 正在备份摘要数据...")
        backup_entries(summarized_entries)

    return summarized_entries, sources, {
        "source_count": len(sources),
        "fetched_count": len(raw_entries),
        "summarized_count": len(summarized_entries),
    }


def _write_json(output_path: Path, payload: dict) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)
        file.write("\n")


def _export_summarized_news_json(summarized_entries: list[dict], sources: list[dict], limit: int = 500) -> tuple[Path, int]:
    """
    将摘要数据导出给前端静态模式读取。
    """
    updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sorted_items = sorted(
        summarized_entries,
        key=lambda item: item.get("published_time") or "",
        reverse=True,
    )

    public_data_dir = _project_root() / "frontend" / "public" / "data"
    category_dir = public_data_dir / "news"
    category_dir.mkdir(parents=True, exist_ok=True)
    for old_file in category_dir.glob("*.json"):
        old_file.unlink()

    output_path = category_dir / "all.json"
    _write_json(
        output_path,
        {
            "total": len(sorted_items),
            "limit": limit,
            "offset": 0,
            "items": sorted_items[:limit],
        },
    )

    for source in sources:
        category = source.get("category")
        if not category:
            continue

        category_items = [item for item in sorted_items if item.get("category") == category]
        _write_json(
            category_dir / f"{category}.json",
            {
                "total": len(category_items),
                "limit": 10,
                "offset": 0,
                "items": category_items[:10],
            },
        )

    return output_path, min(len(sorted_items), limit)


def local_fetch_news(max_entries: int = 20) -> dict:
    """
    执行一次抓取 -> 摘要 -> 入库流程。
    返回统计信息，供 job 命令输出。
    """
    started_at = perf_counter()
    print("🚀 开始执行抓取任务...")
    summarized_entries, sources, stats = _collect_summarized_entries(max_entries=max_entries)

    print("💾 正在写入数据库（自动去重）...")
    session: Session = SessionLocal()
    try:
        inserted, skipped = save_news_items(session, summarized_entries)
    except Exception:
        session.rollback()
        print("❌ 入库失败，已回滚事务")
        raise
    finally:
        session.close()
    
    elapsed = perf_counter() - started_at
    print(
        f"🎉 任务完成：新增 {inserted} 条，跳过重复 {skipped} 条，耗时 {elapsed:.1f}s"
    )
    
    return {
        **stats,
        "inserted_count": inserted,
        "skipped_count": skipped
    }


def cron_fetch_news(max_entries: int = 20) -> dict:
    """
    执行一次抓取 -> 摘要 -> 导出静态 JSON 流程（不写数据库）。
    """
    started_at = perf_counter()
    print("🚀 开始执行静态导出任务...")
    summarized_entries, sources, stats = _collect_summarized_entries(max_entries=max_entries)

    print("🧾 正在导出前端静态 JSON...")
    output_path, exported_count = _export_summarized_news_json(summarized_entries, sources)

    elapsed = perf_counter() - started_at
    print(f"🎉 静态导出完成：导出 {exported_count} 条到 {output_path}，耗时 {elapsed:.1f}s")

    return {
        **stats,
        "exported_count": exported_count,
        "output_path": str(output_path),
    }
