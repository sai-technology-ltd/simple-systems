#!/usr/bin/env bash
set -euo pipefail

CLIENT_SLUG=${1:-demo-client}
ROLE_ID=${2:-"role-page-id"}
TS=$(date +%s)
BODY=$(cat <<JSON
{"roleId":"$ROLE_ID","candidateName":"Smoke Test","candidateEmail":"smoke@example.com","submissionId":"smoke-$TS"}
JSON
)

# fetch webhook secret via admin API
ADMIN_KEY=${ADMIN_API_KEY:-dummy}
SECRET=$(curl -sS -H "x-admin-key: $ADMIN_KEY" "http://localhost:3000/admin/clients/$CLIENT_SLUG" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("webhookSecret",""))')
if [[ -z "$SECRET" ]]; then
  echo "Missing webhook secret for client $CLIENT_SLUG"
  exit 1
fi

SIG=$(python3 - <<PY
import hmac,hashlib
secret="$SECRET".encode()
ts="$TS"
body='''$BODY'''
print(hmac.new(secret, f"{ts}.{body}".encode(), hashlib.sha256).hexdigest())
PY
)

echo "Posting signed smoke webhook..."
curl -sS -X POST "http://localhost:3000/webhooks/hiring/intake/$CLIENT_SLUG" \
  -H "Content-Type: application/json" \
  -H "x-webhook-timestamp: $TS" \
  -H "x-webhook-signature: $SIG" \
  -d "$BODY"

echo
