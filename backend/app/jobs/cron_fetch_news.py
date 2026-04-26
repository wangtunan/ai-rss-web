import argparse
import sys

from app.services.ingest_service import cron_fetch_news


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch RSS news and export static JSON.")
    parser.add_argument("--max-entries", type=int, default=20, help="Max entries per source")
    args = parser.parse_args()

    try:
        cron_fetch_news(max_entries=args.max_entries)
    except Exception as e:
        print(f"[cron_fetch_news] failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
