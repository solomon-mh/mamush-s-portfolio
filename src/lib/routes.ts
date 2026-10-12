/** Canonical URL strategy: one URL per document type. */
export type LinkableType = "project" | "artwork" | "discipline";

export function hrefFor(type: string, slug: string | null | undefined): string | null {
  if (!slug) return null;
  switch (type) {
    case "project":
      return `/projects/${slug}`;
    case "artwork":
      return `/artwork/${slug}`;
    case "discipline":
      return `/work/${slug}`;
    default:
      return null;
  }
}

export const mainNav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** True when `pathname` is the nav item's page or one of its children. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/work") {
    return pathname === "/work" || pathname.startsWith("/work/") || pathname.startsWith("/projects/") || pathname.startsWith("/artwork/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
