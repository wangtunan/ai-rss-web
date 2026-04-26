from typing import Iterable
from datetime import date
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.db.models import NewsItem

def save_news_items(session: Session, items: Iterable[dict]) -> tuple[int, int]:
    """
    批量写入新闻，按 link 去重。
    返回: (inserted_count, skipped_count)
    """

    candidate_rows = []
    seen_links = set()

    for item in items:
        link = (item.get("link") or "").strip()
        if not link or link in seen_links:
            continue
        seen_links.add(link)

        candidate_rows.append({
            "source": item.get("source", ""),
            "category": item.get("category", ""),
            "title": item.get("title", ""),
            "link": link,
            "published_time": item.get("published_time", ""),
            "raw_content": item.get("raw_content", ""),
            "ai_summary": item.get("ai_summary", ""),
            "ai_tags": item.get("ai_tags", []),
            "ai_importance": item.get("ai_importance", 3),
        })
    
    if not candidate_rows:
        return 0, 0

    links = [row["link"] for row in candidate_rows]
    existing_links = {
        link
        for (link,) in session.query(NewsItem.link)
        .filter(NewsItem.link.in_(links))
        .all()
    }

    rows = [row for row in candidate_rows if row["link"] not in existing_links]
    if rows:
        session.add_all(NewsItem(**row) for row in rows)
    session.commit()

    inserted = len(rows)
    skipped = len(candidate_rows) - inserted
    return inserted, skipped


def list_news_items(
    session: Session,
    *,
    category: str | None = None,
    source: str | None = None,
    ingest_date: date | None = None,
    limit: int = 100,
    offset: int = 0,
) -> tuple[list[NewsItem], int]:
    """
    根据条件查询新闻列表。
    """

    safe_limit = max(1, min(limit, 500))
    safe_offset = max(0, offset)
    query = session.query(NewsItem)

    if category:
        query = query.filter(NewsItem.category == category)
    
    if source:
        query = query.filter(NewsItem.source == source)
    
    if ingest_date:
        query = query.filter(NewsItem.ingest_date == ingest_date)
    
    total = query.count()

    date_key = func.substr(NewsItem.published_time, 1, 10)

    items = (
        query.order_by(
            desc(date_key),
            desc(NewsItem.ai_importance),
            desc(NewsItem.id),
        )
        .offset(safe_offset)
        .limit(safe_limit)
        .all()
    )

    return items, total