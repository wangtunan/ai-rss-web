#!/usr/bin/env bash

set -eu

cd "$(dirname "$0")"

MAX_ENTRIES="20"
case "${1:-}" in
  ''|*[!0-9]*) ;;
  *)
    MAX_ENTRIES="$1"
    shift
    ;;
esac

mkdir -p data

if command -v uv >/dev/null 2>&1; then
  uv run python -m app.jobs.fetch_news_to_json --max-entries "$MAX_ENTRIES" "$@"
else
  if [ -f ".venv/Scripts/activate" ]; then
    # Git Bash on Windows.
    source ".venv/Scripts/activate"
  elif [ -f ".venv/bin/activate" ]; then
    source ".venv/bin/activate"
  fi

  python -m app.jobs.fetch_news_to_json --max-entries "$MAX_ENTRIES" "$@"
fi
