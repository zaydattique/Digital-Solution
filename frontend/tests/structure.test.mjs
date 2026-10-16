import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== ".next" && entry.name !== "node_modules") {
      return collectSourceFiles(target);
    }
    return entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name) ? [target] : [];
  }));
  return files.flat();
}

test("frontend owns no backend implementation or server route", async () => {
  const sourceFiles = await collectSourceFiles(root);
  const contents = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
  const source = contents.join("\n");

  assert.doesNotMatch(source, /@backend|drizzle-orm|from ["']postgres["']|from ["']resend["']/);
  await assert.rejects(readFile(path.join(root, "app", "api", "contact", "route.ts"), "utf8"));
});

test("contact form uses the centralized same-origin API client", async () => {
  const [component, client] = await Promise.all([
    readFile(path.join(root, "src", "features", "contact", "components", "BookDemoPage.tsx"), "utf8"),
    readFile(path.join(root, "src", "lib", "api", "contact.ts"), "utf8"),
  ]);

  assert.match(component, /submitContactRequest/);
  assert.doesNotMatch(component, /fetch\(/);
  assert.match(client, /fetch\("\/api\/v1\/contact"/);
  assert.match(client, /\/api\/v1\/contact/);
  assert.doesNotMatch(client, /https?:\/\/[^"'`]+\.vercel\.app/);
});

test("all public page entry points remain present", async () => {
  const pages = [
    "app/page.tsx",
    "app/book-a-demo/page.tsx",
    "app/reviews/page.tsx",
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/services/development/page.tsx",
    "app/services/ai-automation/page.tsx",
    "app/services/design/page.tsx",
    "app/services/marketing-seo/page.tsx",
    "app/services/software-tools/page.tsx",
    "app/checkout/page.tsx"
  ];

  await Promise.all(pages.map((page) => readFile(path.join(root, page), "utf8")));
});

test("service pages reuse the catalog and carry inquiry context", async () => {
  const [catalog, detail, hub, contact, footer] = await Promise.all([
    readFile(path.join(root, "src/features/services/data/services.ts"), "utf8"),
    readFile(path.join(root, "src/features/services/components/ServiceDetailView.tsx"), "utf8"),
    readFile(path.join(root, "src/features/services/components/ServiceHubView.tsx"), "utf8"),
    readFile(path.join(root, "app/book-a-demo/page.tsx"), "utf8"),
    readFile(path.join(root, "src/components/layout/AgencyFooter.tsx"), "utf8"),
  ]);

  assert.match(catalog, /export const serviceMenuGroups/);
  assert.match(detail, /const contactHref = currentGroup/);
  assert.match(detail, /relatedServices\.map/);
  assert.match(hub, /book-a-demo\?service=/);
  assert.match(contact, /serviceMenuGroups\.find/);
  assert.match(contact, /initialSubService/);
  assert.match(footer, /serviceMenuGroups\.map/);
});

test("service outcomes and testimonials require real evidence", async () => {
  const paths = [
    "src/features/services/data/aiAutomationData.ts",
    "src/features/services/data/designData.ts",
    "src/features/services/data/webDevelopmentData.ts",
    "src/features/services/data/marketingSeoData.ts",
  ];
  const data = await Promise.all(paths.map((p) => readFile(path.join(root, p), "utf8")));
  for (const content of data) assert.doesNotMatch(content, /metrics:\s*\[/);
  const [detail, reviews, home] = await Promise.all([
    readFile(path.join(root, "src/features/services/components/ServiceDetailView.tsx"), "utf8"),
    readFile(path.join(root, "app/reviews/page.tsx"), "utf8"),
    readFile(path.join(root, "src/features/home/components/HomePage.tsx"), "utf8"),
  ]);
  assert.doesNotMatch(detail, /AnimatedMetric|ds-service-hero-stats/);
  assert.match(detail, /<details key=\{item\.question\}/);
  assert.doesNotMatch(reviews, /allClientReviews|4\.9 \/ 5\.0/);
  assert.doesNotMatch(home, /clientReviews|CLIENT TESTIMONIALS/);
});

test("direct-link checkout is separate from the public service directory", async () => {
  const [checkout, legacy, catalog] = await Promise.all([
    readFile(path.join(root, "app/checkout/page.tsx"), "utf8"),
    readFile(path.join(root, "app/services/software-tools/checkout/page.tsx"), "utf8"),
    readFile(path.join(root, "src/features/services/data/services.ts"), "utf8"),
  ]);
  assert.match(checkout, /robots: \{ index: false, follow: false/);
  assert.match(legacy, /redirect\("\/checkout"\)/);
  assert.doesNotMatch(catalog, /id: "software-tools"/);
});

test("SEO route sources use the existing service catalog and exclude checkout", async () => {
  const [sitemap, robots, llms, seo, detail] = await Promise.all([
    readFile(path.join(root, "app/sitemap.ts"), "utf8"),
    readFile(path.join(root, "app/robots.ts"), "utf8"),
    readFile(path.join(root, "app/llms.txt/route.ts"), "utf8"),
    readFile(path.join(root, "src/lib/seo.ts"), "utf8"),
    readFile(path.join(root, "app/services/design/[slug]/page.tsx"), "utf8"),
  ]);
  assert.match(sitemap, /serviceMenuGroups/);
  assert.match(sitemap, /getServiceItemHref/);
  assert.doesNotMatch(sitemap, /\/checkout|\/services\/software-tools/);
  assert.match(robots, /publishedOrigin/);
  assert.match(robots, /"\/checkout"/);
  assert.match(llms, /serviceMenuGroups/);
  assert.match(seo, /alternates: \{ canonical: path \}/);
  assert.match(seo, /BreadcrumbList/);
  assert.match(detail, /serviceStructuredData/);
});

test("all indexable route entry points use centrally managed canonical metadata", async () => {
  const routes = [
    "app/page.tsx",
    "app/book-a-demo/page.tsx",
    "app/reviews/page.tsx",
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/services/development/page.tsx",
    "app/services/ai-automation/page.tsx",
    "app/services/design/page.tsx",
    "app/services/marketing-seo/page.tsx",
    "app/services/development/[slug]/page.tsx",
    "app/services/ai-automation/[slug]/page.tsx",
    "app/services/design/[slug]/page.tsx",
    "app/services/marketing-seo/[slug]/page.tsx",
  ];
  await Promise.all(routes.map(async (route) => {
    const source = await readFile(path.join(root, route), "utf8");
    assert.match(source, /pageMetadata\(/, route);
  }));
});

test("public application uses exactly one authored stylesheet", async () => {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(file);
      return entry.isFile() && entry.name.endsWith(".css") ? [file] : [];
    }));
    return nested.flat();
  }
  const styles = (await walk(path.join(root, "src")))
    .map((file) => path.relative(root, file).replaceAll(path.sep, "/"))
    .sort();
  assert.deepEqual(styles, ["src/features/home/styles/home.css"]);
  const layout = await readFile(path.join(root, "app/layout.tsx"), "utf8");
  assert.match(layout, /home\/styles\/home\.css/);
});

test("root Vercel services route API and frontend through one public domain", async () => {
  const config = JSON.parse(await readFile(path.resolve(root, "../vercel.json"), "utf8"));
  assert.equal(config.services.frontend.root, "frontend");
  assert.equal(config.services.frontend.framework, "nextjs");
  assert.equal(config.services.backend.root, "backend");
  assert.equal(config.services.backend.framework, "express");
  assert.deepEqual(config.services.frontend.bindings, [
    { type: "service", service: "backend", format: "url", env: "BACKEND_URL" },
  ]);
  assert.deepEqual(config.rewrites, [
    { source: "/api/(.*)", destination: { service: "backend" } },
    { source: "/(.*)", destination: { service: "frontend" } },
  ]);
});

test("CMS content is fetched from the runtime-only backend binding", async () => {
  const [content, editor, logo] = await Promise.all([
    readFile(path.join(root, "src/lib/site-content.ts"), "utf8"),
    readFile(path.join(root, "app/admin/page.tsx"), "utf8"),
    readFile(path.join(root, "src/components/brand/Brand.tsx"), "utf8"),
  ]);
  assert.match(content, /process\.env\.BACKEND_URL/);
  assert.match(content, /await connection\(\)/);
  assert.match(editor, /saveSiteDocument/);
  assert.match(logo, /useSiteIdentity/);
});
