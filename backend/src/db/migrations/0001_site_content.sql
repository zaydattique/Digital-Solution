CREATE TABLE IF NOT EXISTS "site_content" (
  "key" varchar(80) PRIMARY KEY NOT NULL,
  "value" jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
