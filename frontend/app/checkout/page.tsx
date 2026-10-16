import type { Metadata } from "next";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Suspense } from "react";
import SoftwareCheckoutPage from "@/src/features/services/components/SoftwareCheckoutPage";
import { softwareTools } from "@/src/features/services/data/softwareToolsData";
import "@/src/features/services/styles/software-checkout.css";

// Private share links are verified server-side. Noindex is not authorization.
export const metadata: Metadata = {
  title: "Checkout | Digital Solutions",
  robots: { index: false, follow: false, nocache: true },
};

type Params = { token?: string | string[] };
type CheckoutProps = { searchParams: Promise<Params> };

function verifyCheckoutLink(raw: string | string[] | undefined) {
  const secret = process.env.CHECKOUT_LINK_SECRET;
  if (!secret || secret.length < 32 || typeof raw !== "string" || !raw || raw.length > 512) return null;

  // Token format: productId.expiryEpochSeconds.hexHmac
  const [productId, expiry, signature, extra] = raw.split(".");
  if (extra || !productId || !/^\d{10}$/.test(expiry ?? "") || !/^[0-9a-f]{64}$/.test(signature ?? "")) return null;
  const expiresAt = Number(expiry);
  if (expiresAt < Math.floor(Date.now() / 1000) || expiresAt > Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30) return null;
  const tool = softwareTools.find((entry) => entry.id === productId);
  if (!tool) return null;

  const message = `${productId}.${expiry}`;
  const expected = createHmac("sha256", secret).update(message).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return null;
  return {
    product: tool.name,
    plan: tool.plan,
    price: `Rs ${tool.price.toLocaleString("en-PK")}${tool.period}`,
    category: tool.category,
  };
}

export default async function CheckoutPage({ searchParams }: CheckoutProps) {
  const { token } = await searchParams;
  const order = verifyCheckoutLink(token);
  if (!order) {
    return (
      <main style={{ minHeight: "70vh", padding: "12vh 7vw", color: "#f6f9ff", background: "#050d20" }}>
        <h1>Checkout link unavailable</h1>
        <p>This payment link is missing, invalid or expired. Please request a new link from our team.</p>
        <a href="/book-a-demo" style={{ color: "#81b8ff" }}>Contact Digital Solutions</a>
      </main>
    );
  }
  return (
    <Suspense fallback={<main aria-busy="true">Loading checkout...</main>}>
      <SoftwareCheckoutPage order={order} />
    </Suspense>
  );
}
