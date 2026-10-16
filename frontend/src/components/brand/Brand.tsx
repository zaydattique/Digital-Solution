"use client";

import Image from "next/image";
import { useSiteIdentity } from "@/src/components/brand/SiteIdentityProvider";

type BrandProps = { compact?: boolean; light?: boolean };

export function Brand({ compact = false, light = false }: BrandProps) {
  const identity = useSiteIdentity();
  return (
    <span className={`vx-brand${compact ? " vx-brand--compact" : ""}`} aria-label={identity.name}>
      {identity.logoUrl ? (
        <Image
          className="vx-brand-logo"
          src={identity.logoUrl}
          alt={identity.name}
          width={320}
          height={80}
          unoptimized
          style={{ width: "auto", height: compact ? 36 : 46, objectFit: "contain" }}
        />
      ) : (
        <span className="vx-brand-wordmark" style={{ color: light ? "#050d20" : "#f6f9ff" }}>
          {identity.name}
        </span>
      )}
    </span>
  );
}
