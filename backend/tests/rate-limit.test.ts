import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import type { ContactService } from "../src/services/contact.service.js";
import { testEnv, validContactRequest } from "./fixtures.js";

afterEach(() => vi.unstubAllGlobals());

describe("distributed contact limiter", () => {
  const env = {
    ...testEnv,
    CONTACT_RATE_LIMIT_MAX: 2,
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-only-secret",
  };
  const contactService: ContactService = {
    submit: vi.fn(async (payload) => ({
      record: { ...payload, id: 1, createdAt: new Date("2026-10-16T00:00:00Z") },
      notificationSent: true,
    })),
  };

  it("enforces a shared quota across different Express instances", async () => {
    let requests = 0;
    const fetchMock = vi.fn(async () => {
      requests += 1;
      return new Response(JSON.stringify([
        { result: requests },
        { result: 1 },
      ]), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    // Separate app instances still consume the same external key counter.
    await request(createApp({ env, contactService }))
      .post("/api/v1/contact").send(validContactRequest).expect(201);
    await request(createApp({ env, contactService }))
      .post("/api/v1/contact").send(validContactRequest).expect(201);
    const response = await request(createApp({ env, contactService }))
      .post("/api/v1/contact").send(validContactRequest).expect(429);

    expect(response.body.error.code).toBe("RATE_LIMITED");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(firstCall[0]).toBe("https://example.upstash.io/pipeline");
    expect(firstCall[1].body).toContain('"INCR"');
  });

  it("fails closed when Redis is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network unavailable"); }));
    const response = await request(createApp({ env, contactService }))
      .post("/api/v1/contact").send(validContactRequest).expect(503);
    expect(response.body.error.code).toBe("RATE_LIMIT_UNAVAILABLE");
  });

  it("fails closed without a shared store in production", async () => {
    const response = await request(createApp({
      env: { ...testEnv, NODE_ENV: "production" },
      contactService,
    })).post("/api/v1/contact").send(validContactRequest).expect(503);
    expect(response.body.error.code).toBe("RATE_LIMIT_UNAVAILABLE");
  });
});
