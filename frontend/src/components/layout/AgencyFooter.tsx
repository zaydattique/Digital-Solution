"use client";

import { MouseEvent, useState } from "react";
import { Linkedin, Instagram, Facebook, Globe2, Mail, Phone, ArrowUpRight } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";
import { useSite } from "@/src/components/brand/SiteContext";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";
import { claimMailSendPermission } from "@/src/lib/mailRateLimit";

export function AgencyFooter() {
  const [mailLimitMessage, setMailLimitMessage] = useState("");
  const site = useSite();

  const handleEmailClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const permission = claimMailSendPermission();
    if (!permission.allowed) {
      event.preventDefault();
      setMailLimitMessage(permission.message);
    }
  };

  return (
    <footer className="vx-agency-footer" id="contact">
      <div className="vx-agency-footer-inner">
        <div className="vx-agency-footer-grid">
          {/* Column 1: Contact Us & Brand & Social Icons */}
          <div className="vx-footer-col-contact">
            <div style={{ marginBottom: "18px" }}>
              <Brand />
            </div>
            <span className="lead-text">Have a project?</span>
            <h3 className="main-text">Contact us</h3>

            <div className="vx-footer-contact-info">
              {site["contact.email"] && <a href={`mailto:${site["contact.email"]}`} className="vx-footer-contact-link" onClick={handleEmailClick}><Mail size={16} /> {site["contact.email"]}</a>}
              {[site["contact.phone"], site["contact.phoneSecondary"]].filter(Boolean).map(phone => <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="vx-footer-contact-link"><Phone size={16} /> {phone}</a>)}
              {mailLimitMessage && <p role="status">{mailLimitMessage}</p>}
            </div>
            <div className="vx-footer-social-icons">
              {site["social.linkedin"] && <a href={site["social.linkedin"]} target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="LinkedIn"><Linkedin size={16} /></a>}
              {site["social.instagram"] && <a href={site["social.instagram"]} target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="Instagram"><Instagram size={16} /></a>}
              {site["social.facebook"] && <a href={site["social.facebook"]} target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="Facebook"><Facebook size={16} /></a>}
              {site["social.website"] && <a href={site["social.website"]} target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="Website"><Globe2 size={16} /></a>}
            </div>
          </div>

          {serviceMenuGroups.map((group) => (
            <div className="vx-footer-col" key={group.id}>
              <h4><a href={`/services/${group.id}`}>{group.title}</a></h4>
              <ul>
                {group.services.map((service) => (
                  <li key={service}>
                    <a href={getServiceItemHref(service, group.id)}>{service}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Bar */}
        <div className="vx-footer-copyright-bar">
          <span>© {new Date().getFullYear()} {site["brand.name"] || "HavocX Agency"}. All rights reserved.</span>
          <div className="vx-footer-legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/#top" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Back to top <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default AgencyFooter;
