/**
 * The napkin math. Every figure derives from a single number — what an average
 * table, or customer, spends — so the calculator and the contact form's
 * carry-over panel always agree.
 *
 * The nouns come from the audience; the arithmetic and the prices do not. The
 * build is $1,200 and the care plan $75 whoever is reading.
 */

import type { Units } from "./audience";

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

export const BUILD_PRICE = 1200;
export const CARE_MONTHLY = 75;

/** Two extra a week, expressed as a month. 4.33 weeks per month. */
const PER_WEEK = 2;
const WEEKS_PER_MONTH = 4.33;

/**
 * Below this, "one X a month" is no longer a fair description of a $75 plan.
 * 0.9 rather than 1 so the restaurant default ($70 a table, ratio 1.07) reads
 * exactly as it always has.
 */
const ROUNDS_TO_ONE = 0.9;

export type NapkinFigures = {
  /** The price actually used for the sums, after falling back to the default. */
  price: number;
  /** e.g. "$600" */
  monthly: string;
  /** e.g. "month three" */
  payback: string;
  /** e.g. "about $500" */
  surplus: string;
  /** e.g. "one table a month", or "less than one customer a month" */
  care: string;
};

function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Strips everything but digits and caps at three characters. */
export function sanitiseSpend(raw: string): string {
  return raw.replace(/[^0-9]/g, "").slice(0, 3);
}

export function calcNapkin(spend: string, units: Units): NapkinFigures {
  const parsed = Number.parseInt(sanitiseSpend(spend), 10);
  const price = parsed > 0 ? parsed : units.defaultSpend;

  // Rounded to the nearest $50 — this is a napkin, not an invoice.
  const monthly = Math.round((PER_WEEK * price * WEEKS_PER_MONTH) / 50) * 50;
  const net = monthly - CARE_MONTHLY;
  const months = net > 0 ? Math.ceil(BUILD_PRICE / net) : 0;

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
    monthly: money(monthly),
    payback,
    surplus: net > 0 ? `about ${money(Math.round(net / 100) * 100)}` : "not yet",
    care: careLine(price, units),
  };
}

/**
 * What the care plan costs, counted in the visitor's own unit.
 *
 * This used to clamp the count up to one, which is fine at a $70 table and a
 * lie at a $250 job: it told an owner a $75 plan costs them $250 of work a
 * month. Where one unit already covers the plan outright, say so — it is both
 * true and the better line.
 */
function careLine(price: number, units: Units): string {
  const ratio = CARE_MONTHLY / price;
  if (ratio < ROUNDS_TO_ONE) return `less than one ${units.one} a month`;
  const count = Math.round(ratio);
  return count === 1
    ? `one ${units.one} a month`
    : `${count} ${units.many} a month`;
}
