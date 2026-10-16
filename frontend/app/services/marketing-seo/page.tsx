import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { Search, Cpu, Target, Mail, BarChart3 } from "lucide-react";
import { ServiceHubView } from "@/src/features/services/components/ServiceHubView";
import { marketingSeoSubServices } from "@/src/features/services/data/marketingSeoData";
import type { HubPageConfig } from "@/src/features/services/types";

export const metadata: Metadata = pageMetadata("/services/marketing-seo", "Digital Marketing & SEO Services", "Technical SEO, content workflows, paid campaigns, CRM and marketing analytics for businesses.");

const config: HubPageConfig = {
  title: "Marketing & SEO Services — HavocX Agency",
  eyebrow: "Marketing and search",
  heading: "Digital Marketing and SEO Services",
  description:
    "Plan and improve your search visibility, content workflows, paid campaigns, customer journeys and marketing analytics.",
  groupSlug: "marketing-seo",
  services: Object.values(marketingSeoSubServices),
  icons: {
    "technical-seo": Search,
    "ai-content-systems": Cpu,
    "performance-marketing": Target,
    "crm-lifecycle-automation": Mail,
    "analytics-attribution": BarChart3,
  },
  ctaHeading: "Discuss your marketing goals",
  ctaDescription:
    "Tell us about your audience, current channels and the results you want to improve.",
  ctaButtonText: "Discuss a project",
};

export default function MarketingSeoHubPage() {
  return <ServiceHubView config={config} />;
}
