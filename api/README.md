# Simple Systems API (Simple Hiring v2)

Multi-tenant NestJS backend for Simple Hiring.

## Stack
- NestJS
- Supabase-compatible Postgres (Docker)
- Prisma ORM

## Quick start
```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm start:dev
```

## Local DB
This repo ships with `docker-compose.yml` using `supabase/postgres`:
- host: `localhost`
- port: `54329`
- db: `simple_systems`
- user: `postgres`
- password: `postgres`

## Key env vars
- `DATABASE_URL`
- `TOKEN_ENC_KEY`
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `NOTION_REDIRECT_URI`
- `POSTMARK_SERVER_TOKEN`
- `ADMIN_API_KEY`
- `OAUTH_STATE_SECRET`

## Implemented endpoints
- `GET /health`
- `GET /notion/oauth/start?clientSlug=...&product=HIRING`
- `GET /notion/oauth/callback?code=...&state=...`
- `GET /clients/:clientSlug/notion/databases`
- `POST /clients/:clientSlug/notion/databases/select`
- `PATCH /clients/:clientSlug/settings`
- `GET /apply/:clientSlug/:roleSlug`
- `POST /webhooks/hiring/intake/:clientSlug`
- `POST /admin/clients`
- `GET /admin/clients`
- `GET /admin/clients/:clientSlug`
- `POST /admin/clients/:clientSlug/suspend`
- `POST /admin/clients/:clientSlug/activate`
- `POST /admin/clients/:clientSlug/rotate-webhook-secret`
- `GET /admin/clients/:clientSlug/logs`

## Operational scripts
- `scripts/migrate_first_client.sh`
- `scripts/smoke_webhook.sh`

## Validation docs
- `docs/deploy-checklist.md`
- `docs/runbook.md`
- `docs/production-validation.md` (step-by-step go-live verification)
