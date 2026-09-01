"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Audience } from "@/lib/audience";
import { calcNapkin, sanitiseSpend, type NapkinFigures } from "@/lib/napkin";

type SiteState = {
  /** Raw digits as typed. Empty means "use the audience's default". */
  spend: string;
  setSpend: (value: string) => void;
  figures: NapkinFigures;
  audience: Audience;
};

const SiteStateContext = createContext<SiteState | null>(null);

/**
 * Holds the one number the napkin calculator and the contact form share.
 * Typing in either field moves both, and the carry-over panel with them.
 *
 * The audience rides along because every consumer of the figures also needs
 * the noun they are counted in.
 */
export function SiteStateProvider({
  audience,
  children,
}: {
  audience: Audience;
  children: React.ReactNode;
}) {
  const [spend, setSpendRaw] = useState(String(audience.units.defaultSpend));

  const value = useMemo<SiteState>(
    () => ({
      spend,
      setSpend: (next: string) => setSpendRaw(sanitiseSpend(next)),
      figures: calcNapkin(spend, audience.units),
      audience,
    }),
    [spend, audience],
  );

  return (
    <SiteStateContext.Provider value={value}>
      {children}
    </SiteStateContext.Provider>
  );
}

export function useSiteState(): SiteState {
  const context = useContext(SiteStateContext);
  if (!context) {
    throw new Error("useSiteState must be used inside <SiteStateProvider>");
  }
  return context;
}
