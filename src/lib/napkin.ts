/**
 * The napkin math. Every figure derives from a single number — what an average
 * table, or customer, spends — so the calculator and the contact form's
 * carry-over panel always agree.
 *
 * The nouns come from the audience; the arithmetic does not. Nor do the prices:
 * the build and the monthly are now both choices the reader makes, and both
 * come from `offerings.ts`, so there is no price written down in this file for
 * the pricing section to drift away from.
 */

import type { Units } from "./audience";
import {
  BUILD_OPTIONS,
  DEFAULT_BUILD_ID,
  DEFAULT_PLAN_ID,
  money,
  optionById,
  PLAN_OPTIONS,
  type PriceOption,
} from "./offerings";

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
] as const;

/** Two extra a week, expressed as a month. 4.33 weeks per month. */
const PER_WEEK = 2;
const WEEKS_PER_MONTH = 4.33;

/**
 * Below this, "one X a month" is no longer a fair description of the plan.
 * 0.9 rather than 1 so the restaurant default ($70 a table against the $75
 * plan, ratio 1.07) reads exactly as it always has.
 */
const ROUNDS_TO_ONE = 0.9;

/** Which build and which monthly the sums are being done for. */
export type NapkinChoice = { build: PriceOption; plan: PriceOption };

export const DEFAULT_CHOICE: NapkinChoice = {
  build: optionById(BUILD_OPTIONS, DEFAULT_BUILD_ID),
  plan: optionById(PLAN_OPTIONS, DEFAULT_PLAN_ID),
};

/**
 * Resolves two ids into a choice.
 *
 * Falls back to the default rather than to the first option, because this also
 * resolves ids that arrived over the wire: an enquiry posted by a cached bundle
 * that predates the dropdowns carries no ids at all, and it should read in the
 * inbox the way the page read before they existed, not as the cheapest thing
 * on the menu.
 */
export function choiceFrom(buildId: string, planId: string): NapkinChoice {
  return {
    build:
      BUILD_OPTIONS.find((option) => option.id === buildId) ??
      DEFAULT_CHOICE.build,
    plan:
      PLAN_OPTIONS.find((option) => option.id === planId) ?? DEFAULT_CHOICE.plan,
  };
}

export type NapkinFigures = {
  /** The price actually used for the sums, after falling back to the default. */
  price: number;
  /** What was chosen, echoed back so callers need not re-resolve it. */
  choice: NapkinChoice;
  /** e.g. "$1,200" */
  build: string;
  /** e.g. "$75", or "" when there is no plan. */
  plan: string;
  /** e.g. "$600" */
  monthly: string;
  /** e.g. "month three" */
  payback: string;
  /** e.g. "about $500" */
  surplus: string;
  /** e.g. "one table a month", "less than one customer a month", or "" */
  care: string;
};

/** Strips everything but digits and caps at three characters. */
export function sanitiseSpend(raw: string): string {
  return raw.replace(/[^0-9]/g, "").slice(0, 3);
}

export function calcNapkin(
  spend: string,
  units: Units,
  choice: NapkinChoice = DEFAULT_CHOICE,
): NapkinFigures {
  const parsed = Number.parseInt(sanitiseSpend(spend), 10);
  const price = parsed > 0 ? parsed : units.defaultSpend;

  // Rounded to the nearest $50 — this is a napkin, not an invoice.
  const monthly = Math.round((PER_WEEK * price * WEEKS_PER_MONTH) / 50) * 50;
  const net = monthly - choice.plan.amount;
  const months = net > 0 ? Math.ceil(choice.build.amount / net) : 0;

  let payback: string;
  if (months > 0 && months <= 12) {
    payback = `month ${WORDS[months]}`;
  } else if (months > 12) {
    payback = `month ${months}`;
  } else {
    payback = "the first month";
  }

  return {
    price,
    choice,
    build: money(choice.build.amount),
    plan: choice.plan.amount > 0 ? money(choice.plan.amount) : "",
    monthly: money(monthly),
    payback,
    surplus: net > 0 ? `about ${money(Math.round(net / 100) * 100)}` : "not yet",
    care: careLine(price, units, choice.plan.amount),
  };
}

/**
 * What the monthly plan costs, counted in the visitor's own unit.
 *
 * This used to clamp the count up to one, which is fine at a $70 table and a
 * lie at a $250 job: it told an owner a $75 plan costs them $250 of work a
 * month. Where one unit already covers the plan outright, say so — it is both
 * true and the better line.
 *
 * With no plan chosen there is no line to draw, and the row disappears rather
 * than reading "zero tables a month".
 */
function careLine(price: number, units: Units, plan: number): string {
  if (plan <= 0) return "";
  const ratio = plan / price;
  if (ratio < ROUNDS_TO_ONE) return `less than one ${units.one} a month`;
  const count = Math.round(ratio);
  return count === 1
    ? `one ${units.one} a month`
    : `${count} ${units.many} a month`;
}
