# Delight Digital — Landing Page

Static Next.js (App Router) landing page for **Delight Digital**, an AI Beginner's Guide.
Built for **Cloudflare Pages** via static export.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build the static site

```bash
npm run build        # outputs ./out
npm run preview      # serve ./out locally to sanity-check
```

`next.config.mjs` sets `output: 'export'` and `images.unoptimized: true`, so
`npm run build` produces a fully static `./out` directory — no Node runtime needed.

## Email signup (MailerLite via Cloudflare Function)

The inline "Get the Free Guide" form posts to `/api/subscribe`, a **Cloudflare
Pages Function** (`functions/api/subscribe.ts`) that adds the address to MailerLite
via its API. MailerLite's automation then emails the guide. The API token stays
server-side — it's never shipped to the browser.

### Required environment variables

Set these on the Cloudflare Pages project (**Settings → Environment variables**,
add as *encrypted*), or via `npx wrangler pages secret put <NAME>`:

| Variable              | Required | Notes                                                              |
| --------------------- | -------- | ------------------------------------------------------------------ |
| `MAILERLITE_API_KEY`  | Yes      | MailerLite → Integrations → API → generate token.                  |
| `MAILERLITE_GROUP_ID` | Yes*     | `189109351425771332` ("Free PDF subscribers"). See note below.     |

\*The "Free AI Guide Workflow" automation is triggered by **subscribers joining the
"Free PDF subscribers" group**. Without `MAILERLITE_GROUP_ID`, signups are still
saved to MailerLite but never join that group, so the automation never fires and
**no guide email is sent**. Set this variable so the guide actually goes out.

### Test the form locally

`next dev` does **not** run Cloudflare Functions, so `/api/subscribe` 404s under it.
To exercise the real form end-to-end, use Wrangler:

```bash
# 1. Create .dev.vars (git-ignored) with your token:
#    MAILERLITE_API_KEY=xxxxx
#    MAILERLITE_GROUP_ID=xxxxx   # optional
# 2. Build + serve the static export through Wrangler:
npm run pages:dev            # = next build && wrangler pages dev out
```

The UI and simulated sandbox still work under plain `npm run dev`; only the email
submit needs Wrangler.

## Deploy to Cloudflare Pages

Connect the repo and use these settings:

| Setting                | Value                        |
| ---------------------- | ---------------------------- |
| Framework preset       | Next.js (Static HTML Export) |
| Build command          | `npm run build`              |
| Build output directory | `out`                        |
| Node version           | `20` (env var `NODE_VERSION=20`) |

The `functions/` directory is deployed automatically as Pages Functions alongside
the static assets — no extra config needed.

## The sandbox

The "Simulated AI Sandbox" in the hero is a fully client-side teaser: two
`<select>` dropdowns build a prompt string, and **Run Simulation** streams one of
three hardcoded responses character-by-character (no external API calls). A
**Try the real AI sandbox** button links to the live tool at
`https://ai.delightdigital.online` (set as `AI_APP_URL` in `app/page.tsx`).
