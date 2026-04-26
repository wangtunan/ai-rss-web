#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

if command -v uv >/dev/null 2>&1; then
  uv run python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
else
  if [ -f ".venv/Scripts/activate" ]; then
    source ".venv/Scripts/activate"
  elif [ -f ".venv/bin/activate" ]; then
    source ".venv/bin/activate"
  fi

  python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi