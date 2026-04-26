def serialize_news_row(row) -> dict:
    """
    序列化新闻行数据为字典。
    """
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