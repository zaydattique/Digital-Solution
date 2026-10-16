import type { Metadata } from "next";
import { pageMetadata, serviceStructuredData } from "@/src/lib/seo";
import { notFound } from "next/navigation";
import { marketingSeoSubServices } from "@/src/features/services/data/marketingSeoData";
import { ServiceDetailView } from "@/src/features/services/components/ServiceDetailView";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(marketingSeoSubServices).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = marketingSeoSubServices[slug];
  if (!detail) return {};

  return pageMetadata(`/services/marketing-seo/${slug}`, detail.title, detail.description || detail.headline || detail.title);
}

export default async function MarketingSeoSubServicePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = marketingSeoSubServices[slug];

  if (!detail) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData(`/services/marketing-seo/${slug}`, detail.title, detail.description || detail.headline || detail.title, "/services/marketing-seo")).replace(/</g, "\\u003c") }}
      />
      <ServiceDetailView detail={detail} heroImage="/assets/images/services/menu-marketing-seo.jpg" />;
    </>
  );
}
