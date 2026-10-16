import type { MetadataRoute } from "next";
import { absoluteUrl, publishedOrigin } from "@/src/lib/seo";
import { serviceMenuGroups, getServiceItemHref } from "@/src/features/services/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publishedOrigin) return [];
  const paths = [
    "/",
    "/book-a-demo",
    "/reviews",
    "/privacy-policy",
    "/terms-of-service",
    ...serviceMenuGroups.flatMap((group) => [
      `/services/${group.id}`,
      ...group.services.map((service) => getServiceItemHref(service, group.id)),
    ]),
  ];
  return [...new Set(paths)].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/book-a-demo" ? 0.7 : 0.6,
  }));
}
