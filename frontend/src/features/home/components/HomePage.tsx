"use client";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useSite } from "@/src/components/brand/SiteContext";
import { ServicePageHeader } from "@/src/features/services/components/ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";

const defaultProjects = [
  { number: "01", name: "D Square Clinic", discipline: "Healthcare / Web experience", image: "/assets/images/projects/dsquare-landing.jpg", href: "https://dsquareclinic.com/" },
  { number: "02", name: "Alooverse", discipline: "Hospitality / Digital commerce", image: "https://alooverse.alooverse.workers.dev/hero/potato-landed.webp", href: "https://alooverse.alooverse.workers.dev/" },
  { number: "03", name: "T.E.G Cleaning", discipline: "Local services / Digital redesign", image: "/assets/images/services/menu-development.jpg", href: "https://tegcarpetfurniturecleaning.com/" },
];
const principles = [
  { number: "01", title: "Discover", body: "Understand the business, the audience, and where an experience can do more." },
  { number: "02", title: "Define", body: "Build the strategy and creative direction around measurable priorities." },
  { number: "03", title: "Design & build", body: "Create thoughtful visuals, digital products and connected experiences." },
  { number: "04", title: "Evolve", body: "Launch carefully, learn from real use, and keep improving." },
];
export default function HomePage() {
  const site = useSite();
  const heroTitle = site["home.heroTitle"] || "Make your brand impossible to miss.";
  const heroDescription = site["home.heroDescription"] || "Digital strategy, distinctive design and considered engineering for brands ready to move forward.";
  const heroImage = site["home.heroImageUrl"];
  const heroVideo = site["home.heroVideoUrl"];
  const projects = defaultProjects.map((project,index) => ({ ...project, name: site[`project.${index+1}.title`] || project.name, image: site[`project.${index+1}.imageUrl`] || project.image, href: site[`project.${index+1}.href`] || project.href, discipline: site[`project.${index+1}.discipline`] || project.discipline }));
  return <div className="hx-editorial" id="top">
    <ServicePageHeader />
    <main>
      <section className="hx-hero" aria-labelledby="hx-hero-title">
        <div className="hx-hero-media" aria-hidden="true">
          {heroVideo ? <video autoPlay loop muted playsInline poster={heroImage || undefined}><source src={heroVideo} /></video> : heroImage ? <div className="hx-cover" style={{backgroundImage:`url("${heroImage.replace(/["\\]/g, "")}")`}} /> : <div className="hx-hero-abstract"><span className="hx-orbit hx-orbit-one" /><span className="hx-orbit hx-orbit-two" /><span className="hx-orbit hx-orbit-three" /></div>}
        </div>
        <div className="hx-hero-content">
          <p className="hx-kicker"><span className="hx-kicker-dot" /> Independent digital & creative agency <span className="hx-kicker-index">/ {new Date().getFullYear()}</span></p>
          <h1 id="hx-hero-title">{heroTitle}</h1>
          <div className="hx-hero-bottom"><p>{heroDescription}</p><a className="hx-circle-link" href="#work" aria-label="Explore our work"><ArrowDownRight size={28} /></a></div>
        </div>
        <div className="hx-hero-bottomline"><span>STRATEGY — DESIGN — TECHNOLOGY</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <section className="hx-cinema-interlude" aria-label="Our creative perspective"><div className="hx-interlude-art" aria-hidden="true"><span className="hx-art-disc"/><span className="hx-art-wave"/></div><div className="hx-interlude-copy"><span>AN INDEPENDENT CREATIVE STUDIO</span><strong>DESIGN.<br/>DEVELOP.<br/><i>DISRUPT.</i></strong></div></section><section className="hx-intro hx-container" id="about">
        <div className="hx-section-eyebrow"><span>(01 / THE STUDIO)</span><span>What makes us different</span></div>
        <div className="hx-intro-grid"><h2>Not more noise.<br /><em>More impact.</em></h2><div><p>We connect strategy, design and engineering to make ambitious ideas feel unmistakably real. Built for people, designed to perform.</p><a className="hx-text-link" href="#expertise">Explore what we do <ArrowUpRight size={19}/></a></div></div>
      </section>
      <section className="hx-work hx-container" id="work">
        <div className="hx-section-eyebrow"><span>(02 / SELECTED WORK)</span><span>Ideas made tangible</span></div>
        <div className="hx-section-title"><h2>Made to <em>matter.</em></h2><p>A selection of real digital experiences and work.</p></div>
        <div className="hx-projects">{projects.map((project, index) => <a className={index === 0 ? "hx-project hx-project-featured" : "hx-project"} href={project.href} key={project.number} target="_blank" rel="noopener noreferrer"><div className="hx-project-image"><img src={project.image} alt={project.name + " project preview"} loading="lazy" width={900} height={900} decoding="async" /><span className="hx-project-open"><ArrowUpRight size={24}/></span></div><div className="hx-project-meta"><span>{project.number} / {project.discipline}</span><h3>{project.name}</h3><ArrowUpRight size={22}/></div></a>)}</div>
      </section>
      <section className="hx-services" id="expertise"><div className="hx-container">
        <div className="hx-section-eyebrow"><span>(03 / EXPERTISE)</span><span>Connected capabilities</span></div>
        <div className="hx-section-title"><h2>Everything <em>connected.</em></h2><p>From the first idea to the finished experience.</p></div>
        <div className="hx-service-list">{serviceMenuGroups.map((group, index)=><div className="hx-service-item" key={group.id}><a href={`/services/${group.id}`} className="hx-service-heading"><span className="hx-service-index">0{index + 1}</span><h3>{group.title}</h3><ArrowUpRight size={27}/></a><div className="hx-service-body"><p>{group.description}</p><div className="hx-tags">{group.services.map(s=><a href={getServiceItemHref(s,group.id)} key={s}>{s} ↗</a>)}</div></div></div>)}</div>
      </div></section>
      <section className="hx-process hx-container" id="approach"><div className="hx-section-eyebrow"><span>(04 / OUR APPROACH)</span><span>How we create</span></div><div className="hx-process-grid"><div><h2>Good work<br />starts with <em>clarity.</em></h2><p>Our process is collaborative, intentional and built around what your business actually needs.</p></div><div className="hx-steps">{principles.map(step=><div className="hx-step" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div></div></section>
      <section className="hx-cta"><div className="hx-container"><p className="hx-kicker">/ YOUR NEXT CHAPTER</p><h2>Have something<br /><em>in mind?</em></h2><a href="/book-a-demo">Start a conversation <ArrowUpRight size={24}/></a><span className="hx-cta-glow" aria-hidden="true" /></div></section>
    </main>
    <AgencyFooter />
  </div>;
}