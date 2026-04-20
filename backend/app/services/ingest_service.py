from sqlalchemy.orm import Session
from time import perf_counter

from app.db.session import SessionLocal
from app.repositories.news_repository import save_news_items
from app.services.feed_service import parse_feeds
from app.services.source_loader import load_sources
from app.services.summarize_service import summary_entries
from app.services.raw_backup_service import backup_entries, is_raw_backup_enabled


def _attach_source_name(entries: list[dict], sources: list[dict]) -> list[dict]:
    """
    根据 category 回填 source 名称，便于后续落库展示。
    """

    category_to_name = {
        (src.get("category") or ""): (src.get("name") or "")
        for src in sources
    }

    enriched: list[dict] = []

    for item in entries:
        category = item.get("category", "")
        enriched.append(
            {
                **item,
                "source": category_to_name.get(category, category),
            }
        )
    
    return enriched


def run_ingest(max_entries: int = 20) -> dict:
    """
    执行一次抓取 -> 摘要 -> 入库流程。
    返回统计信息，供 job 命令输出。
    """
    if max_entries < 1:
        raise ValueError("max_entries 必须 >= 1")

    started_at = perf_counter()
    print("🚀 开始执行抓取任务...")

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
    print(f"🎉 任务完成：新增 {inserted} 条，跳过重复 {skipped} 条，耗时 {elapsed:.1f}s")
    
    return {
        "source_count": len(sources),
        "fetched_count": len(raw_entries),
        "summarized_count": len(summarized_entries),
        "inserted_count": inserted,
        "skipped_count": skipped,
    }
