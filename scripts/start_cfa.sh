#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$PROJECT_ROOT/.runtime"

AWS_PROFILE="${AWS_PROFILE:-cafe-fausse-application-sandbox}"
AWS_REGION="${AWS_REGION:-us-east-2}"
STACK_NAME="${STACK_NAME:-CafeFausseApplicationStack}"

DB_LOCAL_PORT="${DB_LOCAL_PORT:-15433}"
DB_REMOTE_PORT="${DB_REMOTE_PORT:-5432}"

BACKEND_PORT="${BACKEND_PORT:-5001}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

TUNNEL_PID_FILE="$RUNTIME_DIR/tunnel.pid"
BACKEND_PID_FILE="$RUNTIME_DIR/backend.pid"
FRONTEND_PID_FILE="$RUNTIME_DIR/frontend.pid"

TUNNEL_LOG="$RUNTIME_DIR/tunnel.log"
BACKEND_LOG="$RUNTIME_DIR/backend.log"
FRONTEND_LOG="$RUNTIME_DIR/frontend.log"

mkdir -p "$RUNTIME_DIR"

is_port_running() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: Required command not found: $1"
    exit 1
  }
}

for command_name in aws session-manager-plugin nc lsof curl; do
  require_command "$command_name"
done

if [[ ! -x "$PROJECT_ROOT/backend/.venv/bin/python" ]]; then
  echo "ERROR: Backend virtual environment not found."
  echo "Run: cd backend && python3 -m venv .venv"
  echo "Then: .venv/bin/pip install -r requirements.txt"
  exit 1
fi

if [[ ! -x "$PROJECT_ROOT/frontend/node_modules/.bin/vite" ]]; then
  echo "ERROR: Frontend dependencies not found."
  echo "Run: npm --prefix frontend install"
  exit 1
fi

echo "Validating AWS access using profile '$AWS_PROFILE'..."

if ! aws sts get-caller-identity \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  >/dev/null 2>&1; then
  echo "ERROR: AWS session is unavailable or expired."
  echo "Run: aws sso login --profile $AWS_PROFILE"
  exit 1
fi

echo "Discovering Café Fausse database resources..."

INSTANCE_ID="$(
  aws ec2 describe-instances \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --filters \
      "Name=tag:aws:cloudformation:stack-name,Values=$STACK_NAME" \
      "Name=instance-state-name,Values=running" \
    --query \
      "Reservations[].Instances[?contains(Tags[?Key=='Name'].Value | [0], 'DatabaseAccess/AccessHost')].InstanceId | [0]" \
    --output text
)"

CLUSTER_ID="$(
  aws cloudformation list-stack-resources \
    --stack-name "$STACK_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --query \
      "StackResourceSummaries[?ResourceType=='AWS::RDS::DBCluster'].PhysicalResourceId | [0]" \
    --output text
)"

if [[ -z "$INSTANCE_ID" || "$INSTANCE_ID" == "None" ]]; then
  echo "ERROR: Database access host was not found."
  exit 1
fi

if [[ -z "$CLUSTER_ID" || "$CLUSTER_ID" == "None" ]]; then
  echo "ERROR: Aurora cluster was not found."
  exit 1
fi

DB_HOST="$(
  aws rds describe-db-clusters \
    --db-cluster-identifier "$CLUSTER_ID" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --query "DBClusters[0].Endpoint" \
    --output text
)"

if [[ -z "$DB_HOST" || "$DB_HOST" == "None" ]]; then
  echo "ERROR: Aurora endpoint was not found."
  exit 1
fi

if is_port_running "$DB_LOCAL_PORT"; then
  echo "ERROR: Local database port $DB_LOCAL_PORT is already in use."
  echo "Run scripts/stop_cfa.sh or select another DB_LOCAL_PORT."
  exit 1
fi

echo "Opening SSM database tunnel on local port $DB_LOCAL_PORT..."

nohup aws ssm start-session \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --target "$INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters \
    "{\"host\":[\"$DB_HOST\"],\"portNumber\":[\"$DB_REMOTE_PORT\"],\"localPortNumber\":[\"$DB_LOCAL_PORT\"]}" \
  </dev/null >"$TUNNEL_LOG" 2>&1 &

TUNNEL_PID=$!
echo "$TUNNEL_PID" >"$TUNNEL_PID_FILE"
echo "Tunnel PID: $TUNNEL_PID"

for _ in {1..20}; do
  if nc -z 127.0.0.1 "$DB_LOCAL_PORT" 2>/dev/null; then
    break
  fi

  if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "ERROR: SSM tunnel process stopped unexpectedly."
    cat "$TUNNEL_LOG"
    exit 1
  fi

  sleep 1
done

if ! nc -z 127.0.0.1 "$DB_LOCAL_PORT" 2>/dev/null; then
  echo "ERROR: SSM tunnel did not become available."
  cat "$TUNNEL_LOG"
  exit 1
fi

if is_port_running "$BACKEND_PORT"; then
  echo "ERROR: Backend port $BACKEND_PORT is already in use."
  exit 1
fi

echo "Starting Flask on port $BACKEND_PORT..."

nohup env \
  AWS_PROFILE="$AWS_PROFILE" \
  AWS_REGION="$AWS_REGION" \
  DB_HOST="$DB_HOST" \
  DB_HOST_ADDRESS="127.0.0.1" \
  DB_LOCAL_PORT="$DB_LOCAL_PORT" \
  DB_REMOTE_PORT="$DB_REMOTE_PORT" \
  "$PROJECT_ROOT/backend/.venv/bin/python" \
  "$PROJECT_ROOT/backend/app.py" \
  </dev/null >"$BACKEND_LOG" 2>&1 &

BACKEND_PID=$!
echo "$BACKEND_PID" >"$BACKEND_PID_FILE"
echo "Flask PID: $BACKEND_PID"

if is_port_running "$FRONTEND_PORT"; then
  echo "ERROR: Frontend port $FRONTEND_PORT is already in use."
  exit 1
fi

echo "Starting React on port $FRONTEND_PORT..."

nohup "$PROJECT_ROOT/frontend/node_modules/.bin/vite" \
  "$PROJECT_ROOT/frontend" \
  --host 127.0.0.1 \
  --port "$FRONTEND_PORT" \
  </dev/null >"$FRONTEND_LOG" 2>&1 &

FRONTEND_PID=$!
echo "$FRONTEND_PID" >"$FRONTEND_PID_FILE"
echo "React PID: $FRONTEND_PID"

for _ in {1..20}; do
  if curl --silent --fail \
      "http://127.0.0.1:$BACKEND_PORT/api/health" \
      >/dev/null &&
     curl --silent --fail \
      "http://127.0.0.1:$FRONTEND_PORT/" \
      >/dev/null; then
    echo
    echo "Café Fausse development environment is ready."
    echo "Frontend: http://127.0.0.1:$FRONTEND_PORT/"
    echo "Backend : http://127.0.0.1:$BACKEND_PORT/api/health"
    echo "Database: 127.0.0.1:$DB_LOCAL_PORT -> Aurora:$DB_REMOTE_PORT"
    echo
    echo "Processes:"
    echo "  React PID : $FRONTEND_PID"
    echo "  Flask PID : $BACKEND_PID"
    echo "  Tunnel PID: $TUNNEL_PID"
    echo
    echo "Logs:"
    echo "  $FRONTEND_LOG"
    echo "  $BACKEND_LOG"
    echo "  $TUNNEL_LOG"
    exit 0
  fi

  sleep 1
done

echo "ERROR: One or more services failed to become ready."
echo "Run scripts/stop_cfa.sh and review the runtime logs."
exit 1