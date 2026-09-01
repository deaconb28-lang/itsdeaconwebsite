/**
 * The two readers, and only what actually differs between them.
 *
 * Mechanics and nouns live here — the numbers the napkin math starts from, the
 * words a form labels its fields with, the person the audit is talking about.
 * Sentences do not. A section's prose belongs in the section that says it, or
 * this file quietly becomes a CMS and the copy stops being anybody's.
 *
 * The test: if a value would ever want a <span> in it, a second sentence, or an
 * em dash mid-clause, it is prose and it does not go here.
 *
 * Both audiences sit side by side on purpose. Divergence should be visible.
 */

export type AudienceId = "restaurants" | "small-business";

/** The nouns every napkin figure is phrased with. */
export type Units = {
  /** "table" | "customer" */
  one: string;
  /** "tables" | "customers" */
  many: string;
  /** "Two extra tables a week" — the cadence, capitalised for a heading. */
  cadence: string;
  /** Lower-cased for mid-sentence use. */
  cadenceLower: string;
  /** What the calculator starts at, in dollars. */
  defaultSpend: number;
  /** "What an average table spends" */
  spendLabel: string;
};

export type Audience = {
  id: AudienceId;
  path: string;
  /** The business, as the copy addresses it: "restaurant" | "business". */
  noun: string;
  /** The person on the other side of the screen: "diner" | "customer". */
  reader: string;
  /** Plural, sentence-initial: "Diners" | "Customers". */
  readers: string;
  units: Units;
  /** The made-up business in the before/after. */
  demoAddress: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    notesPlaceholder: string;
  };
  lookupPlaceholder: string;
};

export const RESTAURANTS: Audience = {
  id: "restaurants",
  path: "/restaurants",
  noun: "restaurant",
  reader: "diner",
  readers: "Diners",
  units: {
    one: "table",
    many: "tables",
    cadence: "Two extra tables a week",
    cadenceLower: "two extra tables a week",
    defaultSpend: 70,
    spendLabel: "What an average table spends",
  },
  demoAddress: "harborandvine.com",
  form: {
    nameLabel: "Restaurant name",
    namePlaceholder: "Harbor & Vine",
    emailPlaceholder: "you@restaurant.com",
    notesPlaceholder: "Nobody can find our menu on a phone.",
  },
  lookupPlaceholder: "yourrestaurant.com",
};

export const SMALL_BUSINESS: Audience = {
  id: "small-business",
  path: "/small-business",
  noun: "business",
  reader: "customer",
  readers: "Customers",
  units: {
    one: "customer",
    many: "customers",
    cadence: "Two extra customers a week",
    cadenceLower: "two extra customers a week",
    defaultSpend: 120,
    spendLabel: "What an average customer spends",
  },
  demoAddress: "ridgelineplumbing.com",
  form: {
    nameLabel: "Business name",
    namePlaceholder: "Ridgeline Plumbing",
    emailPlaceholder: "you@yourbusiness.com",
    notesPlaceholder: "We come up third and the other two look better.",
  },
  lookupPlaceholder: "yourbusiness.com",
};

const BY_ID: Record<AudienceId, Audience> = {
  restaurants: RESTAURANTS,
  "small-business": SMALL_BUSINESS,
};

/**
 * Resolves an audience id that arrived over the wire.
 *
 * Defaults to restaurants rather than rejecting: a visitor holding a cached
 * bundle from before the second page existed posts no id at all, and losing
 * their enquiry over a missing field would be the worst possible trade.
 */
export function audienceFrom(raw: unknown): Audience {
  return typeof raw === "string" && raw in BY_ID
    ? BY_ID[raw as AudienceId]
    : RESTAURANTS;
}
