import { createHash, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "../db/client.js";
import { siteContent } from "../db/schema.js";
import type { AppEnv } from "../config/env.js";

// A constrained set of public site documents avoids using the admin API as an arbitrary JSON store.
const allowedKeys = new Set(["identity", "home", "services", "projects", "footer", "contact", "seo", "media"]);
const contentSchema = z.object({ value: z.record(z.string(), z.unknown()) }).strict();

function tokenMatches(actual: string | undefined, expected: string | undefined): boolean {
  if (!actual || !expected) return false;
  const a = createHash("sha256").update(actual).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function createContentRouter(env: AppEnv): Router {
  const router = Router();
  router.get("/content/:key", async (request, response, next) => {
    try {
      const key = String(request.params.key);
      if (!allowedKeys.has(key)) { response.status(404).json({ success: false }); return; }
      const record = await getDatabase().select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
      response.setHeader("Cache-Control", "no-store");
      response.json({ success: true, data: record[0]?.value ?? null });
    } catch (error) { next(error); }
  });

  // Only server-side CMS actions may write. This bearer token is NEVER sent to browsers.
  router.put("/admin/content/:key", async (request, response, next) => {
    try {
      if (!env.CMS_INTERNAL_TOKEN) {
        response.status(503).json({ success: false, error: { code: "CMS_NOT_CONFIGURED" } });
        return;
      }
      if (!tokenMatches(request.get("x-cms-internal-token"), env.CMS_INTERNAL_TOKEN)) {
        response.status(401).json({ success: false, error: { code: "UNAUTHORIZED" } });
        return;
      }
      const key = String(request.params.key);
      if (!allowedKeys.has(key)) { response.status(404).json({ success: false }); return; }
      const parsed = contentSchema.safeParse(request.body);
      if (!parsed.success || JSON.stringify(parsed.data.value).length > 100_000) {
        response.status(400).json({ success: false, error: { code: "INVALID_CONTENT" } });
        return;
      }
      const [record] = await getDatabase().insert(siteContent)
        .values({ key, value: parsed.data.value })
        .onConflictDoUpdate({ target: siteContent.key, set: { value: parsed.data.value, updatedAt: new Date() } })
        .returning();
      response.setHeader("Cache-Control", "no-store");
      response.json({ success: true, data: record.value });
    } catch (error) { next(error); }
  });
  return router;
}
