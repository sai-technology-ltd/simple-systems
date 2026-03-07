# Simple Systems API (Simple Hiring v2)

Multi-tenant NestJS backend for Simple Hiring.

## Stack
- NestJS
- Supabase-compatible Postgres (Docker)
- Prisma ORM

## What this service does
- Manages onboarding for each client workspace
- Stores the selected Notion database IDs for Candidates, Roles, and Stages
- Validates the Notion schema required by the hiring product
- Serves role metadata and application endpoints
- Processes webhook-driven and direct test submissions
- Accepts direct Tally form webhooks with signature verification
- Handles activation and payment state

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
- `PAYMENT_PROVIDER`
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `NOTION_REDIRECT_URI`
- `POSTMARK_SERVER_TOKEN`
- `ADMIN_API_KEY`
- `OAUTH_STATE_SECRET`
- `LEMON_SQUEEZY_API_KEY`
- `LEMON_SQUEEZY_STORE_ID`
- `LEMON_SQUEEZY_VARIANT_ID`
- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `LEMON_SQUEEZY_DEFAULT_AMOUNT`
- `LEMON_SQUEEZY_TEST_MODE`
- `PADDLE_API_KEY`
- `PADDLE_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_DEFAULT_AMOUNT`
- `PADDLE_DEFAULT_CURRENCY_CODE`
- `HIRING_APP_URL`

## Core onboarding flow
The API models onboarding as distinct steps. These are easy to confuse in the UI unless they are handled separately:

1. Create or update the client
   - `POST /onboarding/start`
   - `PATCH /clients/:clientSlug/settings`
2. Connect Notion
   - `POST /clients/:clientSlug/notion/connect`
   - Notion OAuth callback stores the encrypted access token on the client record
   - The callback then redirects the browser to `${HIRING_APP_URL}/onboarding?clientSlug=...`
3. List databases visible to the Notion integration
   - `GET /clients/:clientSlug/notion/databases`
   - This only confirms that the integration can see databases in Notion
4. Persist the selected database IDs
   - `POST /clients/:clientSlug/notion/databases/select`
   - This writes `notionDbCandidatesId`, `notionDbRolesId`, and `notionDbStagesId` to the client row
5. Validate the saved selection
   - `POST /clients/:clientSlug/validate`
   - This fetches the three saved databases and checks the required property names and types

Important:
- Sharing databases with the Notion integration is not enough on its own
- Validation reads the saved database IDs from the database, not the frontend dropdown state
- If `POST /clients/:clientSlug/notion/databases/select` is skipped, `/validate` will fail with a workspace-level selection error even when Notion access is already granted

## Validation behavior
`POST /clients/:clientSlug/validate` can fail in three broad ways:

- Notion is not connected
  - No access token is stored for the client
- Database selection is incomplete
  - One or more of the saved `notionDb*Id` fields is missing
- Notion or schema validation fails after selection
  - Notion denies access to a selected DB
  - A selected DB no longer exists
  - Required property names or types do not match the expected schema

The controller now returns more descriptive `issues` for these cases so the frontend can show actionable errors instead of a generic workspace failure.

## Required Notion schema
The schema validator expects the following properties:

- Candidates database
  - `Name` as `title`
  - `Email` as `email` or `rich_text`
  - `Phone` as `phone_number` or `rich_text`
  - `CV URL` as `url` or `rich_text`
  - `Role` as `relation`
  - `Stage` as `relation`
- Roles database
  - `Role Name` as `title`
  - `Status` as `select`
  - `Public Slug` as `rich_text`
- Stages database
  - `Stage Name` as `title`
  - `Order` as `number`
  - `Is Terminal` as `checkbox`

## Implemented endpoints
- `GET /health`
- `GET /notion/oauth/start?clientSlug=...&product=HIRING`
- `GET /notion/oauth/callback?code=...&state=...`
- `POST /onboarding/start`
- `GET /clients/:clientSlug`
- `POST /clients/:clientSlug/validate`
- `GET /clients/:clientSlug/roles`
- `GET /clients/:clientSlug/roles/:roleSlug`
- `GET /clients/:clientSlug/notion/databases`
- `POST /clients/:clientSlug/notion/databases/select`
- `POST /clients/:clientSlug/notion/connect`
- `PATCH /clients/:clientSlug/settings`
- `POST /clients/:clientSlug/test-submission`
- `POST /clients/:clientSlug/payments/initialize`
- `GET /clients/:clientSlug/payments/verify`
- `POST /payments/lemonsqueezy/webhook`
- `POST /payments/paddle/webhook`
- `GET /apply/:clientSlug/:roleSlug`
- `POST /webhooks/hiring/intake/:clientSlug`
- `POST /webhooks/hiring/tally/:clientSlug`
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

## Useful commands
```bash
pnpm start:dev
pnpm lint
pnpm test
pnpm test -- client-workspace.controller.spec.ts
pnpm test:e2e
```
