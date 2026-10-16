import { Router } from "express";
import { sql } from "drizzle-orm";
import { getDatabase } from "../db/client.js";
import { logger } from "../utils/logger.js";

export function createHealthRouter(): Router {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.status(200).json({
      success: true,
      data: {
        service: "digital-solutions-api",
        status: "ok",
      },
    });
  });

  // Liveness remains available during a database outage; readiness reports dependency health.
  router.get("/ready", async (_request, response) => {
    try {
      await getDatabase().execute(sql`select 1`);
      response.status(200).json({ success: true, data: { status: "ready" } });
    } catch (error) {
      logger.warn("Readiness check failed", { error });
      response.status(503).json({
        success: false,
        error: { code: "NOT_READY", message: "Service is temporarily unavailable." },
      });
    }
  });

  return router;
}
