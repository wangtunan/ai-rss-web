from typing import Iterable
from datetime import date, timedelta
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


def delete_old_news_items(session: Session, days: int = 7) -> int:
    """
    删除超过 N 天的新闻记录（基于 ingest_date）。
    返回删除的行数。
    """
    cutoff = date.today() - timedelta(days=days)
    deleted = session.query(NewsItem).filter(NewsItem.ingest_date < cutoff).delete()
    session.commit()
    return deleted


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


def list_curated_news_items(
    session: Session,
    *,
    categories: list[str] | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[NewsItem], int]:
    """
    List the highest AI-rated items inside a scoped time window.
    """

    safe_limit = max(1, min(limit, 100))
    safe_offset = max(0, offset)
    query = session.query(NewsItem)
    date_key = func.substr(NewsItem.published_time, 1, 10)

    if categories:
        query = query.filter(NewsItem.category.in_(categories))

    if start_date:
        query = query.filter(date_key >= start_date.isoformat())

    if end_date:
        query = query.filter(date_key <= end_date.isoformat())

    total = query.count()

    items = (
        query.order_by(
            desc(NewsItem.ai_importance),
            desc(date_key),
            desc(NewsItem.id),
        )
        .offset(safe_offset)
        .limit(safe_limit)
        .all()
    )

    return items, total
