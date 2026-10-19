import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { LegalPage } from "@/src/features/legal/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/privacy-policy", "Privacy Policy | HavocX Agency", "How HavocX Agency collects, uses and handles information submitted through its website."); }


export default function PrivacyPolicyPage() {
  return <LegalPage type="privacy" />;
}
