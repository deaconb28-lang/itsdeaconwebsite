"use client";

import { createContext, useContext, useMemo, useState } from "react";

import {
  calcNapkin,
  DEFAULT_TABLE_PRICE,
  sanitiseTable,
  type NapkinFigures,
} from "@/lib/napkin";

type SiteState = {
  /** Raw digits as typed. Empty means "use the default". */
  table: string;
  setTable: (value: string) => void;
  figures: NapkinFigures;
};

const SiteStateContext = createContext<SiteState | null>(null);

/**
 * Holds the one number the napkin calculator and the contact form share.
 * Typing in either field moves both, and the carry-over panel with them.
 */
export function SiteStateProvider({ children }: { children: React.ReactNode }) {
  const [table, setTableRaw] = useState(String(DEFAULT_TABLE_PRICE));

  const value = useMemo<SiteState>(
    () => ({
      table,
      setTable: (next: string) => setTableRaw(sanitiseTable(next)),
      figures: calcNapkin(table),
    }),
    [table],
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
