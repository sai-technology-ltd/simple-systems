# Simple Hiring App

Frontend application for the Simple Hiring product. This app handles onboarding, workspace setup, role listing, and public application pages.

## Stack
- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4

## Local development
```bash
pnpm install
pnpm dev
```

The app runs on `http://localhost:3000` by default.

## Environment
- `NEXT_PUBLIC_API_BASE_URL`
  - Base URL for the API
  - Defaults to `https://api.simplesystem.app` when unset

For local development you will usually want:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Main routes
- `/`
  - Marketing and product landing page
- `/onboarding`
  - Client setup flow
- `/roles`
  - Workspace home for live roles and test actions
- `/settings`
  - Client settings editor
- `/apply/[clientSlug]/[roleSlug]`
  - Public application page for a role

## Onboarding flow
The onboarding page is stateful and driven by API responses from the client workspace endpoints.

1. Save company details
   - Creates a client with `POST /onboarding/start` when needed
   - Updates settings with `PATCH /clients/:clientSlug/settings`
2. Connect Notion
   - Starts OAuth with `POST /clients/:clientSlug/notion/connect`
3. Load visible Notion databases
   - Uses `GET /clients/:clientSlug/notion/databases`
4. Save selected databases
   - Uses `POST /clients/:clientSlug/notion/databases/select`
5. Validate setup
   - Uses `POST /clients/:clientSlug/validate`
6. Activate workspace
   - Starts payment and verifies activation state

Important:
- Seeing a database in the dropdown does not mean it has been saved to the workspace
- Validation runs against the saved database IDs in the API, not only what is selected locally in the browser
- The onboarding page now persists the current selection before validation if the selection has changed locally

## Client slug persistence
The app stores the current `clientSlug` in local storage so the user can return to onboarding after OAuth or payment redirects.

Implementation:
- [workspace-storage.ts](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/lib/workspace-storage.ts)
- [page.tsx](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/app/onboarding/page.tsx)

## API helpers
Shared fetch helpers live in:
- [api.ts](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/lib/api.ts)

Behavior:
- Sends JSON requests to `NEXT_PUBLIC_API_BASE_URL`
- Parses API error payloads and surfaces `message` when present
- Exposes `apiGet`, `apiPost`, `apiPatch`, and `apiPostWithoutBody`

## UI notes
The app uses a calm visual system:
- Primary UI and text use slate tones
- Backgrounds and cards use soft gray surfaces
- Accent color is a restrained blue used sparingly for highlights
- Typography uses readable sans-serif fonts via `next/font`

Primary shared UI files:
- [globals.css](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/app/globals.css)
- [layout.tsx](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/app/layout.tsx)
- [button.tsx](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/components/ui/button.tsx)
- [enhanced-select.tsx](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/components/ui/enhanced-select.tsx)
- [status-banner.tsx](/Users/shareef/engineering/sai-technology/simple-systems/hiring/src/components/status-banner.tsx)

## Useful commands
```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Current verification
There is no frontend test script configured right now. The main automated verification step available in this app is:

```bash
pnpm lint
```
