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

## HavocX identity, CMS and Vercel Services (2026-10-17)
- The active public identity is **HavocX Agency**, canonical domain **havocx.agency**. "Digital Solutions" is legacy project history only, not current public branding. Never reintroduce the old logo, email or phone numbers.
- The uploaded HavocX brand-identity board is a visual **idea**, not permission to fabricate or copy logo assets. Use the admin-controlled approved-logo URL or a text fallback until real artwork is provided.
- Editable company name, description, contact channels, logo, favicon, OG image, home hero, legal revision and 20 service-detail hero fields are owned by PostgreSQL `site_settings`. Change original public components to use one server-provided SiteProvider, not parallel hardcoded copies.
- Every additional user-facing text/media item intended to be editable must gain a typed/validated admin field and corresponding UI consumer; do not mark the no-hardcoding audit closed while old service-category, legal-body, secondary-media, case-study or footer content remains in code.
- Keep `frontend/src/features/home/styles/home.css` as the sole authored application CSS owner. Modify original rules, no special "admin override" CSS files.
- Root `vercel.json` owns **one Vercel project with two services**. `frontend` binds to `backend` using Vercel-generated `BACKEND_URL`; never hardcode, manually configure, expose to the browser, or use the binding during build/middleware.
- Public browser calls go to same-origin `/api/*`; actual backend Express paths retain `/api`. Confirm public paths, names and binding with operator before merge/deploy.
- New admin-uploaded images must validate MIME, magic bytes and pixel limits, then convert to compressed WebP. Video must be transcoded to WebM by the configured media provider with a verified result; avoid storing uploads to ephemeral function disk. Never accept SVG until a securely sandboxed sanitizer/validation pipeline is implemented.
- Admin tokens/passwords, Cloudinary keys and third-party credentials remain server-only. Never commit .env files or distribute proprietary brand/font files. Signed cookie, admin API authorization and no-store response must remain enforced.
- Public SEO and schema descriptions must use actual approved brand and content; avoid fictional reviews, locations or service-delivery statistics. Preview deployments must remain nonindex.
- Do not claim that the full CMS coverage audit, live CDN video transcoding, Vercel Services deployment or final production verification has passed without real evidence.
