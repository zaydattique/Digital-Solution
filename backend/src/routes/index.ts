import { Router } from "express";
import type { AppEnv } from "../config/env.js";
import type { ContactService } from "../services/contact.service.js";
import { createContactRouter } from "./contact.routes.js";
import { createHealthRouter } from "./health.routes.js";
import { createSiteRouter } from "./site.routes.js";

export function createApiRouter(service: ContactService, env: AppEnv): Router {
  const router = Router();

  router.use(createHealthRouter());
  router.use("/v1/site", createSiteRouter());
  router.use("/v1", createContactRouter(service, env));

  return router;
}
