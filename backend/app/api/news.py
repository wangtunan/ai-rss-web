from fastapi import APIRouter, Query
from datetime import datetime, date

from app.db.session import SessionLocal
from app.repositories.news_repository import list_news_items
from app.utils.news import serialize_news_row

router = APIRouter(prefix="/api/v1/news", tags=["news"])

@router.get("")
def get_news(limit: int = Query(default=100, ge=1, le=500)) -> dict:
    session = SessionLocal()

    try:
        rows, _total = list_news_items(session, limit=limit, offset=0)
        items = [serialize_news_row(row) for row in rows]
    finally:
        session.close()
    
    now_label = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "last_updated": now_label,
        "items": items
    } 

@router.get("/list")
def get_news_list(
    category: str | None = None,
    source: str | None = None,
    ingest_date: date | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0)
) -> dict:
    session = SessionLocal()

    try: 
        rows, total = list_news_items(
            session,
            category=category,
            source=source,
            ingest_date=ingest_date,
            limit=limit,
            offset=offset
        )
        items = [serialize_news_row(row) for row in rows]
    finally:
        session.close()
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": items
    }