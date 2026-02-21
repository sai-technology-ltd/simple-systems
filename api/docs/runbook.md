# Simple Systems v2 Runbook

## Health checks
- API: `GET /health`
- Docker: `docker compose ps`
- Logs: `docker compose logs api --tail=200`

## Common failures

### Notion OAuth callback fails
- Check `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET`, `NOTION_REDIRECT_URI`.
- Confirm callback URL is public and matches Notion config exactly.

### Webhook rejected (401)
- Ensure headers are present:
  - `x-webhook-timestamp`
  - `x-webhook-signature`
- Signature must be: `HMAC_SHA256(secret, timestamp + '.' + rawBody)`.
- Timestamp must be within 5 minutes.

### Candidate not created
- Verify client has selected DB IDs (Candidates/Roles/Stages).
- Verify Roles/Stages schema required fields.
- Check EventLog entries via admin logs endpoint.

### Email not sent
- Check `POSTMARK_SERVER_TOKEN`.
- Check `emailEnabled` and monthly quota.

## Admin operations
Use header: `x-admin-key: <ADMIN_API_KEY>`

- Create client: `POST /admin/clients`
- List clients: `GET /admin/clients`
- Get client: `GET /admin/clients/:clientSlug`
- Suspend/activate: `POST /admin/clients/:clientSlug/suspend|activate`
- Rotate webhook secret: `POST /admin/clients/:clientSlug/rotate-webhook-secret`
- Read logs: `GET /admin/clients/:clientSlug/logs`
