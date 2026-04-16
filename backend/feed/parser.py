import feedparser
from time import strftime
from concurrent.futures import ThreadPoolExecutor, as_completed


def _parse_one_feed(feed_item: dict, max_entries: int = 10):
    feed_url = feed_item.get("url")
    feed_category = feed_item.get("category")

    if not feed_url:
        return []
    
    feed = feedparser.parse(feed_url)
    # 按发布时间排序
    sorted_entries = sorted(
        feed.entries,
        key=lambda e: e.get("published_parsed") or e.get("updated_parsed") or (0,) * 9,
        reverse=True,
    )
    result = []
    for entry in sorted_entries[:max_entries]:
        content = entry.get("summary", "") or entry.get("description", "")
        time_struct = entry.get("published_parsed") or entry.get("updated_parsed")
        formatted_time = strftime('%Y-%m-%d %H:%M:%S', time_struct) if time_struct else ""

        result.append({
            "category": feed_category,
            "title": entry.get("title", ""),
            "link": entry.get("link", ""),
            "published_time": formatted_time,
            "raw_content": content[:500]
        })
    
    return result

def parse_feeds(feed_sources: list[dict], max_entries: int = 10):
    """
    批量解析多个 feed 源
    """
    entries = []
    workers = max(len(feed_sources), 10)

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(_parse_one_feed, item, max_entries) for item in feed_sources]

        for f in as_completed(futures):
            try:
                entries.extend(f.result())
            except Exception as e:
                print(f"Error parsing feed: {e}")
    
    return entries