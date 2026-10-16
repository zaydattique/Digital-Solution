# Agent Rules for HavocX Agency

These instructions apply to all changes in this repository.

## Canonical documents
1. PROJECT_PLAN_SITE_REDESIGN.md is the current redesign implementation roadmap and phase gate.
2. DESIGN_REDESIGN.md is the visual, routing, content and SEO design contract.
3. README.md explains current local commands and architecture.
4. PROJECT_REVAMP_PLAN.md is historic migration documentation. Do not misreport prior checkmarks as current production proof.

## Prime directive: FIX IN PLACE
- Before proposing a new file, search for an existing file/module that owns the behavior. Modify the OWNER. A new file must have an explicit single responsibility absent from existing modules.
- Never create parallel _v2, _new, redesign, fixed, override, temp copies of components, hooks, styles, handlers, data stores or routes to avoid fixing the original.
- Do not append selectors with higher specificity merely to mask old CSS. Edit the original rule, migrate properly, and remove the obsolete selector once usages are verified.
- The public UI's target is ONE canonical CSS stylesheet. Existing multiple CSS files are technical debt to consolidate in controlled, verified slices. Prefer existing frontend/src/features/home/styles/home.css unless Phase 0 decides otherwise. Do not add extra global stylesheets.
- Keep changes scoped, readable and typed. Delete dead code and outdated imports only after locating all consumers. Do not create commentary-heavy code where clear naming suffices.
- Do not alter or delete existing functionality under a redesign without an approved compatibility/redirect plan.

## Working order
1. Read relevant canonical docs, Git diff and owner files.
2. Record baseline behavior and test coverage; reproduce defect.
3. Identify exact owner and dependencies.
4. Write regression test before a behavior fix when practical.
5. Implement smallest correct change in existing files.
6. Run relevant lint/typecheck/unit/integration/browser tests.
7. Inspect page layout at mobile and desktop, check keyboard and responsive states.
8. Report files, test commands, outputs, observed versus unverified claims, new risks and rollback path.
9. Do not mark phase complete until every required acceptance criterion is met.

## Frontend and design
- Next.js App Router: server components by default; only use client components for stateful user interaction.
- One confirmed licensed font family, user requires "Translucent Sans"; its exact source and embedding license remain PENDING. No guessed replacements.
- Dark navy, high legibility, constrained electric blue accents; original visual work inspired by provided video, not a copied design.
- Responsive from 320px upward; no horizontal scroll, inaccessible overlay, or broken viewport-height hero.
- WCAG 2.2 AA intent with actual keyboard, focus, semantic heading, form, reduced-motion and contrast checks.
- Efficient images and measured performance, not unverified benchmark claims.
- No em dash character in NEW public website copy. Avoid robotic marketing filler and invented claims. Genuine AI-related service terms are allowed when accurate.
- No misleading loading, payment, booking or verification success states.

## Backend, payments and security
- Preserve Express API routes, DB schema, and existing lead data unless a migration is reviewed and authorized.
- Strict origin handling, Zod validation, request limits, safe error messages, rate-limit defense across actual deployment shape.
- Never fabricate DB records or report success for operations not completed.
- Never trust client query parameters for authoritative product pricing or payment verification.
- Do not store/expose real secrets in client code, logs, commits or generated docs.
- Add robust failure-path tests, include provider and DB partial failures.
- Avoid sending real emails or making external paid API calls in tests without explicit operator consent.
- Do not make production deployments or destructive changes without explicit authorization.

## SEO, AEO and GEO
- Implement metadata using existing Next.js Metadata APIs and page files.
- Ensure exact and unique canonical URLs, sitemap only for approved live pages, accurate robots.txt and optional accurate llms.txt.
- llms.txt does not guarantee indexing or AI citations. No black-box "10/10 SEO" promise.
- Use structured data only if valid and supported by visible, factual, verified content.
- No fictional clients, invented reviews, statistics, certifications, award logos, geographic offices or backlinks.
- Resolve product-only routes and indexable status via operator decision before removing or noindexing.
- Confirm generated HTML, HTTP status, redirects, CWV, Search Console and Bing Webmaster where available.

## Documentation hygiene
- Keep only useful canonical docs; do not create a new doc per tiny change.
- Update existing plan checkboxes and design specification with verified outcomes, not invented status.
- Cite specific files, tests and actual commands for claims.
- Record unverified requirements or blocked decisions explicitly as PENDING.
- Use no em dashes in newly written public site copy; prefer also avoiding them in internal prose.

## Completion report template
- Phase and commit SHA
- Existing files edited, files deliberately removed or newly justified
- Functional contracts preserved or changed
- Tests run and exact results
- Screenshot/performance/accessibility and SEO evidence
- Risks/blockers and rollback
- Next phase and necessary approvals

## HavocX brand, CMS and multi-service contract
- Canonical agency identity is **HavocX Agency** at **havocx.agency**, with the uploaded brand identity board as a reference, NOT a final logo asset. Never invent, trace, or publish a substitute finished logo without approval.
- Company identity, logos, favicon, OG media, social links, email, phones, homepage content and future service/project/legal text belong to the admin-managed site content system. Do not hardcode company metadata/contact data separately into new components.
- The source of truth for CMS overrides is PostgreSQL `site_content`, reached by frontend server functions through the runtime Vercel service binding `BACKEND_URL`. The frontend bootstrap defaults are transitional only. Every field exposed for editing MUST be read by its public consumers or marked draft until wired. A successful CMS save must visibly change the public page without a rebuild.
- Images should be stored off Vercel's ephemeral filesystem, transformed/compressed to WebP for web delivery and videos to WebM before publishing. Media provider signatures, server verification, limits and the admin login protect writes; never publish original/raw unoptimized upload URLs.
- The root `vercel.json` is the only active Vercel service configuration. `frontend` is publicly routed for all non-API URLs; `backend` owns original `/api/*` paths; frontend server-only calls use a bound service URL. Never expose `BACKEND_URL` as `NEXT_PUBLIC_` or manually configure the injected binding variable.
- Public contact forms call same-origin `/api/v1/contact`. Keep the checkout unlisted, signed and separated from service landing pages, and keep admin unlisted with authentication and noindex.
- New account deployment, final service names, public rewrites and bindings need explicit operator confirmation. CI success is not proof of Vercel service deployment.
