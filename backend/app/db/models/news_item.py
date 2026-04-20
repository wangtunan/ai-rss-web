from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint, func, Date
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class NewsItem(Base):
    __tablename__ = "news_items"
    __table_args__ = (UniqueConstraint("link", name="uq_news_items_link"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source: Mapped[str] = mapped_column(String(100), default="")
    category: Mapped[str] = mapped_column(String(100), index=True)
    title: Mapped[str] = mapped_column(String(500))
    link: Mapped[str] = mapped_column(String(1000))
    published_time: Mapped[str] = mapped_column(String(32), default="")
    raw_content: Mapped[str] = mapped_column(Text, default="")
    ai_summary: Mapped[str] = mapped_column(Text, default="")
    ai_tags: Mapped[list] = mapped_column(JSONB, default=list)
    ai_importance: Mapped[int] = mapped_column(Integer, default=3)
    ingest_date: Mapped[datetime] = mapped_column(Date, server_default=func.current_date(), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
