/**
 * What is actually wrong with a restaurant's website.
 *
 * Every finding here comes from something measured on the page — a header, a
 * tag, a byte count, a timing. Nothing is inferred and nothing is guessed,
 * because the whole section's argument is that it is showing the owner the
 * truth. Claude is used later to *phrase* these findings, never to decide
 * that one exists.
 */

export type Severity = "high" | "medium" | "low";

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
  htmlBytes: number;
  https: boolean;
  hasViewport: boolean;
  menuPdf: string | null;
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
  builder: string | null;
  antique: boolean;
};

// Third-party services, plus the plain words a restaurant uses for the same
// thing on its own domain. Missing both is what the finding is about.
const ORDERING =
  /doordash|ubereats|grubhub|toasttab|chownow|slicelife|seamless|postmates|olo\.com|order[-_ ]?online|\/order\b|start[-_ ]?order/i;
const BOOKING =
  /opentable|resy\.com|sevenrooms|tock\.com|yelp\.com\/reservations|bookatable|reservation|book[-_ ]?a[-_ ]?table|\/book\b/i;
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

  const menuPdf =
    html.match(/href=["']([^"']*menu[^"']*\.pdf[^"']*)["']/i)?.[1] ??
    html.match(/href=["']([^"']*\.pdf[^"']*)["'][^>]*>[^<]{0,40}menu/i)?.[1] ??
    null;

  const builder =
    BUILDERS.find(([re]) => re.test(html) || re.test(headers.get("server") ?? ""))?.[1] ?? null;

  return {
    loadMs,
    htmlBytes,
    https: url.startsWith("https://"),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    menuPdf,
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
    builder,
    antique: /<(?:marquee|blink|font\b|center\b)/i.test(html),
  };
}

/** Turns measurements into findings. Deterministic — no model involved. */
export function findingsFrom(signals: Signals): Finding[] {
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

  if (signals.menuPdf) {
    add(
      "menu-pdf",
      "The menu is a PDF",
      "The menu links to a PDF file. On a phone that downloads, opens in a separate viewer, and can't be searched by Google.",
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

  if (signals.loadMs > 2500) {
    add(
      "slow",
      "It takes a moment to load",
      `The page took ${(signals.loadMs / 1000).toFixed(1)} seconds to answer. Diners leave well before that on a phone signal.`,
      signals.loadMs > 5000 ? "high" : "medium",
    );
  }

  // Only worth saying when a number is actually printed on the page: that is
  // the case where a diner can see it and still cannot tap it.
  if (!signals.hasTelLink && signals.hasPhoneNumber && !signals.clientRendered) {
    add(
      "no-tap-call",
      "The phone number isn't tappable",
      "The number is printed on the page but isn't a link, so calling means copying it out by hand instead of one tap.",
      "medium",
    );
  }

  if (signals.staleYear !== null) {
    add(
      "stale",
      `The footer still says ${signals.staleYear}`,
      "A copyright a couple of years out of date is the first thing that makes a diner wonder whether you're still open.",
      "medium",
    );
  }

  if (!signals.hasOrderingLink && !signals.hasBookingLink && !signals.clientRendered) {
    add(
      "no-action",
      "Nothing to book or order",
      "No ordering or reservation link anywhere on the page. Whoever's ready to commit has to go and find another way.",
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
