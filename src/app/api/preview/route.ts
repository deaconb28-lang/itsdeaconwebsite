import { NextResponse } from "next/server";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { safeFetch, UnsafeHostError } from "@/lib/safe-fetch";
import type { PreviewResult } from "@/lib/preview";
import { activeRenderer, isPhoneWidth } from "@/lib/renderer";
import { normaliseUrl, prettyUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 20;
const WINDOW_MS = 5 * 60 * 1000;

/** Sites answer very differently to a real browser than to a bare fetch. */
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/** Only ever read enough of the body to find a <title>. */
const MAX_BODY_BYTES = 96 * 1024;

export async function POST(request: Request) {
  const limit = rateLimit(`preview:${clientIp(request)}`, LIMIT, WINDOW_MS);
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

  const result = await inspect(url);
  return NextResponse.json({ ok: true, result });
}

async function inspect(url: string): Promise<PreviewResult> {
  const renderer = await activeRenderer();
  const base: PreviewResult = {
    url,
    pretty: prettyUrl(url),
    reachable: false,
    embeddable: false,
    blockedBy: null,
    title: null,
    status: null,
    renderer,
    phoneWidth: isPhoneWidth(renderer),
  };

  let response: Response;
  try {
    response = await safeFetch(url, {
      method: "GET",
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
      timeoutMs: 8000,
    });
  } catch (error) {
    if (error instanceof UnsafeHostError) return base;
    // Unreachable over https — many small restaurant sites are http-only.
    if (url.startsWith("https://")) {
      return inspectPlainHttp(url, base);
    }
    return base;
  }

  return describe(response, base);
}

async function inspectPlainHttp(
  httpsUrl: string,
  base: PreviewResult,
): Promise<PreviewResult> {
  try {
    const response = await safeFetch(httpsUrl.replace(/^https:/, "http:"), {
      method: "GET",
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
      timeoutMs: 8000,
    });
    // A site with no TLS cannot be framed on an https page anyway.
    const described = await describe(response, base);
    return { ...described, embeddable: false, blockedBy: null };
  } catch {
    return base;
  }
}

async function describe(
  response: Response,
  base: PreviewResult,
): Promise<PreviewResult> {
  const xfo = response.headers.get("x-frame-options")?.toLowerCase() ?? "";
  const csp = response.headers.get("content-security-policy") ?? "";

  let blockedBy: PreviewResult["blockedBy"] = null;
  if (/deny|sameorigin|allow-from/.test(xfo)) {
    blockedBy = "x-frame-options";
  } else if (blocksFrameAncestors(csp)) {
    blockedBy = "frame-ancestors";
  }

  return {
    ...base,
    reachable: response.status < 500,
    status: response.status,
    embeddable: blockedBy === null && response.status < 400,
    blockedBy,
    title: await readTitle(response),
  };
}

/** True when the policy names frame-ancestors and it is not a wildcard. */
function blocksFrameAncestors(csp: string): boolean {
  const directive = csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => /^frame-ancestors\b/i.test(part));
  if (!directive) return false;

  const sources = directive.split(/\s+/).slice(1).map((s) => s.toLowerCase());
  if (sources.length === 0) return true;
  return !sources.includes("*") && !sources.includes("https:");
}

async function readTitle(response: Response): Promise<string | null> {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("html") || !response.body) return null;

  try {
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;

    while (total < MAX_BODY_BYTES) {
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

    const html = new TextDecoder("utf-8", { fatal: false }).decode(merged);
    const match = html.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
    if (!match) return null;

    return decodeEntities(match[1].replace(/\s+/g, " ").trim()).slice(0, 120) || null;
  } catch {
    return null;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    );
}
