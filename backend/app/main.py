from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.db.session import SessionLocal
from app.repositories.news_repository import list_news_items

app = FastAPI(title="AI RSS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-rss-web.vercel.app/"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check() -> dict[str, bool]:
    return { "ok": True }



@app.get("/api/v1/news")
def get_news(limit: int = Query(default=100, ge=1, le=500)) -> dict:
    session = SessionLocal()

    try:
        rows = list_news_items(session, limit=limit)

        items = [
            {
                "category": row.category,
                "title": row.title,
                "link": row.link,
                "published_time": row.published_time,
                "raw_content": row.raw_content,
                "ai_summary": row.ai_summary,
                "ai_tags": row.ai_tags or [],
                "ai_importance": row.ai_importance,
            }
            for row in rows
        ]
    finally:
        session.close()
    
    now_label = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "last_updated": now_label,
        "items": items
    } 