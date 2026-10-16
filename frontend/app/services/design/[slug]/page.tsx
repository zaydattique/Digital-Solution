import type { Metadata } from "next";
import { pageMetadata, serviceStructuredData } from "@/src/lib/seo";
import { getSiteSettings } from "@/src/lib/site";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/src/features/services/components/ServiceDetailView";
import { designServices } from "@/src/features/services/data/designData";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return designServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = designServices.find((s) => s.slug === slug);
  if (!service) return {};
  const settings = await getSiteSettings();
  return pageMetadata(`/services/design/${slug}`, settings[`service.${slug}.title`] || service.title, settings[`service.${slug}.heroSubtitle`] || service.heroSubtitle || service.shortDescription || service.description || service.title);
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = designServices.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  const settings = await getSiteSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData(`/services/design/${slug}`, service.title, service.heroSubtitle || service.shortDescription || service.title, "/services/design", settings["brand.name"] || "HavocX Agency")).replace(/</g, "\\u003c") }}
      />
      <ServiceDetailView detail={service} heroImage="/assets/images/services/menu-design.jpg" />
    </>
  );
}
