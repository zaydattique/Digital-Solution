import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "@/src/features/home/styles/home.css";
import "@/src/features/home/styles/not-found.css";
import "@/src/features/services/styles/services.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Solutions | Digital Marketing, Design and Development",
    template: "%s | Digital Solutions",
  },
  description:
    "Digital Solutions provides digital marketing, technical SEO, experience design, web development and workflow automation services.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  colorScheme: "light",
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
