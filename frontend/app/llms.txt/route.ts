import { serviceMenuGroups, getServiceItemHref } from "@/src/features/services/data/services";
import { absoluteUrl, publishedOrigin } from "@/src/lib/seo";
import { getSiteSettings } from "@/src/lib/site";

export async function GET() {
  const site = await getSiteSettings();
  const brand = site["brand.name"] || "HavocX Agency";
  const lines = [
    `# ${brand}`,
    "",
    "> Digital marketing, SEO, experience design, website development and workflow automation services.",
    "",
    "## Service categories",
    ...serviceMenuGroups.flatMap((group) => [
      `- [${group.title}](${absoluteUrl(`/services/${group.id}`)}): ${group.description}`,
      ...group.services.map((name) => `  - [${name}](${absoluteUrl(getServiceItemHref(name, group.id))})`),
    ]),
    "",
    "## Other public pages",
    `- [Contact ${brand}](${absoluteUrl("/book-a-demo")})`,
    `- [Working approach](${absoluteUrl("/reviews")})`,
    `- [Privacy policy](${absoluteUrl("/privacy-policy")})`,
    `- [Terms of service](${absoluteUrl("/terms-of-service")})`,
    "",
    "The site describes client services, not a proprietary AI product ecosystem.",
  ];
  if (!publishedOrigin) {
    return new Response("Public origin not configured.\n", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
