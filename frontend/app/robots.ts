import type { MetadataRoute } from "next";
import { absoluteUrl, publishedOrigin } from "@/src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Staging and unconfigured deployments should not be accidentally indexed.
  if (!publishedOrigin) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/services/software-tools", "/services/software-tools/checkout"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: publishedOrigin,
  };
}
