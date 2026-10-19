import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { LegalPage } from "@/src/features/legal/components/LegalPage";

export const metadata: Metadata = pageMetadata("/terms-of-service", "Terms of Service | Digital Solutions", "Read terms governing use of the Digital Solutions website and its services.");

export default function TermsOfServicePage() {
  return <LegalPage type="terms" />;
}
