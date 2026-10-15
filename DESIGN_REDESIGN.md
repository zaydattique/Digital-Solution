# Digital Solutions Redesign: Design, Content, Route and SEO Specification

Date: 2026-10-15
Status: DESIGN SPECIFICATION DRAFT. Implementation requires Phase 0 and Phase 1 decisions in PROJECT_PLAN_SITE_REDESIGN.md.
Canonical phase plan: PROJECT_PLAN_SITE_REDESIGN.md
Historical backend separation plan: PROJECT_REVAMP_PLAN.md

## Reference interpretation
### Uploaded recording
The user supplied a 351-second screen recording showing an ESE Agency-style site. Sampled frames reveal:
- nearly black canvas, high-contrast enormous editorial headings;
- minimal horizontal navigation with small brand;
- large full-bleed color-rich photos and projects;
- strong cards/grid systems, compact services accordion;
- offset editorial compositions and bold closing contact.
Translate these FORM principles to Digital Solutions with original compositions and media. Never trace/copy the reference brand, source site UI, text, images, icons, illustrations or animations.

### Xeven reference
Source: https://www.xevensolutions.com/ (reviewed October 2026).
Relevant sequence: promise -> what we do -> delivery model -> delivered work -> third-party trust -> company/about -> contact.
Not relevant: proprietary platform ecosystem, product flywheel, investor section, product adoption metrics, platform screenshots. Do not reuse Xeven's copy, client identities, statistics or other claims.
Our intent is a services-led enterprise consultancy / engineering studio, not a product seller.

## Visual identity v0 (subject to approval)
| Token | Value | Use |
| --- | --- | --- |
| navy-950 | #050D20 | site shell |
| navy-900 | #09162B | primary section background |
| navy-800 | #102B55 | card/surface |
| blue-500 | #2779F5 | focus, primary CTA and controlled highlights |
| blue-300 | #81B8FF | links/details on navy |
| ink-inverse | #F6F9FF | headings and body on dark |
| muted-inverse | #BACBE6 | supporting copy |
| border | #315177 | separator and surface boundaries |
Avoid low-contrast muted labels; verify real WCAG contrast. Avoid gratuitous glowing gradients, glassmorphism on all cards, neon outlines, and default purple "AI" illustrations.
Typography: SINGLE family, user-specified "Transgender Sans" pending exact identity/licence verification. Do not silently replace. Define scale using CSS clamp for H1/H2/H3/body while keeping legibility and minimum mobile line-height. No extra font for code or decorative labels until explicit signoff.
Spacing: consistent 4/8-point scale; page padding fluid from 16px mobile through 64px large desktop; max content width 1440px; constrained body copy line length.
Components: header, section heading, service card/accordion, case-study tile, process step, trust proof, FAQ, CTA, footer. Reuse and edit existing components first.

## Motion and responsive contract
- Motion must explain state, reveal hierarchy or add controlled brand personality; it must not block navigation or reading.
- Honor prefers-reduced-motion and preserve correct content without animation.
- Avoid scroll-jacking, animation-tied readability, auto-moving carousels without pause controls.
- Test widths 320, 375, 390, 768, 1024, 1440, 1920; portrait and landscape; keyboard and touch; zoom 200%.
- Interactive minimum targets and visible focus rings; native semantic markup; descriptive button labels.
- Preload only actual LCP asset; use AVIF/WebP responsive sources, dimensions to prevent CLS, loading lazy below fold.

## Editorial guidelines
- Use direct, plain English. Descriptive, enterprise-level confidence must be supported by specifics.
- Never use em dash in new public copy. Choose full stops, colons, or commas.
- Avoid generic filler such as "revolutionize your business", "cutting-edge", "unleash the power", "game-changing", or "AI-powered" unless factual and necessary.
- AI service names are allowed because the business actually offers them, but no robot-generated self-congratulation or false guarantees.
- One service topic per page, opening explanation in 40 to 60 words where appropriate, followed by measurable client problems, deliverables, process, FAQs and fit.
- No claims about clients, delivery counts, awards, integrations, testimonials, security certifications or results without evidence and rights.
- NAP = legal/trading name, full approved address where public, telephone and email. Use the SAME canonical data source in footer, contact, schema and metadata.
- Do not invent author biographies or publish templated hundreds of articles.

## Content model / routing proposal
Existing:
- /, /book-a-demo, /reviews, /privacy-policy, /terms-of-service
- /services/ai-automation, /services/design, /services/development, /services/marketing-seo plus existing [slug] pages
- /services/software-tools, /services/software-tools/checkout

Proposed:
- Maintain current routes until route decision table and redirect map approved.
- Add /services aggregator only if real navigation warrants it.
- Add /about, /work and case-study paths only when actual validated content exists.
- Existing software tools / checkout MUST NOT be removed, hidden or rewritten until business owner decides whether to discontinue the offering and how to preserve prior users/orders/bookmarks.
- Use data-driven service details without creating several thin pages for synonymous keywords.
- Use central typed service inventory from existing frontend/src/features/services/data modules; choose a single source of truth and eliminate duplicated descriptors, menu labels and slug maps.

### Page template requirements
Homepage: proposition -> service categories -> delivery approach -> selected verified work -> differentiators -> FAQs -> conversion.
Service category: clear scope -> services list -> business cases -> approach -> proof (only verified) -> FAQs -> quote CTA.
Service detail: concise definition -> audience/problems -> what is delivered -> how engagement works -> integrations/constraints -> FAQs -> related services -> CTA.
About (conditional): verifiable company story -> team/working model -> values in concrete behavior -> contact.
Work (conditional): background -> actual problem -> constraints -> solution -> evidence/outcomes -> consented client context. No invented metrics.
Booking: lean fields, field-level accessible errors, submit loading/success, persisted-lead success semantics, privacy notice.
Legal: accessible from sitewide footer, accurate to actual data handling.

## Source owners and change-in-place file policy
- Global document/meta: edit frontend/app/layout.tsx and actual route page files.
- Home structure: refactor frontend/src/features/home/components/HomePage.tsx and frontend/src/features/home/data/content.ts in place.
- Shared brand/nav/footer: edit existing frontend/src/components/brand and /layout components in place.
- Service cards/details: edit existing frontend/src/features/services/components and /data structures.
- Form behavior: edit frontend/src/features/contact/components/BookDemoPage.tsx, frontend/src/lib/api/contact.ts and backend contact flow rather than creating a parallel form.
- Media: existing frontend/public/assets tree; replace assets responsibly, reuse asset optimizer only after verifying requirements.
- CSS: work toward ONE canonical public CSS owner, preferably existing frontend/src/features/home/styles/home.css; DO NOT introduce "redesign.css", "new.css" or unbounded appended overrides. Inventory imports/selectors and migrate in tested slices. Delete obsolete styles only after checking every existing route; do not accidentally abandon styles for legal/contact/service screens.
- API: edit existing Express paths, never add competing endpoints or duplicate notifications just to avoid debugging original behavior.

## SEO, AEO and GEO route acceptance matrix
Every canonical public route must be reviewed for:
1. HTTP 200 and SSR/crawlable substantive content.
2. Unique human-readable title (~50 to 60 characters as editorial guidance, not a hard ranking rule), meta description, H1, robots state.
3. Correct metadataBase and self-canonical; no redirect loops or conflicting alternates.
4. Visible user intent, defined service/entity, non-thin copy, sensible headings, contextual internal links, useful CTA.
5. Open Graph and Twitter image/title/description, verified via rendered HTML/card preview.
6. Eligible JSON-LD entities reflecting visible factual content, with no misleading Review/AggregateRating markup.
7. Alt text for meaningful images, no decorative alt-text spam.
8. XML sitemap lastmod based on real content updates; only canonical 200/indexable URLs.
9. robots.txt: explicit host/sitemap and environment-sensitive index control, no secrets disclosure.
10. llms.txt: concise accurate navigation and service summaries only; voluntary emerging convention, no ranking promise.
11. Measured mobile performance and Core Web Vitals, accessibility and correct non-200 states for missing slugs.
12. AEO: answer-first explanations and useful FAQs, not gimmicky snippets; GEO: consistent entity identity and credible citations.

### Canonical SEO targets and implementation owner
- frontend/app/layout.tsx: metadataBase, sitewide fallback metadata, icon and locale.
- frontend/app/**/page.tsx: route-specific titles/descriptions/canonicals, page semantics.
- frontend/app/sitemap.ts: derive canonical URL records from approved service route data.
- frontend/app/robots.ts: crawler directives and sitemap location.
- frontend/app/llms.txt/route.ts OR frontend/public/llms.txt: choose one implementation, avoid duplication, use actual product-free navigation.
- Shared validated schema helpers only if duplication exists; no needless abstraction modules.
- 404 route: real notFound() status, no soft 404.
- Redirects: maintain migration table with original URL, target, status and rationale; implement on hosting or Next config, not JS-only navigation.
- hreflang only if translated equivalents are published.
- Publish Google/Bing performance and index evidence only after verified external tool access.

## Existing high-priority correctness issues to repair, with evidence
1. backend/src/app.ts CORS callback accepts unauthorized origins; backend/tests/app.test.ts expects rejection.
2. backend/src/services/contact.service.ts logs DB failure then may return fabricated id 0 if email succeeded; add failure matrix tests.
3. backend/src/middleware/rate-limit.ts uses in-memory store; production request distribution must be considered.
4. frontend/src/features/services/components/SoftwareCheckoutPage.tsx trusts URL query price/product/plan; no authoritative order/payout verification.
5. frontend/src/features/reviews/data/reviewsData.ts marks entries verified but provenance is not established from source; verify each entry before publishing.
6. frontend/src/features/home/data/content.ts publishes quantified delivery claims requiring supporting evidence.
7. frontend/src/features/home/components/HomePage.tsx is large and entirely client-side; reduce client bundle by refactoring existing file.
8. CSS files are fragmented across feature folders; consolidate ONLY with comprehensive regression test coverage.
9. README and PROJECT_REVAMP_PLAN.md record historical production and DB uncertainties; independently verify latest deployment before launch.

## Pre-implementation decisions
- Exact font identification and legal usage: PENDING.
- Which existing software-tools revenue paths remain, if any: PENDING.
- Verified service catalog and prohibited offerings: PENDING.
- Final domain, address, company facts, case studies, client reviews and consent: PENDING.
- Hosting/WAF/CDN, analytics setup, Search Console access: PENDING.

## Review gates
Design approval -> route/content approval -> implementation per phase -> running automated checks -> browser QA -> live SEO and conversion verification -> release. Every claimed score or phase completion must cite performed checks and remaining unknowns.
