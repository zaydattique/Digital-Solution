import { serviceMenuGroups, getServiceItemHref } from "@/src/features/services/data/services";
import { absoluteUrl, publishedOrigin } from "@/src/lib/seo";

export function GET() {
  const lines = [
    "# Digital Solutions",
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
    `- [Contact Digital Solutions](${absoluteUrl("/book-a-demo")})`,
    `- [Working approach](${absoluteUrl("/reviews")})`,
    `- [Privacy policy](${absoluteUrl("/privacy-policy")})`,
    `- [Terms of service](${absoluteUrl("/terms-of-service")})`,
    "",
    "The site describes client services. It does not claim to operate a proprietary AI product ecosystem.",
  ];
  if (!publishedOrigin) {
    return new Response("Public origin not configured.\n", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
