"use client";

import { MouseEvent, useState } from "react";
import { Linkedin, Instagram, Facebook, Globe2, Mail, Phone, ArrowUpRight } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";
import { claimMailSendPermission } from "@/src/lib/mailRateLimit";

export function AgencyFooter() {
  const [mailLimitMessage, setMailLimitMessage] = useState("");

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
              <a href="mailto:dsolutions555@gmail.com" className="vx-footer-contact-link" onClick={handleEmailClick}>
                <Mail size={16} /> dsolutions555@gmail.com
              </a>
              <a href="tel:+923096548143" className="vx-footer-contact-link">
                <Phone size={16} /> +92 309 6548143
              </a>
              <a href="tel:+923293269494" className="vx-footer-contact-link">
                <Phone size={16} /> +92 329 3269494
              </a>
              {mailLimitMessage && <p role="status">{mailLimitMessage}</p>}
            </div>

            <div className="vx-footer-social-icons">
              <a href="https://www.linkedin.com/in/abdul-mannan-butt-0382a1379" target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="https://www.instagram.com/dsolution555/" target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61594256333150" target="_blank" rel="noopener noreferrer" className="vx-footer-social-btn" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="/" className="vx-footer-social-btn" aria-label="Website">
                <Globe2 size={16} />
              </a>
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
          <span>© {new Date().getFullYear()} Digital Solutions. All rights reserved.</span>
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
