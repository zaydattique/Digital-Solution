import type { Metadata } from "next";
import { Zap, Brain, BarChart3, FileText, ShieldCheck } from "lucide-react";
import { ServiceHubView } from "@/src/features/services/components/ServiceHubView";
import { aiAutomationServices } from "@/src/features/services/data/aiAutomationData";
import type { HubPageConfig } from "@/src/features/services/types";

export const metadata: Metadata = {
  title: "AI Automation Services — Digital Solutions",
  description: "AI agents and dependable workflows designed around how your teams actually work.",
};

const config: HubPageConfig = {
  title: "AI Automation Services — Digital Solutions",
  eyebrow: "Business automation",
  heading: "Business Automation Services",
  description:
    "Connect your business tools and simplify repeatable tasks with practical workflows, integrations and clear human oversight.",
  groupSlug: "ai-automation",
  services: aiAutomationServices,
  icons: {
    "ai-workflow-automation": Zap,
    "ai-agents-copilots": Brain,
    "process-intelligence": BarChart3,
    "document-intelligence": FileText,
    "governance-observability": ShieldCheck,
  },
  ctaHeading: "Discuss a workflow improvement",
  ctaDescription:
    "Talk to us about the manual steps and disconnected systems you want to improve.",
  ctaButtonText: "Discuss a project",
};

export default function AIAutomationHubPage() {
  return <ServiceHubView config={config} />;
}
