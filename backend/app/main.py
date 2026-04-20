from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, date

from app.db.session import SessionLocal
from app.repositories.news_repository import list_news_items

app = FastAPI(title="AI RSS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-rss-web.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _serialize_news_row(row) -> dict:
    return {
        "category": row.category,
        "source": row.source,
        "title": row.title,
        "link": row.link,
        "published_time": row.published_time,
        "raw_content": row.raw_content,
        "ai_summary": row.ai_summary,
        "ai_tags": row.ai_tags or [],
        "ai_importance": row.ai_importance,
        "ingest_date": row.ingest_date.isoformat() if row.ingest_date else None,
    }

@app.get("/health")
def health_check() -> dict[str, bool]:
    return { "ok": True }


@app.get("/api/v1/news")
def get_news(limit: int = Query(default=100, ge=1, le=500)) -> dict:
    session = SessionLocal()

    try:
        rows, _total = list_news_items(session, limit=limit, offset=0)
        items = [_serialize_news_row(row) for row in rows]
    finally:
        session.close()
    
    now_label = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "last_updated": now_label,
        "items": items
    } 

@app.get("/api/v1/news/list")
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
        items = [_serialize_news_row(row) for row in rows]
    finally:
        session.close()
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": items
    }