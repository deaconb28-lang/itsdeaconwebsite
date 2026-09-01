import { NextResponse } from "next/server";

import { audienceFrom, type Audience } from "@/lib/audience";
import { envOr } from "@/lib/env";
import { sendMail } from "@/lib/mail";
import { calcNapkin } from "@/lib/napkin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every enquiry lands here. */
const INBOX = envOr("CONTACT_TO", "hello@itsdeacon.com");

/**
 * Enquiries are sent from a dedicated address rather than from the inbox that
 * receives them, so a reply to a lead never looks like it came from the form,
 * and so form traffic can be filtered on its own.
 */
const DEFAULT_SENDER = "Deacon <form@itsdeacon.com>";

/**
 * The envelope sender. Resend and most SMTP providers will only send from a
 * domain you have verified, so this stays configurable; the default assumes
 * itsdeacon.com is verified with the provider. Any address on that domain
 * works — providers verify the domain, not the individual mailbox.
 */
const SENDER = envOr("CONTACT_FROM", DEFAULT_SENDER);

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const MAX_LENGTHS = {
  business: 200,
  email: 320,
  currentSite: 500,
  spend: 3,
  notes: 4000,
} as const;

/**
 * `restaurant` and `table` are the field names the single-page site posted.
 * Vercel keeps serving old JS chunks for a while after a deploy, so a visitor
 * who loaded the page before this change still posts them. Losing a real
 * enquiry to a field rename is the one failure this route exists to prevent —
 * accept both for a release, then drop the aliases.
 */
type ContactPayload = {
  business?: unknown;
  restaurant?: unknown;
  email?: unknown;
  currentSite?: unknown;
  spend?: unknown;
  table?: unknown;
  notes?: unknown;
  audience?: unknown;
  /** Honeypot — a real person never fills this in. */
  company?: unknown;
};

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages from this connection. Try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read that submission." },
      { status: 400 },
    );
  }

  // Silently accept and discard bot submissions, so they get no signal.
  if (str(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const audience = audienceFrom(payload.audience);

  const business = (str(payload.business) || str(payload.restaurant)).slice(
    0,
    MAX_LENGTHS.business,
  );
  const email = str(payload.email).slice(0, MAX_LENGTHS.email);
  const currentSite = str(payload.currentSite).slice(0, MAX_LENGTHS.currentSite);
  const spend = (str(payload.spend) || str(payload.table))
    .replace(/[^0-9]/g, "")
    .slice(0, MAX_LENGTHS.spend);
  const notes = str(payload.notes).slice(0, MAX_LENGTHS.notes);

  const fieldErrors: Record<string, string> = {};
  if (!business) {
    const message = `Tell me the ${audience.noun}'s name.`;
    fieldErrors.business = message;
    // Keyed for the old bundle too, or its error renders nowhere at all.
    fieldErrors.restaurant = message;
  }
  if (!email) {
    fieldErrors.email = "I need somewhere to send the homepage.";
  } else if (!isEmail(email)) {
    fieldErrors.email = "That email address doesn't look right.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const figures = calcNapkin(spend, audience.units);
  const subject = `New mockup request — ${business}`;
  const enquiry: Enquiry = {
    business,
    email,
    currentSite,
    notes,
    figures,
    audience,
  };

  const result = await sendMail({
    to: INBOX,
    from: SENDER,
    replyTo: email,
    subject,
    text: renderText(enquiry),
    html: renderHtml(enquiry),
  });

  if (result.ok) {
    // Deliberately no address or message body — just enough to find the send
    // in the provider's dashboard if an enquiry is ever disputed or lost.
    console.log(
      `[contact] delivered ${SENDER} -> ${INBOX} via ${result.provider}` +
        `${result.id ? ` id=${result.id}` : ""}`,
    );
    return NextResponse.json({ ok: true });
  }

  // Nothing was delivered. Say so, and let the form fall back to a mailto so
  // the visitor's message is not simply lost.
  console.error(`[contact] delivery failed (${result.reason}): ${result.detail}`);
  return NextResponse.json(
    {
      ok: false,
      error:
        "That didn't send — the mail service isn't answering. Email me directly and it'll reach me.",
      fallbackEmail: INBOX,
    },
    { status: 502 },
  );
}

type Enquiry = {
  business: string;
  email: string;
  currentSite: string;
  notes: string;
  figures: ReturnType<typeof calcNapkin>;
  audience: Audience;
};

function renderText({
  business,
  email,
  currentSite,
  notes,
  figures,
  audience,
}: Enquiry) {
  return [
    `${pad(audience.form.nameLabel)}${business}`,
    `${pad("Came from")}${audience.path}`,
    `${pad("Reach them")}${email}`,
    `${pad("Current site")}${currentSite || "—"}`,
    "",
    "Their napkin math",
    `  Average ${audience.units.one}: $${figures.price}`,
    `  Two a week:     ${figures.monthly} a month`,
    `  Build clears:   ${figures.payback}`,
    `  Then:           ${figures.surplus} a month`,
    "",
    "Anything I should know",
    notes || "—",
  ].join("\n");
}

/**
 * Keeps the plain-text labels in one column. 17 is one wider than the longest
 * label plus its colon ("Restaurant name:"), so every value gets at least one
 * space in front of it rather than running straight into the label.
 */
function pad(label: string): string {
  return `${label}:`.padEnd(17, " ");
}

function renderHtml({
  business,
  email,
  currentSite,
  notes,
  figures,
  audience,
}: Enquiry) {
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 16px 6px 0;color:#5C6B64;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
       <td style="padding:6px 0;color:#13312C;font-size:15px">${value}</td>
     </tr>`;

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F8F1E3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:28px;background:#fff;border:3px solid #13312C;border-radius:10px">
    <p style="margin:0 0 18px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5C6B64">New mockup request &middot; ${escapeHtml(audience.path)}</p>
    <h1 style="margin:0 0 22px;font-size:26px;line-height:1.15;color:#13312C">${escapeHtml(business)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row("Reach them", `<a href="mailto:${escapeHtml(email)}" style="color:#E0571C">${escapeHtml(email)}</a>`)}
      ${row("Current site", currentSite ? linkify(currentSite) : "&mdash;")}
    </table>
    <div style="margin:22px 0;padding:16px 18px;border-radius:8px;background:rgba(224,87,28,.1)">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#E0571C">Their napkin math</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#3F5049">
        Average ${escapeHtml(audience.units.one)} <b style="color:#13312C">$${figures.price}</b> &middot;
        two a week is <b style="color:#13312C">${escapeHtml(figures.monthly)}</b> a month &middot;
        build clears by <b style="color:#13312C">${escapeHtml(figures.payback)}</b>, then
        <b style="color:#13312C">${escapeHtml(figures.surplus)}</b> a month.
      </p>
    </div>
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#5C6B64">Anything I should know</p>
    <p style="margin:0;font-size:15px;line-height:1.65;color:#3F5049;white-space:pre-wrap">${notes ? escapeHtml(notes) : "&mdash;"}</p>
  </div>
</body></html>`;
}

function linkify(value: string): string {
  const safe = escapeHtml(value);
  if (!/^https?:\/\//i.test(value) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) {
    return safe;
  }
  const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return `<a href="${escapeHtml(href)}" style="color:#E0571C">${safe}</a>`;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
