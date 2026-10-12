import type { Metadata } from "next";
import type { ArtImage, SeoContent } from "@/content/types";
import { publicEnv } from "./env";
import { truncate } from "./utils";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${publicEnv.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** A sharing image entry from a content image (served from the build's static assets). */
function ogImage(image: ArtImage | null | undefined) {
  if (!image?.src) return undefined;
  return { url: absoluteUrl(image.src.src), width: image.src.width, height: image.src.height, alt: image.alt };
}

interface SiteSeoInput {
  siteName: string;
  description?: string | null;
  seo?: SeoContent | null;
  image?: ArtImage | null;
}

/** Defaults for every page; individual pages override title, description and image. */
export function buildSiteMetadata({ siteName, description, seo, image }: SiteSeoInput): Metadata {
  const desc = seo?.description || description || `Portfolio of ${siteName}.`;
  const og = ogImage(seo?.image ?? image);
  return {
    title: { default: seo?.title || siteName, template: `%s — ${siteName}` },
    description: truncate(desc),
    applicationName: siteName,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName, locale: "en", url: "/", ...(og ? { images: [og] } : {}) },
    twitter: { card: og ? "summary_large_image" : "summary" },
    robots: { index: true, follow: true },
  };
}

interface PageSeoInput {
  title: string;
  description?: string | null;
  path: string;
  seo?: SeoContent | null;
  /** Main image of the page, used when no dedicated sharing image is set. */
  image?: ArtImage | null;
  type?: "website" | "article";
}

export function buildPageMetadata({ title, description, path, seo, image, type = "website" }: PageSeoInput): Metadata {
  const og = ogImage(seo?.image ?? image);
  const desc = seo?.description || description;
  return {
    title: seo?.title || title,
    ...(desc ? { description: truncate(desc) } : {}),
    alternates: { canonical: path },
    openGraph: {
      type,
      title: seo?.title || title,
      url: path,
      ...(desc ? { description: truncate(desc) } : {}),
      ...(og ? { images: [og] } : {}),
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ---------------------------------------------------------------- JSON-LD

type JsonLd = Record<string, unknown>;

/** Serialises JSON-LD safely for a <script> tag (prevents `</script>` injection). */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd(profile: {
  name?: string | null;
  headline?: string | null;
  socialLinks?: Array<{ url: string }> | null;
  portrait?: ArtImage | null;
}): JsonLd | null {
  if (!profile.name) return null;
  const sameAs = (profile.socialLinks ?? []).map((l) => l.url).filter(Boolean);
  const image = ogImage(profile.portrait)?.url;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: absoluteUrl("/"),
    ...(profile.headline ? { description: profile.headline } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(image ? { image } : {}),
  };
}

export function websiteJsonLd(name: string): JsonLd {
  return { "@context": "https://schema.org", "@type": "WebSite", name, url: absoluteUrl("/") };
}

export function creativeWorkJsonLd(work: {
  type?: "VisualArtwork" | "CreativeWork";
  title: string;
  path: string;
  description?: string | null;
  year?: number | null;
  image?: ArtImage | null;
  creatorName?: string | null;
  medium?: string | null;
}): JsonLd {
  const image = ogImage(work.image)?.url;
  return {
    "@context": "https://schema.org",
    "@type": work.type ?? "CreativeWork",
    name: work.title,
    url: absoluteUrl(work.path),
    ...(work.description ? { description: truncate(work.description, 300) } : {}),
    ...(work.year ? { dateCreated: String(work.year) } : {}),
    ...(image ? { image } : {}),
    ...(work.medium && work.type === "VisualArtwork" ? { artMedium: work.medium } : {}),
    ...(work.creatorName ? { creator: { "@type": "Person", name: work.creatorName } } : {}),
  };
}

export function videoJsonLd(video: {
  title: string;
  description?: string | null;
  thumbnail?: ArtImage | null;
  embedUrl?: string | null;
  contentUrl?: string | null;
  duration?: string;
  uploadYear?: number | null;
}): JsonLd | null {
  const thumbnail = ogImage(video.thumbnail)?.url;
  // VideoObject requires a thumbnail and an upload date; skip rather than guess.
  if (!thumbnail || !video.uploadYear || !(video.embedUrl || video.contentUrl)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: thumbnail,
    uploadDate: `${video.uploadYear}-01-01`,
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
    ...(video.contentUrl ? { contentUrl: absoluteUrl(video.contentUrl) } : {}),
    ...(video.duration ? { duration: video.duration } : {}),
  };
}
