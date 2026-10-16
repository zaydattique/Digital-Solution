import type { Metadata } from "next";
import BookDemoPage from "@/src/features/contact/components/BookDemoPage";

export const metadata: Metadata = {
  title: "Contact Digital Solutions | Discuss a Project",
  description: "Contact Digital Solutions to discuss digital marketing, SEO, design, website development and business automation services.",
};

export default function BookADemoRoute() {
  return <BookDemoPage />;
}
