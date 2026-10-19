"use client";

import { useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import type { ServiceDetail } from "@/src/features/services/types";
import { ServiceDeliverables, ServiceTimeline } from "./ServiceContent";
import { ServicePageHeader } from "./ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { ResponsiveImage } from "@/src/components/ui/ResponsiveImage";
import { useSite } from "@/src/components/brand/SiteContext";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";

type ServiceDetailViewProps = { detail: ServiceDetail; heroImage?: string };

export function ServiceDetailView({ detail, heroImage = "/assets/images/home/hero-workflow.jpg" }: ServiceDetailViewProps) {
  const site = useSite();
  const key = `service.${detail.slug}`;
  const publishedTitle = site[`${key}.title`] || detail.title;
  const publishedHero = site[`${key}.heroSubtitle`] || detail.heroSubtitle || detail.headline;
  const publishedSummary = site[`${key}.shortDescription`] || detail.shortDescription || detail.description;
  const publishedImage = site[`${key}.imageUrl`] || heroImage;
  const currentGroup = serviceMenuGroups.find((group) =>
    group.services.some((name) => getServiceItemHref(name, group.id).endsWith(`/${detail.slug}`)),
  );
  const serviceLabel = currentGroup?.services.find((name) =>
    getServiceItemHref(name, currentGroup.id).endsWith(`/${detail.slug}`),
  );
  const contactHref = currentGroup
    ? `/book-a-demo?service=${encodeURIComponent(currentGroup.id)}${serviceLabel ? `&focus=${encodeURIComponent(serviceLabel)}` : ""}`
    : "/book-a-demo";
  const relatedServices = currentGroup?.services.filter((service) => service !== serviceLabel).slice(0, 4) ?? [];

  useEffect(() => {
    document.documentElement.classList.add("ds-motion-ready");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-service-reveal]"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ds-services-page">
      <ServicePageHeader backHref="/#services" backLabel="Back to Services" />

      <section className="ds-service-detail-hero" data-service-reveal>
        <div className="ds-service-hero-media" aria-hidden="true">
          <ResponsiveImage source={publishedImage} widths={[480, 768, 1280]} sizes="100vw" alt="" loading="eager" fetchPriority="high" decoding="sync" />
        </div>
        <div className="ds-service-detail-hero-inner">
          <span className="ds-service-kicker">{detail.eyebrow || "Agency service"}</span>
          <h1>{publishedTitle}</h1>
          <p className="ds-service-hero-lede">{publishedHero}</p>
          <p className="ds-service-hero-description">{publishedSummary}</p>
          <div className="ds-service-actions">
            <a href={contactHref} className="ds-service-primary">Discuss your project <ArrowRight size={16} /></a>
            <a href="#deliverables" className="ds-service-secondary">View deliverables</a>
          </div>
        </div>
      </section>

      <section id="deliverables" className="ds-service-section" data-service-reveal>
        <div className="ds-service-section-heading">
          <div>
            <span className="ds-service-section-kicker">Scope of work</span>
            <h2>Clear outputs. Built to last.</h2>
          </div>
          <p className="ds-service-section-intro">We turn the brief into practical systems, documented decisions, and a delivery handover your team can confidently run.</p>
        </div>
        <ServiceDeliverables items={detail.deliverables} />
      </section>

      <section className="ds-service-section ds-service-section--wide" data-service-reveal>
        <div className="ds-service-section-heading">
          <div>
            <span className="ds-service-section-kicker">Delivery approach</span>
            <h2>A clear process from brief to delivery.</h2>
          </div>
          <p className="ds-service-section-intro">A focused process keeps delivery aligned, testable, and ready for the realities of production.</p>
        </div>
        <ServiceTimeline steps={detail.workflowSteps} />
      </section>

      <section className="ds-service-section" data-service-reveal>
        <div className="ds-service-split">
          <div>
            <span className="ds-service-section-kicker">Tools and foundations</span>
            <h2>Practical tools for your project.</h2>
            <div className="ds-service-tech-grid">
              {detail.techStack.map((tech, index) => (
                <span key={tech} style={{ animationDelay: `${index * 60}ms` }}>
                  <small>{String(index + 1).padStart(2, "0")}</small>{tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="ds-service-section-kicker">Common questions</span>
            <h2>What to know before we begin.</h2>
            <div className="ds-service-faq" aria-label="Frequently asked questions">
              {detail.faq.map((item) => (
                <details key={item.question} className="ds-service-faq-item">
                  <summary className="ds-service-faq-trigger">
                    <span><HelpCircle size={15} aria-hidden="true" /> {item.question}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </summary>
                  <p className="ds-service-faq-answer">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ds-service-section" aria-labelledby="related-services-heading">
        <div className="ds-service-section-heading">
          <div>
            <span className="ds-service-section-kicker">Explore more services</span>
            <h2 id="related-services-heading">Find the right support for your project.</h2>
          </div>
          <p className="ds-service-section-intro">Explore related capabilities or contact our team to discuss your goals.</p>
        </div>
        <nav aria-label="Related services and categories">
          <div className="ds-service-hub-grid">
            {relatedServices.map((service) => (
              <a className="ds-service-hub-card" key={service} href={getServiceItemHref(service, currentGroup?.id ?? "")}>
                <h3>{service}</h3>
                <span className="ds-service-hub-card-link">Explore service <ArrowRight size={15} aria-hidden="true" /></span>
              </a>
            ))}
          </div>
          <p className="ds-service-section-intro">
            {serviceMenuGroups.map((group, index) => (
              <span key={group.id}>
                {index > 0 ? " · " : ""}
                <a href={`/services/${group.id}`}>{group.title}</a>
              </span>
            ))}
          </p>
        </nav>
      </section>

      <section className="ds-service-cta" data-service-reveal>
        <div>
          <h2>Need help with {detail.title.toLowerCase()}?</h2>
          <p>Talk with our team about the right scope, sequence, and next step for your team.</p>
        </div>
        <a href={contactHref} className="ds-service-primary">Discuss your project <ArrowUpRight size={16} /></a>
      </section>

      <AgencyFooter />
    </div>
  );
}
