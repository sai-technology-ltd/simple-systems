# Deploy Checklist (v1)

## Secrets
- [ ] `DATABASE_URL`
- [ ] `TOKEN_ENC_KEY` (64 hex or base64 32-byte)
- [ ] `NOTION_CLIENT_ID`
- [ ] `NOTION_CLIENT_SECRET`
- [ ] `NOTION_REDIRECT_URI`
- [ ] `POSTMARK_SERVER_TOKEN`
- [ ] `ADMIN_API_KEY`
- [ ] `OAUTH_STATE_SECRET`

## Infrastructure
- [ ] Postgres backups enabled
- [ ] API domain points correctly
- [ ] `/health` publicly reachable
- [ ] TLS active

## Functional smoke tests
- [ ] Admin create client
- [ ] Notion OAuth start + callback
- [ ] Database list + select + schema validate
- [ ] Signed webhook intake creates candidate in Notion
- [ ] Confirmation email sends (or intentional skip if disabled)

## Security
- [ ] Webhook signature verification active
- [ ] Replay window active
- [ ] No plaintext token storage
- [ ] Admin API key rotated from default

## Operational
- [ ] Alerting for API downtime
- [ ] Logs retained
- [ ] Incident runbook available (`docs/runbook.md`)
