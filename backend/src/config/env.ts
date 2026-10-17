import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  DATABASE_URL: z.url().refine(
    (value) => value.startsWith("postgres://") || value.startsWith("postgresql://"),
    "DATABASE_URL must be a PostgreSQL URL",
  ),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  DATABASE_SSL_MODE: z.enum(["require", "disable"]).default("require"),
  ADMIN_EMAIL: z.email(),
  EMAIL_FROM: z.string().min(3).default("Digital Solutions <onboarding@resend.dev>"),
  CORS_ORIGINS: z.string().min(1).default("http://localhost:3000"),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(600_000),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(2),
  INTERNAL_CMS_TOKEN: z.string().min(32).optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema> & {
  corsOrigins: string[];
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join(".")).filter(Boolean);
    throw new Error(`Invalid environment configuration: ${[...new Set(keys)].join(", ")}`);
  }

  if (result.data.NODE_ENV === "production" && result.data.DATABASE_SSL_MODE === "disable") {
    throw new Error("Database TLS cannot be disabled in production.");
  }

  if (Boolean(result.data.UPSTASH_REDIS_REST_URL) !== Boolean(result.data.UPSTASH_REDIS_REST_TOKEN)) {
    throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together.");
  }

  const origins = result.data.CORS_ORIGINS.split(",").map((origin) => origin.trim().replace(/\/$/, "")).filter(Boolean);
  if (origins.includes("*") || origins.some((origin) => !/^https?:\/\/[^/]+$/.test(origin))) {
    throw new Error("CORS_ORIGINS must contain exact http(s) origins. Wildcards are not permitted.");
  }

  return {
    ...result.data,
    corsOrigins: origins,
  };
}

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
  cachedEnv ??= loadEnv();
  return cachedEnv;
}
