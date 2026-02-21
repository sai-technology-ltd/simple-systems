# Production Validation Guide

Use this checklist to verify Simple Systems API is healthy in production with your real Supabase + Notion setup.

---

## 0) Preconditions

You already have:
- Supabase cloud project (Postgres)
- Notion public integration (OAuth)
- Domain/API endpoint configured

You still need:
- Docker host/VPS running
- Environment variables configured with real secrets

---

## 1) Configure production environment

Set these env vars on the server:

- `NODE_ENV=production`
- `PORT=3000`
- `BASE_URL=https://api.simplesystem.app`
- `DATABASE_URL=<supabase postgres connection string>`
- `TOKEN_ENC_KEY=<64-char-hex OR base64-encoded-32-byte-key>`
- `NOTION_CLIENT_ID=<notion client id>`
- `NOTION_CLIENT_SECRET=<notion client secret>`
- `NOTION_REDIRECT_URI=https://api.simplesystem.app/notion/oauth/callback`
- `NOTION_VERSION=2022-06-28`
- `POSTMARK_SERVER_TOKEN=<postmark token>`
- `ADMIN_API_KEY=<strong random key>`
- `OAUTH_STATE_SECRET=<strong random key>`

### Generate secure keys quickly

```bash
openssl rand -hex 32   # for TOKEN_ENC_KEY / OAUTH_STATE_SECRET / ADMIN_API_KEY
```

---

## 2) Build and start services

```bash
docker compose up -d --build
```

Verify:

```bash
docker compose ps
curl -sS https://api.simplesystem.app/health
```

Expected:

```json
{"ok":true}
```

---

## 3) Create your first client

```bash
curl -sS -X POST "https://api.simplesystem.app/admin/clients" \
  -H "x-admin-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName":"Demo Co",
    "clientSlug":"demo-co",
    "productType":"HIRING"
  }'
```

Check it exists:

```bash
curl -sS -H "x-admin-key: $ADMIN_API_KEY" \
  "https://api.simplesystem.app/admin/clients/demo-co"
```

---

## 4) Notion OAuth connect

Open in browser:

```text
https://api.simplesystem.app/notion/oauth/start?clientSlug=demo-co&product=HIRING
```

Complete OAuth.

Then re-check client:

```bash
curl -sS -H "x-admin-key: $ADMIN_API_KEY" \
  "https://api.simplesystem.app/admin/clients/demo-co"
```

You should see Notion fields populated (`notionWorkspaceId`, token encrypted in DB).

---

## 5) List and select Notion databases

List accessible DBs:

```bash
curl -sS "https://api.simplesystem.app/clients/demo-co/notion/databases"
```

Select DBs:

```bash
curl -sS -X POST "https://api.simplesystem.app/clients/demo-co/notion/databases/select" \
  -H "Content-Type: application/json" \
  -d '{
    "candidatesDbId":"<candidates_db_id>",
    "rolesDbId":"<roles_db_id>",
    "stagesDbId":"<stages_db_id>"
  }'
```

Expected:
- `valid: true` OR
- `valid: false` with clear `fixes[]`

Fix schema issues in Notion and retry until valid.

---

## 6) Verify apply-link role resolution

Ensure Roles DB has:
- `Role Name` (title)
- `Public Slug` (rich_text)

Test resolver:

```bash
curl -sS "https://api.simplesystem.app/apply/demo-co/<roleSlug>"
```

Expected:
- `rolePageId` returned.

---

## 7) Send signed webhook intake test

### 7.1 Get client webhook secret

```bash
SECRET=$(curl -sS -H "x-admin-key: $ADMIN_API_KEY" \
  "https://api.simplesystem.app/admin/clients/demo-co" | \
  python3 -c 'import json,sys;print(json.load(sys.stdin)["webhookSecret"])')
```

### 7.2 Build payload + signature

```bash
TS=$(date +%s)
BODY='{"roleId":"<rolePageId>","candidateName":"Smoke Test","candidateEmail":"smoke@example.com","submissionId":"smoke-'"$TS"'"}'
SIG=$(python3 - <<PY
import hmac, hashlib
secret = "${SECRET}".encode()
ts = "${TS}"
body = '''${BODY}'''
print(hmac.new(secret, f"{ts}.{body}".encode(), hashlib.sha256).hexdigest())
PY
)
```

### 7.3 Post webhook

```bash
curl -sS -X POST "https://api.simplesystem.app/webhooks/hiring/intake/demo-co" \
  -H "Content-Type: application/json" \
  -H "x-webhook-timestamp: ${TS}" \
  -H "x-webhook-signature: ${SIG}" \
  -d "${BODY}"
```

Expected:

```json
{"ok":true}
```

Verify candidate in Notion Candidates DB.

---

## 8) Verify email behavior

- If `emailEnabled=true` and quota available, confirmation email should send.
- If Postmark is not configured, API still works and logs send skip/failure safely.

Update settings if needed:

```bash
curl -sS -X PATCH "https://api.simplesystem.app/clients/demo-co/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "emailEnabled": true,
    "replyToEmail": "hiring@democo.com",
    "monthlyEmailQuota": 500
  }'
```

---

## 9) Check logs and operational endpoints

Fetch client event logs:

```bash
curl -sS -H "x-admin-key: $ADMIN_API_KEY" \
  "https://api.simplesystem.app/admin/clients/demo-co/logs"
```

Check service logs:

```bash
docker compose logs api --tail=200
```

---

## 10) Go-live checklist

You are good to go when all are true:

- [ ] `/health` is stable
- [ ] OAuth connects successfully
- [ ] DB selection validates successfully
- [ ] Apply resolver returns rolePageId
- [ ] Signed webhook creates candidate in Notion
- [ ] Event logs show successful intake events
- [ ] Email behavior matches settings/quota
- [ ] Admin endpoints protected with strong key
- [ ] Secrets rotated from defaults

---

## Troubleshooting quick map

- `401` on webhook: bad/missing timestamp/signature or expired timestamp
- `400` on intake: client not configured or missing Stages/Role mapping
- Notion errors: check OAuth token, DB IDs, schema fields
- No email: check Postmark token + client `emailEnabled` + quota
