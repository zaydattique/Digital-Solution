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


---

# Phase 1 and Phase 2 execution record, 15 October 2026

Status: Research, repository-based architecture and design specifications completed on the shared Phase 1/2 branch. Final visual sign-off, genuine portfolio evidence, the exact font identity, and the decision on software-tool commerce remain blocked; these are not represented as approved.

## Source inspection and reference evidence

- Full repository tree on main reviewed, including 20 service detail slugs, four service hubs, booking, reviews, legal, software tools and manual checkout. The existing public routes remain untouched on this branch.
- Current Xeven Solutions homepage consulted on October 15, 2026: its useful *service-first* sections are offer, service capabilities, process, client delivery, proof, company and contact. Its separately owned AI products, investment offer and proprietary ecosystem are not part of Digital Solutions.
- Uploaded ESE Agency reference recording duration 351.17 seconds; frames sampled at 4, 20, 40, 70, 100, 140, 185, 230, 275 and 320 seconds. The frames show a minimal top navigation, high contrast oversize typography, featured projects in rich media panels, dark card grid, review cards, compact footer, service detail hero, company metrics grid and contact composition. All future assets and arrangements must be original, not transcriptions of the reference.
- Current typography in frontend/app/layout.tsx uses Geist Mono, Nunito Sans and Roboto; frontend/src/components/brand/Brand.tsx hardcodes Nunito Sans and Inter fallbacks in SVG text. The single-family requirement spans logo SVG text and all components, not merely body text.
- Web research identifies a commercially licensed typeface named **Transgender Grotesk**, with its designer specimen at https://tomorrow.type.today/en/trnsgndr/regular . This does NOT verify a family called **Transgender Sans**, and the Grotesk specimen describes a single-weight half-display face oriented to medium/large typography. Do not use a downloaded trial or third-party mirror font to circumvent the license. The identity, normal text readability, weights and web embedding rights must be decided before build.

## Phase 1: Service inventory, real content and URL decisions

### Existing service records, not evidence that offerings are confirmed

The repository currently defines 20 detail routes via frontend/src/features/services/data/services.ts, with four groups of five items. Data modules include claims of guaranteed speed, accuracy, ROI, uptime and savings. Preserve old URLs initially; independently confirm capabilities and remove unsupported numerical promises from copy in Phase 4.

| Existing canonical intent group | Existing slug | Service focus | Phase 1 disposition |
| --- | --- | --- | --- |
| AI automation | ai-workflow-automation | Workflow mapping and automation | Retain route; verify real delivery ability |
| AI automation | ai-agents-copilots | Assistants and action-taking agents | Retain route; verify real delivery ability |
| AI automation | process-intelligence | Process audits and optimization | Retain route; subject to service sign-off |
| AI automation | document-intelligence | Document extraction and workflows | Retain route; subject to service sign-off |
| AI automation | governance-observability | Control and monitoring | Retain route; subject to service sign-off |
| Development | web-app-engineering | Custom websites, apps and platforms | Retain route; primary engineering landing target |
| Development | ai-product-development | Client-commissioned AI features/products | Retain only when phrased as client development, not company-owned products |
| Development | api-systems-integration | APIs and integrations | Retain route |
| Development | cloud-devops | Delivery infrastructure | Retain route pending scope validation |
| Development | quality-automation | QA and test automation | Retain route pending scope validation |
| Design | product-strategy | Discovery and product definition | Retain route pending scope validation |
| Design | ux-ui-design | Product interface design | Retain route |
| Design | design-systems | UI systems and reusable components | Retain route |
| Design | rapid-prototyping | Prototyping | Retain route |
| Design | conversion-experience-design | Conversion-focused UX | Retain route |
| Marketing & SEO | technical-seo | Crawling, indexation and performance | Retain route |
| Marketing & SEO | ai-content-systems | AI-assisted editorial workflows | Retain only if service is verified and human oversight is explicit |
| Marketing & SEO | performance-marketing | Paid media | Retain route pending client evidence |
| Marketing & SEO | crm-lifecycle-automation | CRM and lifecycle orchestration | Retain route pending service scope |
| Marketing & SEO | analytics-attribution | Tracking and analysis | Retain route pending service scope |

The existing slug lists must be derived directly from the current data arrays/objects in implementation, not recopied into another competing registry. The table is a design audit, not a new source of runtime truth.

### URL inventory and migration map

| Current URL pattern | Target treatment | Indexing stance | Constraint |
| --- | --- | --- | --- |
| / | Rebuild in place as editorial services homepage | index | Existing conversion and navigation continue |
| /services/ai-automation | Restyle/rewrite existing hub | index | Must have unique distinct landing intent |
| /services/ai-automation/[slug] | Reuse existing detail template/slug | index when evidence-based | Five entries mapped above |
| /services/development | Restyle existing hub | index | No misleading proprietary products |
| /services/development/[slug] | Reuse existing detail template/slug | index when evidence-based | Five entries mapped above |
| /services/design | Restyle existing hub | index | Distinct from product engineering |
| /services/design/[slug] | Reuse existing detail template/slug | index when evidence-based | Five entries mapped above |
| /services/marketing-seo | Restyle existing hub | index | Distinct from AEO promise pages |
| /services/marketing-seo/[slug] | Reuse existing detail template/slug | index when evidence-based | Five entries mapped above |
| /book-a-demo | Keep exact URL; change visible label to Discuss a Project | index | Reuse existing form and endpoint |
| /privacy-policy | Retain | index unless legal advice says otherwise | Review real data-processing clauses |
| /terms-of-service | Retain | index unless legal advice says otherwise | Review actual commerce/engagement terms |
| /reviews | Temporarily retain and quarantine unsupported credibility claims | Decision pending | No fabricated verification flags or claims |
| /services/software-tools | Retain functionality during business decision | No premature deindex | Not company-owned AI products, but an existing separate resale catalog |
| /services/software-tools/checkout | Retain functionality during business decision | Recommend noindex once decision approved | Existing commerce and external links require continuity |
| /services | Candidate new indexable hub only with substantive distinct content | Conditional | Do not add if it duplicates category pages |
| /about | Candidate page based on verifiable company identity and team | Conditional | Do not fabricate history or staff |
| /work and /work/[slug] | Candidate pages based on consented real projects | Conditional | No placeholders |
| /insights | Optional later editorial hub | Deferred | No speculative content farm |

**Redirect ledger:** no 301/308 redirects are approved yet because no existing URL is being removed. Any future route retirement requires a recorded old URL -> destination, permanent status, canonical, sitemap removal, internal-link update, 404/non-200 QA and preservation of external order/history links.

**Navigation proposal:** Brand | Services (4 real categories) | Our Approach (homepage anchor unless content warrants dedicated page) | Work (only when evidence approved) | About (only when real material approved) | Discuss a Project. Desktop navigation must degrade to a keyboard-operable mobile menu; no empty top-level items.

**Footer proposal:** concise brand description; exact 4 category hub links; selected distinct service links; contact address/phone/email from one approved source; legal links; verified external social links. No conflicting addresses or unverifiable location schema.

**Homepage sections and proposed original editorial copy, pending approval:**

1. Hero: Heading **"Software and systems built around your business."** Intro **"We design and build web applications, workflow automations, integrations and digital experiences that solve operational problems."** CTA **"Discuss a project"**. Only list services genuinely offered. Avoid pretending all sections are AI products.
2. Who we help: succinct problems (fragmented tools, slow manual handoffs, complicated digital products), not fictional client sectors.
3. What we do: four existing service categories in a 2x2 service grid, each linked to a distinct hub. Actual service label and image must originate from existing catalog.
4. How we work: **Discover, Design, Build, Launch, Support**, only if these stages reflect actual delivery operations.
5. Selected work: conditional on real consented evidence. Without real projects, use **"What an engagement includes"** with concrete outputs, not fabricated portfolios.
6. Why Digital Solutions: explicit delivery practices and engineering standards that can be demonstrated, without made-up "100% delivery" statistics.
7. FAQs: What projects do you take on? How do you scope work? Can you work with an existing system? How are changes tested? What happens after launch? Answers must be factual and succinct.
8. Closing CTA: **"Tell us what you need to build."** with expectations about response time only after evidence.
9. Footer: real name, real contact details and accessible legal links.

**Content truth audit:**
- frontend/src/features/home/data/content.ts presents 100% production delivery, zero incidents, 50+ integrations and 4.2x ROAS without evidence in the repository.
- frontend/src/features/reviews/data/reviewsData.ts marks testimonials verified and lists impressive outcomes without independent proof.
- frontend/app/reviews/page.tsx shows 4.9/5 and 100% delivery-rate figures without source evidence.
- All 20 detail entries contain numeric service outcome claims such as 99.9% error elimination, 99.99% uptime and 100% data sync. These must be validated or removed at Phase 4 publication, never silently migrated as verified data.
- Existing company contact channels are hardcoded in frontend/src/components/layout/AgencyFooter.tsx, frontend/src/features/contact/components/BookDemoPage.tsx and frontend/src/features/services/components/SoftwareCheckoutPage.tsx. A shared single content owner is needed when implementation is authorized.

**AEO/GEO page content blueprint**: unique first paragraph defining real offer and audience; clear deliverables; actual processes; constraints and when not suitable; genuine scenario/case study where allowed; conversational FAQ answering relevant questions; consistent organization name/NAP; linked related services and primary conversion; schema reflecting only visible verified content. Do not generate separate keyword doorway routes for AI SEO or "GEO agency".

**Required editorial evidence form (record privately, not invented in public copy):** claim; source URL/contract/case-study document; owner; permission; dates; exactly what metric means; verification state; permitted wording; next review date.

### Phase 1 acceptance evidence
- [x] Current source route inventory and 20 service slug mapping recorded.
- [x] Xeven service-led inspiration translated to independent Digital Solutions architecture.
- [x] Existing URL preservation and conditional route decisions recorded.
- [x] Default homepage information sequence, navigation and editorial standards specified.
- [x] Unsupported claims and conflicting commerce intent inventoried.
- [ ] Operator confirms actually sold services and exclusions.
- [ ] Operator approves future software-tools catalog/checkout policy.
- [ ] Actual company NAP and consented work/reviews verified.
- [ ] Final route/redirect list signed off.
**Phase 1 status: Research + implementation-ready proposal completed, sign-off gates OPEN.**

## Phase 2: Design language, layout, assets and implementation contract

### Reference-to-original visual translation
| Video reference motif | Original Digital Solutions direction | Avoid |
| --- | --- | --- |
| Oversized white editorial headline on black | White strong headline on navy-950, restrained width, balanced multi-line layout | Copying reference slogan and exact title composition |
| Sparse horizontal masthead | Compact enterprise nav with business CTA and mobile disclosure | Unreadable micro-links or unclickable hover-only menus |
| High-energy red/yellow portfolio images | Licensed architectural, workshop or business-system imagery graded to dark/cobalt blues | Copying source photographs or selling nonexistent own products |
| Tall dark cards and review strip | Responsive 2-column service cards and one genuine proof section | Fake ratings or carousel autoplay |
| Statistics-heavy company grid | Process/security/delivery methodology tiles, with no unverified numbers | Invented years served, countries, clients |
| Color-blocked contact panel | Deep navy-to-blue gradient CTA plus compact contact form and helpful contact alternatives | Reproducing original composition pixel-for-pixel |

### Approved-for-implementation preliminary tokens (colors subject to visual accessibility tests)
- --ds-navy-950: #050D20
- --ds-navy-900: #09162B
- --ds-navy-800: #102B55
- --ds-blue-500: #2779F5
- --ds-blue-300: #81B8FF
- --ds-text: #F6F9FF
- --ds-muted: #BACBE6
- --ds-line: #315177
- --ds-success: #42C5A5; --ds-error: #FF8B90
- Avoid pure black oversized areas without visual relief. Use light or neutral section cards only if contrast and enterprise coherence warrant them.
- Buttons: primary blue filled; secondary outlined; tertiary underlined text link. No inconsistent pill/corner radius per page.
- Corner radius: 8px controls, 16px cards, 24px large media. Hero editorial imagery can use straight edges.
- Max text width: 68ch paragraph; max layout width: 1440px, responsive page gutter clamp(16px, 4vw, 64px).
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px tokens; section spacing clamp(64px, 9vw, 144px).
- Type scale for one eventual approved family: body clamp(16px, 1.05vw, 18px), H3 clamp(22px, 2.2vw, 32px), H2 clamp(36px, 5vw, 76px), H1 clamp(48px, 8vw, 128px), tracking adjusted by actual font metrics. Headline never clipped at 320px.
- Use one family for hero, navigation, cards, legal, form, footer AND SVG brand text. Browser fallback system-ui only for load failures, not a competing design font.

### Font implementation gate
**BLOCKED**. The requested literal name "Transgender Sans" has not been validated as a font family. The verified "Transgender Grotesk" has only one weight and is designed mainly for display/short passages. If that is the intended font, a single-font requirement creates a body readability/accessibility tradeoff and must be explicitly assessed. No font binary is bundled, fetched or redistributed. Do not rewrite existing font imports yet. Once identity/license approved, update existing frontend/app/layout.tsx and brand SVG to one family, use next/font/local when licensed, then test text wrap and CWV.

### Component and layout contract

| Component | Structure and behavior | Existing owner to change |
| --- | --- | --- |
| Site header | Semantically labeled nav, 4 service groups, focus/escape mobile menu, sticky only if unobtrusive | HomePage.tsx and ServicePageHeader.tsx; eliminate duplicated nav ownership after mapping |
| Hero | Short headline, 1 supporting paragraph, 1 primary CTA, original responsive media, no CLS | HomePage.tsx and home data module |
| Service overview | 4 large actionable category cards, each service hub accessible via click and keyboard | HomePage.tsx, services.ts, ServiceHubView.tsx |
| Service detail | Context header, outcomes without unproven numbers, deliverables, approach, FAQ, related pages, CTA | ServiceDetailView.tsx and related existing detail data |
| Delivery process | 5 steps, static readable layout without JS-required reading | HomePage.tsx |
| Proof | Real permitted projects or demonstration of delivery methods, never fictional results | HomePage.tsx and reviews modules |
| FAQ | Native disclosure or accessible controlled accordion; all answers SSR/crawlable | Existing service and home components |
| Contact | Clear stateful form, server-confirmed results, mobile layouts | BookDemoPage.tsx |
| Footer | Clear categories, company identity, contact and legal, works on all pages | AgencyFooter.tsx |
| 404 | Helpful route recovery, actual 404 status and correct navigation | app/not-found.tsx |

### Media ownership and sourcing register
- Existing home assets in frontend/public/assets/images/home: hero-integrations, hero-workflow, hero-process, hero-customer, hero-agents and workflow-team, with existing JPG and AVIF/WebP variants. Reuse only with rights and visual appropriateness verified.
- Existing services menu assets in frontend/public/assets/images/services: menu-ai-automation, menu-development, menu-design, menu-marketing-seo with 480/768/1280 AVIF/WebP alternatives. Their paths and dimensions must remain stable until new references are tested.
- Existing projects imagery in frontend/public/assets/images/projects: dsquare landing and logo, which cannot be represented as customer delivery proof without actual permission and provenance.
- Required final asset slots, NOT new files until approved: 1 primary home hero photograph/illustration, 4 category cards, 1 process/method editorial panel, 0 to 3 consented project visuals if real work exists, 1 closing contact visual (reuse hero crop if appropriate), 1 Open Graph image, 1 favicon/icon set. Each needs source rights, 480/768/1280/1920 variants where applicable, alt vs decorative designation, dimensions and compression tests.
- CSS background-only critical imagery must have meaningful accessible adjacent text. Mark decorative images alt="" and avoid text over busy areas at poor contrast.
- Image strategy: AVIF then WebP then retained fallback, lazy-load below-fold, reserve aspect ratio, preload only actual above-fold LCP image. Avoid unneeded duplicate image sets.

### Single stylesheet migration plan for Phase 3
Current files include frontend/src/features/home/styles/home.css, footer.css, not-found.css; services/styles/services.css, software-checkout.css, software-tools.css; contact/styles/contact.css; legal/styles/legal.css; reviews/styles/reviews.css. They have multiple imports from page files and root layout. The target single stylesheet is the existing home.css (unless a Phase 0 execution proves impossible), not a new override file.
1. Build import/class ownership inventory across all routes and record baseline screenshots.
2. Consolidate base tokens, resets and shared control styles into existing home.css; remove previous duplicates by replacing original declarations.
3. Move each page's necessary unique rules from existing CSS files into labeled functional sections in home.css; for each move, remove source import, run page checks, verify cascade and responsiveness.
4. Remove empty obsolete CSS files only when no imports remain and all routes pass visual regression.
5. The final build must show exactly one authored application stylesheet import for the public site (Next bundler can output optimized chunks). Do not confuse compiled CSS chunks with source stylesheet duplication.
6. If files are still required by a deployed feature, keep work incomplete, report truthfully, and do not force a broken "single file" checkbox.

### Phase 2 visual QA gate
- [x] 10 video frames sampled and visual patterns inventoried; references and limitations written.
- [x] Dark navy palette, spacing, type scales, components and responsive behavior specified.
- [x] Existing image ownership and target media slot requirements defined.
- [x] Typography licensing and applicability blocker documented.
- [x] One-stylesheet in-place migration recipe defined.
- [ ] Exact final font and licensed asset provided or agreed.
- [ ] Hero/layout wireframes reviewed visually and approved.
- [ ] Authentic image rights and client proof permissions obtained.
- [ ] Palette contrast and mobile interactive behavior measured in actual build.
**Phase 2 status: Design specification completed, final design sign-off and visual/runtime verification OPEN.**

## Next implementation handoff
Once service/font/commerce decisions are made, Phase 3 may start with baseline tests, in-place homepage component decomposition, approved font configuration and CSS consolidation. Do not claim Phase 1/2 formally closed while sign-off boxes remain open.
