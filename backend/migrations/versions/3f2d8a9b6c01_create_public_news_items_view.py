"""create public news items view

Revision ID: 3f2d8a9b6c01
Revises: c0804ab220a9
Create Date: 2026-05-02 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "3f2d8a9b6c01"
down_revision: Union[str, Sequence[str], None] = "c0804ab220a9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


PUBLIC_NEWS_ITEMS_VIEW = """
CREATE OR REPLACE VIEW public.public_news_items AS
SELECT
    id,
    source,
    category,
    title,
    link,
    published_time,
    ai_summary,
    ai_tags,
    ai_importance,
    ingest_date,
    created_at,
    updated_at
FROM public.news_items
"""


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    op.execute(PUBLIC_NEWS_ITEMS_VIEW)
    op.execute("ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY")
    op.execute("REVOKE ALL ON TABLE public.news_items FROM anon, authenticated")
    op.execute("GRANT USAGE ON SCHEMA public TO anon, authenticated")
    op.execute("GRANT SELECT ON public.public_news_items TO anon, authenticated")


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    op.execute("REVOKE SELECT ON public.public_news_items FROM anon, authenticated")
    op.execute("DROP VIEW IF EXISTS public.public_news_items")
