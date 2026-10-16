# Digital Solutions Enterprise Redesign: Canonical Phase Plan

Status: Phase 1 research/route architecture and Phase 2 visual design specification completed on a single branch; operator approval, licensed font, verified proof and visual sign-off remain open. No application source modified.
Date: 2026-10-15
Repository: zaydattique/Digital-Solution
Documentation merged into main as commit 1e2f2b8370e0e59fdacc3c629e560934488aa37f; Phase 1 and Phase 2 working branch: feat/phase-1-2-architecture-design

## Product and operator goals
- Build a credible, fast, accessible enterprise services website based on the visual *direction* observed in the supplied ESE Agency screen recording: dramatic type, clear grids, bold media, restrained navigation, and dark editorial sections. Do not duplicate its identity, assets, illustrations, or content.
- Adopt dark navy surfaces and controlled electric blue highlights, not the reference site's orange/red look.
- Use exactly one approved, licensed font family on the public website. The user wrote "Translucent Sans". This name has NOT been verified; do not select a substitute or ship an unknown/unlicensed font without explicit confirmation.
- Adapt the service-first information architecture of https://www.xevensolutions.com/ without copying its text, product catalog, marketing metrics, reviews, award claims, or distinctive design.
- Digital Solutions offers CLIENT SERVICES, not proprietary AI products. Remove product-ecosystem wording and invented product/platform claims.
- Preserve existing working functionality, backend and data. Any URL removal requires a redirect and SEO assessment.
- Business goal: qualified leads and demonstrable trust, not decorative motion or vanity traffic.
- Target an internally verified audit score >=8/10 and 100% of applicable technical SEO/AEO/GEO acceptance gates. A third-party 10/10 SEO rating or AI search citation cannot be guaranteed.

## Sources, current baseline, and boundaries
- Supplied 351-second ESE Agency reference video, October 2026, inspected as sampled frames, not yet measured through browser automation.
- Xeven Solutions public pages researched 2026-10-15. Service structure relevant, product ecosystem irrelevant.
- Threezero reference: PROJECT_PLAN_SITE_REDESIGN.md and DESIGN_REDESIGN.md. Adopt its phase format and evidence-based completion rules, not its unrelated admin/payment requirements.
- Existing Digital Solutions documentation: README.md and PROJECT_REVAMP_PLAN.md. Preserve historical revamp plan.
- Current frontend: Next.js 16 App Router; route pages under frontend/app; CSS spread across home, services, legal, contact, reviews, and software tools; content in feature/data modules.
- Current backend: Express/Drizzle/PostgreSQL/Resend; POST /api/v1/contact and GET /api/health.
- Confirmed defects from source review: CORS fallback allows unmatched origins in backend/src/app.ts; contact.service.ts fabricates a record after persistence failure if email sends; process-local limiter; checkout takes price from URL without server-issued orders. Verification and repair are mandatory.
- Phase completion is NEVER inferred from old README statements. Record exact test commands, commit SHA, results, screenshots and deployment evidence.

## Locked working rules
1. Audit and EDIT the existing implementation in place. No side-by-side V2 components, routes, CSS overrides, API implementations, or replacement folders where original code can be corrected.
2. First map every affected file, imports, data dependencies, class selectors and URLs. Write failing regression tests for defects before fixing them.
3. Maintain existing public URLs when useful. Preserve content and form submissions; add server-side 301/308 redirects for approved retired URLs.
4. One canonical public stylesheet as a final outcome. Prefer consolidating into existing frontend/src/features/home/styles/home.css, which is already globally imported, unless Phase 0 demonstrates a stronger canonical owner. Do NOT create an additional stylesheet as a shortcut. Remove obsolete CSS files/imports only after verifying all consuming pages.
5. One approved font family sitewide; self-host/next/font when legally possible. No uncontrolled font mixtures.
6. Keep server components by default. Only interactive islands need "use client".
7. No unapproved paid products, invented portfolios, client names, logos, certification badges, statistics, testimonials or SEO claims.
8. No em dash characters in *new frontend copy*; use punctuation naturally. Avoid empty "AI-powered/revolutionary/transformative" filler. Technical descriptions of AI services are allowed when accurate.
9. No fabricated SEO outcomes. Page-level acceptance criteria must be verified in generated HTML and deployed behavior.
10. No irreversible deletion, migration, production change, payment processing, or third-party outreach without explicit approval and backup.
11. Existing content that can change through code is not necessarily admin-managed. Admin editing is out of scope unless approved and a content management design is specified.
12. Every phase ends with code diff review, relevant tests, accessibility + responsive checks, record of known gaps, and a rollback plan.

## Phase 0: Read-only baseline and dependency inventory
### What we want
Know exactly what exists, what works, what must survive, and where cleanup is safe.
### How to achieve it
- Snapshot HEAD SHA, all routes, navigation/footer links, forms, SEO metadata, API contracts, assets, tracking, environment variable names, and current documents.
- Capture full-page desktop/tablet/mobile screenshots for existing routes, keyboard interactions and network behavior.
- Run both npm ci/check pipelines, note actual results; do not copy historical passing counts as current results.
- Search all hard-coded business contacts, media paths, titles, pricing, company claims, reviews, scripts and duplicate CSS rules.
- Inventory existing web pages indexed publicly and Search Console analytics when access is available; capture canonical, status, backlinks and redirects.
- Create a retained/modify/remove file map; identify breakage risk by route.
### Acceptance criteria
- [ ] HEAD SHA, route inventory, baseline screenshots and test transcript recorded.
- [ ] Every existing public URL mapped as retain, redirect, or deliberately retire.
- [ ] Defects prioritized with reproduction steps and tests.
- [ ] List of CSS, JS, data and media files to EDIT versus eventual delete approved.
- [ ] No source behavior or production data changed.
### Non-goals
No redesign implementation and no premature code deletion.

## Phase 1: Brand truth, services and information architecture
### What we want
A search-friendly, service-led site reflecting actual Digital Solutions capabilities.
### Proposed public URL model
- / : landing page and conversion hub.
- /services : all service categories.
- /services/ai-automation : overview of AI consulting, workflow automation, agents, integrations when actually offered.
- /services/ai-automation/[slug] : distinct genuine services, unique intent only.
- /services/development and /services/development/[slug] : software, web, mobile, API/cloud topics according to actual service inventory.
- /services/design and /services/design/[slug] : UX/UI, product and brand design if offered.
- /services/marketing-seo and /services/marketing-seo/[slug] : SEO, digital marketing and performance if offered.
- /work and /work/[slug] : ONLY if real, consented, publishable projects exist. Otherwise keep case studies embedded and do not generate empty pages.
- /about : company facts, method and team only after identity/people evidence is approved.
- /book-a-demo : rename visible CTA to "Discuss a project" or "Get a proposal" while retaining current URL initially.
- /privacy-policy and /terms-of-service.
- /reviews : retain only if reviews are genuine and verifiable. Otherwise consolidate genuine proof and redirect deliberately.
- /services/software-tools and /services/software-tools/checkout : quarantine from navigation pending operator decision. These are currently existing public routes and must NOT be deleted without preservation/redirect/payment analysis. A product-free services direction conflicts with this existing checkout.
- /insights and /insights/[slug] : OPTIONAL only if real editorial capacity and original articles exist; do not create templated filler.
### Proposed homepage sequence
1. Compact header with clear services navigation and one primary CTA.
2. Editorial hero: one clear value proposition and strong media, not product ecosystem.
3. Client problems / who we help, concise and evidence-based.
4. Services overview, interactive/accordion only if accessible and useful.
5. Delivery approach: Discover, Design, Build, Launch, Support, reflecting actual process.
6. Selected outcomes or verified work, conditional on evidence.
7. Why work with us / quality assurance / capabilities, with verifiable differentiators.
8. Direct-answer FAQ, concise content matched to search intent.
9. Contact CTA with clear next step.
10. Complete structured footer with NAP, legal and services.
Do not import Xeven's proprietary ecosystem, product wheel, investment section, or numerical claims.
### Acceptance criteria
- [ ] Operator-approved services and subservices, no false offerings (20 existing candidates mapped; sign-off pending).
- [x] Each existing route group has a proposed primary search intent, CTA and internal-link architecture; conditional new routes are documented.
- [ ] Existing-to-target redirect map and canonical route table signed off (preservation proposal drafted; no redirects approved).
- [ ] Reviews, software-tools checkout, company NAP, portfolio claims resolved explicitly (source risks inventoried; decisions pending).
- [x] Content plan avoids new competing keyword doorway pages; future published copy needs QA.
### Non-goals
No speculative service pages, fictional case studies or autogenerated SEO doorway pages.

## Phase 2: Visual system, media and content specification
### What we want
A consistent enterprise dark-blue design, visually inspired by the recording yet recognizably Digital Solutions.
### How to achieve it
- Lock navy palette, contrast-safe foreground colors, spacing, grid, typography scales, controls, icon treatment and motion limits in DESIGN_REDESIGN.md.
- Resolve exact identity, licensing, font files and loading strategy for "Translucent Sans" before CSS implementation.
- Use authentic product-free media with licensing and accessibility metadata. Prefer existing optimized AVIF/WebP assets only if they suit the new direction.
- Define states: hover/focus/active/loading/error/empty/success; mobile/touch; prefers-reduced-motion; zoom at 200%.
- Create route wireframes and content specs first; no animated effects without a user-experience rationale.
### Acceptance criteria
- [ ] Reference analysis, tokens and responsive wireframe inventory approved.
- [ ] Font name and use rights explicitly confirmed.
- [ ] Asset list, source rights, sizes and alt-text briefs accepted.
- [ ] Contrast checks at least WCAG 2.2 AA where applicable.
- [ ] Single CSS owner and migration plan fixed.
### Non-goals
No pixel copying, unauthorized logos or unlicensed media.

## Phase 3: Shared layout and homepage redesign
### What we want
Implement the approved direction without duplicate markup/styles and without breaking existing routes.
### How to achieve it
- Modify existing global layout, navigation, footer, homepage and shared components in place.
- Break up HomePage.tsx by responsibility and shift static sections to server components.
- Consolidate CSS into the agreed existing canonical stylesheet, migrate selectors in batches, then remove old imports/files after all routes are tested.
- Ensure all controls, forms, navigation, responsive assets and animations work with keyboard/touch, reduced motion and realistic network conditions.
### Acceptance criteria
- [ ] Mobile 320/375/390, tablet 768/1024 and desktop 1440/1920 verified.
- [ ] Home UI matches approved compositions, not merely approximate colors.
- [ ] No cloned components or newly layered CSS implementation.
- [ ] Existing conversion paths, deep links and footer navigation still work.
- [ ] Documented baseline versus post-change performance and accessibility.
### Non-goals
No backend rewrites under cover of visual updates.

## Phase 4: Services, about, trust and conversion pages
### What we want
Finish the service-first page architecture with unique copy and predictable components.
### How to achieve it
- Edit existing service hubs and detail templates with reusable layouts and topic-appropriate content.
- Introduce new routes only when content/intent cannot be served by existing routes; preserve existing slugs as appropriate.
- Verify all real testimonials/case studies with written source and permission before publishing.
- Simplify the contact form while matching backend validation exactly; keep the backend API unchanged except approved bugfixes.
- Decide fate of existing software tools and manual checkout, documenting business continuity and safe transitions.
### Acceptance criteria
- [ ] Each approved service has unique H1/title/description, benefits, deliverables, process, FAQ and primary CTA.
- [ ] Every exposed stat or testimonial has supporting evidence or is removed.
- [ ] No client-visible fictitious "verified" badges.
- [ ] Conversion journey and all existing retained URLs pass E2E tests.
### Non-goals
No fabricated thought leadership, products or certifications.

## Phase 5: Backend correctness, security and operations
### What we want
Correct inherited vulnerabilities and business reliability defects before release.
### How to achieve it
- Fix false-allow CORS in backend/src/app.ts and regression tests; use explicit exact origins, no arbitrary *.vercel.app bypass.
- Fix backend/src/services/contact.service.ts so a failed persistence cannot look like a real saved record; define and test success semantics.
- Harmonize Unicode-friendly contact validation between frontend and backend.
- Add server-side shared rate limiting/edge protection and privacy-safe logs, subject to actual hosting capability.
- Split /api/health liveness from an optional /api/ready database readiness check.
- Harden outbound notification lifecycle, secrets, provider timeouts, consent and spam abuse controls.
- Resolve pricing/order integrity or remove production purchase claims until genuine server-side order verification exists.
### Acceptance criteria
- [ ] DB/email partial failures tested; no fabricated IDs.
- [ ] Allowed/disallowed-origin tests run and pass.
- [ ] Abuse controls work across parallel instances or are enforced at edge.
- [ ] Security headers and runtime configuration verified on deployment.
- [ ] No checkout claim of payment verification without verified backend event.
### Non-goals
No unnecessary authentication system or complex queue if evidence says not needed.

## Phase 6: Technical SEO, AEO and GEO implementation
### What we want
Complete auditable search and answer-discovery foundations with truthful editorial content.
### How to achieve it
- Add Next.js Metadata API titles, meta descriptions, metadataBase, absolute canonicals, language, OG/Twitter image metadata per indexable page.
- Add frontend/app/robots.ts, frontend/app/sitemap.ts, frontend/app/llms.txt/route.ts (or appropriately equivalent static file) ONLY where absent; verify that output is correct and not duplicated.
- Sitemap enumerates only canonical 200 indexable routes, including generated service slugs; exclude checkout, unapproved drafts and thank-you states.
- robots obeys staging restrictions (prefer auth/noindex; robots alone is not access control), protects sensitive endpoints where meaningful.
- Build Organization, WebSite, Service, BreadcrumbList, and eligible FAQ schema only when Google/schema.org guidelines and actual visible content support them. FAQ schema is not guaranteed to display a rich result.
- AEO: answer-first intros, descriptive question headings, precise terminology, concise extractable definitions, genuine FAQs and verifiable citations.
- GEO: consistent approved business name/contact/location, verifiable evidence, service-specialty associations, authoritative outbound references, and no contradictory claims.
- llms.txt is supplemental and NOT a substitute for sitemap, metadata, visible content or crawl access. Never imply ranking/AI citation guarantees.
- Audit 404/redirect behavior, mobile crawl rendering, duplicate pages, index coverage, internal linking, hreflang only when translated pages exist, and image alt text.
### Acceptance criteria
- [ ] /robots.txt, /sitemap.xml, /llms.txt return 200 and accurate content in preview/production.
- [ ] All indexable pages have unique title/H1/description/canonical, proper status, purposeful internal links.
- [ ] Structured data validates and aligns with visible verified content.
- [ ] No indexable soft 404, duplicate canonical, accidental noindex or broken internal links.
- [ ] Core Web Vitals measured, documented and improved by priority, not guessed.
- [ ] Search Console, Bing Webmaster and actual indexing reviewed when access granted.
- [ ] 100% applicable internal SEO/AEO/GEO quality gates passed; no claimed guarantee of an external 10/10 score.
### Non-goals
No keyword stuffing, mass-generated empty pages, fictitious reviews or LLM-specific manipulation.

## Phase 7: Comprehensive QA, accessibility and performance
### What we want
Evidence of usability, correctness and regression resistance.
### How to achieve it
- CI: npm ci, lint, typecheck, backend/frontend tests and production builds.
- Playwright E2E: header/mobile navigation, every route, contact happy/error/timeout cases, service linking, FAQ, keyboard, no-JS baseline where applicable, 404, payment flow only if retained.
- Axe checks; manual screen-reader and keyboard passes; browser tests in Chromium/WebKit/Firefox; responsive/zoom and reduced-motion testing.
- PageSpeed/Lighthouse runs per template, not one homepage score.
- Dependency audit, runtime smoke tests, CSP/CORS probes, rate limiting with concurrency and actual email/database test in isolated environment.
### Acceptance criteria
- [ ] Current HEAD and executed command logs recorded, no unexplained failing checks.
- [ ] P0/P1 regressions fixed, page screenshots approved.
- [ ] All supported mobile/desktop journeys and accessibility requirements tested.
- [ ] Performance budgets and exceptions recorded.
### Non-goals
No unsupported claims of a penetration test or provider-side DDoS certification.

## Phase 8: Release, crawl verification and post-launch hardening
### What we want
Safe cutover with observability and rollback.
### How to achieve it
- Deploy to preview, inspect exact commits, run full gates, back up deployment settings and data.
- Validate production routes, redirects, forms, real persistence, emails, headers, assets, sitemap, robots, llms and OG previews.
- Configure analytics with consent where required, track meaningful conversions without PII leakage or duplicate events.
- Submit sitemap in Search Console/Bing Webmaster; monitor crawl/index coverage and CWV.
- Define rollback commit, release owner and monitoring plan.
### Acceptance criteria
- [ ] Production deployment is linked to reviewed commit SHA.
- [ ] Every retained route or approved redirect works, 404s intentional.
- [ ] Forms persist exactly as promised and conversion events are not duplicated.
- [ ] SEO endpoints and structured data rechecked against LIVE HTML.
- [ ] Final audit >=8/10 according to documented scored evidence, otherwise phase remains open.
- [ ] Remaining unknowns and independent SEO outcome limitations documented.
### Non-goals
No declaring launch complete from successful compilation alone.

## Phase dependencies and sequence
| Phase | Purpose | Depends on |
| --- | --- | --- |
| 0 | Baseline and inventory | None |
| 1 | Services, truth and URLs | 0 |
| 2 | Visual and content design | 1 |
| 3 | Homepage/layout | 2 |
| 4 | Service and conversion pages | 1, 2, 3 |
| 5 | Backend, safety and payments | 0; can proceed in parallel with 2 to 4 |
| 6 | SEO/AEO/GEO | 1, 4, 5 |
| 7 | Certification | 3, 4, 5, 6 |
| 8 | Deployment and verification | 7 |

## Mandatory decisions before implementation
1. Confirm actual intended single font family, licensing, and asset availability: "Translucent Sans" may be a mistaken font name.
2. Decide what to do with existing software-tool sales/checkout, which conflicts with services-only vision.
3. Approve actual services and subservices; no automatic inclusion solely because Xeven lists them.
4. Supply/approve legal business name, contact details, locations, case studies and review provenance.
5. Confirm final primary domain and hosting, plus access for live technical SEO, analytics and performance verification.

## Reporting for each phase
Every completion update must contain: commit SHA; paths modified/deleted; old code reused versus removed; route/API compatibility; tests actually executed (commands/counts); screenshots or measurements; security/SEO checks; remaining risks; rollback steps; and pending operator approvals. Incomplete or untested is never marked complete.


## Phase 1 and Phase 2 checkpoint (2026-10-15)
- Branch: `feat/phase-1-2-architecture-design`. All work for these phases is kept together, after original planning PR #1 was merged to main.
- Source: 20 current detailed service slugs and four hubs inventoried without modifying their implementation. Existing software-tools checkout and reviews are preserved pending explicit operator decisions.
- Homepage sequence, navigation, footer and page content requirements are defined in DESIGN_REDESIGN.md, along with the original visual grammar extracted from ten sampled frames of the supplied video.
- Dark navy tokens, single typography requirement, image sourcing, accessibility and one-CSS-file consolidation plan are specified. The font named `Translucent Sans` could not be independently verified; `Transgender Grotesk` exists but is not automatically equivalent or licensed.
- Release/implementation blockers: verify which services are actually delivered; approve software-tools fate; supply factual company NAP, testimonial permissions, approved media/font; approve final visual layouts. No redirects, source changes, CSS edits, app tests or live deployments have happened in Phases 1 and 2.
- Completion truth: research and documentation deliverables are complete; all approval-dependent acceptance boxes remain open. Do not mark implementation or runtime quality gates as passed.

## Operator scope update and Phase 1/2 implementation record (2026-10-15)
- Business identity: **marketing-focused agency**. Keep existing 20 service routes and four category groups. Reorder and rename the four current groups, without introducing new offerings or duplicate service modules: Marketing & SEO, Design & Experience, Web & Development, Automation & AI.
- Service pages remain useful SEO landing pages, while all inquiry CTAs point to the existing /book-a-demo contact form. Internal links must connect every category, detail and contact page.
- Software Tools catalog removed from public navigation; legacy /services/software-tools redirects to contact. Checkout now lives at /checkout with old checkout deep link redirected and robots noindex/nofollow. This is a **direct-link-only unlisted page, not access-controlled privacy**; real payment processing remains pending secure server validation.
- Font name corrected to **Translucent Sans**. Source and embedding license not verified; no substitute binary may be mislabeled or uploaded. Typography implementation remains explicitly BLOCKED until valid font is supplied.
- Implementation on this phase branch edits existing service catalog, homepage/navigation, header, contact copy and legacy route owners. One justified new app/checkout/page.tsx file exists for route separation. No new services or CSS overrides added.
- SEO requirements continue to include cross-links among related services/hubs and contact; technical sitemap/robots/llms will be verified in Phase 6.

## Phase 3 implementation checkpoint, 2026-10-15
Working branch: `feat/phase-3-marketing-homepage`; Phase 1/2 PR #2 was merged into main at commit `9f6bcf0c52ac51454f17ac9760697de143a04da9`.

### Implemented in existing files
- Homepage hero and initial service-section messaging now establish the marketing agency positioning. The process carousel now describes Discover, Plan, Create, Launch and Improve using existing components, avoiding invented performance guarantees in these edited passages.
- Homepage brand-tool marquee no longer renders; this avoids suggesting a proprietary AI-product lineup.
- Sitewide footer now reads exactly the four category groups and all 20 existing service-detail URL targets directly from the existing services.ts catalog. No new link registry was introduced.
- Every service detail template now links to sibling detail pages, all existing hubs and the existing /book-a-demo contact page; service hubs already link to all five detail pages and the form.
- Root/homepage metadata now describes digital marketing and design; existing dark navy/blue tokens are being adapted in place.
- Removed the previous three simultaneously loaded font families, leaving Nunito Sans as the only loaded **temporary fallback** font. The specifically requested **Translucent Sans is NOT installed or rendered** because no verified legally embeddable source was established. This remains a blocking visual requirement.

### Incomplete Phase 3 acceptance gates
- [ ] Exact requested Translucent Sans licensed font integrated and measured.
- [ ] Full reference-directed composition and coherent dark blue treatment on EVERY public route.
- [ ] Single canonical CSS source. Existing page-specific stylesheets remain until safe migration with visual regression tests.
- [ ] All existing links, checkout redirect, and contact journeys tested under running server.
- [ ] Baseline and post-change mobile/tablet/desktop screenshots approved.
- [ ] Automated lint, typecheck, build, keyboard and WCAG contrast executed and logged.
- [ ] Unsupported homepage/reviews/service metric claims removed or verified before publication.
- [ ] Complete SEO live crawl and canonical/OG/structured-data checks (Phase 6).
Phase 3 is **IN PROGRESS**, not complete, regardless of branch merge or document status.


## Phase 5 implementation checkpoint (2026-10-16)

Working branch: `fix/phase-5-backend-security-reliability`. Phase 3 PR #3 merged as `bcfa9285915c9d6ef016b2b1ecfe34302a8b7b3b` and Phase 4 PR #4 merged as `6ee530835f78884e0ff6980bfd505e571d78a1de`.

### Implemented in existing owners
- [x] `backend/src/app.ts`: exact origins only, deny outside browser origins with 403, remove permissive `.vercel.app` suffix and unconditional success fallback.
- [x] `backend/src/config/env.ts`: parse and reject wildcard/invalid origin config.
- [x] `backend/src/services/contact.service.ts`: persist before email, fail on database error; no manufactured `id: 0`.
- [x] `backend/src/schemas/contact.schema.ts` and frontend contact component: Unicode-friendly consistent name validation.
- [x] Existing backend tests cover DB write failure without notification, rejected preflight and international names.
- [x] `backend/src/routes/health.routes.ts`: distinguish liveness from DB-backed readiness at `/api/ready`.
- [ ] Full `npm run check` execution: not performed. No running local checkout of repository available from connector. These assertions are code inspections, not passing test claims.
- [ ] Distributed limiter / edge WAF: deployment-specific setup unverified. Current express-rate-limit is process-local; production gate remains.
- [ ] Authoritative server-side order and payment verification for direct-link checkout: not implemented, checkout must not be described as private authorization.
- [ ] Verified database, Resend and preview/prod security headers in live infrastructure: unavailable.
- [ ] Frontend browser tests, responsive CSS consolidation, verified Translucent Sans: inherited unfinished phases.

**Phase 5 status: significant bugfixes committed; infrastructure, payment and runtime acceptance criteria OPEN.**
