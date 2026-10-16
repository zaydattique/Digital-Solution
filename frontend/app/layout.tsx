import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "@/src/features/home/styles/home.css";
import { siteOrigin } from "@/src/lib/seo";
import { getSiteIdentity, getHomeContent } from "@/src/lib/site-content";
import { SiteIdentityProvider } from "@/src/components/brand/SiteIdentityProvider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  const icon = identity.faviconUrl.startsWith("https://") ? identity.faviconUrl : undefined;
  const preview = identity.ogImageUrl.startsWith("https://") ? [identity.ogImageUrl] : undefined;
  return {
    metadataBase: new URL(siteOrigin),
    title: {
      default: `${identity.name} | Digital Marketing, Strategy & Creative`,
      template: `%s | ${identity.name}`,
    },
    description: identity.description,
    applicationName: identity.name,
    openGraph: { siteName: identity.name, locale: "en_US", type: "website", images: preview },
    icons: icon ? { icon, shortcut: icon } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#050d20",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, home] = await Promise.all([getSiteIdentity(), getHomeContent()]);
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <SiteIdentityProvider value={{ identity, home }}>{children}</SiteIdentityProvider>
      </body>
    </html>
  );
}
