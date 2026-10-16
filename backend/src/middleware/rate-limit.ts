import { createHmac } from "node:crypto";
import type { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import type { AppEnv } from "../config/env.js";
import { logger } from "../utils/logger.js";

const reject = (response: Parameters<RequestHandler>[1]) => response.status(429).json({
  success: false,
  error: { code: "RATE_LIMITED", message: "Too many contact requests. Please try again later." },
});

export function createContactRateLimit(env: AppEnv): RequestHandler {
  // A local store is suitable for development and tests, not distributed production traffic.
  const localLimiter = rateLimit({
    windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MS,
    limit: env.CONTACT_RATE_LIMIT_MAX,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_request, response) => { reject(response); },
  });

  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    if (env.NODE_ENV !== "production") return localLimiter;
    return (_request, response) => {
      // Fail closed in production rather than silently falling back to per-instance quotas.
      response.status(503).json({
        success: false,
        error: { code: "RATE_LIMIT_UNAVAILABLE", message: "Contact requests are temporarily unavailable." },
      });
    };
  }

  const endpoint = env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "") + "/pipeline";
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const windowSeconds = Math.ceil(env.CONTACT_RATE_LIMIT_WINDOW_MS / 1000);
  const windowMs = env.CONTACT_RATE_LIMIT_WINDOW_MS;

  return async (request, response, next) => {
    try {
      const windowId = Math.floor(Date.now() / windowMs);
      // Keyed hash means client IP addresses are not stored in Redis as raw text.
      const visitorHash = createHmac("sha256", token).update(request.ip ?? "unknown").digest("hex");
      const key = `ds:contact:rate:${windowId}:${visitorHash}`;
      const result = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([["INCR", key], ["EXPIRE", key, windowSeconds * 2]]),
        signal: AbortSignal.timeout(3000),
      });
      if (!result.ok) throw new Error(`Redis limiter HTTP ${result.status}`);
      const data: unknown = await result.json();
      if (!Array.isArray(data) || typeof data[0]?.result !== "number" || data[0]?.error || data[1]?.error) {
        throw new Error("Unexpected Redis limiter response");
      }
      const used = data[0].result as number;
      response.setHeader("RateLimit-Limit", String(env.CONTACT_RATE_LIMIT_MAX));
      response.setHeader("RateLimit-Remaining", String(Math.max(0, env.CONTACT_RATE_LIMIT_MAX - used)));
      if (used > env.CONTACT_RATE_LIMIT_MAX) {
        reject(response);
        return;
      }
      next();
    } catch (error) {
      logger.error("Distributed contact limiter unavailable", { error });
      response.status(503).json({
        success: false,
        error: { code: "RATE_LIMIT_UNAVAILABLE", message: "Contact requests are temporarily unavailable." },
      });
    }
  };
}
