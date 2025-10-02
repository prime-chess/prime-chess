#!/usr/bin/env bash
set -euo pipefail

export ROCKET_PORT=8080

(
  cd server
  cargo watch -x run
) &
CARGO_PID=$!

(
  cd app
  pnpm i
  pnpm run dev
) &
PNPM_PID=$!

trap "kill $CARGO_PID $PNPM_PID" EXIT

wait -n
kill $CARGO_PID $PNPM_PID 2>/dev/null || true
