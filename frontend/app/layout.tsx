import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "@/src/features/home/styles/home.css";
import "@/src/features/home/styles/not-found.css";
import "@/src/features/services/styles/services.css";
import { siteOrigin } from "@/src/lib/seo";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Digital Solutions | Digital Marketing, Design and Development",
    template: "%s | Digital Solutions",
  },
  description:
    "Digital Solutions provides digital marketing, technical SEO, experience design, web development and workflow automation services.",
  applicationName: "Digital Solutions",
  openGraph: { siteName: "Digital Solutions", locale: "en_US", type: "website" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050d20",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
