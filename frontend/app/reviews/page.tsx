import type { Metadata } from "next";
import { pageMetadata } from "@/src/lib/seo";
import { ArrowUpRight } from "lucide-react";
import { ServicePageHeader } from "@/src/features/services/components/ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { serviceMenuGroups } from "@/src/features/services/data/services";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/reviews", "How We Work | HavocX Agency", "Learn how HavocX Agency approaches digital marketing, design, development and automation projects."); }


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
 return <div className="hx-subpage"><ServicePageHeader/><main>
  <section className="hx-subhero"><div className="hx-subcontainer"><span className="hx-subeyebrow">/ OUR APPROACH</span><h1>Practical work.<br/>Clear expectations.</h1><p>Every project starts with your business needs. We connect creative strategy, design and engineering around a defined scope.</p><div className="hx-subhero-meta"><span>HOW WE WORK</span><span>HAVOCX AGENCY</span></div></div></section>
  <section className="hx-subcontainer hx-capability-list"><div className="hx-subsection-head"><span>(01 / PROCESS)</span><h2>How we <em>work.</em></h2></div>{deliveryApproach.map((step,index)=><article className="hx-capability" key={step.title}><span>0{index+1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><ArrowUpRight size={28}/></article>)}</section>
  <section className="hx-subcta"><div className="hx-subcontainer"><span>/ LET&apos;S COLLABORATE</span><h2>Make your next<br/>idea count.</h2><p>Explore our services or tell us what you are planning.</p><a href="/book-a-demo">Discuss your project <ArrowUpRight size={21}/></a><nav aria-label="Service categories" className="hx-tags" style={{justifyContent:"start",marginTop:36}}>{serviceMenuGroups.map(group=><a href={`/services/${group.id}`} key={group.id}>{group.title} ↗</a>)}</nav></div></section>
 </main><AgencyFooter/></div>;
}
