#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  if [[ -n "${UI_PID:-}" ]] && kill -0 "$UI_PID" 2>/dev/null; then
    kill "$UI_PID" 2>/dev/null || true
  fi
  if [[ -n "${WORKER_PID:-}" ]] && kill -0 "$WORKER_PID" 2>/dev/null; then
    kill "$WORKER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting Worker API on http://localhost:5174 ..."
npm run dev:worker -- --port 5174 &
WORKER_PID=$!

sleep 1
if ! kill -0 "$WORKER_PID" 2>/dev/null; then
  echo "Worker failed to start."
  exit 1
fi

echo "Starting UI dev server on http://localhost:5173 ..."
npm run dev:ui &
UI_PID=$!

while true; do
  if ! kill -0 "$WORKER_PID" 2>/dev/null; then
    echo "Worker process stopped."
    exit 1
  fi

  if ! kill -0 "$UI_PID" 2>/dev/null; then
    echo "UI process stopped."
    exit 1
  fi

  sleep 1
done
