/**
 * The napkin math from section 10. Every figure on the page derives from a
 * single number — what an average table spends — so the calculator and the
 * contact form's carry-over panel always agree.
 */

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

export const DEFAULT_TABLE_PRICE = 70;
export const BUILD_PRICE = 1200;
export const CARE_MONTHLY = 75;

/** Two extra tables a week, expressed as a month. 4.33 weeks per month. */
const TABLES_PER_WEEK = 2;
const WEEKS_PER_MONTH = 4.33;

export type NapkinFigures = {
  /** The price actually used for the sums, after falling back to the default. */
  price: number;
  /** e.g. "$600" */
  monthly: string;
  /** e.g. "month three" */
  payback: string;
  /** e.g. "about $500" */
  surplus: string;
  /** e.g. "one table a month" */
  careTables: string;
};

function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Strips everything but digits and caps at three characters. */
export function sanitiseTable(raw: string): string {
  return raw.replace(/[^0-9]/g, "").slice(0, 3);
}

export function calcNapkin(table: string): NapkinFigures {
  const parsed = Number.parseInt(sanitiseTable(table), 10);
  const price = parsed > 0 ? parsed : DEFAULT_TABLE_PRICE;

  // Rounded to the nearest $50 — this is a napkin, not an invoice.
  const monthly =
    Math.round((TABLES_PER_WEEK * price * WEEKS_PER_MONTH) / 50) * 50;
  const net = monthly - CARE_MONTHLY;
  const months = net > 0 ? Math.ceil(BUILD_PRICE / net) : 0;
  const care = Math.max(1, Math.round(CARE_MONTHLY / price));

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
    careTables: care === 1 ? "one table a month" : `${care} tables a month`,
  };
}
