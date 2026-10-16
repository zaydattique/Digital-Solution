"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Mail, MessageCircle, Upload, Wallet } from "lucide-react";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { useSite } from "@/src/components/brand/SiteContext";
import { claimMailSendPermission } from "@/src/lib/mailRateLimit";
import { ServicePageHeader } from "./ServicePageHeader";

const paymentMethods = [
  {
    id: "bank",
    name: "Bank transfer",
    copy: "Request the current account details from our team before paying.",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    copy: "Get the latest JazzCash number from our team, then upload your receipt.",
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    copy: "Get the latest EasyPaisa number from our team, then upload your receipt.",
  },
] as const;

type PaymentMethod = (typeof paymentMethods)[number]["id"];

export type Order = {
  category: string;
  product: string;
  plan: string;
  price: string;
};

function buildMessage(order: Order, paymentMethod: PaymentMethod | "", name: string, phone: string, email: string, agency: string) {
  const methodName = (paymentMethods.find((method) => method.id === paymentMethod)?.name ?? paymentMethod) || "Not selected";
  return [
    `Assalam-o-Alaikum ${agency},`,
    "",
    "Please review my payment receipt for this order. I understand payment is not confirmed until your team verifies it.",
    `Product: ${order.product || "Not selected"}`,
    `Plan: ${order.plan || "Not selected"}`,
    `Price: ${order.price || "To confirm"}`,
    `Payment method: ${methodName}`,
    `Name: ${name || "Not provided"}`,
    `WhatsApp: ${phone || "Not provided"}`,
    `Email: ${email || "Not provided"}`,
    "Please verify my payment and send the tool access details.",
  ].join("\n");
}

export default function SoftwareCheckoutPage({ order }: { order: Order }) {
  const site = useSite();
  const supportEmail = site["contact.email"];
  const supportNumber = site["checkout.whatsappNumber"] || site["contact.phone"];
  const agency = site["brand.name"] || "HavocX Agency";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const message = useMemo(
    () => buildMessage(order, paymentMethod, name.trim(), phone.trim(), email.trim(), agency),
    [email, name, order, paymentMethod, phone, agency],
  );

  const sendProof = async (channel: "whatsapp" | "email") => {
    const missingFields: string[] = [];
    if (!paymentMethod) missingFields.push("payment method");
    if (!name.trim()) missingFields.push("your name");
    if (!phone.trim() && !email.trim()) missingFields.push("WhatsApp number or email address");
    if (!proofFile) missingFields.push("payment screenshot");

    if (missingFields.length > 0) {
      setStatus(`Please complete: ${missingFields.join(", ")}.`);
      return;
    }

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (!proofFile || !["image/png", "image/jpeg", "image/webp"].includes(proofFile.type) || proofFile.size > 10 * 1024 * 1024) {
      setStatus("Please upload a valid PNG, JPG, or WebP screenshot under 10 MB.");
      return;
    }

    if (channel === "whatsapp") {
      if (!supportNumber) { setStatus("WhatsApp support is not configured."); return; }
      window.open(`https://wa.me/${supportNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      setStatus("WhatsApp opened. Please attach the screenshot before sending.");
      return;
    }

    const shareData: ShareData = {
      title: `Payment proof — ${order.product || "Software tool"}`,
      text: message,
      files: [proofFile as File],
    };

    try {
      if (navigator.share && navigator.canShare?.({ files: [proofFile as File] })) {
        await navigator.share(shareData);
        setStatus("The share dialog was opened. Our team must independently confirm any received payment before fulfillment.");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    const permission = claimMailSendPermission();
    if (!permission.allowed) {
      setStatus(permission.message);
      return;
    }

    if (!supportEmail) { setStatus("Email support is not configured."); return; }
    window.location.assign(`mailto:${supportEmail}?subject=${encodeURIComponent(`Payment proof — ${order.product || "Software tool"}`)}&body=${encodeURIComponent(`${message}\n\nPlease attach your payment screenshot before sending.`)}`);
    setStatus("Your email app is opening. Please attach the screenshot before sending.");
  };

  return (
    <div className="ds-services-page ds-software-checkout-page">
      <ServicePageHeader backHref="/book-a-demo" backLabel="Contact our team" />

      <main className="ds-checkout-main">
        <div className="ds-checkout-back-row">
          <a href="/book-a-demo"><ArrowLeft size={15} /> Contact our team</a>
        </div>

        <section className="ds-checkout-layout" aria-labelledby="checkout-title">
          <div className="ds-checkout-copy">
            <span className="ds-service-kicker">Manual payment review</span>
            <h1 id="checkout-title">Submit payment details for review.</h1>
            <p>Only pay using account details confirmed directly by our team. A screenshot alone is not proof that payment has settled.</p>

            <div className="ds-checkout-order-card">
              <span>Selected tool</span>
              <strong>{order.product || "Your selected software tool"}</strong>
              <small>{order.plan || "Plan details"}</small>
              <b>{order.price || "Price to confirm"}</b>
            </div>

            <div className="ds-checkout-steps" aria-label="Order steps">
              <div><span>01</span><p>Confirm the payment details with us.</p></div>
              <div><span>02</span><p>Pay and keep your receipt screenshot.</p></div>
              <div><span>03</span><p>Send proof and receive access after verification.</p></div>
            </div>
          </div>

          <div className="ds-checkout-form-card">
            <div className="ds-checkout-form-heading">
              <Wallet size={20} aria-hidden="true" />
              <div><span>Step 1</span><h2>Choose payment method</h2></div>
            </div>

            <div className="ds-payment-options" role="radiogroup" aria-label="Payment method">
              {paymentMethods.map((method) => (
                <label className={`ds-payment-option${paymentMethod === method.id ? " is-selected" : ""}`} key={method.id}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="ds-payment-radio"><Check size={13} aria-hidden="true" /></span>
                  <span><strong>{method.name}</strong><small>{method.copy}</small></span>
                </label>
              ))}
            </div>

            <div className="ds-payment-details-note">
              Payment account numbers are shared and confirmed by our team before payment so you always use the current details.
              {supportNumber && <a href={`https://wa.me/${supportNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent("Please send me the current payment details.")}`} target="_blank" rel="noopener noreferrer">Request payment details on WhatsApp</a>}
            </div>

            <div className="ds-checkout-form-heading ds-checkout-form-heading--proof">
              <Upload size={20} aria-hidden="true" />
              <div><span>Step 2</span><h2>Send payment proof</h2></div>
            </div>

            <div className="ds-checkout-fields">
              <label><span>Your name <em>*</em></span><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Arslan Ahmad" autoComplete="name" /></label>
              <label><span>WhatsApp number</span><input type="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d+\s()-]/g, ""))} placeholder="+92 300 1234567" autoComplete="tel" /></label>
              <label><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
            </div>
            <p className="ds-checkout-contact-hint">WhatsApp number ya email — koi ek zaroor dein.</p>

            <label className={`ds-proof-upload${proofFile ? " is-uploaded" : ""}`}>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setProofFile(event.target.files?.[0] ?? null)} />
              <Upload size={22} aria-hidden="true" />
              <strong>{proofFile ? proofFile.name : "Upload payment screenshot"}</strong>
              <small>PNG, JPG, or WebP · required</small>
            </label>

            <div className="ds-proof-checklist" aria-label="Payment proof checklist">
              <strong>Our team will independently verify:</strong>
              <span><Check size={14} /> {order.product || "Selected tool"} · {order.plan || "Selected plan"}</span>
              <span><Check size={14} /> Paid amount · {order.price || "Amount to confirm"}</span>
              <span><Check size={14} /> {paymentMethods.find((method) => method.id === paymentMethod)?.name ?? "Payment method"} receipt, date, receiver, and transaction ID</span>
            </div>

            <div className="ds-proof-actions">
              {supportNumber && <div className="ds-proof-action-item"><button type="button" onClick={() => sendProof("whatsapp")}><MessageCircle size={17} /> Send to WhatsApp</button><small>{supportNumber}</small></div>}
              {supportEmail && <div className="ds-proof-action-item"><button type="button" className="is-email" onClick={() => sendProof("email")}><Mail size={17} /> Send by email</button><small>{supportEmail}</small></div>}
            </div>

            {status && <p className="ds-checkout-status" role="status">{status}</p>}
            <p className="ds-checkout-help">On devices that don’t support sharing files directly, WhatsApp or email will open with your order message ready. Attach the screenshot before sending.</p>
          </div>
        </section>
      </main>

      <AgencyFooter />
    </div>
  );
}
