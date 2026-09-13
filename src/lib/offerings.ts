/**
 * What Deacon sells, in one place.
 *
 * Two independent axes, not three bundled tiers. A visitor picks a build, then
 * adds a monthly plan or doesn't. The old structure was three cards that were
 * all the same $1,200 build differing only by the monthly attached, which made
 * the monthly look like something you chose *instead of* a cheaper build
 * rather than something you add to any of them.
 *
 * Every price on the site is a number in this file. The pricing cards render
 * it, the napkin calculator does arithmetic with it, and the structured data
 * quotes it — so a price is changed here once and the three cannot disagree.
 * Names and order live here too, because they are identical on both pitch
 * pages. The words live in each route's copy.ts, because a menu and a service
 * area are not the same thing. `offeringsFor` welds the two together, which is
 * what stops the pages drifting apart: there is no way to add a tier to one
 * page and forget the other.
 */

/** One purchasable thing, reduced to what the arithmetic needs. */
export type PriceOption = {
  id: string;
  /** How the option names itself in a sentence. */
  label: string;
  amount: number;
};

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/**
 * One ladder, each rung containing the one below it. The entry used to be a
 * written report about the site rather than work on it, which made the $300
 * a different kind of thing from the two above it and left a visitor comparing
 * a document to a website.
 */
export const BUILD_OPTIONS: readonly PriceOption[] = [
  { id: "refresh", label: "The Refresh", amount: 300 },
  { id: "rebuild", label: "The Rebuild + Refresh", amount: 1200 },
  { id: "redo", label: "The Complete Redo", amount: 2000 },
];

/**
 * "No plan" is a first-class option rather than an absence, because the whole
 * point of the split is that not buying a monthly is a choice you are allowed
 * to make. It carries an amount of 0 so the calculator needs no special case.
 */
export const PLAN_OPTIONS: readonly PriceOption[] = [
  { id: "none", label: "no plan", amount: 0 },
  { id: "care", label: "Care", amount: 75 },
  { id: "care-hosting", label: "Care + Hosting", amount: 200 },
];

/** What the napkin math opens on: the middle build and the cheaper plan. */
export const DEFAULT_BUILD_ID = "rebuild";
export const DEFAULT_PLAN_ID = "care";

export function optionById(
  options: readonly PriceOption[],
  id: string,
): PriceOption {
  return options.find((option) => option.id === id) ?? options[0];
}

export type Offering = {
  id: string;
  name: string;
  amount: number;
  /** Rendered as text, never an image. */
  price: string;
  priceNote: string;
  tagline?: string;
  /** A sentence before the list, where the list alone would not land. */
  blurb?: string;
  /** Set above the bullets rather than inside them: it points at another card. */
  leadIn?: string;
  features: readonly string[];
  /** Paragraphs after the list. */
  notes?: readonly string[];
  ctaLabel: string;
  featured?: boolean;
};

export type Offerings = {
  builds: readonly Offering[];
  plans: readonly Offering[];
  plansNote: string;
};

/** The per-audience half. Everything here is words; nothing here is a price. */
export type OfferingWords = {
  refresh: OfferingCopy;
  rebuild: OfferingCopy;
  redo: OfferingCopy;
  care: OfferingCopy;
  careHosting: OfferingCopy;
  plansNote: string;
};

const BUILD_CTA: Record<string, string> = {
  refresh: "Start a refresh",
  rebuild: "Start a build",
  redo: "Start a build",
};

/** The words half: everything an Offering has that is not a price or a name. */
export type OfferingCopy = Omit<
  Offering,
  "id" | "name" | "amount" | "price" | "priceNote" | "ctaLabel"
>;

function build(id: string, extra: OfferingCopy): Offering {
  const option = optionById(BUILD_OPTIONS, id);
  return {
    id: option.id,
    name: option.label,
    amount: option.amount,
    price: money(option.amount),
    priceNote: "one time",
    ctaLabel: BUILD_CTA[option.id],
    ...extra,
  };
}

function plan(id: string, extra: OfferingCopy): Offering {
  const option = optionById(PLAN_OPTIONS, id);
  return {
    id: option.id,
    name: option.label,
    amount: option.amount,
    price: money(option.amount),
    priceNote: "per month",
    ctaLabel: `Add ${option.label}`,
    ...extra,
  };
}

export function offeringsFor(words: OfferingWords): Offerings {
  return {
    builds: [
      build("refresh", words.refresh),
      build("rebuild", { ...words.rebuild, featured: true }),
      build("redo", words.redo),
    ],
    plans: [plan("care", words.care), plan("care-hosting", words.careHosting)],
    plansNote: words.plansNote,
  };
}

/** The anchor, which belongs to the Redesign specifically and to nothing else. */
export const AGENCY_ANCHOR = "$6,000–15,000";
