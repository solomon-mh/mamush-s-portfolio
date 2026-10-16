/**
 * The `path` query parameter as a path on this site, or "/". Resolving it
 * against the request's own origin rejects anything browsers would send
 * elsewhere, such as "//evil.com" or "/\evil.com".
 */
export function sameSitePath(request: Request): string {
  const base = new URL(request.url);
  const raw = base.searchParams.get("path") ?? "/";
  try {
    const target = new URL(raw, base);
    if (target.origin === base.origin) return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    // Not a valid URL: fall through to the homepage.
  }
  return "/";
}
