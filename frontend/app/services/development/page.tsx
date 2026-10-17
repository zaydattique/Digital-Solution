import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { Globe, Brain, Share2, Cloud, CheckCircle2 } from "lucide-react";
import { ServiceHubView } from "@/src/features/services/components/ServiceHubView";
import { webDevServices } from "@/src/features/services/data/webDevelopmentData";
import type { HubPageConfig } from "@/src/features/services/types";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/services/development", "Web Development & Integration Services", "Web applications, API integrations and reliable digital infrastructure for growing businesses.");; }


const config: HubPageConfig = {
  title: "Development Services — HavocX Agency",
  eyebrow: "Web and development",
  heading: "Websites and Development Services",
  description:
    "Websites, applications and integrations designed around your business needs, customer journeys and long-term maintenance.",
  groupSlug: "development",
  services: webDevServices,
  icons: {
    "web-app-engineering": Globe,
    "ai-product-development": Brain,
    "api-systems-integration": Share2,
    "cloud-devops": Cloud,
    "quality-automation": CheckCircle2,
  },
  ctaHeading: "Build your next digital experience",
  ctaDescription:
    "Tell us about your website, platform or integration requirements.",
  ctaButtonText: "Discuss a project",
};

export default function DevelopmentHubPage() {
  return <ServiceHubView config={config} />;
}
