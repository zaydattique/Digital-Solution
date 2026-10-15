// src/features/services/data/services.ts
export type ServiceGroup = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imagePosition: string;
  services: readonly string[];
};

export const serviceMenuGroups: readonly ServiceGroup[] = [
  {
    id: "marketing-seo",
    title: "Marketing & SEO",
    eyebrow: "Digital growth",
    description: "Search visibility, content strategy, paid campaigns, CRM journeys and practical analytics.",
    image: "/assets/images/services/menu-marketing-seo.jpg",
    imagePosition: "center center",
    services: ["Technical SEO", "AI Content Systems", "Performance Marketing", "CRM & Lifecycle Automation", "Analytics & Attribution"],
  },
  {
    id: "design",
    title: "Design & Experience",
    eyebrow: "Brand and conversion",
    description: "Product strategy, user experience, design systems and conversion-focused experiences.",
    image: "/assets/images/services/menu-design.jpg",
    imagePosition: "center center",
    services: ["Product Strategy", "UX & UI Design", "Design Systems", "Rapid Prototyping", "Conversion Experience Design"],
  },
  {
    id: "development",
    title: "Web & Development",
    eyebrow: "Websites and platforms",
    description: "Web applications, integrations, reliable infrastructure and quality engineering that support growth.",
    image: "/assets/images/services/menu-development.jpg",
    imagePosition: "center center",
    services: ["Web & App Engineering", "AI Product Development", "API & Systems Integration", "Cloud & DevOps", "Quality Automation"],
  },
  {
    id: "ai-automation",
    title: "Automation & AI",
    eyebrow: "Efficient operations",
    description: "Workflow automation, practical AI integrations and clear operational controls for busy teams.",
    image: "/assets/images/services/menu-ai-automation.jpg",
    imagePosition: "center center",
    services: ["AI Workflow Automation", "AI Agents & Copilots", "Process Intelligence", "Document Intelligence", "Governance & Observability"],
  },
] as const;

/**
 * Mapping table of individual service button titles to their dedicated page routes.
 * If a dedicated page route exists, it directs to that page.
 * If no page exists yet, it falls back to the existing service hub.
 */
export const SERVICE_ITEM_ROUTES: Record<string, string> = {
  // AI Automation sub-services
  "AI Workflow Automation": "/services/ai-automation/ai-workflow-automation",
  "AI Agents & Copilots": "/services/ai-automation/ai-agents-copilots",
  "Process Intelligence": "/services/ai-automation/process-intelligence",
  "Document Intelligence": "/services/ai-automation/document-intelligence",
  "Governance & Observability": "/services/ai-automation/governance-observability",

  // Marketing & SEO sub-services
  "Technical SEO": "/services/marketing-seo/technical-seo",
  "AI Content Systems": "/services/marketing-seo/ai-content-systems",
  "Performance Marketing": "/services/marketing-seo/performance-marketing",
  "CRM & Lifecycle Automation": "/services/marketing-seo/crm-lifecycle-automation",
  "Analytics & Attribution": "/services/marketing-seo/analytics-attribution",

  // Development sub-services
  "Web & App Engineering": "/services/development/web-app-engineering",
  "AI Product Development": "/services/development/ai-product-development",
  "API & Systems Integration": "/services/development/api-systems-integration",
  "Cloud & DevOps": "/services/development/cloud-devops",
  "Quality Automation": "/services/development/quality-automation",

  // Design sub-services
  "Product Strategy": "/services/design/product-strategy",
  "UX & UI Design": "/services/design/ux-ui-design",
  "Design Systems": "/services/design/design-systems",
  "Rapid Prototyping": "/services/design/rapid-prototyping",
  "Conversion Experience Design": "/services/design/conversion-experience-design",

};

/**
 * Returns the exact route for a service item, or falls back to the existing group hub page
 */
export function getServiceItemHref(serviceName: string, groupId: string): string {
  if (SERVICE_ITEM_ROUTES[serviceName]) {
    return SERVICE_ITEM_ROUTES[serviceName];
  }
  // If no specific route exists yet, send to the group hub page if available
  if (
    groupId === "ai-automation" ||
    groupId === "marketing-seo" ||
    groupId === "development" ||
    groupId === "design"
  ) {
    return `/services/${groupId}`;
  }
  return `/services/not-found?service=${encodeURIComponent(serviceName)}`;
}
