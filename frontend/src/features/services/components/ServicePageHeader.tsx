"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronLeft, Menu, X } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";

type ServicePageHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export function ServicePageHeader({
  backHref = "/",
  backLabel = "Back to Home",
}: ServicePageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ds-service-header-wrap">
      <header className="ds-service-header">
        <a href="/" aria-label="HavocX Agency home">
          <Brand compact />
        </a>

        <nav aria-label="Service page navigation" className="ds-service-header-nav">
          <a href={backHref} className="ds-service-header-back">
            <ChevronLeft size={15} /> {backLabel}
          </a>
          <a href="/#expertise">Services</a>
        </nav>

        <div>
          <a href="/book-a-demo" className="ds-service-header-cta">
            Discuss a project <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="ds-service-menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav aria-label="Mobile service page navigation" className="ds-service-mobile-nav">
          <a href={backHref} onClick={() => setMenuOpen(false)}>{backLabel}</a>
          <a href="/#expertise" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/book-a-demo" onClick={() => setMenuOpen(false)}>Discuss a project</a>
        </nav>
      )}
    </div>
  );
}
