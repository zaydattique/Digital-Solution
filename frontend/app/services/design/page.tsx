import type { Metadata } from "next";
import { Compass, Palette, Layers, Zap, Target } from "lucide-react";
import { ServiceHubView } from "@/src/features/services/components/ServiceHubView";
import { designServices } from "@/src/features/services/data/designData";
import type { HubPageConfig } from "@/src/features/services/types";

export const metadata: Metadata = {
  title: "Design Services — Digital Solutions",
  description: "Research-led experiences and design systems that make complex products feel simple.",
};

const config: HubPageConfig = {
  title: "Design Services — Digital Solutions",
  eyebrow: "Experience and conversion",
  heading: "Design and Conversion Services",
  description:
    "User experience, interface design and prototyping for websites and digital products that serve your customers.",
  groupSlug: "design",
  services: designServices,
  icons: {
    "product-strategy": Compass,
    "ux-ui-design": Palette,
    "design-systems": Layers,
    "rapid-prototyping": Zap,
    "conversion-experience-design": Target,
  },
  ctaHeading: "Plan a better customer experience",
  ctaDescription:
    "Discuss the customer journeys or product experiences you want to improve.",
  ctaButtonText: "Discuss a project",
};

export default function DesignHubPage() {
  return <ServiceHubView config={config} />;
}
