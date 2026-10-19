import { expect, test } from "@playwright/test";

test("homepage has a usable marketing inquiry path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href="/book-a-demo"]:visible').first()).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /digital marketing|Digital marketing/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://seo-ci.example.test");
});

test("service-detail inquiry preselects the correct existing catalog option", async ({ page }) => {
  await page.goto("/services/marketing-seo/technical-seo");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Technical SEO");
  await expect(page.locator("html.ds-motion-ready")).toHaveCount(1);
  const inquiry = page.locator('a[href*="/book-a-demo?service="]').first();
  await expect(inquiry).toBeVisible();
  await inquiry.click();
  await expect(page).toHaveURL(/\/book-a-demo\?service=marketing-seo/);
  await expect(page.locator('select[name="service"]')).toHaveValue("Marketing & SEO");
  await expect(page.locator('select[name="subService"]')).toHaveValue("Technical SEO");
});

test("service pages link to sibling services and other approved categories", async ({ page }) => {
  await page.goto("/services/marketing-seo/technical-seo");
  await expect(page.locator('a[href="/services/marketing-seo/performance-marketing"]:visible').first()).toBeVisible();
  await expect(page.locator('a[href="/services/design"]:visible').first()).toBeVisible();
});

test("unlisted checkout rejects unsigned price and product changes", async ({ page }) => {
  const response = await page.goto("/checkout?product=chatgpt-plus&price=1");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Checkout link unavailable" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
});

test("visible pages avoid horizontal overflow at supported widths", async ({ page }) => {
  for (const path of ["/", "/services/marketing-seo", "/book-a-demo"]) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect.soft(widths.document, `Horizontal scroll on ${path}`).toBeLessThanOrEqual(widths.viewport + 2);
  }
});

test("contact form displays errors without submitting incomplete data", async ({ page }) => {
  await page.goto("/book-a-demo");
  await page.getByRole("button", { name: /send request/i }).click();
  await expect(page.locator(".ds-booking-form-message--error")).toContainText("name");
});


const serviceRoutes = {
  "marketing-seo": ["technical-seo","ai-content-systems","performance-marketing","crm-lifecycle-automation","analytics-attribution"],
  design: ["product-strategy","ux-ui-design","design-systems","rapid-prototyping","conversion-experience-design"],
  development: ["web-app-engineering","ai-product-development","api-systems-integration","cloud-devops","quality-automation"],
  "ai-automation": ["ai-workflow-automation","ai-agents-copilots","process-intelligence","document-intelligence","governance-observability"],
};
test("all public marketing routes render with the shared navbar, footer and no page exceptions", async ({ page }) => {
  test.setTimeout(180000);
  const paths = ["/","/book-a-demo","/privacy-policy","/terms-of-service","/reviews",
    ...Object.keys(serviceRoutes).map(group => `/services/${group}`),
    ...Object.entries(serviceRoutes).flatMap(([group, slugs]) => slugs.map(slug => `/services/${group}/${slug}`))];
  const exceptions: string[] = [];
  page.on("pageerror", error => exceptions.push(error.message));
  for (const path of paths) {
    exceptions.length = 0;
    const response = await page.goto(path, {waitUntil:"domcontentloaded"});
    expect.soft(response?.status(), path).toBe(200);
    await expect.soft(page.locator("h1").first(), path).toBeVisible();
    await expect.soft(page.locator("header.hx-nav"), path).toHaveCount(1);
    await expect.soft(page.locator("footer.hx-footer"), path).toHaveCount(1);
    expect.soft(exceptions, `JS errors at ${path}`).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect.soft(overflow, `Horizontal overflow at ${path}`).toBe(false);
  }
});


test("shared navigation exposes all service categories and closes with Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /services/i });
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded","true");
  const mega = page.locator("#hx-service-menu");
  await expect(mega.getByRole("link", {name:/Marketing & SEO/i})).toBeVisible();
  await expect(mega.getByRole("link", {name:/Design & Experience/i})).toBeVisible();
  await expect(mega.getByRole("link", {name:/Web & Development/i})).toBeVisible();
  await expect(mega.getByRole("link", {name:/Automation & AI/i})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded","false");
});
