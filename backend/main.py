import json
from datetime import datetime
from pathlib import Path

from tools.tools import get_feed_sources
from feed.parser import parse_feeds
from llm.summary import summary_entries


def generate_json(entries: list[dict]):
    """
     生成 JSON 数据
    """
    data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "items": entries
    }
    with open("../frontend/public/data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def save_raw_entries(entries: list[dict]):
    """
    保存原始数据
    """
    now = datetime.now()
    date_dir = Path("data") / now.strftime("%Y-%m-%d")
    date_dir.mkdir(parents=True, exist_ok=True)
    file_path = date_dir / f"raw_{now.strftime('%H%M%S')}.json"
    payload = {
        "generated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "count": len(entries),
        "items": entries,
    }
    with file_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

def main():
    print("Generating JSON data...")
    sources = get_feed_sources()
    print("Parsing feeds...")
    entries = parse_feeds(sources)
    print("Summarizing entries...")
    summarized_entries = summary_entries(entries)
    print("Generating JSON data...")
    generate_json(summarized_entries)
    print("Saving raw entries...")
    save_raw_entries(entries)
    print("All tasks completed successfully")

if __name__ == "__main__":
   main()