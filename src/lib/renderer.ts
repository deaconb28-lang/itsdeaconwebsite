/**
 * Which service renders a site that refuses to be framed.
 *
 * Only the first three reproduce a real 375px phone viewport. mShots renders
 * at a desktop width and crops, so when it is the one in use the lookup says
 * so rather than claiming phone width — the honesty of that section is part
 * of the pitch.
 */
import { env } from "./env";

export type Renderer = "screenshotone" | "apiflash" | "playwright" | "mshots";

/** True only for renderers that lay the page out at phone width. */
export function isPhoneWidth(renderer: Renderer): boolean {
  return renderer !== "mshots";
}

/* --------------------------------------------------------------------------
   Playwright is an optional peer, not a dependency. Installing it (plus a
   browser) upgrades a self-hosted deployment to true phone-width captures;
   without it nothing here runs and nothing is bundled.
   -------------------------------------------------------------------------- */

/** Only the slice of Playwright's surface this app touches. */
export type PlaywrightModule = {
  chromium: {
    launch(options?: {
      args?: string[];
      executablePath?: string;
    }): Promise<PlaywrightBrowser>;
  };
};

export type PlaywrightBrowser = {
  newContext(options?: Record<string, unknown>): Promise<PlaywrightContext>;
  close(): Promise<void>;
};

export type PlaywrightContext = {
  newPage(): Promise<PlaywrightPage>;
};

export type PlaywrightPage = {
  goto(url: string, options?: Record<string, unknown>): Promise<unknown>;
  waitForTimeout(ms: number): Promise<void>;
  screenshot(options?: Record<string, unknown>): Promise<Buffer>;
};

let probe: Promise<PlaywrightModule | null> | null = null;

/**
 * The specifier is held in a variable on purpose: a bare string literal would
 * make TypeScript resolve (and fail on) a module that is allowed to be absent,
 * and would make the bundler try to trace it.
 */
export function loadPlaywright(): Promise<PlaywrightModule | null> {
  probe ??= (async () => {
    const specifier = "playwright";
    try {
      return (await import(/* webpackIgnore: true */ specifier)) as PlaywrightModule;
    } catch {
      return null;
    }
  })();
  return probe;
}

export async function activeRenderer(): Promise<Renderer> {
  if (env("SCREENSHOTONE_API_KEY")) return "screenshotone";
  if (env("APIFLASH_KEY")) return "apiflash";
  if (await loadPlaywright()) return "playwright";
  return "mshots";
}
