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

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "HavocX Agency | Digital Marketing, Strategy & Creative",
    template: "%s | HavocX Agency",
  },
  description:
    "HavocX Agency provides digital marketing, technical SEO, experience design, web development and workflow automation services.",
  applicationName: "HavocX Agency",
  openGraph: { siteName: "HavocX Agency", locale: "en_US", type: "website" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

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
