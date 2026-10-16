"use client";

import { MouseEvent, useState } from "react";
import { Linkedin, Instagram, Facebook, Globe2, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useSiteIdentity } from "@/src/components/brand/SiteIdentityProvider";
import { Brand } from "@/src/components/brand/Brand";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";
import { claimMailSendPermission } from "@/src/lib/mailRateLimit";

export function AgencyFooter() {
  const [mailLimitMessage, setMailLimitMessage] = useState("");
  const identity = useSiteIdentity();

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
              {identity.email && (
                <a href={`mailto:${identity.email}`} className="vx-footer-contact-link" onClick={handleEmailClick}>
                  <Mail size={16} /> {identity.email}
                </a>
              )}
              {identity.phones.map((phone) => (
                <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} className="vx-footer-contact-link" key={phone}>
                  <Phone size={16} /> {phone}
                </a>
              ))}
              {!identity.email && !identity.phones.length && (
                <a href="/book-a-demo" className="vx-footer-contact-link">Discuss a project <ArrowUpRight size={16}/></a>
              )}
              {mailLimitMessage && <p role="status">{mailLimitMessage}</p>}
            </div>
            <div className="vx-footer-social-icons">
              {Object.entries(identity.socials).map(([network, url]) => {
                if (!/^https:\/\//.test(url)) return null;
                const icon = network.toLowerCase().includes("linkedin") ? <Linkedin size={16}/> :
                  network.toLowerCase().includes("instagram") ? <Instagram size={16}/> :
                  network.toLowerCase().includes("facebook") ? <Facebook size={16}/> : <Globe2 size={16}/>;
                return (
                  <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label={network}>
                    {icon}
                  </a>
                );
              })}
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
          <span>© {new Date().getFullYear()} {identity.name}. All rights reserved.</span>
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
