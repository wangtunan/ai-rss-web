from typing import Iterable
from sqlalchemy import desc
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.db.models import NewsItem

def save_news_items(session: Session, items: Iterable[dict]) -> tuple[int, int]:
    """
    批量写入新闻，按 link 去重。
    返回: (inserted_count, skipped_count)
    """

    rows = []

    for item in items:
        link = (item.get("link") or "").strip()
        if not link:
            continue

        rows.append({
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
    
    if not rows:
        return 0, 0
    
    stmt = insert(NewsItem).values(rows)
    stmt = stmt.on_conflict_do_nothing(index_elements=["link"]).returning(NewsItem.id)

    inserted_ids  = session.execute(stmt).scalars().all()
    session.commit()

    inserted = len(inserted_ids)
    skipped = len(rows) - inserted
    return inserted, skipped


def list_news_items(session: Session, limit: int = 100) -> list[NewsItem]:
    limit = max(1, min(limit, 500))

    return (
        session.query(NewsItem)
        .order_by(desc(NewsItem.created_at))
        .limit(limit)
        .all()
    )