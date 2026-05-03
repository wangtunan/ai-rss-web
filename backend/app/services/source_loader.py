import os
from pathlib import Path
from typing import Sequence

import yaml


def _sources_dir() -> Path:
    return Path(__file__).resolve().parents[2] / "sources"


def _load_single_file(file_path: Path) -> list[dict]:
    with file_path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    sources = data.get("sources")
    if not isinstance(sources, list):
        raise ValueError(f"Invalid source file {file_path}: `sources` must be a list")
    return sources


def _resolve_source_file(source_file: str, sources_dir: Path) -> Path:
    source_name = source_file.strip()
    if not source_name:
        raise ValueError("Source file name cannot be empty")

    source_path = Path(source_name)
    if not source_path.suffix:
        source_path = source_path.with_suffix(".yml")

    file_path = source_path if source_path.is_absolute() else sources_dir / source_path.name
    if not file_path.exists():
        raise FileNotFoundError(f"Source file not found: {file_path}")

    return file_path


def _load_sources_from_db() -> list[dict]:
    """
    从数据库加载启用状态的 RSS 源。
    """
    from app.db.session import SessionLocal
    from app.repositories.rss_source_repository import list_enabled_rss_sources

    session = SessionLocal()
    try:
        return list_enabled_rss_sources(session)
    finally:
        session.close()


def load_sources_from_yml(source_files: Sequence[str] | None = None) -> list[dict]:
    """
    读取 sources/sources.yml 入口文件，解析 include 列表，
    逐个加载子文件并合并返回 feed 列表。
    """
    sources_dir = _sources_dir()
    if source_files:
        selected_sources: list[dict] = []
        for source_file in source_files:
            selected_sources.extend(_load_single_file(_resolve_source_file(source_file, sources_dir)))
        return selected_sources

    entry_path = sources_dir / "sources.yml"

    if not entry_path.exists():
        raise FileNotFoundError(f"Entry file not found: {entry_path}")

    with entry_path.open("r", encoding="utf-8") as f:
        entry_data = yaml.safe_load(f) or {}

    includes = entry_data.get("include")
    if not isinstance(includes, list):
        raise ValueError(f"Invalid entry file {entry_path}: `include` must be a list")

    all_sources: list[dict] = []
    for rel_path in includes:
        sub_path = sources_dir / rel_path
        if not sub_path.exists():
            raise FileNotFoundError(f"Included file not found: {sub_path}")
        all_sources.extend(_load_single_file(sub_path))

    # 入口文件也可直接定义 sources（混合模式）
    all_sources.extend(entry_data.get("sources", []))

    return all_sources


def load_sources(source_files: Sequence[str] | None = None) -> list[dict]:
    """
    RSS_SOURCE_MODE=auto 时优先读取数据库 rss_sources，失败或为空时回退到 yml。
    RSS_SOURCE_MODE=db 时只读取数据库。
    RSS_SOURCE_MODE=yml 时只读取 yml。
    显式传入 source_files 时始终读取 yml，方便调试或只抓某个文件。
    """
    if source_files:
        return load_sources_from_yml(source_files=source_files)

    mode = os.getenv("RSS_SOURCE_MODE", "auto").strip().lower()
    if mode not in {"auto", "db", "database", "yml", "yaml"}:
        raise ValueError("RSS_SOURCE_MODE must be one of: auto, db, yml")

    if mode in {"yml", "yaml"}:
        return load_sources_from_yml()

    try:
        db_sources = _load_sources_from_db()
        if db_sources:
            return db_sources
        if mode in {"db", "database"}:
            raise RuntimeError("No enabled RSS sources found in database")
        print("⚠️ 数据库中没有可用 RSS 源，改用 yml 配置")
    except Exception as e:
        if mode in {"db", "database"}:
            raise
        print(f"⚠️ 无法从数据库加载 RSS 源，改用 yml 配置：{e}")

    return load_sources_from_yml()


if __name__ == "__main__":
    print(load_sources())
