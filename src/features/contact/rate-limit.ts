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
  reset(): void;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key, now = Date.now()) {
      // Opportunistic cleanup so the map cannot grow without bound.
      if (hits.size > 5_000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (entry.count >= limit) return false;
      entry.count += 1;
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}

/** Best-effort client identifier from proxy headers set by the hosting platform. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
