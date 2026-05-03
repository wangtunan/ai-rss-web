import feedparser

from concurrent.futures import ThreadPoolExecutor, as_completed
from time import strftime


def _resolve_max_entries(feed_item: dict, default: int) -> int:
    value = feed_item.get("max_entries")
    if value is None or value == "":
        return default
    try:
        return max(1, int(value))
    except (TypeError, ValueError):
        return default


def _parse_one_feed(feed_item: dict, max_entries: int = 10) -> list[dict]:
    feed_url = feed_item.get("url")
    feed_category = feed_item.get("category", "")
    feed_max_entries = _resolve_max_entries(feed_item, max_entries)

    if not feed_url:
        return []

    feed = feedparser.parse(feed_url)
    sorted_entries = sorted(
        feed.entries,
        key=lambda entry: entry.get("published_parsed") or entry.get("updated_parsed") or (0,) * 9,
        reverse=True,
    )

    result: list[dict] = []
    for entry in sorted_entries[:feed_max_entries]:
        content = entry.get("summary", "") or entry.get("description", "")
        time_struct = entry.get("published_parsed") or entry.get("updated_parsed")
        formatted_time = strftime("%Y-%m-%d %H:%M:%S", time_struct) if time_struct else ""

        result.append(
            {
                "category": feed_category,
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published_time": formatted_time,
                "raw_content": content[:500],
            }
        )

    return result


def parse_feeds(feed_sources: list[dict], max_entries: int = 10) -> list[dict]:
    """
    并发解析多个 feed 源，返回扁平化条目列表。
    """
    if not feed_sources:
        return []

    entries: list[dict] = []
    workers = min(max(len(feed_sources), 4), 20)

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(_parse_one_feed, item, max_entries) for item in feed_sources]

        for future in as_completed(futures):
            try:
                entries.extend(future.result())
            except Exception as exc:
                # 单个源失败不影响整体抓取。
                print(f"Error parsing feed: {exc}")

    return entries
