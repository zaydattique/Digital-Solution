import { ArrowUpRight, Compass } from "lucide-react";
import { ServicePageHeader } from "@/src/features/services/components/ServicePageHeader";
import { AgencyFooter } from "@/src/components/layout/AgencyFooter";

export default function NotFound() {
  return (
    <div className="hx-subpage">
      <ServicePageHeader />
      <main>
        <section className="hx-subhero">
          <div className="hx-subcontainer">
            <span className="hx-subeyebrow"><Compass aria-hidden="true" size={16} /> / 404 NOT FOUND</span>
            <h1>That page isn't here.</h1>
            <p>The link may have changed. You can return to our work or find the right service below.</p>
            <div className="hx-subhero-meta">
              <span>HAVOCX AGENCY</span>
              <a href="/">Return home <ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
          </div>
        </section>
        <section className="hx-subcontainer hx-capability-list" aria-label="Find your way">
          <div className="hx-subsection-head">
            <span>(01 / EXPLORE)</span>
            <h2>Find your <em>way.</em></h2>
          </div>
          <a className="hx-capability" href="/services/marketing-seo"><span>01</span><div><h3>Marketing & SEO</h3><p>Grow visibility and connect with the right audience.</p></div><ArrowUpRight aria-hidden="true" size={26} /></a>
          <a className="hx-capability" href="/services/design"><span>02</span><div><h3>Design & Experience</h3><p>Create purposeful experiences and recognizable brands.</p></div><ArrowUpRight aria-hidden="true" size={26} /></a>
          <a className="hx-capability" href="/book-a-demo"><span>03</span><div><h3>Start a project</h3><p>Tell us what you're looking to build.</p></div><ArrowUpRight aria-hidden="true" size={26} /></a>
        </section>
      </main>
      <AgencyFooter />
    </div>
  );
}
