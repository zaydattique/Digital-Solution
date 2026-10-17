import type { Metadata } from "next";
import { pageMetadata, publishedOrigin, siteOrigin, absoluteUrl } from "@/src/lib/seo";
import HomePage from "@/src/features/home/components/HomePage";
import { getSiteSettings } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); return pageMetadata("/", settings["home.heroTitle"] || "HavocX Agency — Creative Digital Agency", settings["brand.description"] || "Strategy, digital experiences, marketing and technology by HavocX Agency."); }


export default async function Home() {
  const settings = await getSiteSettings();
  return (
    <>
      {publishedOrigin && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": absoluteUrl("/#organization"),
                  name: settings["brand.name"] || "HavocX Agency",
                  url: siteOrigin,
                },
                {
                  "@type": "WebSite",
                  "@id": absoluteUrl("/#website"),
                  name: settings["brand.name"] || "HavocX Agency",
                  url: siteOrigin,
                  publisher: { "@id": absoluteUrl("/#organization") },
                  inLanguage: "en",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <HomePage />
    </>
  );
}
