"use client";
import { useSite } from "./SiteContext";

type BrandProps = { compact?: boolean; light?: boolean };
/** Uploaded artwork is selected through admin settings. No unapproved logo is manufactured. */
export function Brand({ compact = false, light = false }: BrandProps) {
  const site = useSite();
  const name = site["brand.name"] || "HavocX Agency";
  const logo = site["brand.logoUrl"];
  return (
    <span className={`vx-brand${compact ? " vx-brand--compact" : ""}`} style={{ display: "inline-flex", alignItems: "center", maxWidth: "100%" }}>
      {logo ? (
        // The approved logo URL is supplied from the authenticated CMS.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} style={{ height: compact ? 36 : 46, width: "auto", maxWidth: 250, objectFit: "contain" }} />
      ) : (
        <span style={{ color: light ? "#050d20" : "#f6f9ff", fontSize: compact ? 18 : 24, fontWeight: 900, letterSpacing: ".08em" }}>{name}</span>
      )}
    </span>
  );
}
