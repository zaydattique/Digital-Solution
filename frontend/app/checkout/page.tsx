import type { Metadata } from "next";
import { Suspense } from "react";
import SoftwareCheckoutPage from "@/src/features/services/components/SoftwareCheckoutPage";
import "@/src/features/services/styles/software-checkout.css";

// Direct-link-only checkout. Noindex keeps it out of organic service discovery.
// This is NOT access control. Sensitive/private transactions require authorization.
export const metadata: Metadata = {
  title: "Checkout | Digital Solutions",
  robots: { index: false, follow: false, nocache: true },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main aria-busy="true">Loading checkout...</main>}>
      <SoftwareCheckoutPage />
    </Suspense>
  );
}
