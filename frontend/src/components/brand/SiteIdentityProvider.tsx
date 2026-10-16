"use client";

import { createContext, useContext } from "react";
import type { SiteIdentity, HomeContent } from "@/src/lib/site-defaults";
import { bootstrapIdentity, bootstrapHome } from "@/src/lib/site-defaults";

type SiteState = { identity: SiteIdentity; home: HomeContent };
const SiteContext = createContext<SiteState>({ identity: bootstrapIdentity, home: bootstrapHome });
export function SiteIdentityProvider({ value, children }: { value: SiteState; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
export function useSiteIdentity() { return useContext(SiteContext).identity; }
export function useHomeContent() { return useContext(SiteContext).home; }
