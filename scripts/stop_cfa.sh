#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$PROJECT_ROOT/.runtime"

stop_process() {
  local service_name="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$service_name PID file was not found."
    return
  fi

  local process_id
  process_id="$(cat "$pid_file")"

  if kill -0 "$process_id" 2>/dev/null; then
    echo "Stopping $service_name process $process_id..."

    local child_processes
    child_processes="$(pgrep -P "$process_id" 2>/dev/null || true)"

    kill "$process_id" 2>/dev/null || true

    for child_process in $child_processes; do
      kill "$child_process" 2>/dev/null || true
    done
  else
    echo "$service_name process $process_id is not running."
  fi

  rm -f "$pid_file"
}

stop_process "React" "$RUNTIME_DIR/frontend.pid"
stop_process "Flask" "$RUNTIME_DIR/backend.pid"
stop_process "SSM tunnel" "$RUNTIME_DIR/tunnel.pid"

echo "Café Fausse development environment stopped."