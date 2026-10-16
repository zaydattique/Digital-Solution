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
  const inquiry = page.locator('a[href*="/book-a-demo?service="]').first();
  await expect(inquiry).toBeVisible();
  await inquiry.click();
  await expect(page).toHaveURL(/\/book-a-demo\?service=marketing-seo/);
  await expect(page.locator('select[name="service"]')).toHaveValue("Marketing & SEO");
  await expect(page.locator('select[name="subService"]')).toHaveValue("Technical SEO");
});

test("service pages link to sibling services and other approved categories", async ({ page }) => {
  await page.goto("/services/marketing-seo/technical-seo");
  await expect(page.locator('a[href="/services/marketing-seo/performance-marketing"]').first()).toBeVisible();
  await expect(page.locator('a[href="/services/design"]').first()).toBeVisible();
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
