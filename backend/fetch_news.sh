#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

MAX_ENTRIES="${1:-20}"

mkdir -p data

if command -v uv >/dev/null 2>&1; then
  uv run python -m alembic upgrade head
  uv run python -m app.jobs.fetch_news --max-entries "$MAX_ENTRIES"
else
  if [ -f ".venv/Scripts/activate" ]; then
    # Git Bash on Windows.
    source ".venv/Scripts/activate"
  elif [ -f ".venv/bin/activate" ]; then
    source ".venv/bin/activate"
  fi

  python -m alembic upgrade head
  python -m app.jobs.fetch_news --max-entries "$MAX_ENTRIES"
fi