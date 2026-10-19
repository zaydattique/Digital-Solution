import { createHmac } from "node:crypto";
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

  it("isolates signed public visitors without trusting forged identifiers", async () => {
    const secret = "signed-service-auth-token-longer-than-thirty-two-chars";
    const keys: string[] = [];
    const mock = vi.fn(async (_url: string, options?: RequestInit) => {
      const commands = JSON.parse(String(options?.body)) as [string, string][][];
      keys.push(commands[0][1]);
      return new Response(JSON.stringify([{ result: 1 }, { result: 1 }]), { status: 200 });
    });
    vi.stubGlobal("fetch", mock);
    const app = createApp({ env: { ...env, INTERNAL_CMS_TOKEN: secret }, contactService });
    const issued = String(Math.floor(Date.now() / 1000));
    function signedHeaders(visitor: string) {
      const hash = createHmac("sha256", secret).update(visitor).digest("hex");
      return {
        "X-HavocX-Visitor": hash,
        "X-HavocX-Issued-At": issued,
        "X-HavocX-Signature": createHmac("sha256", secret).update(`${hash}.${issued}`).digest("hex"),
      };
    }
    await request(app).post("/api/v1/contact").set(signedHeaders("visitor-a")).send(validContactRequest).expect(201);
    await request(app).post("/api/v1/contact").set(signedHeaders("visitor-b")).send(validContactRequest).expect(201);
    const forged = signedHeaders("visitor-a");
    forged["X-HavocX-Signature"] = "0".repeat(64);
    await request(app).post("/api/v1/contact").set(forged).send(validContactRequest).expect(201);
    expect(keys).toHaveLength(3);
    expect(keys[0]).not.toEqual(keys[1]);
    expect(keys[0]).not.toEqual(keys[2]);
  });

  it("fails closed without a shared store in production", async () => {
    const response = await request(createApp({
      env: { ...testEnv, NODE_ENV: "production" },
      contactService,
    })).post("/api/v1/contact").send(validContactRequest).expect(503);
    expect(response.body.error.code).toBe("RATE_LIMIT_UNAVAILABLE");
  });
});
