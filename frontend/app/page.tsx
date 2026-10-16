import type { Metadata } from "next";
import { pageMetadata, publishedOrigin, siteOrigin, absoluteUrl } from "@/src/lib/seo";
import HomePage from "@/src/features/home/components/HomePage";

export const metadata: Metadata = pageMetadata("/", "Digital Solutions | Digital Marketing and Creative Services", "Digital marketing, SEO, design and development services focused on visibility, user experience and customer growth.");

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/images/home/hero-integrations-768.avif"
        imageSrcSet="/assets/images/home/hero-integrations-768.avif 768w, /assets/images/home/hero-integrations-1280.avif 1280w, /assets/images/home/hero-integrations-1920.avif 1920w"
        imageSizes="100vw"
        type="image/avif"
        fetchPriority="high"
      />
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
                  name: "Digital Solutions",
                  url: siteOrigin,
                },
                {
                  "@type": "WebSite",
                  "@id": absoluteUrl("/#website"),
                  name: "Digital Solutions",
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
