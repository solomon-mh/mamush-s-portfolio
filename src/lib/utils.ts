/** Joins class names, skipping falsy values. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Joins defined, non-empty parts with a separator. */
export function joinParts(parts: Array<string | number | null | undefined>, separator = ", "): string {
  return parts.filter((part) => part !== null && part !== undefined && String(part).trim() !== "").join(separator);
}

/** Validates a URL slug segment from route params. */
export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 96 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/** Truncates text on a word boundary for meta descriptions. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).trimEnd()}…`;
}

/** Only allow site-relative paths, to avoid open redirects. */
export function isSafeInternalPath(path: unknown): path is string {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}
