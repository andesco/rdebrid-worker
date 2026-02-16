#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8788}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="$(mktemp)"

cleanup() {
  if [[ -n "${WRANGLER_PID:-}" ]]; then
    kill "${WRANGLER_PID}" >/dev/null 2>&1 || true
    wait "${WRANGLER_PID}" 2>/dev/null || true
  fi
  rm -f "${LOG_FILE}"
}
trap cleanup EXIT

npx wrangler dev --local --port "${PORT}" >"${LOG_FILE}" 2>&1 &
WRANGLER_PID=$!

for _ in $(seq 1 40); do
  if curl -fsS "${BASE_URL}/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

health_status="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/api/health")"
if [[ "${health_status}" != "200" ]]; then
  echo "Expected /api/health 200, got ${health_status}"
  cat "${LOG_FILE}"
  exit 1
fi

missing_token_status="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/api/debrid/user")"
if [[ "${missing_token_status}" != "500" && "${missing_token_status}" != "401" ]]; then
  echo "Expected /api/debrid/user 500 (missing token) or 401 (auth challenge), got ${missing_token_status}"
  cat "${LOG_FILE}"
  exit 1
fi

disallowed_cors_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X OPTIONS \
  -H "Origin: https://evil.example" \
  -H "Access-Control-Request-Method: GET" \
  "${BASE_URL}/api/health")"
if [[ "${disallowed_cors_status}" != "403" ]]; then
  echo "Expected disallowed preflight 403, got ${disallowed_cors_status}"
  cat "${LOG_FILE}"
  exit 1
fi

allowed_origin="${BASE_URL}"
allowed_cors_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X OPTIONS \
  -H "Origin: ${allowed_origin}" \
  -H "Access-Control-Request-Method: GET" \
  "${BASE_URL}/api/health")"
if [[ "${allowed_cors_status}" != "204" ]]; then
  echo "Expected same-origin preflight 204, got ${allowed_cors_status}"
  cat "${LOG_FILE}"
  exit 1
fi

echo "Route smoke tests passed"
