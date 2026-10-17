# HavocX Agency

HavocX Agency is a marketing-focused website with a Next.js frontend and an Express/PostgreSQL backend. The repository uses **one Vercel Services project**, not two separate Vercel projects. The agency's new public domain is **havocx.agency**.

## Quick start

Requirements: Node.js 22+, npm 10+, PostgreSQL and email-provider credentials.

```bash
cd backend && npm ci && npm run dev
cd frontend && npm ci && npm run dev
```

For an integrated Vercel Services run from the repository root:

```bash
vercel dev -L
```

The root `vercel.json` owns service builds, internal bindings and public URL routing. Only `frontend` is publicly exposed.

## Vercel Services configuration

The proposed service topology is:

| Service | Directory | Framework | Public URL |
| --- | --- | --- | --- |
| `frontend` | `frontend/` | Next.js | `/*`, including contact proxy |
| `backend` | `backend/` | Express | Internal only; no public rewrite |

The **frontend** service binds to **backend** using `BACKEND_URL` (service binding, server-side only). Vercel sets `BACKEND_URL` automatically for frontend functions. **Never add BACKEND_URL yourself** and do not read this binding inside browser code or middleware. The browser contact form calls the same-origin `/api/v1/contact`, handled by a narrowly scoped Next.js frontend route that validates and forwards requests over `BACKEND_URL`. There is no public rewrite to backend. Backend Express routes already include the `/api` prefix. Internal CMS and media APIs stay private. The backend does not bind to the frontend.

Confirmed with Vercel services docs: https://vercel.com/docs/services

### Deploy with a different Google/Vercel account

1. Sign in to the intended Vercel account. Connect or authorize the GitHub account/organization that has access to `zaydattique/Digital-Solution`.
2. Choose **Add New -> Project**, import the repository, and use the **repository root** as the project root. Do **not** select `frontend/` or `backend/` for this multi-service project.
3. Vercel Services reads root `vercel.json`. The names `frontend`/`backend`, frontend-only public routing and one-way backend binding are confirmed.
4. Provision the environment variables below in this Vercel project. A different Google account does not automatically copy databases, secrets, domain ownership or deployments.
5. Prepare/run the reviewed Drizzle migration from `backend/` using `npm run db:migrate`; use database backup procedures before running it against live data.
6. Configure DNS for `havocx.agency` in the account that actually controls the domain. Set `SITE_URL=https://havocx.agency`, attach the domain to the new Vercel project, then run staging/production smoke checks.
7. Do not route traffic or merge this PR until you confirm the service topology and all secret/provider dependencies are installed.

### Environment variables

Configure these in the **Vercel project environment**, with per-service secrets kept server-side. Do not use a `NEXT_PUBLIC_` prefix for passwords/tokens.

- `SITE_URL=https://havocx.agency` for frontend canonical URLs, sitemap and schema (use a separate preview origin for preview testing if indexing is desired; otherwise explicitly block previews).
- `DATABASE_URL`: PostgreSQL connection string. Default SSL is required in production.
- `RESEND_API_KEY`, `ADMIN_EMAIL`, `EMAIL_FROM`: backend notification provider settings.
- `CORS_ORIGINS=https://havocx.agency`: allowed browser origin(s); preview origins must be explicit. Same-origin browser calls normally do not need cross-origin requests.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: **required for production contact availability** because the limiter fails closed without a shared rate-limit store.
- `CHECKOUT_LINK_SECRET`: random 32+ character secret for standalone signed /checkout links (manual bank verification still needed).
- `ADMIN_PASSWORD`: unique strong password, 16+ characters, used only by server-side admin login.
- `ADMIN_SESSION_SECRET`: independent random 32+ character secret for signed HTTP-only admin sessions.
- `INTERNAL_CMS_TOKEN`: independent random 32+ character API token, shared privately between frontend server and backend API for admin writes.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: backend media storage and transformation provider. Without them, uploads are blocked (503) rather than saved as unoptimized originals.

**Do not configure Vercel's generated `BACKEND_URL` yourself.**

### CMS / admin

Go to `/admin/login`. After login, `/admin` allows authorized content editors to update saved site values: agency name, tagline, logo, favicon, OG media, homepage hero copy/image/video, email, phone numbers, social links, legal revision display, and text/media slots of the 20 existing service details. Public pages load the shared PostgreSQL-backed settings through the runtime service binding. Sensitive admin updates are restricted to an authenticated frontend server action and an independent backend API token.

**Image and video handling:** The admin upload form validates accepted types and size limits. JPEG/PNG/WebP uploads are transformed through Sharp into compressed **WebP**. MP4/WebM uploads are forwarded to Cloudinary's eager **WebM** transcode. Only a confirmed WebM transformation URL is published. Remote object storage persists assets across serverless deploys. SVG is intentionally rejected. Video conversion and storage depend on Cloudinary account capabilities/credentials and are not represented as live-tested without them.

The uploaded logo board is inspiration only. **No logo files have been generated, extracted, or added to the repository.** Until a licensed and approved artwork file is uploaded through admin, the site shows an accessible text fallback.

**Scope caveat:** The admin foundation covers identity, contact, home hero, service heading/lede/summary and hero asset fields. The remaining legacy secondary page copy, full category catalogs, legal article bodies, decorative screenshots and any additional media placements have NOT all been converted to editable CMS data yet. A full editable-content inventory and publishing workflow are still needed before claiming *nothing is hardcoded*.

### Verification

```bash
cd backend && npm ci && npm run check
cd frontend && npm ci && npm run check && npm run test:e2e
```

GitHub Actions also runs real PostgreSQL migrations/persistence and browser tests. **CI is not a substitute for live domain, database, Cloudinary video output, email, edge rate limit or actual customer payment checks.**

Public routes include homepage, four service hubs, 20 service detail routes, `/book-a-demo`, and legal pages. `/checkout` is deliberately unlisted and requires a signed link. The previous software-tools service is not publicly offered.

For detailed phase history, see [PROJECT_PLAN_SITE_REDESIGN.md](PROJECT_PLAN_SITE_REDESIGN.md), [DESIGN_REDESIGN.md](DESIGN_REDESIGN.md) and [AGENTS.md](AGENTS.md).

### Confirmed service routing (2026-10-17)

The operator confirmed **frontend** and **backend** names, one public frontend catch-all, internal-only backend and the sole service binding `frontend → backend` through Vercel's generated `BACKEND_URL`. The frontend implements a narrow POST route at `/api/v1/contact`, not a generic API passthrough. Internal settings and media APIs remain accessible only to server functions with the internal binding and authorization.

Self-deployment smoke checks: a valid POST to `https://havocx.agency/api/v1/contact` should reach the internal backend, invalid payloads should return 400, and foreign Origin requests should be rejected. `GET /api/v1/site` and `POST /api/v1/media` on the **public** domain should return 404. `/admin` is a protected frontend server route; internal writes require authorization. The private backend verifies a short-lived signed pseudonymous visitor identifier supplied by the frontend and falls back to the service caller's address for unsigned requests; verify live traffic before assuming per-visitor throttling. Do not claim that the proxy preserves visitor IPs without a verified trusted-forwarding design.
