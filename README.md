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


## Backend safety and release checks (Phase 5)

- `GET /api/health` is liveness only. `GET /api/ready` performs a database readiness query and returns HTTP 503 when the database is unavailable. Do not use /health as proof that database-backed submissions work.
- CORS origins must be explicit protocol + host pairs in `CORS_ORIGINS`, separated by commas. Arbitrary preview domains and `*` are not allowed. Add every approved preview domain exactly as needed. Absence of a browser Origin header is allowed for server-to-server requests, which still require endpoint security when appropriate.
- Contact requests must be persisted successfully before a 201 response is returned. Email failures after persistence are logged without discarding the saved request. Failed persistence must not trigger a notification or fabricated record.
- `express-rate-limit` remains in-memory and per instance. **Before production**, configure verified host/edge rate controls or a shared limiter and test abuse across concurrent instances. The current limiter is not distributed DDoS protection.
- `/checkout` is an unlisted, noindex route, not authenticated or secure for sensitive orders. Product prices from query parameters and emailed/WhatsApp receipts are not authoritative verification. Do not treat these as completed transactions until a server-owned order and confirmation workflow exists.
- Phase 5 changes are not considered live-tested merely because code and test cases exist. Run `cd backend && npm ci && npm run check`, exercise an actual allowed/disallowed browser origin, verify database and email failure cases in staging, and test checkout security separately before release.
