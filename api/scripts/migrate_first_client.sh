#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <companyName> <clientSlug> [productType=HIRING]"
  exit 1
fi

COMPANY_NAME="$1"
CLIENT_SLUG="$2"
PRODUCT_TYPE="${3:-HIRING}"
ADMIN_KEY="${ADMIN_API_KEY:-dummy}"

curl -sS -X POST "http://localhost:3000/admin/clients" \
  -H "x-admin-key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"companyName\":\"$COMPANY_NAME\",\"clientSlug\":\"$CLIENT_SLUG\",\"productType\":\"$PRODUCT_TYPE\"}"

echo

echo "Client created. Next steps:"
echo "1) Open: http://localhost:3000/notion/oauth/start?clientSlug=$CLIENT_SLUG&product=$PRODUCT_TYPE"
echo "2) Select databases via POST /clients/$CLIENT_SLUG/notion/databases/select"
echo "3) Run scripts/smoke_webhook.sh $CLIENT_SLUG <rolePageId>"
