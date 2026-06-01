"""expand news item title to text

Revision ID: b4e9d2a1c8f0
Revises: a1b2c3d4e5f6
Create Date: 2026-06-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b4e9d2a1c8f0"
down_revision: Union[str, Sequence[str], None] = "a1b2c3d4e5f6"
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


def _recreate_public_news_items_view() -> None:
    op.execute(PUBLIC_NEWS_ITEMS_VIEW)
    op.execute("GRANT SELECT ON public.public_news_items TO anon, authenticated")


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "news_items" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("news_items")}
    if "title" not in columns:
        return

    if bind.dialect.name == "postgresql":
        op.execute("DROP VIEW IF EXISTS public.public_news_items")
        op.alter_column(
            "news_items",
            "title",
            existing_type=sa.String(length=500),
            type_=sa.Text(),
            existing_nullable=False,
        )
        _recreate_public_news_items_view()
        return

    with op.batch_alter_table("news_items") as batch_op:
        batch_op.alter_column(
            "title",
            existing_type=sa.String(length=500),
            type_=sa.Text(),
            existing_nullable=False,
        )


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "news_items" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("news_items")}
    if "title" not in columns:
        return

    if bind.dialect.name == "postgresql":
        op.execute("DROP VIEW IF EXISTS public.public_news_items")
        op.alter_column(
            "news_items",
            "title",
            existing_type=sa.Text(),
            type_=sa.String(length=500),
            existing_nullable=False,
            postgresql_using="left(title, 500)",
        )
        _recreate_public_news_items_view()
        return

    with op.batch_alter_table("news_items") as batch_op:
        batch_op.alter_column(
            "title",
            existing_type=sa.Text(),
            type_=sa.String(length=500),
            existing_nullable=False,
        )
