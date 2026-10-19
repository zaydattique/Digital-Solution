import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { LegalPage } from "@/src/features/legal/components/LegalPage";

export const metadata: Metadata = pageMetadata("/privacy-policy", "Privacy Policy | Digital Solutions", "How Digital Solutions collects, uses and handles information submitted through its website.");

export default function PrivacyPolicyPage() {
  return <LegalPage type="privacy" />;
}
