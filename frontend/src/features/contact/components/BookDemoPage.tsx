"use client";

import { FormEvent, useState } from "react";
import { ServicePageHeader } from "@/src/features/services/components/ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { useSite } from "@/src/components/brand/SiteContext";
import { ApiClientError, submitContactRequest } from "@/src/lib/api/contact";
import { serviceMenuGroups } from "@/src/features/services/data/services";


type BookingForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  subService: string;
  customService: string;
  message: string;
};

// Keep contact options aligned with the same catalog used by navigation and service pages.
const serviceOptions: Record<string, readonly string[]> = Object.fromEntries(
  serviceMenuGroups.map((group) => [group.title, group.services]),
);

const countryCodes = [
  { code: "+92", label: "🇵🇰 +92" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
];

const initialForm: BookingForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  subService: "",
  customService: "",
  message: "",
};

export default function BookDemoPage({
  initialService = "",
  initialSubService = "",
}: { initialService?: string; initialSubService?: string }) {
  const [form, setForm] = useState<BookingForm>(() => ({
    ...initialForm,
    service: initialService,
    subService: initialSubService,
  }));
  const site = useSite();
  const contactEmail = site["contact.email"];
  const contactPhones = [site["contact.phone"], site["contact.phoneSecondary"]].filter(Boolean);
  const [countryCode, setCountryCode] = useState("+92");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);



  const updateField = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = form.name.trim();
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[\p{L}\p{M} .'-]+$/u.test(cleanName)) {
      setError("Please use letters and standard name punctuation.");
      return;
    }
    if (cleanName.length > 60) {
      setError("Name must be 60 characters or fewer.");
      return;
    }

    const cleanEmail = form.email.trim();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid work email address.");
      return;
    }
    if (cleanEmail.length > 100) {
      setError("Email must be 100 characters or fewer.");
      return;
    }

    const cleanPhone = form.phone.trim();
    if (!/^\d{7,14}$/.test(cleanPhone)) {
      setError("Please enter a valid phone number (7 to 14 digits).");
      return;
    }

    const cleanCompany = form.company.trim();
    if (!cleanCompany) {
      setError("Please enter your company name.");
      return;
    }
    if (cleanCompany.length > 100) {
      setError("Company name must be 100 characters or fewer.");
      return;
    }

    if (!form.service) {
      setError("Please select a service.");
      return;
    }
    if (form.service === "Something else" ? !form.customService.trim() : !form.subService) {
      setError(form.service === "Something else" ? "Please describe the service you need." : "Please select a focus area.");
      return;
    }

    const cleanMessage = form.message.trim();
    if (!cleanMessage) {
      setError("Please share a few project details.");
      return;
    }
    if (cleanMessage.length > 2000) {
      setError("Project details must be 2000 characters or fewer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await submitContactRequest({
        name: cleanName,
        email: cleanEmail,
        phone: `${countryCode} ${cleanPhone}`,
        company: cleanCompany,
        service: form.service,
        subService: form.customService.trim() || form.subService,
        message: cleanMessage,
      });

      setSubmitted(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError instanceof ApiClientError
        ? submitError.message
        : "Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ds-booking-page">
      <ServicePageHeader backHref="/" backLabel="Back to Home" />

      <main className="ds-booking-main">
        <section className="ds-booking-intro" aria-labelledby="booking-title">
          <span className="ds-booking-kicker">Contact our team</span>
          <h1 id="booking-title">Tell us about your next project.</h1>
          <p>
            Tell us about your marketing goals, website or digital project. We will review the details and discuss the next practical step.
          </p>
          <div className="ds-booking-contact-note">
            <span>Prefer a direct conversation?</span>
            {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
            {contactPhones.map(phone => <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>)}
          </div>
        </section>

        <section className="ds-booking-form-section" aria-labelledby="booking-form-title">
          <div className="ds-booking-form-heading">
            <span className="ds-booking-kicker">Start a conversation</span>
            <h2 id="booking-form-title">Share a little context.</h2>
            <p>Share your contact details and a short project brief. Required fields are marked.</p>
          </div>

          <form className="ds-booking-form" onSubmit={handleSubmit} noValidate>
            <div className="ds-booking-field-grid">
              <label>
                <span className="ds-booking-label">Full name <em aria-hidden="true">*</em></span>
                <input name="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} autoComplete="name" placeholder="Your full name" maxLength={60} required />
              </label>
              <label>
                <span className="ds-booking-label">Work email <em aria-hidden="true">*</em></span>
                <input name="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} autoComplete="email" placeholder="you@company.com" maxLength={100} required />
              </label>
              <label>
                <span className="ds-booking-label">Phone number <em aria-hidden="true">*</em></span>
                <div className="ds-phone-input-group">
                  <select
                    className="ds-phone-country-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country Code"
                  >
                    {countryCodes.map((item) => (
                      <option key={`${item.code}-${item.label}`} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{7,14}"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, ""))}
                    autoComplete="tel"
                    placeholder="7-14 digits"
                    maxLength={14}
                    required
                  />
                </div>
              </label>
              <label>
                <span className="ds-booking-label">Company <em aria-hidden="true">*</em></span>
                <input name="company" value={form.company} onChange={(event) => updateField("company", event.target.value)} autoComplete="organization" placeholder="Company name" maxLength={100} required />
              </label>
            </div>

            <label>
              <span className="ds-booking-label">What can we help with? <em aria-hidden="true">*</em></span>
              <select name="service" value={form.service} onChange={(event) => {
                setForm((current) => ({ ...current, service: event.target.value, subService: "", customService: "" }));
                setError("");
                setSubmitted(false);
              }} required>
                <option value="">Select a service</option>
                {serviceMenuGroups.map((group) => (
                  <option key={group.id} value={group.title}>{group.title}</option>
                ))}
                <option value="Something else">Something else</option>
              </select>
            </label>

            {form.service === "Something else" ? (
              <label>
                <span className="ds-booking-label">Tell us what you need <em aria-hidden="true">*</em></span>
                <input name="customService" value={form.customService} onChange={(event) => updateField("customService", event.target.value)} placeholder="Describe the service or outcome" maxLength={150} required />
              </label>
            ) : (
              <label>
                <span className="ds-booking-label">Focus area <em aria-hidden="true">*</em></span>
                <select name="subService" value={form.subService} onChange={(event) => updateField("subService", event.target.value)} disabled={!form.service} required>
                  <option value="">{form.service ? "Select a focus area" : "Select a service first"}</option>
                  {(serviceOptions[form.service] ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            )}

            <label>
              <span className="ds-booking-label">Project details <em aria-hidden="true">*</em></span>
              <textarea name="message" value={form.message} onChange={(event) => updateField("message", event.target.value)} rows={6} placeholder="What would you like to improve, launch, or automate?" maxLength={2000} required />
            </label>

            {error && <p className="ds-booking-form-message ds-booking-form-message--error" role="alert">{error}</p>}
            {submitted && <p className="ds-booking-form-message ds-booking-form-message--success" role="status">✓ Request received! We will review your details and get back to you shortly.</p>}

            <button type="submit" className="ds-booking-submit" disabled={loading}>
              {loading ? "Sending…" : <>Send request <span aria-hidden="true">↗</span></>}
            </button>
            <p className="ds-booking-privacy">Your details are used only to respond to this request.</p>
          </form>
        </section>
      </main>

      <AgencyFooter />
    </div>
  );
}
