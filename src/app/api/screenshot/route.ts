import { NextResponse } from "next/server";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loadPlaywright, type PlaywrightBrowser } from "@/lib/renderer";
import { assertPublicHost } from "@/lib/safe-fetch";
import { normaliseUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 20;
const WINDOW_MS = 5 * 60 * 1000;

/** The viewport a diner actually holds. */
const PHONE_WIDTH = 375;
const PHONE_HEIGHT = 667;

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/**
 * Renders a site that refuses to be framed.
 *
 * Providers are tried in order of fidelity. The last one needs no account and
 * no browser, so the lookup still works on a bare deployment — see
 * lib/renderer.ts for what each one can and can't do.
 */
export async function GET(request: Request) {
  const limit = rateLimit(`shot:${clientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const target = normaliseUrl(
    new URL(request.url).searchParams.get("url") ?? "",
  );
  if (!target) {
    return NextResponse.json(
      { ok: false, error: "That doesn't look like a web address." },
      { status: 400 },
    );
  }

  // The capture is taken elsewhere, but validating here keeps this endpoint
  // from being used to probe hosts it has no business reaching.
  try {
    await assertPublicHost(new URL(target).hostname);
  } catch {
    return NextResponse.json(
      { ok: false, error: "That address can't be previewed." },
      { status: 400 },
    );
  }

  const shot =
    (await viaScreenshotOne(target)) ??
    (await viaApiFlash(target)) ??
    (await viaPlaywright(target)) ??
    (await viaMshots(target));

  if (!shot) {
    return NextResponse.json(
      { ok: false, error: "Couldn't get a picture of that one." },
      { status: 502 },
    );
  }

  return new NextResponse(shot.body as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": shot.contentType,
      "X-Deacon-Renderer": shot.renderer,
      // A restaurant's homepage does not change minute to minute.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

type Shot = { body: ArrayBuffer; contentType: string; renderer: string };

async function viaScreenshotOne(url: string): Promise<Shot | null> {
  const key = process.env.SCREENSHOTONE_API_KEY;
  if (!key) return null;

  const endpoint = new URL("https://api.screenshotone.com/take");
  endpoint.searchParams.set("access_key", key);
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("viewport_width", String(PHONE_WIDTH));
  endpoint.searchParams.set("viewport_height", String(PHONE_HEIGHT));
  endpoint.searchParams.set("device_scale_factor", "2");
  endpoint.searchParams.set("format", "webp");
  endpoint.searchParams.set("block_cookie_banners", "true");
  endpoint.searchParams.set("cache", "true");
  endpoint.searchParams.set("cache_ttl", "86400");

  return fetchImage(endpoint.toString(), "screenshotone");
}

async function viaApiFlash(url: string): Promise<Shot | null> {
  const key = process.env.APIFLASH_KEY;
  if (!key) return null;

  const endpoint = new URL("https://api.apiflash.com/v1/urltoimage");
  endpoint.searchParams.set("access_key", key);
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("width", String(PHONE_WIDTH));
  endpoint.searchParams.set("height", String(PHONE_HEIGHT));
  endpoint.searchParams.set("scale_factor", "2");
  endpoint.searchParams.set("format", "webp");
  endpoint.searchParams.set("response_type", "image");
  endpoint.searchParams.set("no_cookie_banners", "true");
  endpoint.searchParams.set("ttl", "86400");

  return fetchImage(endpoint.toString(), "apiflash");
}

/**
 * A local browser, when one is installed. This is the only free option that
 * lays the page out at a real phone width, so a self-hosted deployment with
 * `npm i playwright && npx playwright install chromium` gets the best result
 * the section can show.
 */
async function viaPlaywright(url: string): Promise<Shot | null> {
  const playwright = await loadPlaywright();
  if (!playwright) return null;

  let browser: PlaywrightBrowser | null = null;
  try {
    browser = await playwright.chromium.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      // Set PLAYWRIGHT_EXECUTABLE_PATH when the host already has a Chromium
      // that Playwright's own download layout wouldn't find.
      executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
    });

    const context = await browser.newContext({
      viewport: { width: PHONE_WIDTH, height: PHONE_HEIGHT },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    const page = await context.newPage();
    // "networkidle" never settles on sites with polling or ad scripts, which
    // is a lot of them. Take the markup, then give images and fonts a moment.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await page.waitForTimeout(2500);

    const buffer = await page.screenshot({ type: "jpeg", quality: 82 });
    const body = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;

    return { body, contentType: "image/jpeg", renderer: "playwright" };
  } catch (error) {
    // Worth surfacing: the deployment has Playwright but can't drive it, so
    // every capture is silently degrading to the desktop-width fallback.
    console.warn(
      `[screenshot] playwright capture failed, falling back: ${
        error instanceof Error ? error.message.split("\n")[0] : String(error)
      }`,
    );
    return null;
  } finally {
    await browser?.close().catch(() => {});
  }
}

/**
 * WordPress's public mShots service. No key, no account, no browser.
 *
 * It renders at a desktop viewport and crops to the requested size, so this
 * is a picture of the site rather than a phone-width layout — the lookup's
 * copy says as much when this is the renderer in play.
 *
 * A 3xx means the capture is still being generated, so the first request for
 * an uncached site kicks off the render and later ones collect it.
 */
async function viaMshots(url: string): Promise<Shot | null> {
  const endpoint =
    `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=750&h=1334`;

  const attempts = 12;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        headers: { "User-Agent": BROWSER_UA },
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
      });

      const type = response.headers.get("content-type") ?? "";
      if (response.status === 200 && type.startsWith("image/")) {
        const body = await response.arrayBuffer();
        // A capture this small is a placeholder, not a homepage.
        if (body.byteLength > 6000) {
          return { body, contentType: type, renderer: "mshots" };
        }
      }
    } catch {
      // Fall through to the retry.
    }

    if (attempt < attempts - 1) await sleep(1200);
  }

  return null;
}

async function fetchImage(
  endpoint: string,
  renderer: string,
): Promise<Shot | null> {
  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(45_000),
    });
    const type = response.headers.get("content-type") ?? "";
    if (!response.ok || !type.startsWith("image/")) return null;
    return { body: await response.arrayBuffer(), contentType: type, renderer };
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
