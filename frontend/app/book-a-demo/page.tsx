import type { Metadata } from "next";
import BookDemoPage from "@/src/features/contact/components/BookDemoPage";
import { serviceMenuGroups } from "@/src/features/services/data/services";

export const metadata: Metadata = {
  title: "Contact Digital Solutions | Discuss a Project",
  description: "Contact Digital Solutions to discuss digital marketing, SEO, design, website development and business automation services.",
};

type ContactRouteProps = {
  searchParams: Promise<{ service?: string; focus?: string }>;
};

export default async function BookADemoRoute({ searchParams }: ContactRouteProps) {
  const params = await searchParams;
  const group = serviceMenuGroups.find((item) => item.id === params.service);
  const focus = group?.services.find((item) => item === params.focus) ?? "";
  return <BookDemoPage initialService={group?.title ?? ""} initialSubService={focus} />;
}
