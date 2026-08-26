/**
 * Environment variables, read defensively.
 *
 * A variable that is *set but empty* is the case that bites: importing a
 * deployment's variables from a template file leaves blanks behind, and `??`
 * only falls back on `undefined`. An empty `NEXT_PUBLIC_SITE_URL` reaching
 * `new URL()` failed a production build with "Invalid URL" — everything here
 * treats blank as absent.
 */

/** The value, or undefined when unset or blank. */
export function env(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** The value, or `fallback` when unset or blank. */
export function envOr(name: string, fallback: string): string {
  return env(name) ?? fallback;
}

/** The value as an integer, or `fallback` when unset, blank or not a number. */
export function envInt(name: string, fallback: number): number {
  const raw = env(name);
  if (raw === undefined) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** True/false when explicitly set, otherwise undefined so a caller can infer. */
export function envBool(name: string): boolean | undefined {
  const raw = env(name)?.toLowerCase();
  if (raw === undefined) return undefined;
  return raw === "true" || raw === "1" || raw === "yes";
}

const FALLBACK_SITE_URL = "https://itsdeacon.com";

/**
 * The site's public origin, used for canonical URLs, Open Graph and the
 * sitemap. Falls back to the deployment's own URL when the platform provides
 * one, so a preview does not advertise the production domain.
 */
export function siteUrl(): string {
  const configured = env("NEXT_PUBLIC_SITE_URL");
  if (configured) {
    const parsed = toOrigin(configured);
    if (parsed) return parsed;
  }

  const vercel = env("VERCEL_PROJECT_PRODUCTION_URL") ?? env("VERCEL_URL");
  if (vercel) {
    const parsed = toOrigin(vercel);
    if (parsed) return parsed;
  }

  return FALLBACK_SITE_URL;
}

function toOrigin(value: string): string | null {
  try {
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}
