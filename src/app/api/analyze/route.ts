import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  findingsFrom,
  looksBlocked,
  rank,
  readSignals,
  type Finding,
} from "@/lib/audit";
import { env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { safeFetch } from "@/lib/safe-fetch";
import { normaliseUrl, prettyUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIMIT = 15;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_HTML_BYTES = 600 * 1024;

const BROWSER_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

export async function POST(request: Request) {
  const limit = rateLimit(`analyze:${clientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let raw = "";
  try {
    const body = (await request.json()) as { url?: unknown };
    raw = typeof body.url === "string" ? body.url : "";
  } catch {
    // Falls through to the validation error below.
  }

  const url = normaliseUrl(raw);
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "That doesn't look like a web address." },
      { status: 400 },
    );
  }

  let html = "";
  let headers = new Headers();
  let loadMs = 0;
  let status = 0;
  try {
    const started = Date.now();
    const response = await safeFetch(url, {
      method: "GET",
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
      timeoutMs: 12_000,
    });
    headers = response.headers;
    status = response.status;
    html = await readCapped(response);
    loadMs = Date.now() - started;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Nothing came back from that address." },
      { status: 502 },
    );
  }

  if (looksBlocked(html, headers, status)) {
    return NextResponse.json({
      ok: true,
      pretty: prettyUrl(url),
      blocked: true,
      findings: [],
      summary:
        "Your host blocked me from reading the page — a bot check, which is normal. Send me the address and I'll go through it properly.",
      writtenBy: "rules",
    });
  }

  const signals = readSignals(html, headers, url, loadMs, Buffer.byteLength(html));
  const measured = rank(findingsFrom(signals));

  // Nothing measurable is wrong. Say so — the honest zero is what makes the
  // rest of the section believable.
  if (measured.length === 0) {
    return NextResponse.json({
      ok: true,
      pretty: prettyUrl(url),
      findings: [],
      summary:
        "Nothing to fix from here. Genuinely — keep it and spend the money on the room.",
      writtenBy: "rules",
    });
  }

  const polished = await phrase(measured, prettyUrl(url));

  return NextResponse.json({
    ok: true,
    pretty: prettyUrl(url),
    findings: polished.findings,
    summary: polished.summary,
    writtenBy: polished.writtenBy,
  });
}

const Written = z.object({
  summary: z
    .string()
    .describe("One sentence to the owner about the state of the site overall."),
  findings: z
    .array(
      z.object({
        id: z.string().describe("The id of the finding being rewritten."),
        title: z.string().describe("Six words or fewer."),
        detail: z
          .string()
          .describe("One or two sentences: what it costs them, and the fix."),
      }),
    )
    .describe("The same findings, reordered by what matters most."),
});

type Phrased = {
  findings: Finding[];
  summary: string;
  writtenBy: "claude" | "rules";
};

/**
 * Rewrites measured findings in Deacon's voice.
 *
 * The model may reorder, retitle and reword — it may not add a finding or drop
 * one. Anything it returns whose id is not in the measured set is discarded,
 * and anything missing keeps its rule-written text, so a hallucinated problem
 * cannot reach an owner being told what is wrong with their website.
 */
async function phrase(measured: Finding[], pretty: string): Promise<Phrased> {
  const fallback: Phrased = {
    findings: measured,
    summary: defaultSummary(measured),
    writtenBy: "rules",
  };

  if (!env("ANTHROPIC_API_KEY")) return fallback;

  try {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 4000,
      output_config: { effort: "low", format: zodOutputFormat(Written) },
      system:
        "You write for Deacon, who builds websites for local restaurants. " +
        "Voice: first person, plain, warm, occasionally self-deprecating. " +
        "Short sentences. No marketing language, no exclamation marks, no jargon " +
        "like 'leverage' or 'optimize'. Talk about diners and tables, not users " +
        "and conversions.\n\n" +
        "You are given findings that were MEASURED on a real website. Rewrite " +
        "them so an owner understands what each one costs them. You may reorder " +
        "them and change the wording. You must not invent a finding, and you " +
        "must not drop one: return every id you were given, exactly once. Never " +
        "claim anything the measurements do not state.",
      messages: [
        {
          role: "user",
          content:
            `Site: ${pretty}\n\nMeasured findings:\n` +
            measured
              .map(
                (f) =>
                  `- id: ${f.id}\n  severity: ${f.severity}\n  what: ${f.title}\n  measurement: ${f.detail}`,
              )
              .join("\n"),
        },
      ],
    });

    const parsed = response.parsed_output;
    if (!parsed) return fallback;

    const remaining = new Map(measured.map((f) => [f.id, f]));
    const findings: Finding[] = [];
    for (const item of parsed.findings) {
      const original = remaining.get(item.id);
      if (!original) continue; // Invented, or a duplicate — drop it.
      findings.push({
        id: original.id,
        severity: original.severity,
        title: item.title.trim() || original.title,
        detail: item.detail.trim() || original.detail,
      });
      remaining.delete(item.id);
    }
    // Anything the model forgot keeps its measured wording.
    findings.push(...remaining.values());

    if (findings.length !== measured.length) return fallback;

    return {
      findings,
      summary: parsed.summary.trim() || defaultSummary(measured),
      writtenBy: "claude",
    };
  } catch (error) {
    console.warn(
      `[analyze] rewrite failed, using measured wording: ${
        error instanceof Error ? error.message.split("\n")[0] : String(error)
      }`,
    );
    return fallback;
  }
}

function defaultSummary(findings: Finding[]): string {
  const high = findings.filter((f) => f.severity === "high").length;
  if (high >= 2) {
    return "There's real money leaking here, and none of it is a rebuild.";
  }
  if (findings.length >= 4) {
    return "A handful of small things, each of them costing you tables quietly.";
  }
  return "Not much wrong — and what there is, is the cheap kind to fix.";
}

async function readCapped(response: Response): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  await reader.cancel().catch(() => {});

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}
