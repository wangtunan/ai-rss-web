"""create rss_sources table

Revision ID: 8b7c6d5e4f3a
Revises: 3f2d8a9b6c01
Create Date: 2026-05-03 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "8b7c6d5e4f3a"
down_revision: Union[str, Sequence[str], None] = "3f2d8a9b6c01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    table_created = False

    if "rss_sources" not in inspector.get_table_names():
        op.create_table(
            "rss_sources",
            sa.Column(
                "id",
                postgresql.UUID(as_uuid=True),
                server_default=sa.text("gen_random_uuid()"),
                nullable=False,
            ),
            sa.Column("category", sa.String(length=100), nullable=False),
            sa.Column("name", sa.String(length=200), nullable=False),
            sa.Column("url", sa.String(length=1000), nullable=False),
            sa.Column("enabled", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("sort_order", sa.Integer(), server_default=sa.text("0"), nullable=False),
            sa.Column("max_entries", sa.Integer(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("url", name="uq_rss_sources_url"),
        )
        table_created = True

    indexes = set() if table_created else {index["name"] for index in inspector.get_indexes("rss_sources")}
    if op.f("ix_rss_sources_category") not in indexes:
        op.create_index(op.f("ix_rss_sources_category"), "rss_sources", ["category"], unique=False)
    if op.f("ix_rss_sources_enabled") not in indexes:
        op.create_index(op.f("ix_rss_sources_enabled"), "rss_sources", ["enabled"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "rss_sources" not in inspector.get_table_names():
        return

    indexes = {index["name"] for index in inspector.get_indexes("rss_sources")}
    if op.f("ix_rss_sources_enabled") in indexes:
        op.drop_index(op.f("ix_rss_sources_enabled"), table_name="rss_sources")
    if op.f("ix_rss_sources_category") in indexes:
        op.drop_index(op.f("ix_rss_sources_category"), table_name="rss_sources")

    op.drop_table("rss_sources")
