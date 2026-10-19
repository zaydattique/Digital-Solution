import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const origin = "http://127.0.0.1:39477";
const configured = "https://seo-ci.example.test";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "39477"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: "39477" },
});
let logs = "";
for (const stream of [server.stdout, server.stderr]) stream.on("data", (chunk) => { logs += String(chunk); });
async function get(path) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(12000) });
  return { response, body: await response.text() };
}
async function waitForServer() {
  for (let i = 0; i < 35; i++) {
    try {
      const result = await get("/");
      if (result.response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("Next.js preview did not start:\n" + logs.slice(-4000));
}
try {
  await waitForServer();
  const [home, detail, sitemap, robots, llms, checkout] = await Promise.all([
    get("/"),
    get("/services/marketing-seo/technical-seo"),
    get("/sitemap.xml"),
    get("/robots.txt"),
    get("/llms.txt"),
    get("/checkout"),
  ]);
  for (const [label, result] of Object.entries({ home, detail, sitemap, robots, llms })) {
    assert.equal(result.response.status, 200, label);
  }
  assert.ok(home.body.includes('rel="canonical" href="https://seo-ci.example.test"') || home.body.includes('rel="canonical" href="https://seo-ci.example.test/"'), "home canonical should use configured origin");
  assert.match(home.body, /schema\.org/);
  assert.match(detail.body, /BreadcrumbList/);
  assert.match(detail.body, /Service/);
  assert.match(sitemap.body, /https:\/\/seo-ci\.example\.test\/services\/marketing-seo\/technical-seo/);
  assert.doesNotMatch(sitemap.body, /software-tools|checkout/);
  // Discover canonical URLs from the actual rendered XML, never from a duplicate route list.
  const publicUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.equal(publicUrls.length, 29, "Five core pages, four hubs and twenty detail routes");
  for (const url of publicUrls) {
    assert.equal(url.origin, configured, "Sitemap origin must match the canonical site");
    const page = await get(url.pathname);
    assert.equal(page.response.status, 200, `Sitemap route ${url.pathname}`);
    assert.match(page.body, /<h1[\s>]/i, `Missing h1: ${url.pathname}`);
    assert.match(page.body, /<meta name="description"/, `Missing description: ${url.pathname}`);
    const expectedCanonical = `href="${url.origin}${url.pathname === "/" ? "" : url.pathname}"`;
    assert.ok(page.body.includes(expectedCanonical), `Canonical mismatch at ${url.pathname}`);
  }
  assert.match(robots.body, /Disallow: \/checkout/);
  assert.match(robots.body, /Sitemap: https:\/\/seo-ci\.example\.test\/sitemap\.xml/);
  assert.match(llms.body, /Marketing & SEO/);
  assert.match(checkout.body, /Checkout link unavailable/);
  assert.match(checkout.response.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.match(checkout.response.headers.get("cache-control") ?? "", /no-store/);
  const forbidden = await fetch(origin + "/api/v1/site", { signal: AbortSignal.timeout(12000) });
  assert.equal(forbidden.status, 404, "Internal site content API must not be public");
  const missing = await fetch(origin + "/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Only name" }),
  });
  assert.equal(missing.status, 400, "Proxy must validate fields before invoking a private backend");
  const crossorigin = await fetch(origin + "/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://untrusted.example" },
    body: JSON.stringify({
      name: "Test Person", email: "test@example.com", phone: "+1 5555555555",
      company: "Test", service: "Design", subService: "UX", message: "Test inquiry",
    }),
  });
  assert.equal(crossorigin.status, 403, "Cross-origin browser contact requests must be denied");
  const valid = await fetch(origin + "/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Person", email: "test@example.com", phone: "+1 5555555555",
      company: "Test", service: "Design", subService: "UX", message: "Test inquiry",
    }),
  });
  assert.equal(valid.status, 503, "Local production server without a binding must fail closed");
  console.info("SEO and private-service HTTP smoke: canonicals, 29 pages, no public CMS, restricted contact proxy OK");
} finally {
  server.kill("SIGTERM");
}
