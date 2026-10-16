# HavocX Agency

Digital Solutions ab do independent TypeScript applications par mushtamil hai:

- `frontend/`: standard Next.js App Router website
- `backend/`: Express API, PostgreSQL/Drizzle aur Resend integration

Dono applications ke apne dependencies, lockfiles, environment files aur lifecycle commands hain. Root par shared npm package ya shared `node_modules` use nahi hota.

## Prerequisites

- Node.js `>=22.13.0`
- npm `>=10`
- PostgreSQL database
- Resend API key

## Frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Frontend local preview `http://localhost:3000` par run hota hai. Multi-service requests test karne ke liye root se `vercel dev` use karein. Public SEO URL:

```dotenv
SITE_URL=https://havocx.agency
```

Commands:

- `npm run dev`: development server
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript validation
- `npm test`: structure/integration contract tests
- `npm run build`: production Next.js build
- `npm start`: compiled production server
- `npm run check`: complete local quality gate

## Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Backend default taur par `http://localhost:4000` par run hota hai.

API endpoints:

- `GET /`: service metadata
- `GET /api/health`: health check
- `POST /api/v1/contact`: validated contact/demo request

Commands:

- `npm run dev`: watched TypeScript development server
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript validation
- `npm test`: unit/integration tests
- `npm run build`: compile to `backend/dist`
- `npm start`: run compiled Express server
- `npm run check`: complete local quality gate
- `npm run db:generate`: create a reviewed Drizzle migration
- `npm run db:migrate`: apply committed migrations
- `npm run db:studio`: open Drizzle Studio
- `npm run db:check`: non-destructive DB connectivity check

## Backend Architecture

```text
backend/src/
├── config/         Environment validation
├── controllers/    HTTP request/response adaptation
├── db/             Drizzle client, schema and migrations
├── errors/         Typed application errors
├── middleware/     CORS, validation, rate limit and error handling
├── repositories/   Database operations
├── routes/         API route composition
├── schemas/        Zod request contracts
├── services/       Business workflows and provider integrations
├── templates/      Escaped email templates
├── utils/          Structured logging
├── app.ts          Express application factory
└── index.ts        Local server and Vercel entry point
```

Contact submission pehle database mein persist hoti hai. Resend notification baad mein send hoti hai; email provider failure saved lead ko reject nahi karti aur structured error log produce karti hai.

## Environment Variables

Backend secrets sirf `backend/.env` aur Vercel backend project mein rakhein. Frontend mein database ya Resend secret kabhi configure na karein.

Backend required variables:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `EMAIL_FROM`
- `CORS_ORIGINS`: comma-separated exact frontend origins

Optional backend settings:

- `NODE_ENV` (default `development`)
- `PORT` (default `4000`)
- `CONTACT_RATE_LIMIT_WINDOW_MS` (default `600000`)
- `CONTACT_RATE_LIMIT_MAX` (default `2`)

Production rate limiter shared Upstash Redis use karta hai; bina configured Redis ke contact endpoint 503 return karta hai.

## Database Migrations

`backend/src/db/migrations/0000_smiling_barracuda.sql` current `demo_requests` table ki idempotent baseline hai. Existing Aiven data preserve karne ke liye migration `CREATE TABLE IF NOT EXISTS` use karti hai.

Production migration ko blindly build/start hook mein nahi chalaya jata. Pehle SQL review karein, database backup/status verify karein, phir backend folder se explicitly run karein:

```powershell
npm run db:migrate
```

## Vercel Services: one project, two services, new account

The root `vercel.json` is the **single source of truth** for Vercel Services Beta. Import this Git repository from the new Vercel/Google account and select **the repository root** as the project directory. The old `backend/vercel.json` was removed to prevent conflicting standalone deployment settings.

| Service | Directory | Framework | Public route |
| --- | --- | --- | --- |
| `frontend` | `frontend/` | Next.js | `/(.*)` catch-all |
| `backend` | `backend/` | Express | `/api/(.*)` |

The frontend declares a service binding to the backend named **`BACKEND_URL`**. Vercel injects it into frontend server functions, and the CMS server-side reader and admin actions consume it at runtime. **Never manually define `BACKEND_URL` or expose it with a `NEXT_PUBLIC_` prefix.** Browsers submit contact requests to same-origin `/api/v1/contact`. Express already owns `/api` in its routes, so no API prefix rewrite is needed.

**Service names, rewrites, and binding are a proposed configuration pending your explicit approval.** No deployment or merge is performed automatically. Run `vercel dev` from the repository root to test all services with injected bindings after linking your new account. Services are currently in Beta; confirm the new account supports the feature.

### New Vercel account and environment settings

Use the new Google account to sign in to Vercel, connect **your GitHub account/repository to that Vercel account**, and grant that account access to the repository. This project does not depend on any old Vercel account ID or hardcoded backend domain.

Set these in the project's environment configuration (some settings are used by only one service):

- **Public canonical site:** `SITE_URL=https://havocx.agency` (frontend server); then attach and verify the domain in the new account and configure its DNS.
- **API/database:** `DATABASE_URL`, `DATABASE_SSL_MODE=require`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `EMAIL_FROM`, `CORS_ORIGINS=https://havocx.agency` (add exact preview origins when applicable).
- **Distributed contact safety:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Production contact submissions return 503 without these shared limiter credentials by design.
- **Private CMS service writes:** `CMS_INTERNAL_TOKEN`, randomly generated with 32+ characters. It must be available to **both** frontend server functions and backend. The backend refuses CMS writes if unset.
- **Admin access:** `CMS_ADMIN_SESSION_SECRET` (32+ random characters) and `CMS_ADMIN_PASSWORD_HASH` (hex SHA-256 of a unique strong password, 64 characters); never commit or expose the raw password. Configure edge/WAF login rate limiting and MFA before regarding the admin as production-hardened.
- **Media processor (optional until connected):** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` on frontend server functions. Images are signed for eager **WebP with auto quality**; videos are signed for eager **WebM/VP9/Opus**. Browser uploads go directly to Cloudinary to avoid Vercel function upload-size limits. Only the provider-confirmed derived URL is published. Check supported video codecs, transformation quotas, billing and CDN policies for your own media account. Large/asynchronous conversions need a verified webhook workflow before being advertised as complete.
- **Signed checkout:** `CHECKOUT_LINK_SECRET`, generated with 32+ random characters.

To create a non-public admin password hash, run locally with the password in an environment variable:
```bash
node -e 'const c=require("node:crypto");const p=process.env.CMS_ADMIN_PASSWORD;if(!p||p.length<12)throw Error("Supply a unique long password in CMS_ADMIN_PASSWORD");console.log(c.createHash("sha256").update(p).digest("hex"))'
```
Set only the resulting hash as `CMS_ADMIN_PASSWORD_HASH`. Use a dedicated secrets manager or Vercel environment fields for passwords/tokens and do not paste them into the repository or chat.

### Admin and media publishing

The `/admin` page is unlisted/noindex, uses an HttpOnly signed session and validates all writes on the backend with `CMS_INTERNAL_TOKEN`. It stores JSON documents in PostgreSQL `site_content`, so apply the reviewed migration `backend/src/db/migrations/0001_site_content.sql` **before enabling admin saves**. The frontend consumes the `identity` and `home` documents on every server-rendered request; favicon, brand, footer and contact URLs follow the shared identity record.

This is a **foundation, not a claim that every old service/project/legal string has been migrated**. Other CMS keys are reserved for future migrations but hidden from the admin interface until a real public consumer is connected. Do not consider the entire site fully admin-driven yet. Use the original site service routes and client-facing contact form while migration continues.

Image/video uploads appear under the admin media tab. They do not work until the media provider credentials exist. Converted .webp and .webm delivery assets are saved only after verified provider responses. **The uploaded brand board is a visual reference, not the final favicon/logo; no replacement artwork has been generated.**

### Required manual release checks

Run migrations against your backed-up database, verify `/api/health` and `/api/ready`, test allowed/disallowed CORS origins, check a real form submission and email, confirm your Cloudinary transformation outputs, upload the real approved logo and favicon, review admin access controls, and inspect public SEO before pointing production DNS. Check all CI jobs in GitHub. Production payment settlement still requires independent verification.


## Security Notes

- Real `.env*` files Git-ignored hain; sirf `.env.example` commit hoti hain.
- CORS exact allowlist use karta hai; wildcard origin use nahi hota.
- Helmet security headers, JSON body limit, request IDs, validation aur centralized errors enabled hain.
- Logs raw contact payloads, database URLs aur API keys record nahi karte.
- Unknown routes aur runtime errors consistent JSON response dete hain.

Detailed migration record aur acceptance criteria [PROJECT_REVAMP_PLAN.md](./PROJECT_REVAMP_PLAN.md) mein hain.


## Backend and checkout operational security (Phase 5)

The API accepts inquiries only after PostgreSQL persistence. Notification failures are logged and do not erase a saved lead. The API uses `GET /api/health` for liveness and `GET /api/ready` for real PostgreSQL readiness checks.

### Required production configuration

Set the existing backend environment values `DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `EMAIL_FROM`, and `CORS_ORIGINS`. CORS_ORIGINS accepts **exact** HTTP(S) origins separated by commas. Explicitly include each approved production or preview domain. Wildcard origins are rejected.

For **production contact rate limiting**, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` together. The app uses a per-IP HMAC-hashed fixed-window Redis counter across server instances. If Redis is unavailable or the credentials are missing in production, the contact endpoint returns 503 instead of silently degrading to an unshared limit. Local development/tests may use a process-local limit. This is application abuse protection, not a substitute for CDN, provider WAF, DDoS capacity, or proxy/IP configuration. Configure the hosting firewall and test concurrent real edge traffic before release.

`DATABASE_SSL_MODE` defaults to `require`. `disable` is reserved for local/disposable integration databases and is rejected in production.

### Direct-link checkout security

`/checkout` is unlisted, `noindex`, noncacheable and frame-protected. It requires a short-lived, HMAC-signed link. Set **`CHECKOUT_LINK_SECRET`** as a random 32+ character secret in the **frontend server environment**, not as a `NEXT_PUBLIC_` variable. Without it, checkout access is denied.

To issue a 24-hour single-product checkout link, run the following on your own trusted machine with `CHECKOUT_LINK_SECRET` securely exported and one existing `productId` from `frontend/src/features/services/data/softwareToolsData.ts`:

```bash
node -e 'const c=require("node:crypto");const id=process.argv[1];const secret=process.env.CHECKOUT_LINK_SECRET;if(!secret||secret.length<32||!/^[a-z0-9-]+$/.test(id))throw Error("Invalid secret or product ID");const expiry=Math.floor(Date.now()/1000)+86400;const msg=id+"."+expiry;const sig=c.createHmac("sha256",secret).update(msg).digest("hex");console.log("/checkout?token="+encodeURIComponent(msg+"."+sig))' chatgpt-plus
```

Change the example ID to the purchased catalog item. The server checks signature, expiry and product ID, and looks up the authoritative price from the existing catalog. **Do not use price supplied through URL parameters, receipts or messages to confirm a purchase.** A signed checkout link is a bearer credential: only send it privately, rotate the secret to revoke all active links, and do not publish it in an indexable page.

The existing checkout is a *manual review handoff*: it requests proof via WhatsApp/email and explicitly does not settle or verify a bank transfer. An administrator must independently verify settlement with the bank/payment provider before activating a subscription. Without a provider webhook or authenticated back-office reconciliation, automatic payment completion is **not implemented**. Do not claim otherwise.

### Verification and release

- GitHub Actions `.github/workflows/ci.yml` runs `npm ci`, lint, TypeScript checking, tests and production builds for both applications.
- A separate disposable PostgreSQL CI service runs migrations and a real lead insert/read/delete test with a simulated email-provider outage. No actual customer information or real email account is used in CI.
- Check the current commit's CI run logs, not previous commits. Then verify deployment settings: database readiness, external mail-provider delivery from the deployed environment, correct CORS origins, active shared limiter, edge firewall rules, and manual payment reconciliation.
- Do not mark production verified from CI alone. No production secrets are committed.


## SEO settings for self-managed deployment (Phase 6)

Set `SITE_URL` for the frontend to the site's **actual canonical HTTPS origin**, e.g. `https://your-real-domain.com`, with no subpath, username, query or fragment. This is a server-side variable, not a secret. The value is used consistently for root metadata, canonical URLs, structured data, `/sitemap.xml`, `/robots.txt` and `/llms.txt`.

**Important:** Without a valid production HTTPS `SITE_URL`, the generated site deliberately defaults to `noindex`, robots disallow-all, an empty XML sitemap, and a disabled llms index. This guards against staging or unknown domains being indexed accidentally. Setting a verified domain is mandatory for public discovery.

Current service catalog is the only owner of service URLs. The XML sitemap lists the homepage, four existing service hubs, all 20 existing detail pages, the contact form, legal pages and the retained working-approach page. Standalone `/checkout` and legacy software sales routes are deliberately excluded.

The optional `/llms.txt` is a factual navigation guide, not an SEO ranking signal or guarantee of inclusion in model answers. Structured data describes services and the organization without unapproved contact locations, fictional client reviews or paid products.

Verification from deployed frontend:

```bash
curl -I https://your-real-domain.com/
curl https://your-real-domain.com/robots.txt
curl https://your-real-domain.com/sitemap.xml
curl https://your-real-domain.com/llms.txt
```

Check canonical tags and `application/ld+json` in **rendered HTML**, ensure the checkout is excluded from the sitemap and returns `X-Robots-Tag: noindex`, then submit the public sitemap to Search Console and Bing Webmaster when you have account access. CI also executes `frontend/tests/seo.smoke.mjs` against a built Next.js server with a reserved test-only hostname. This is deployment-independent smoke verification, not a claim that search engines have indexed production pages.
