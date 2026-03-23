# Deployment Guide

## 1) Vercel (Direct)

### Requirements
- Vercel account
- Project imported from GitHub
- Environment variables set in Vercel project settings

### Steps
1. Push repository to GitHub.
2. Import project into Vercel.
3. Set these environment variables in Vercel:
   - `ACTIVE_MODEL`
   - `ANTHROPIC_API_KEY`
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NENO_API_URL`
   - `NENO_API_KEY`
4. Deploy.

Vercel uses:
- `api/index.js` as serverless entrypoint
- `vercel.json` for route mapping (`/health`, `/api/*`)

---

## 2) Cloudflare (Direct as Edge Proxy)

This repo includes a Cloudflare Worker that proxies all requests to your deployed backend origin (recommended: Vercel origin).

### Requirements
- Cloudflare account
- `wrangler` CLI authenticated

### Steps
1. Deploy backend first (e.g., on Vercel).
2. Update `BACKEND_ORIGIN` in `wrangler.toml` or set it as a secret/var in Cloudflare.
3. Deploy Worker:
   ```bash
   npm run deploy:cloudflare
   ```
4. Bind your custom domain to the worker route.

Worker files:
- `wrangler.toml`
- `cloudflare/worker.js`

---

## 3) Docker (Alternative)
## Docker
1. Build image:
   - `npm run docker:build`
2. Push image:
   - `npm run docker:push`
3. Run stack:
   - `npm run docker:up`

## Compose Logs
## Compose
- `docker-compose logs -f`
