import request from "supertest";
import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { closeDatabase, getDatabase } from "../src/db/client.js";
import { demoRequests, siteSettings } from "../src/db/schema.js";
import { contactRepository } from "../src/repositories/contact.repository.js";
import { DefaultContactService } from "../src/services/contact.service.js";
import { validContactRequest } from "./fixtures.js";

afterAll(async () => {
  if (process.env.RUN_DB_INTEGRATION === "1") await closeDatabase();
});

describe.skipIf(process.env.RUN_DB_INTEGRATION !== "1")("real PostgreSQL contact integration", () => {
  it("inserts a real row, returns a successful response, and tolerates notification failure", async () => {
    const notifications = {
      sendContactNotification: vi.fn(async () => {
        throw new Error("Simulated email provider outage");
      }),
    };
    const contactService = new DefaultContactService(contactRepository, notifications);
    const env = loadEnv();
    const email = `integration-${Date.now()}@example.com`;
    const payload = { ...validContactRequest, email };

    const response = await request(createApp({ env, contactService }))
      .post("/api/v1/contact")
      .set("Origin", "http://localhost:3000")
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(notifications.sendContactNotification).toHaveBeenCalledOnce();
    const stored = await getDatabase().select().from(demoRequests).where(eq(demoRequests.email, email));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBeGreaterThan(0);
    expect(stored[0].message).toBe(payload.message);
    await getDatabase().delete(demoRequests).where(eq(demoRequests.email, email));
  });
  it("serves seeded HavocX identity and rejects unauthorized CMS updates", async () => {
    const token = "integration-cms-token-12345678901234567890";
    const old = process.env.INTERNAL_CMS_TOKEN;
    process.env.INTERNAL_CMS_TOKEN = token;
    try {
      const app = createApp({ env: loadEnv(), contactService: {
        submit: vi.fn(async () => { throw new Error("Not used"); }),
      } });
      const initial = await request(app).get("/api/v1/site").expect(200);
      expect(initial.body.data["brand.name"]).toBe("HavocX Agency");
      await request(app).put("/api/v1/site/brand.name").send({ value: "HavocX New" }).expect(401);
      await request(app).put("/api/v1/site/brand.name").set("X-Admin-Key", token).send({ value: "HavocX New" }).expect(200);
      const changed = await request(app).get("/api/v1/site").expect(200);
      expect(changed.body.data["brand.name"]).toBe("HavocX New");
      const stored = await getDatabase().select().from(siteSettings).where(eq(siteSettings.key, "brand.name"));
      expect(stored[0].value).toBe("HavocX New");
      await request(app).put("/api/v1/site/brand.name").set("X-Admin-Key", token).send({ value: "HavocX Agency" }).expect(200);
    } finally {
      if (old === undefined) delete process.env.INTERNAL_CMS_TOKEN;
      else process.env.INTERNAL_CMS_TOKEN = old;
    }
  });

});
