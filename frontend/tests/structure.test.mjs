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

test("frontend contains only narrow public API proxy, never backend implementation", async () => {
  const sourceFiles = await collectSourceFiles(root);
  const contents = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
  const source = contents.join("\n");

  assert.doesNotMatch(source, /@backend|drizzle-orm|from ["']postgres["']|from ["']resend["']/);
  const handler = await readFile(path.join(root, "app", "api", "v1", "contact", "route.ts"), "utf8");
  assert.match(handler, /backendAddress\("api\/v1\/contact"\)/);
  assert.match(handler, /export async function POST/);
  assert.doesNotMatch(handler, /X-Admin-Key|process\.env\.BACKEND_URL/);
});

test("contact form uses the same-origin routed API client", async () => {
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

test("Vercel exposes only frontend, using one private backend binding", async () => {
  const config = JSON.parse(await readFile(path.resolve(root, "..", "vercel.json"), "utf8"));
  assert.deepEqual(Object.keys(config.services).sort(), ["backend", "frontend"]);
  assert.equal(config.services.backend.root, "backend");
  assert.equal(config.services.frontend.root, "frontend");
  assert.deepEqual(config.rewrites, [{ source: "/(.*)", destination: { service: "frontend" } }]);
  assert.deepEqual(config.services.frontend.bindings, [
    { type: "service", service: "backend", format: "url", env: "BACKEND_URL" },
  ]);
  assert.equal(config.services.backend.bindings, undefined);
  const client = await readFile(path.join(root, "src/lib/api/contact.ts"), "utf8");
  assert.match(client, /fetch\("\/api\/v1\/contact"/);
  assert.doesNotMatch(client, /BACKEND_URL|NEXT_PUBLIC_API_URL/);
});

test("one shared agency navbar powers homepage, service, contact, and legal views", async () => {
  const files = await Promise.all([
    "src/features/home/components/HomePage.tsx",
    "src/features/services/components/ServiceHubView.tsx",
    "src/features/services/components/ServiceDetailView.tsx",
    "src/features/contact/components/BookDemoPage.tsx",
    "src/features/legal/components/LegalPage.tsx",
    "app/reviews/page.tsx",
    "src/features/services/components/ServicePageHeader.tsx",
  ].map(file => readFile(path.join(root, file), "utf8")));
  assert.match(files[0], /<ServicePageHeader/);
  for (const page of files.slice(1,6)) assert.match(page, /ServicePageHeader/);
  assert.match(files[6], /hx-mega/);
  assert.match(files[6], /getServiceItemHref/);
  assert.doesNotMatch(files[2], /backHref="\/#services"/);
});
