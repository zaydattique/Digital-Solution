"use client";
import { createContext, useContext } from "react";
export type SiteValues = Record<string, string>;
const SiteContext = createContext<SiteValues>({});
export function SiteProvider({ settings, children }: { settings: SiteValues; children: React.ReactNode }) {
  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}
export function useSite() { return useContext(SiteContext); }
