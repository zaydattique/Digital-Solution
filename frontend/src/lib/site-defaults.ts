export type SiteIdentity = {
  name: string;
  tagline: string;
  description: string;
  domain: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  email: string;
  phones: string[];
  socials: Record<string, string>;
};
export type HomeContent = {
  eyebrow: string;
  headline: string;
  description: string;
  heroImages: Array<{ src: string; alt: string; position: string }>;
};
export const bootstrapIdentity: SiteIdentity = {
  name: "HavocX Agency",
  tagline: "Strategy / Creative / Growth",
  description: "Digital marketing, SEO, design and web development.",
  domain: "https://havocx.agency",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  email: "",
  phones: [],
  socials: {},
};
export const bootstrapHome: HomeContent = {
  eyebrow: "STRATEGY / CREATIVE / GROWTH",
  headline: "Make your brand impossible to miss.",
  description: "Marketing, design and digital experiences built around your audience and business goals.",
  heroImages: [],
};

