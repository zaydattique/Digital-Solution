import { createHash, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { getDatabase } from "../db/client.js";
import { siteSettings } from "../db/schema.js";

export const SITE_KEYS = [
  "brand.name", "brand.tagline", "brand.logoUrl", "brand.faviconUrl", "brand.ogImageUrl",
  "brand.description", "home.heroTitle", "home.heroDescription", "home.heroImageUrl",
  "contact.email", "contact.phone", "contact.phoneSecondary",
  "legal.lastUpdated", "social.linkedin", "social.instagram", "social.facebook", "social.website",
] as const;

export function verifyAdminKey(value: string | undefined): boolean {
  const expected = process.env.INTERNAL_CMS_TOKEN;
  if (!expected || expected.length < 32 || !value) return false;
  return timingSafeEqual(createHash("sha256").update(value).digest(), createHash("sha256").update(expected).digest());
}

export function createSiteRouter() {
  const router = Router();
  router.get("/", async (_req, res, next) => {
    try {
      const rows = await getDatabase().select().from(siteSettings);
      const values = Object.fromEntries(rows.map(({ key, value }) => [key, value]));
      res.set("Cache-Control", "no-store");
      res.status(200).json({ success: true, data: values });
    } catch (error) { next(error); }
  });
  router.put("/:key", async (req, res, next) => {
    try {
      if (!verifyAdminKey(req.get("X-Admin-Key"))) {
        res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authorized" } }); return;
      }
      const key = req.params.key;
      const payload: unknown = req.body;
      const value: unknown = typeof payload === "object" && payload !== null && "value" in payload ? payload.value : undefined;
      if (!SITE_KEYS.includes(key as typeof SITE_KEYS[number]) || typeof value !== "string" || value.length > 3000) {
        res.status(400).json({ success: false, error: { code: "INVALID_SETTING", message: "Invalid site setting" } }); return;
      }
      if (key.endsWith("Url") || key.startsWith("social.")) {
        if (value && (!/^https:\/\//.test(value) || (() => { try { return new URL(value).username !== "" || new URL(value).password !== ""; } catch { return true; } })())) {
          res.status(400).json({ success: false, error: { code: "INVALID_URL", message: "Please use an absolute HTTPS URL" } }); return;
        }
      }
      if (key === "contact.email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        res.status(400).json({ success: false, error: { code: "INVALID_EMAIL", message: "Please enter a valid email" } }); return;
      }
      await getDatabase().insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
      res.set("Cache-Control", "no-store");
      res.status(200).json({ success: true, data: { key, value } });
    } catch (error) { next(error); }
  });
  return router;
}
