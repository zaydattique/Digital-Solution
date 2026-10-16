import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { serviceMenuGroups } from "@/src/features/services/data/services";

export const metadata: Metadata = pageMetadata("/reviews", "How We Work | HavocX Agency", "Learn how HavocX Agency approaches digital marketing, design, development and automation projects.");

const deliveryApproach = [
  {
    title: "Understand the challenge",
    description: "We start with your goals, audience, existing channels and the problems you want to solve.",
  },
  {
    title: "Agree on the work",
    description: "Project priorities and deliverables are defined before we begin implementation.",
  },
  {
    title: "Review and refine",
    description: "We check the work against the agreed brief and review opportunities for improvement.",
  },
] as const;

/**
 * Keep the existing /reviews URL reachable. Customer testimonials are intentionally
 * not displayed until independently verified and cleared for publication.
 */
export default function ClientReviewsPage() {
  return (
    <div className="vx-reviews-page">
      <div className="vx-reviews-page-inner">
        <header className="vx-reviews-page-header">
          <Link href="/" className="vx-reviews-page-back">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to home</span>
          </Link>
          <span className="vx-reviews-page-eyebrow">Our approach</span>
          <h1 className="vx-reviews-page-title">Practical work, clear expectations.</h1>
          <p className="vx-reviews-page-subtitle">
            Every project starts with a conversation about what your business needs.
            Our services combine marketing, design and engineering around a defined scope.
          </p>
        </header>

        <section className="vx-reviews-full-grid" aria-labelledby="approach-heading">
          <h2 id="approach-heading" className="vx-reviews-page-subtitle">How an engagement works</h2>
          {deliveryApproach.map((step, index) => (
            <article className="vx-reviews-full-card" key={step.title}>
              <span className="vx-reviews-card-tag">Step {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </section>

        <section className="vx-reviews-page-cta" aria-labelledby="services-heading">
          <h2 id="services-heading">Explore our services</h2>
          <p>Find the support that fits your next marketing or digital project.</p>
          <ul>
            {serviceMenuGroups.map((group) => (
              <li key={group.id}>
                <Link href={`/services/${group.id}`}>{group.title} <ArrowRight size={15} aria-hidden="true" /></Link>
              </li>
            ))}
          </ul>
          <Link href="/book-a-demo">Discuss a project <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </div>
      <AgencyFooter />
    </div>
  );
}
