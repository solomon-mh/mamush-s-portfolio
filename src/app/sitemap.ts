import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/content";
import { hrefFor } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

const STATIC_PATHS = ["/", "/work", "/about", "/contact", "/privacy"];

/** Lists every public, indexable page. Rebuilt on each deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...getSitemapEntries().flatMap((entry) => {
      const path = hrefFor(entry._type, entry.slug);
      return path ? [{ url: absoluteUrl(path) }] : [];
    }),
  ];
}
