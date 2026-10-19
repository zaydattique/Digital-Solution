import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import BookDemoPage from "@/src/features/contact/components/BookDemoPage";
import { serviceMenuGroups } from "@/src/features/services/data/services";

export const metadata: Metadata = pageMetadata("/book-a-demo", "Contact Digital Solutions | Discuss a Project", "Contact Digital Solutions about digital marketing, SEO, design, website development and workflow automation.");

type ContactRouteProps = {
  searchParams: Promise<{ service?: string; focus?: string }>;
};

export default async function BookADemoRoute({ searchParams }: ContactRouteProps) {
  const params = await searchParams;
  const group = serviceMenuGroups.find((item) => item.id === params.service);
  const focus = group?.services.find((item) => item === params.focus) ?? "";
  return <BookDemoPage initialService={group?.title ?? ""} initialSubService={focus} />;
}
