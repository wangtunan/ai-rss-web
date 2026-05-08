"""add rss sources rls policies

Revision ID: a1b2c3d4e5f6
Revises: 8b7c6d5e4f3a
Create Date: 2026-05-03 21:40:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "8b7c6d5e4f3a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


POLICIES = (
    (
        "rss_sources_select_all",
        "FOR SELECT TO anon, authenticated USING (true)",
    ),
    (
        "rss_sources_insert_all",
        "FOR INSERT TO anon, authenticated WITH CHECK (true)",
    ),
    (
        "rss_sources_update_all",
        "FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)",
    ),
    (
        "rss_sources_delete_all",
        "FOR DELETE TO anon, authenticated USING (true)",
    ),
)


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    op.execute("ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY")
    op.execute("GRANT USAGE ON SCHEMA public TO anon, authenticated")
    op.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON public.rss_sources TO anon, authenticated")

    for name, body in POLICIES:
        op.execute(f"DROP POLICY IF EXISTS {name} ON public.rss_sources")
        op.execute(f"CREATE POLICY {name} ON public.rss_sources {body}")


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    for name, _body in POLICIES:
        op.execute(f"DROP POLICY IF EXISTS {name} ON public.rss_sources")

    op.execute("REVOKE SELECT, INSERT, UPDATE, DELETE ON public.rss_sources FROM anon, authenticated")
