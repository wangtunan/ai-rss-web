import argparse
import sys

from app.db.session import SessionLocal
from app.repositories.rss_source_repository import upsert_rss_sources
from app.services.source_loader import load_sources_from_yml


def main() -> None:
    parser = argparse.ArgumentParser(description="Import backend/sources/*.yml into rss_sources.")
    parser.add_argument(
        "--source-file",
        action="append",
        default=[],
        help="Only load one source yml from backend/sources. Can be repeated.",
    )
    parser.add_argument("source_files", nargs="*", help="Source yml files under backend/sources")
    args = parser.parse_args()

    source_files = [*args.source_file, *args.source_files]

    try:
        print("📦 正在加载 yml RSS 源配置...")
        sources = load_sources_from_yml(source_files=source_files)
        print(f"✅ 已加载 {len(sources)} 个源")

        session = SessionLocal()
        try:
            inserted, updated = upsert_rss_sources(session, sources)
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

        print(f"🎉 导入完成：新增 {inserted} 个，更新 {updated} 个")
    except Exception as e:
        print(f"[import_rss_sources] failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
