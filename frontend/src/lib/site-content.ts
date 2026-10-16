import { connection } from "next/server";

// All agency-facing defaults are bootstrap values, never fake contact information.
// Published admin records take precedence on every server-rendered request.
import { bootstrapIdentity, bootstrapHome } from "@/src/lib/site-defaults";
import type { SiteIdentity, HomeContent } from "@/src/lib/site-defaults";

export async function getSiteDocument<T extends object>(key: string): Promise<Partial<T>> {
  // Vercel service bindings work only in runtime functions, never during builds.
  await connection();
  const base = process.env.BACKEND_URL;
  if (!base) return {};
  try {
    const response = await fetch(new URL(`api/v1/content/${encodeURIComponent(key)}`, base.endsWith("/") ? base : base + "/"), {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return {};
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || !("data" in payload) || !payload.data || typeof payload.data !== "object") return {};
    return payload.data as Partial<T>;
  } catch {
    return {};
  }
}

export async function getSiteIdentity(): Promise<SiteIdentity> {
  const input = await getSiteDocument<SiteIdentity>("identity");
  return {
    ...bootstrapIdentity,
    ...input,
    name: typeof input.name === "string" && input.name.trim() ? input.name : bootstrapIdentity.name,
    phones: Array.isArray(input.phones) ? input.phones.filter((x): x is string => typeof x === "string") : [],
    socials: input.socials && typeof input.socials === "object" ? input.socials : {},
  };
}
export async function getHomeContent(): Promise<HomeContent> {
  const input = await getSiteDocument<HomeContent>("home");
  return {
    ...bootstrapHome,
    ...input,
    heroImages: Array.isArray(input.heroImages) ? input.heroImages.filter(
      (item): item is HomeContent["heroImages"][number] => Boolean(item && typeof item.src === "string" && typeof item.alt === "string"),
    ) : [],
  };
}
