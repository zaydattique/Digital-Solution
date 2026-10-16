CREATE TABLE IF NOT EXISTS "site_settings" (
 "key" text PRIMARY KEY NOT NULL,
 "value" text NOT NULL,
 "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "site_settings" ("key","value") VALUES
('brand.name','HavocX Agency'),
('brand.tagline','Strategy / Creative / Growth'),
('brand.logoUrl',''),
('brand.faviconUrl',''),
('brand.ogImageUrl',''),
('brand.description','Digital marketing, creative and web services for growing brands.'),
('home.heroTitle','Make your brand impossible to miss.'),
('home.heroDescription','Marketing, design and development services built around your audience and goals.'),
('home.heroImageUrl',''),
('home.heroVideoUrl',''),
('contact.email',''),
('contact.phone',''),
('contact.phoneSecondary',''),
('legal.lastUpdated',''),
('social.linkedin',''),
('social.instagram',''),
('social.facebook',''),
('social.website','https://havocx.agency')
ON CONFLICT ("key") DO NOTHING;
