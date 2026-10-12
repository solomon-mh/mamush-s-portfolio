/**
 * A small fixed-window rate limiter kept in server memory.
 *
 * Limitation: on serverless platforms each instance has its own memory, so
 * limits are per instance rather than global. Combined with the honeypot and
 * timing checks this is adequate for a portfolio contact form; see the README
 * for upgrading to a shared store or Vercel Firewall rules if abuse appears.
 */
export interface RateLimiter {
  /** Returns true when the request is allowed and records it. */
  check(key: string, now?: number): boolean;
  /** Number of tracked clients (for tests and monitoring). */
  size(): number;
  reset(): void;
}

export function createRateLimiter({
  limit,
  windowMs,
  maxEntries = 10_000,
}: {
  limit: number;
  windowMs: number;
  /** Hard cap on tracked clients so memory stays bounded under a flood of distinct keys. */
  maxEntries?: number;
}): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key, now = Date.now()) {
      if (hits.size >= maxEntries) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
        // Still full: evict the oldest entries (Map keeps insertion order).
        for (const k of hits.keys()) {
          if (hits.size < maxEntries) break;
          hits.delete(k);
        }
      }
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.delete(key);
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (entry.count >= limit) return false;
      entry.count += 1;
      return true;
    },
    size() {
      return hits.size;
    },
    reset() {
      hits.clear();
    },
  };
}

/**
 * Client identifier for rate limiting, from headers the hosting platform sets.
 *
 * The first `X-Forwarded-For` entry is supplied by the client and can be
 * forged, so it is never used. Platform headers are preferred (Vercel sets
 * `x-vercel-forwarded-for` and `x-real-ip` itself); otherwise the last
 * `X-Forwarded-For` entry, which is appended by the nearest proxy.
 */
export function clientKey(headers: Headers): string {
  const platform = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim();
  if (platform) return platform;
  const hops = headers.get("x-forwarded-for")?.split(",").map((h) => h.trim()).filter(Boolean) ?? [];
  return hops.at(-1) || "unknown";
}
