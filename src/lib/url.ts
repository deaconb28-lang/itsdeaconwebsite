/**
 * URL handling for the "check yours" lookup. Shared by the browser (to decide
 * whether the typed value is worth submitting) and the API routes (which then
 * re-validate, because anything arriving over the wire is untrusted).
 */

/** Hostname shapes we refuse outright, before any DNS work. */
const BLOCKED_HOST_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /\.localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.home\.arpa$/i,
  /^\[?::1\]?$/,
  /^0\.0\.0\.0$/,
];

/**
 * Strips any scheme, validates the shape, and returns a canonical
 * `https://host/path` string. Returns "" when the value is not a domain —
 * the caller keeps the preview hidden rather than guessing.
 */
export function normaliseUrl(input: string): string {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return "";

  const withoutScheme = trimmed.replace(/^\s*(https?:\/\/)?/i, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}/i.test(withoutScheme)) return "";

  let parsed: URL;
  try {
    parsed = new URL(`https://${withoutScheme}`);
  } catch {
    return "";
  }

  if (isBlockedHostname(parsed.hostname)) return "";

  // Drop credentials, ports and hashes — none of them belong in a preview.
  parsed.username = "";
  parsed.password = "";
  parsed.port = "";
  parsed.hash = "";

  return parsed.toString().replace(/\/+$/, "");
}

/** The host as a diner would read it: no scheme, no trailing slash. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (BLOCKED_HOST_PATTERNS.some((re) => re.test(host))) return true;

  // A bare IP literal is never a restaurant's website; treat any that is not
  // demonstrably public as hostile.
  const bracketless = host.replace(/^\[|\]$/g, "");
  if (isIpLiteral(bracketless)) return !isPublicIp(bracketless);

  return false;
}

export function isIpLiteral(value: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(value) || value.includes(":");
}

/**
 * Rejects loopback, link-local, private, carrier-grade-NAT, multicast and
 * reserved ranges — the addresses an attacker would use to make the server
 * fetch something on its own network.
 */
export function isPublicIp(ip: string): boolean {
  if (ip.includes(":")) return isPublicIpv6(ip);

  const parts = ip.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  const [a, b] = parts;

  if (a === 0) return false; // "this network"
  if (a === 10) return false; // private
  if (a === 127) return false; // loopback
  if (a === 169 && b === 254) return false; // link-local
  if (a === 172 && b >= 16 && b <= 31) return false; // private
  if (a === 192 && b === 168) return false; // private
  if (a === 192 && b === 0) return false; // IETF protocol assignments
  if (a === 100 && b >= 64 && b <= 127) return false; // carrier-grade NAT
  if (a === 198 && (b === 18 || b === 19)) return false; // benchmarking
  if (a >= 224) return false; // multicast + reserved

  return true;
}

function isPublicIpv6(ip: string): boolean {
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (addr === "::" || addr === "::1") return false;
  if (addr.startsWith("fe80")) return false; // link-local
  if (/^f[cd]/.test(addr)) return false; // unique local
  if (addr.startsWith("ff")) return false; // multicast

  // IPv4-mapped (::ffff:10.0.0.1) inherits the IPv4 rules.
  const mapped = addr.match(/::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return isPublicIp(mapped[1]);

  return true;
}
