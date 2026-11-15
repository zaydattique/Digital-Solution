"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";
import { serviceMenuGroups, getServiceItemHref } from "@/src/features/services/data/services";

type ServicePageHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export function ServicePageHeader({ backHref, backLabel = "Back to home" }: ServicePageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (menuOpen || servicesOpen)) {
        event.preventDefault();
        closeMenus();
        if (menuOpen) menuButtonRef.current?.focus();
        else servicesButtonRef.current?.focus();
      }
      if (event.key !== "Tab" || !menuOpen || !window.matchMedia("(max-width: 900px)").matches) return;
      const items = Array.from(headerRef.current?.querySelectorAll<HTMLElement>("a, button:not([disabled])") ?? [])
        .filter((item) => item.getClientRects().length > 0);
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenus();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen, servicesOpen]);

  useEffect(() => {
    if (!menuOpen || !window.matchMedia("(max-width: 900px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  return (
    <header className="hx-nav" ref={headerRef}>
      <a className="hx-nav-brand" href="/" aria-label="HavocX Agency homepage" onClick={closeMenus}>
        <Brand compact />
      </a>
      <nav id="hx-primary-nav" aria-label="Primary navigation" className={menuOpen ? "hx-nav-links is-open" : "hx-nav-links"}>
        <a href="/#work" onClick={closeMenus}>Work</a>
        <div className="hx-nav-dropdown">
          <button
            ref={servicesButtonRef}
            type="button"
            className="hx-services-trigger"
            aria-expanded={servicesOpen}
            aria-controls="hx-service-menu"
            onClick={() => setServicesOpen((current) => !current)}
          >
            Services <ChevronDown aria-hidden="true" size={15} />
          </button>
          <div id="hx-service-menu" className={servicesOpen ? "hx-mega is-open" : "hx-mega"}>
            {serviceMenuGroups.map((group) => (
              <div className="hx-mega-group" key={group.id}>
                <a className="hx-mega-title" href={`/services/${group.id}`} onClick={closeMenus}>
                  {group.title}<ArrowUpRight aria-hidden="true" size={15} />
                </a>
                {group.services.map((service) => (
                  <a href={getServiceItemHref(service, group.id)} key={service} onClick={closeMenus}>{service}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        {backHref && <a href={backHref} className="hx-context-back" onClick={closeMenus}>{backLabel}</a>}
        <a href="/#about" onClick={closeMenus}>Studio</a>
        <a href="/#approach" onClick={closeMenus}>Approach</a>
      </nav>
      <a className="hx-nav-cta" href="/book-a-demo" onClick={closeMenus}>
        Start a project <ArrowUpRight aria-hidden="true" size={18} />
      </a>
      <button
        ref={menuButtonRef}
        className="hx-menu"
        type="button"
        onClick={() => {
          setMenuOpen((current) => !current);
          setServicesOpen(false);
        }}
        aria-expanded={menuOpen}
        aria-controls="hx-primary-nav"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}
