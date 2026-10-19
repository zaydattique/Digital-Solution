import "server-only";
import { cache } from "react";

export type SiteSettings = Record<string, string>;
export const defaultSiteSettings: SiteSettings = {
  "brand.name": "HavocX Agency",
  "brand.tagline": "Strategy / Creative / Growth",
  "brand.logoUrl": "",
  "brand.faviconUrl": "",
  "brand.ogImageUrl": "",
  "brand.description": "Digital marketing, design and development services for growing brands.",
  "home.heroTitle": "Make your brand impossible to miss.",
  "home.heroDescription": "We help businesses grow visibility and create better digital experiences.",
  "home.heroImageUrl": "",
  "home.heroVideoUrl": "",
  "contact.email": "",
  "contact.phone": "",
  "contact.phoneSecondary": "",
  "legal.lastUpdated": "",
  "checkout.whatsappNumber": "",
  "social.linkedin": "",
  "social.instagram": "",
  "social.facebook": "",
  "social.website": "https://havocx.agency",
};

export function backendAddress(path: string): string | null {
  const base = process.env.BACKEND_URL;
  // Vercel binding exists at runtime in Functions, not during next build.
  return base ? new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : base + "/").toString() : null;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const endpoint = backendAddress("api/v1/site");
  if (!endpoint) return defaultSiteSettings;
  try {
    const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(3500) });
    if (!response.ok) return defaultSiteSettings;
    const data: unknown = await response.json();
    if (typeof data !== "object" || data === null || !("data" in data) || typeof data.data !== "object" || data.data === null) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...(data.data as SiteSettings) };
  } catch { return defaultSiteSettings; }
});
