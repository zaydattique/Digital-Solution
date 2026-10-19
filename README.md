# Digital Solutions

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

Frontend default taur par `http://localhost:3000` par run hota hai. `frontend/.env.local` mein backend origin configure karein:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000
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

Current rate limiter process-local hai. Vercel ke multiple serverless instances par strict global enforcement ke liye deployment se pehle Redis/Upstash jaisa shared store ya Vercel Firewall rate limiting configure karna recommended hai.

## Database Migrations

`backend/src/db/migrations/0000_smiling_barracuda.sql` current `demo_requests` table ki idempotent baseline hai. Existing Aiven data preserve karne ke liye migration `CREATE TABLE IF NOT EXISTS` use karti hai.

Production migration ko blindly build/start hook mein nahi chalaya jata. Pehle SQL review karein, database backup/status verify karein, phir backend folder se explicitly run karein:

```powershell
npm run db:migrate
```

## Vercel Deployment

Aik hi Git repository ko do Vercel projects se connect karein.

### Backend project

1. Root Directory: `backend`
2. Framework Preset: Express (auto-detected)
3. Backend environment variables Preview aur Production mein add karein.
4. Deploy ke baad `/api/health` verify karein.
5. Production backend URL note karein.

`src/index.ts` Express app ko default export karta hai, jo Vercel Function entry point hai. Local environment mein yehi file port listener start karti hai.

### Frontend project

Backend production URL confirm hone ke baad:

1. Root Directory: `frontend`
2. Framework Preset: Next.js (auto-detected)
3. `NEXT_PUBLIC_API_URL` ko backend production origin par set karein; trailing slash na dein.
4. Frontend deploy karein.
5. Final frontend origin ko backend `CORS_ORIGINS` mein add karke backend redeploy karein.
6. Contact form, database row aur notification email ka end-to-end smoke test karein.

Backend URL source code mein hardcoded nahi hai; browser client sirf `NEXT_PUBLIC_API_URL` read karta hai.

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

