import type { Metadata } from "next";
import { getSiteSettings } from "./site";

// A single public origin drives canonicals, structured data, the sitemap and robots.
// Indexing stays disabled until the deployment has a verified public domain.
const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://havocx.agency";
function parseSiteOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return undefined;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
export const publishedOrigin = parseSiteOrigin(configured);
export const siteOrigin = publishedOrigin ?? "http://localhost:3000";

export function absoluteUrl(path: string): string {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteOrigin).toString();
}

export async function pageMetadata(path: string, title: string, description: string): Promise<Metadata> {
  const site = await getSiteSettings();
  const brand = site["brand.name"] || "HavocX Agency";
  const displayTitle = title.replace(/Digital Solutions|HavocX Agency/g, brand);
  return {
    title: displayTitle,
    description,
    alternates: { canonical: path },
    robots: publishedOrigin ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: brand,
      title: displayTitle,
      description,
      locale: "en_US",
      ...(site["brand.ogImageUrl"] ? { images: [site["brand.ogImageUrl"]] } : {}),
    },
    twitter: { card: site["brand.ogImageUrl"] ? "summary_large_image" : "summary", title: displayTitle, description },
  };
}

export function serviceStructuredData(path: string, name: string, description: string, hubPath: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": absoluteUrl(path) + "#service",
        name,
        description,
        url: absoluteUrl(path),
        provider: { "@type": "Organization", name: "HavocX Agency", url: siteOrigin },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl(hubPath) },
          { "@type": "ListItem", position: 3, name, item: absoluteUrl(path) },
        ],
      },
    ],
  };
}
