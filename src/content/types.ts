import type { StaticImageData } from "next/image";

/*
 * Types for the files in /content. Authors write these shapes; the site
 * validates them at build time (src/content/validate.ts) and derives the
 * page data from them (src/content/index.ts).
 */

/** An image imported from /content/images, with the text that makes it accessible. */
export interface ArtImage {
  src: StaticImageData;
  /** Describe what is visible: subject, composition, colour, mood. Leave empty only with `decorative: true`. */
  alt: string;
  decorative?: boolean;
  caption?: string;
  /** Focal point (0–1 from the left and top), used only where a layout deliberately crops, e.g. 16:9 film stills. */
  focus?: { x: number; y: number };
}

export interface VideoContent {
  title: string;
  /** A YouTube or Vimeo link (recommended), or a path to a short clip in /public, e.g. "/video/loop.mp4". */
  url?: string;
  file?: string;
  poster: ArtImage;
  duration?: string;
  /** Path to a .vtt captions file in /public, for uploaded clips. */
  captions?: string;
  transcript?: string;
}

export type DisciplineLayout = "gallery" | "grid" | "screening" | "index";

export interface SeoContent {
  title?: string;
  description?: string;
  image?: ArtImage;
  noIndex?: boolean;
}

export interface DisciplineContent {
  slug: string;
  title: string;
  shortDescription?: string;
  /** Paragraphs separated by a blank line. */
  introduction?: string;
  cover?: ArtImage;
  layout: DisciplineLayout;
  showreel?: VideoContent;
  /** Project slugs shown first on this discipline's page. */
  featuredProjects?: string[];
  /** Lower numbers appear first. */
  order: number;
  hidden?: boolean;
  /** Old web addresses (slugs) that should redirect here. */
  previousSlugs?: string[];
  seo?: SeoContent;
}

export type ProjectSectionContent =
  | { type: "text"; heading?: string; body: string }
  | { type: "images"; heading?: string; layout?: "stack" | "pairs" | "sheet"; images: ArtImage[] }
  | { type: "video"; heading?: string; video: VideoContent };

export interface ProjectContent {
  slug: string;
  title: string;
  summary?: string;
  /** Discipline slugs; the first is the main label. */
  disciplines: string[];
  cover: ArtImage;
  hero?: { image: ArtImage } | { video: VideoContent };
  year?: number;
  client?: string;
  role?: string;
  duration?: string;
  brief?: string;
  approach?: string;
  sections?: ProjectSectionContent[];
  deliverables?: string[];
  collaborators?: string[];
  credits?: { role: string; name: string; url?: string }[];
  /** Project slugs; when empty, others from the same discipline are suggested. */
  related?: string[];
  featured?: boolean;
  order: number;
  hidden?: boolean;
  previousSlugs?: string[];
  seo?: SeoContent;
}

export interface ArtworkContent {
  slug: string;
  title: string;
  /** Discipline slug. */
  discipline: string;
  image: ArtImage;
  description?: string;
  /** Works with the same series name are grouped together. */
  series?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  /** Slug of the project this work belongs to. */
  project?: string;
  /** Credits or rights line, e.g. "Private collection". */
  rights?: string;
  featured?: boolean;
  order: number;
  hidden?: boolean;
  previousSlugs?: string[];
}

export interface ProfileContent {
  name: string;
  headline?: string;
  shortBio?: string;
  fullBio?: string;
  statement?: string;
  approach?: string;
  location?: string;
  email?: string;
  socialLinks?: { platform: string; label?: string; url: string }[];
  /** Path to a PDF in /public, e.g. "/cv.pdf". */
  resume?: string;
  portrait?: ArtImage;
  studioImages?: ArtImage[];
  experience?: { period: string; title: string; organisation?: string }[];
  /** Only details the artist approves for publication. The section is hidden when empty. */
  recognition?: {
    category: "client" | "exhibition" | "publication" | "award" | "collaborator" | "credit";
    title: string;
    detail?: string;
    year?: number;
    url?: string;
  }[];
  seo?: SeoContent;
}

export type WorkReference = `artwork:${string}` | `project:${string}`;

export interface SiteContent {
  siteName: string;
  siteDescription?: string;
  /** Six-digit hex colour for focus outlines and highlights. */
  accentColor?: string;
  announcement?: string;
  hero: {
    /** Artwork slug shown beside the name. */
    artwork: string;
    /** Optional short silent loop in /public shown instead of the image, e.g. "/video/hero.mp4". */
    loop?: string;
  };
  /** 4–8 pieces in display order, e.g. "artwork:water-lily-pond" or "project:llamigos". */
  selectedWork: WorkReference[];
  /** Project slug. */
  featuredProject?: string;
  footerLinks?: { label: string; href: string }[];
  /** Replaces the default privacy notice. Paragraphs separated by a blank line. */
  privacyPolicy?: string;
  contactCta?: { heading?: string; text?: string; buttonLabel?: string };
  enquiryTypes?: string[];
  budgetRanges?: string[];
  defaultShareImage?: ArtImage;
}
