#!/usr/bin/env bash

set -eu

cd "$(dirname "$0")"

if command -v uv >/dev/null 2>&1; then
  uv run python -m alembic upgrade head
  uv run python -m app.jobs.import_rss_sources "$@"
else
  if [ -f ".venv/Scripts/activate" ]; then
    # Git Bash on Windows.
    source ".venv/Scripts/activate"
  elif [ -f ".venv/bin/activate" ]; then
    source ".venv/bin/activate"
  fi

  python -m alembic upgrade head
  python -m app.jobs.import_rss_sources "$@"
fi
