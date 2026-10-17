import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "@/src/features/home/styles/home.css";
import { siteOrigin } from "@/src/lib/seo";
import { getSiteSettings } from "@/src/lib/site";
import { SiteProvider } from "@/src/components/brand/SiteContext";

export const dynamic = "force-dynamic";

const primaryFont = Manrope({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings["brand.name"] || "HavocX Agency";
  const description = settings["brand.description"] || "";
  return {
    metadataBase: new URL(siteOrigin),
    title: { default: name, template: `%s | ${name}` },
    description,
    applicationName: name,
    openGraph: { siteName: name, description, locale: "en_US", type: "website", ...(settings["brand.ogImageUrl"] ? { images: [settings["brand.ogImageUrl"]] } : {}) },
    ...(settings["brand.faviconUrl"] ? { icons: { icon: settings["brand.faviconUrl"], shortcut: settings["brand.faviconUrl"] } } : {}),
  };
}


export const viewport: Viewport = {
  themeColor: "#050c1c",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  return (
    <html lang="en">
      <body
        className={`${primaryFont.variable} antialiased`}
        style={{ "--font-primary": "var(--font-nunito-sans)" } as React.CSSProperties}
      >
        <SiteProvider settings={siteSettings}>{children}</SiteProvider>
      </body>
    </html>
  );
}
