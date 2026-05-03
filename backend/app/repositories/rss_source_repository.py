from typing import Iterable

from sqlalchemy.orm import Session

from app.db.models import RssSource


def _parse_optional_int(value: object) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _parse_bool(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() not in {"0", "false", "no", "off"}
    return bool(value)


def upsert_rss_sources(session: Session, sources: Iterable[dict]) -> tuple[int, int]:
    """
    Import RSS sources by URL.
    Returns: (inserted_count, updated_count)
    """

    candidate_rows = []
    seen_urls = set()

    for index, source in enumerate(sources):
        url = (source.get("url") or "").strip()
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)

        candidate_rows.append(
            {
                "category": (source.get("category") or "").strip(),
                "name": (source.get("name") or "").strip(),
                "url": url,
                "enabled": _parse_bool(source.get("enabled", True)),
                "sort_order": _parse_optional_int(source.get("sort_order")) or index,
                "max_entries": _parse_optional_int(source.get("max_entries")),
            }
        )

    if not candidate_rows:
        return 0, 0

    existing_by_url = {
        rss_source.url: rss_source
        for rss_source in session.query(RssSource)
        .filter(RssSource.url.in_([row["url"] for row in candidate_rows]))
        .all()
    }

    inserted = 0
    updated = 0

    for row in candidate_rows:
        existing = existing_by_url.get(row["url"])
        if existing is None:
            session.add(RssSource(**row))
            inserted += 1
            continue

        existing.category = row["category"]
        existing.name = row["name"]
        existing.enabled = row["enabled"]
        existing.sort_order = row["sort_order"]
        existing.max_entries = row["max_entries"]
        updated += 1

    session.commit()
    return inserted, updated


def list_enabled_rss_sources(session: Session) -> list[dict]:
    """
    Return enabled RSS sources in the dict shape used by the feed parser.
    """

    rows = (
        session.query(RssSource)
        .filter(RssSource.enabled.is_(True))
        .order_by(RssSource.sort_order.asc(), RssSource.category.asc(), RssSource.name.asc())
        .all()
    )

    return [
        {
            "category": row.category,
            "name": row.name,
            "url": row.url,
            "enabled": row.enabled,
            "sort_order": row.sort_order,
            "max_entries": row.max_entries,
        }
        for row in rows
    ]
