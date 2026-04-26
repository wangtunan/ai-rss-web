import argparse
import sys

from app.services.ingest_service import local_fetch_news


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch RSS news and store into local SQLite for API mode.")
    parser.add_argument("--max-entries", type=int, default=20, help="Max entries per source")
    args = parser.parse_args()

    try:
        local_fetch_news(max_entries=args.max_entries)
    except Exception as e:
        print(f"[local_fetch_news] failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()