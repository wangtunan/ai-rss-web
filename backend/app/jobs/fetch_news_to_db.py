import argparse
import sys

from app.services.ingest_service import fetch_news_to_db


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch RSS news and store into the configured database.")
    parser.add_argument("--max-entries", type=int, default=20, help="Max entries per source")
    parser.add_argument(
        "--source-file",
        action="append",
        default=[],
        help="Only load one source yml from backend/sources. Can be repeated.",
    )
    parser.add_argument("source_files", nargs="*", help="Source yml files under backend/sources")
    args = parser.parse_args()

    try:
        fetch_news_to_db(max_entries=args.max_entries, source_files=[*args.source_file, *args.source_files])
    except Exception as e:
        print(f"[fetch_news_to_db] failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
