import dns from "node:dns/promises";

import { isBlockedHostname, isPublicIp } from "./url";

/**
 * Resolves a hostname and confirms every address it points at is publicly
 * routable. Blocking on the name alone is not enough — a public name can
 * resolve to 127.0.0.1 or an internal address on purpose.
 */
export async function assertPublicHost(hostname: string): Promise<void> {
  if (isBlockedHostname(hostname)) {
    throw new UnsafeHostError(`Refusing to fetch ${hostname}`);
  }

  let records: { address: string }[];
  try {
    records = await dns.lookup(hostname, { all: true });
  } catch {
    throw new UnsafeHostError(`Could not resolve ${hostname}`);
  }

  if (records.length === 0) {
    throw new UnsafeHostError(`Could not resolve ${hostname}`);
  }

  for (const record of records) {
    if (!isPublicIp(record.address)) {
      throw new UnsafeHostError(`Refusing to fetch ${hostname}`);
    }
  }
}

export class UnsafeHostError extends Error {
  readonly name = "UnsafeHostError";
}

/**
 * A fetch that will not follow a redirect off a validated host without
 * re-validating the new one, and that always gives up after `timeoutMs`.
 */
export async function safeFetch(
  url: string,
  init: RequestInit & { timeoutMs?: number; maxRedirects?: number } = {},
): Promise<Response> {
  const { timeoutMs = 8000, maxRedirects = 3, ...rest } = init;

  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const target = new URL(current);
    if (target.protocol !== "https:" && target.protocol !== "http:") {
      throw new UnsafeHostError("Only http(s) URLs are supported");
    }
    await assertPublicHost(target.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(target.toString(), {
        ...rest,
        redirect: "manual",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, target).toString();
      continue;
    }
    return response;
  }

  throw new Error("Too many redirects");
}
