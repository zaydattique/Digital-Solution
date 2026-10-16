import type { Metadata } from "next";

// A single public origin drives canonicals, structured data, the sitemap and robots.
// Indexing stays disabled until the deployment has a verified public domain.
const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
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

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: publishedOrigin ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: "Digital Solutions",
      title,
      description,
      locale: "en_US",
    },
    twitter: { card: "summary", title, description },
  };
}
