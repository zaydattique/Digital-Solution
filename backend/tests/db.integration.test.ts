import request from "supertest";
import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { closeDatabase, getDatabase } from "../src/db/client.js";
import { demoRequests, siteContent } from "../src/db/schema.js";
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
  it("publishes admin changes to the public CMS reader without exposing write access", async () => {
    const token = "integration-token-at-least-32-characters";
    const env = { ...loadEnv(), CMS_INTERNAL_TOKEN: token };
    const service = new DefaultContactService(contactRepository, {
      sendContactNotification: vi.fn(async () => {}),
    });
    const app = createApp({ env, contactService: service });
    const key = "identity";
    const value = { name: "HavocX Agency", tagline: "Strategy / Creative / Growth" };
    try {
      await request(app).put(`/api/v1/admin/content/${key}`).send({ value }).expect(401);
      await request(app).put(`/api/v1/admin/content/${key}`)
        .set("x-cms-internal-token", token).send({ value }).expect(200);
      const read = await request(app).get(`/api/v1/content/${key}`).expect(200);
      expect(read.body.data.name).toBe(value.name);
    } finally {
      await getDatabase().delete(siteContent).where(eq(siteContent.key, key));
    }
  });

});
