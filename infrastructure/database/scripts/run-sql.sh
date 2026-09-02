#!/usr/bin/env bash
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-cafe-fausse-application-sandbox}"
AWS_REGION="${AWS_REGION:-us-east-2}"
STACK_NAME="${STACK_NAME:-CafeFausseApplicationStack}"
DB_NAME="${DB_NAME:-cafe_fausse_db}"
DB_USER="${DB_USER:-cafe_fausse_developer}"
DB_PORT="${DB_PORT:-5432}"
LOCAL_PORT="${LOCAL_PORT:-15432}"
SQL_FILE="${1:-}"

if (( $# > 1 )); then
  echo "Usage: $0 [sql-file]"
  exit 1
fi

if [[ -n "$SQL_FILE" && ! -f "$SQL_FILE" ]]; then
  echo "ERROR: SQL file not found: $SQL_FILE"
  exit 1
fi

for cmd in aws psql session-manager-plugin nc; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "ERROR: Required command not found: $cmd"
    exit 1
  fi
done

echo "Validating AWS access using profile '$AWS_PROFILE'..."

aws sts get-caller-identity \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  >/dev/null

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
  echo "ERROR: Database access host not found."
  exit 1
fi

if [[ -z "$CLUSTER_ID" || "$CLUSTER_ID" == "None" ]]; then
  echo "ERROR: Aurora cluster not found."
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
  echo "ERROR: Aurora endpoint not found."
  exit 1
fi

TUNNEL_LOG="$(
  mktemp "${TMPDIR:-/tmp}/cafe-fausse-db-tunnel.XXXXXX"
)"

TUNNEL_PID=""

cleanup() {
  unset PGPASSWORD || true

  if [[ -n "$TUNNEL_PID" ]]; then
    kill "$TUNNEL_PID" 2>/dev/null || true
    wait "$TUNNEL_PID" 2>/dev/null || true
  fi

  rm -f "$TUNNEL_LOG"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

echo "Opening secure SSM tunnel on local port $LOCAL_PORT..."

aws ssm start-session \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --target "$INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters \
    "{\"host\":[\"$DB_HOST\"],\"portNumber\":[\"$DB_PORT\"],\"localPortNumber\":[\"$LOCAL_PORT\"]}" \
  >"$TUNNEL_LOG" 2>&1 &

TUNNEL_PID=$!

for _ in {1..20}; do
  if nc -z 127.0.0.1 "$LOCAL_PORT" 2>/dev/null; then
    break
  fi

  if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "ERROR: SSM tunnel process stopped unexpectedly."
    cat "$TUNNEL_LOG"
    exit 1
  fi

  sleep 1
done

if ! nc -z 127.0.0.1 "$LOCAL_PORT" 2>/dev/null; then
  echo "ERROR: SSM tunnel did not become available."
  cat "$TUNNEL_LOG"
  exit 1
fi

export PGPASSWORD="$(
  aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$AWS_REGION" \
    --username "$DB_USER" \
    --profile "$AWS_PROFILE"
)"

CONNECTION_STRING="host=$DB_HOST hostaddr=127.0.0.1 port=$LOCAL_PORT dbname=$DB_NAME user=$DB_USER sslmode=require"

if [[ -n "$SQL_FILE" ]]; then
  echo "Executing '$SQL_FILE' as '$DB_USER' on '$DB_NAME'..."

  psql "$CONNECTION_STRING" \
    --set ON_ERROR_STOP=1 \
    --file "$SQL_FILE"

  echo "SQL execution completed successfully."
else
  echo "Opening PostgreSQL session as '$DB_USER' on '$DB_NAME'."
  echo "Enter \\q to exit; the SSM tunnel will then close automatically."

  psql "$CONNECTION_STRING"
fi