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
  assert.match(home.body, /rel="canonical" href="https:\/\/seo-ci\.example\.test\/"/);
  assert.match(home.body, /schema\.org/);
  assert.match(detail.body, /BreadcrumbList/);
  assert.match(detail.body, /Service/);
  assert.match(sitemap.body, /https:\/\/seo-ci\.example\.test\/services\/marketing-seo\/technical-seo/);
  assert.doesNotMatch(sitemap.body, /software-tools|checkout/);
  assert.match(robots.body, /Disallow: \/checkout/);
  assert.match(robots.body, /Sitemap: https:\/\/seo-ci\.example\.test\/sitemap\.xml/);
  assert.match(llms.body, /Marketing & SEO/);
  assert.match(checkout.body, /Checkout link unavailable/);
  assert.match(checkout.response.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.match(checkout.response.headers.get("cache-control") ?? "", /no-store/);
  console.info("SEO HTTP smoke: canonical, schema, sitemap, robots, llms, checkout OK");
} finally {
  server.kill("SIGTERM");
}
