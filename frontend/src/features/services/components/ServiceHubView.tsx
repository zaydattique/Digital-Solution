import { ArrowUpRight } from "lucide-react";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { ServicePageHeader } from "./ServicePageHeader";
import type { HubPageConfig } from "@/src/features/services/types";
export function ServiceHubView({config}:{config:HubPageConfig}){
 const {eyebrow,heading,description,groupSlug,services,ctaHeading,ctaDescription,ctaButtonText}=config;
 return <div className="hx-subpage hx-capabilities"><ServicePageHeader backHref="/" backLabel="Back to home"/>
  <main><section className="hx-subhero"><div className="hx-subcontainer"><span className="hx-subeyebrow">/ HAVOCX AGENCY — {eyebrow}</span><h1>{heading}</h1><p>{description}</p><div className="hx-subhero-meta"><span>EXPLORE OUR CAPABILITIES</span><span>{String(services.length).padStart(2,"0")} / SPECIALIST SERVICES</span></div></div></section>
  <section className="hx-subcontainer hx-capability-list" aria-label="Specialist capabilities"><div className="hx-subsection-head"><span>(01 / CAPABILITIES)</span><h2>Find your <em>focus.</em></h2></div>
  {services.map((service,index)=><a className="hx-capability" href={`/services/${groupSlug}/${service.slug}`} key={service.slug}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{service.title}</h3><p>{service.shortDescription||service.description||service.headline}</p></div><ArrowUpRight aria-hidden="true" size={29}/></a>)}</section>
  <section className="hx-subcta"><div className="hx-subcontainer"><span>/ LET'S COLLABORATE</span><h2>{ctaHeading}</h2><p>{ctaDescription}</p><a href={`/book-a-demo?service=${encodeURIComponent(groupSlug)}`}>{ctaButtonText}<ArrowUpRight size={21}/></a></div></section></main><AgencyFooter/></div>;
}