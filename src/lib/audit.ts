/**
 * What is actually wrong with a local business's website.
 *
 * Every finding here comes from something measured on the page — a header, a
 * tag, a byte count, a timing. Nothing is inferred and nothing is guessed,
 * because the whole section's argument is that it is showing the owner the
 * truth. Claude is used later to *phrase* these findings, never to decide
 * that one exists.
 */

import type { Audience } from "./audience";

export type Severity = "high" | "medium" | "low";

/**
 * Above this, a page is slow enough to be worth telling an owner about.
 * Exported because the route needs it: it only spends a second request
 * confirming a reading that would actually produce a finding.
 */
export const SLOW_MS = 2500;

export type Finding = {
  /** Stable key, so the model can reorder findings but never invent one. */
  id: string;
  title: string;
  /** What was measured, in plain words. */
  detail: string;
  severity: Severity;
};

export type Signals = {
  loadMs: number;
  /**
   * Whether `loadMs` was corroborated by a second request.
   *
   * One fetch measures the network between here and the host at least as much
   * as it measures the site. The same unchanged page has answered in 485ms and
   * in 8.3 seconds within a day — quoting the 8.3 would have told an owner
   * their site is broken when it answers in half a second. An unconfirmed
   * reading is still recorded, because the number is useful; it just never
   * becomes a finding.
   */
  loadConfirmed: boolean;
  /**
   * The body was cut off before the end of the document.
   *
   * Absence proves nothing then, for the same reason `clientRendered` means it
   * proves nothing: a tel: link, an ordering link and the copyright line all
   * live at the bottom of a page, which is exactly the part a truncated read
   * does not have.
   */
  truncated: boolean;
  htmlBytes: number;
  https: boolean;
  hasViewport: boolean;
  /** A PDF the page calls a menu. */
  menuPdf: string | null;
  /**
   * A PDF carrying something a visitor came for — a price list, a rate card, a
   * brochure. Same failure as a PDF menu, one audience wider.
   */
  keyPdf: string | null;
  hasTelLink: boolean;
  /** A phone number appears in the text, whether or not it is a link. */
  hasPhoneNumber: boolean;
  /**
   * The page arrived as an near-empty shell. Absence proves nothing here —
   * whatever is missing may simply be rendered by JavaScript after load.
   */
  clientRendered: boolean;
  imageCount: number;
  hugeImages: number;
  tableLayout: boolean;
  staleYear: number | null;
  hasTitle: boolean;
  hasDescription: boolean;
  hasOrderingLink: boolean;
  hasBookingLink: boolean;
  /** A quote, estimate or appointment request — a trade's version of booking. */
  hasContactAction: boolean;
  builder: string | null;
  antique: boolean;
};

// Third-party services, plus the plain words a restaurant uses for the same
// thing on its own domain. Missing both is what the finding is about.
const ORDERING =
  /doordash|ubereats|grubhub|toasttab|chownow|slicelife|seamless|postmates|olo\.com|order[-_ ]?online|\/order\b|start[-_ ]?order/i;
const BOOKING =
  /opentable|resy\.com|sevenrooms|tock\.com|yelp\.com\/reservations|bookatable|reservation|book[-_ ]?a[-_ ]?table|\/book\b/i;
// What a business that isn't a restaurant offers instead of a table booking.
// Deliberately not counted for restaurants: a contact page is not a way to
// order dinner, and the finding would stop being true.
const CONTACT_ACTION =
  /calendly|acuityscheduling|housecallpro|jobber|servicetitan|get[-_ ]?a?[-_ ]?quote|request[-_ ]?(?:an?[-_ ])?(?:quote|estimate|appointment|callback)|free[-_ ]?estimate|book[-_ ]?(?:now|online|a[-_ ]?(?:visit|call|appointment))|schedule[-_ ]?(?:a[-_ ])?(?:service|visit|appointment)|\/quote\b|\/estimate\b|\/booking?\b|\/schedule\b|\/appointments?\b/i;
const PHONE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
const BUILDERS: Array<[RegExp, string]> = [
  [/wix\.com|wixstatic/i, "Wix"],
  [/squarespace/i, "Squarespace"],
  [/godaddy|websitebuilder/i, "GoDaddy"],
  [/weebly/i, "Weebly"],
  [/wordpress|wp-content/i, "WordPress"],
];

export function readSignals(
  html: string,
  headers: Headers,
  url: string,
  loadMs: number,
  htmlBytes: number,
  /**
   * How much the caller trusts what it handed over. Both default to the
   * pessimistic answer: a caller that says nothing gets no timing finding and
   * no absence findings, because silence is the only safe default when the
   * alternative is telling an owner something untrue about their business.
   */
  quality: { loadConfirmed?: boolean; truncated?: boolean } = {},
): Signals {
  const lower = html.toLowerCase();
  const thisYear = new Date().getUTCFullYear();

  // Rough visible text: strip script, style and tags. Used only to decide
  // whether this page rendered anything at all on the server.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const clientRendered = visible.length < 1200;

  // A copyright line that stopped being updated is the clearest staleness tell.
  let staleYear: number | null = null;
  const years = [...html.matchAll(/(?:©|&copy;|copyright)[^0-9]{0,20}(20\d{2})/gi)]
    .map((m) => Number.parseInt(m[1], 10))
    .filter((y) => y >= 2000 && y <= thisYear);
  if (years.length > 0) {
    const newest = Math.max(...years);
    if (newest <= thisYear - 2) staleYear = newest;
  }

  const menuPdf = linkedPdf(html, /menu/i);
  // Word-bounded on purpose: an unanchored "rate" matches "corporate", and a
  // finding that tells an owner something untrue is worse than one missed.
  const keyPdf =
    menuPdf ??
    linkedPdf(html, /\b(?:menu|prices?|pricing|rates?|brochure|catalogue?|services)\b/i);

  const builder =
    BUILDERS.find(([re]) => re.test(html) || re.test(headers.get("server") ?? ""))?.[1] ?? null;

  return {
    loadMs,
    loadConfirmed: quality.loadConfirmed ?? false,
    truncated: quality.truncated ?? false,
    htmlBytes,
    https: url.startsWith("https://"),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    menuPdf,
    keyPdf,
    hasTelLink: /href=["']tel:/i.test(html),
    hasPhoneNumber: PHONE.test(visible),
    clientRendered,
    imageCount: (html.match(/<img\b/gi) ?? []).length,
    hugeImages: (html.match(/\.(?:png|jpe?g)["'][^>]*width=["']?[12]\d{3}/gi) ?? []).length,
    tableLayout: (lower.match(/<table\b/g) ?? []).length >= 3,
    staleYear,
    hasTitle: /<title[^>]*>\s*\S/i.test(html),
    hasDescription: /<meta[^>]+name=["']description["'][^>]*content=["']\s*\S/i.test(html),
    hasOrderingLink: ORDERING.test(html),
    hasBookingLink: BOOKING.test(html),
    hasContactAction: CONTACT_ACTION.test(html),
    builder,
    antique: /<(?:marquee|blink|font\b|center\b)/i.test(html),
  };
}

/**
 * A PDF linked either by a matching filename or by matching link text.
 * Either way it is the thing a visitor clicked expecting a web page.
 */
function linkedPdf(html: string, word: RegExp): string | null {
  const source = word.source;
  return (
    html.match(
      new RegExp(`href=["']([^"']*(?:${source})[^"']*\\.pdf[^"']*)["']`, "i"),
    )?.[1] ??
    html.match(
      new RegExp(
        `href=["']([^"']*\\.pdf[^"']*)["'][^>]*>[^<]{0,40}(?:${source})`,
        "i",
      ),
    )?.[1] ??
    null
  );
}

/**
 * Turns measurements into findings. Deterministic — no model involved.
 *
 * The audience changes two things and only two: the words a finding is written
 * in, and whether a quote form counts as a way to act. Every id stays the same
 * for both, because /api/analyze validates the model's rewrite by matching ids
 * against this set — an id that varies would silently disable that guard.
 */
export function findingsFrom(signals: Signals, audience: Audience): Finding[] {
  const restaurants = audience.id === "restaurants";
  const found: Finding[] = [];
  const add = (id: string, title: string, detail: string, severity: Severity) =>
    found.push({ id, title, detail, severity });

  if (!signals.hasViewport) {
    add(
      "viewport",
      "It isn't built for phones",
      "The page has no mobile viewport tag, so a phone shows the desktop layout shrunk down. Everything is tiny and has to be pinched.",
      "high",
    );
  }

  if (restaurants ? signals.menuPdf : signals.keyPdf) {
    add(
      "menu-pdf",
      restaurants ? "The menu is a PDF" : "What people came for is a PDF",
      `${restaurants ? "The menu" : "One of your main links"} points at a PDF file. On a phone that downloads, opens in a separate viewer, and can't be searched by Google.`,
      "high",
    );
  }

  if (!signals.https) {
    add(
      "no-https",
      "No padlock in the address bar",
      "The site is served over plain HTTP, so browsers mark it “Not secure” before anyone reads a word.",
      "high",
    );
  }

  // Deliberately silent on an unconfirmed reading. A single timing is the one
  // measurement here that is not a property of the page at all, and a wrong
  // "your site is slow" is the most discrediting thing this can say: the owner
  // opens their own site, sees it appear instantly, and stops believing the
  // rest. `loadMs` is the faster of the samples taken, so the number quoted is
  // the one most favourable to them that is still true.
  if (signals.loadConfirmed && signals.loadMs > SLOW_MS) {
    add(
      "slow",
      "It takes a moment to load",
      `The page took ${(signals.loadMs / 1000).toFixed(1)} seconds to answer. ${audience.readers} leave well before that on a phone signal.`,
      signals.loadMs > 5000 ? "high" : "medium",
    );
  }

  // Only worth saying when a number is actually printed on the page: that is
  // the case where a diner can see it and still cannot tap it.
  if (
    !signals.hasTelLink &&
    signals.hasPhoneNumber &&
    !signals.clientRendered &&
    !signals.truncated
  ) {
    add(
      "no-tap-call",
      "The phone number isn't tappable",
      "The number is printed on the page but isn't a link, so calling means copying it out by hand instead of one tap.",
      "medium",
    );
  }

  if (signals.staleYear !== null && !signals.truncated) {
    add(
      "stale",
      `The footer still says ${signals.staleYear}`,
      `A copyright a couple of years out of date is the first thing that makes a ${audience.reader} wonder whether you're still ${restaurants ? "open" : "trading"}.`,
      "medium",
    );
  }

  const canAct =
    signals.hasOrderingLink ||
    signals.hasBookingLink ||
    (!restaurants && signals.hasContactAction);

  if (!canAct && !signals.clientRendered && !signals.truncated) {
    add(
      "no-action",
      restaurants ? "Nothing to book or order" : "No way to actually hire you",
      restaurants
        ? "No ordering or reservation link anywhere on the page. Whoever's ready to commit has to go and find another way."
        : "Nothing on the page asks for the job — no quote form, no booking, no estimate request. Whoever's ready to commit has to go and find another way.",
      "medium",
    );
  }

  if (signals.htmlBytes > 400_000) {
    add(
      "heavy",
      "The page is heavy",
      `${Math.round(signals.htmlBytes / 1024)} KB of HTML before a single image loads. That's a slow first look on a phone.`,
      "medium",
    );
  }

  if (signals.tableLayout || signals.antique) {
    add(
      "dated",
      "It was built a long time ago",
      "The markup uses table layouts and tags browsers stopped recommending years ago. It shows.",
      "medium",
    );
  }

  if (!signals.hasTitle || (!signals.hasDescription && !signals.clientRendered)) {
    add(
      "seo",
      "Google has nothing to show",
      "The page is missing its title or description, so search results fall back to whatever text Google can scrape.",
      "medium",
    );
  }

  if (signals.imageCount > 30) {
    add(
      "images",
      `${signals.imageCount} images on one page`,
      "Every one is a separate download before the page settles. On a phone that is the whole first impression.",
      "low",
    );
  }

  return found;
}

const ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

export function rank(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
}

/* --------------------------------------------------------------------------
   Did we actually see the site?
   -------------------------------------------------------------------------- */

const CHALLENGE_HEADERS = ["sg-captcha", "cf-mitigated", "x-datadome"];
const CHALLENGE_TEXT =
  /captcha|cf-browser-verification|just a moment|attention required|enable javascript and cookies|access denied|are you a robot|ddos protection/i;

/**
 * Hosts behind a bot shield answer a datacenter request with a challenge page
 * instead of the site. It looks like a valid response and parses fine, so
 * without this check the audit would describe the challenge page — telling an
 * owner their site is broken, or worse, that it is perfect, having never seen
 * it. Refusing to guess is the only honest option.
 */
export function looksBlocked(
  html: string,
  headers: Headers,
  status: number,
): boolean {
  if (CHALLENGE_HEADERS.some((h) => headers.has(h))) return true;
  if (status === 202 || status === 403 || status === 429) return true;
  // A body too small to be a homepage, especially one that bounces onward.
  if (html.length < 700 && /http-equiv=["']refresh/i.test(html)) return true;
  if (html.length < 4000 && CHALLENGE_TEXT.test(html)) return true;
  return false;
}
