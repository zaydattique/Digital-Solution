"use client";
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, HelpCircle } from "lucide-react";
import type { ServiceDetail } from "@/src/features/services/types";
import { ServicePageHeader } from "./ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { useSite } from "@/src/components/brand/SiteContext";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";

export function ServiceDetailView({detail,heroImage: _heroImage}: {detail:ServiceDetail;heroImage?:string}) {
 const site=useSite();
 const key=`service.${detail.slug}`;
 const publishedTitle=site[`${key}.title`]||detail.title;
 const publishedHero=site[`${key}.heroSubtitle`]||detail.heroSubtitle||detail.headline;
 const publishedSummary=site[`${key}.shortDescription`]||detail.shortDescription||detail.description;
 const publishedImage=site[`${key}.imageUrl`]||_heroImage;
 const currentGroup=serviceMenuGroups.find(group=>group.services.some(name=>getServiceItemHref(name,group.id).endsWith(`/${detail.slug}`)));
 const serviceLabel=currentGroup?.services.find(name=>getServiceItemHref(name,currentGroup.id).endsWith(`/${detail.slug}`));
 const contactHref = currentGroup ? `/book-a-demo?service=${encodeURIComponent(currentGroup.id)}${serviceLabel?`&focus=${encodeURIComponent(serviceLabel)}`:""}`:"/book-a-demo";
 const relatedServices = currentGroup?.services.filter(service=>service!==serviceLabel).slice(0,4)??[];
 useEffect(()=>{document.documentElement.classList.add("ds-motion-ready");return()=>document.documentElement.classList.remove("ds-motion-ready")},[]);
 return <div className="hx-subpage hx-service-detail"><ServicePageHeader/>
 <main>
 <section className="hx-subhero"><div className="hx-subcontainer">
  <span className="hx-subeyebrow">/ {currentGroup?.title||"Agency service"}</span>
  <h1>{publishedTitle}</h1>
  <p>{publishedHero||publishedSummary}</p>
  {publishedSummary && <p style={{marginTop:18,maxWidth:750}}>{publishedSummary}</p>}
  <div className="hx-subhero-meta"><span>CREATED FOR YOUR BUSINESS</span><a href={contactHref}>Discuss your project ↗</a></div>
 </div></section>
 <section id="deliverables" className="hx-subcontainer hx-capability-list"><div className="hx-subsection-head"><span>(01 / WHAT WE DELIVER)</span><h2>Clear outcomes.<br/><em>Better work.</em></h2></div>
 {detail.deliverables.map((item,index)=><article className="hx-capability" key={item.title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div><ArrowUpRight size={28}/></article>)}
 </section>
 <section className="hx-services"><div className="hx-container"><div className="hx-section-eyebrow"><span>(02 / PROCESS)</span><span>How we work</span></div><div className="hx-section-title"><h2>From idea<br/>to <em>impact.</em></h2><p>Every step built around your goals.</p></div>
 {detail.workflowSteps.map((step,index)=><article key={step.step} className="hx-service-item"><div className="hx-service-heading"><span className="hx-service-index">{String(index+1).padStart(2,"0")}</span><h3>{step.title}</h3><ArrowUpRight size={25}/></div><div className="hx-service-body"><p>{step.desc}</p></div></article>)}</div></section>
 <section className="hx-subcontainer hx-capability-list"><div className="hx-subsection-head"><span>(03 / FOUNDATIONS)</span><h2>Built with <em>care.</em></h2></div><div className="hx-tags" style={{justifyContent:"start",marginBottom:90}}>{detail.techStack.map(item=><span key={item}>{item}</span>)}</div>
 <div className="hx-subsection-head"><span>(04 / QUESTIONS)</span><h2>Good to <em>know.</em></h2></div>
 {detail.faq.map(item=><details key={item.question} className="hx-faq"><summary><HelpCircle size={17}/>{item.question}<ArrowUpRight size={17}/></summary><p>{item.answer}</p></details>)}
 </section>
 {relatedServices.length>0&&<section className="hx-subcontainer hx-capability-list"><div className="hx-subsection-head"><span>(05 / EXPLORE)</span><h2>More <em>expertise.</em></h2></div>{relatedServices.map((service,index)=><a className="hx-capability" key={service} href={getServiceItemHref(service,currentGroup?.id??"")}><span>0{index+1}</span><div><h3>{service}</h3></div><ArrowRight size={24}/></a>)}</section>}
 <section className="hx-subcta"><div className="hx-subcontainer"><span>/ YOUR NEXT CHAPTER</span><h2>Ready to make<br/>something better?</h2><p>Tell us what your business needs. We will define the right next step together.</p><a href={contactHref}>Discuss your project <ArrowUpRight size={22}/></a></div></section>
 </main><AgencyFooter/></div>;
}
