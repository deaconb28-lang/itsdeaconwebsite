"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Audience } from "@/lib/audience";
import {
  calcNapkin,
  choiceFrom,
  sanitiseSpend,
  type NapkinFigures,
} from "@/lib/napkin";
import { DEFAULT_BUILD_ID, DEFAULT_PLAN_ID } from "@/lib/offerings";

type SiteState = {
  /** Raw digits as typed. Empty means "use the audience's default". */
  spend: string;
  setSpend: (value: string) => void;
  /** Which build the napkin math is being done for. */
  buildId: string;
  setBuildId: (value: string) => void;
  /** Which monthly plan, "none" included. */
  planId: string;
  setPlanId: (value: string) => void;
  figures: NapkinFigures;
  audience: Audience;
  /** The pricing card whose CTA was clicked, if one was. */
  tier: string;
  setTier: (value: string) => void;
};

const SiteStateContext = createContext<SiteState | null>(null);

/**
 * Holds what the napkin calculator and the contact form share: the one number
 * typed into either field, the build and plan the sums are for, and the
 * pricing card the visitor came down the page from. Moving any of them moves
 * the carry-over panel too.
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
  const [buildId, setBuildId] = useState(DEFAULT_BUILD_ID);
  const [planId, setPlanId] = useState(DEFAULT_PLAN_ID);
  const [tier, setTier] = useState("");

  const value = useMemo<SiteState>(
    () => ({
      spend,
      setSpend: (next: string) => setSpendRaw(sanitiseSpend(next)),
      buildId,
      setBuildId,
      planId,
      setPlanId,
      figures: calcNapkin(spend, audience.units, choiceFrom(buildId, planId)),
      audience,
      tier,
      setTier,
    }),
    [spend, buildId, planId, tier, audience],
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
