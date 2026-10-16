import type { Metadata } from "next";
import { pageMetadata, serviceStructuredData } from "@/src/lib/seo";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/src/features/services/components/ServiceDetailView";
import { aiAutomationServices } from "@/src/features/services/data/aiAutomationData";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return aiAutomationServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = aiAutomationServices.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata(`/services/ai-automation/${slug}`, service.title, service.heroSubtitle || service.shortDescription || service.title);
}

export default async function AIAutomationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = aiAutomationServices.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData(`/services/ai-automation/${slug}`, service.title, service.heroSubtitle || service.shortDescription || service.title, "/services/ai-automation")).replace(/</g, "\\u003c") }}
      />
      <ServiceDetailView detail={service} heroImage="/assets/images/services/menu-ai-automation.jpg" />
    </>
  );
}
