import config from "@payload-config";
import { getPayload, type Where } from "payload";
import type { Artwork, Discipline, Media, Profile, Project, SiteSetting } from "@/payload-types";
import type {
  ArtImage,
  ArtworkContent,
  DisciplineContent,
  ProfileContent,
  ProjectContent,
  ProjectSectionContent,
  SiteContent,
  VideoContent,
  WorkReference,
} from "./types";
import type { Content } from "./validate";

/*
 * Reads the content the artist manages in Payload and maps it to the same
 * shapes as the files in /content, so every page renders it unchanged.
 * Payload validates on save; here, anything incomplete is simply left out.
 */

type Rel<T> = number | T | null | undefined;
type VideoFields = NonNullable<Discipline["showreel"]>;

const doc = <T extends object>(value: Rel<T>): T | undefined => (value && typeof value === "object" ? value : undefined);
const opt = <T>(value: T | null | undefined): T | undefined => (value === null ? undefined : value);
const list = <T>(value: T[] | null | undefined): T[] | undefined => (value && value.length > 0 ? value : undefined);
const slugOf = (value: Rel<{ slug: string }>) => doc(value)?.slug;

function mediaUrl(value: Rel<Media>): string | undefined {
  return doc(value)?.url ?? undefined;
}

function image(value: Rel<Media>): ArtImage | undefined {
  const m = doc(value);
  if (!m?.url || !m.width || !m.height || !m.mimeType?.startsWith("image/")) return undefined;
  return {
    src: { src: m.url, width: m.width, height: m.height, blurDataURL: opt(m.blurDataURL) },
    alt: m.alt ?? "",
    decorative: opt(m.decorative),
    caption: opt(m.caption),
    focus: m.focalX != null && m.focalY != null ? { x: m.focalX / 100, y: m.focalY / 100 } : undefined,
  };
}

function images(values: Rel<Media>[] | null | undefined): ArtImage[] {
  return (values ?? []).map(image).filter((i): i is ArtImage => Boolean(i));
}

function video(v: VideoFields | null | undefined): VideoContent | undefined {
  if (!v) return undefined;
  const url = opt(v.url) || undefined;
  const file = url ? undefined : mediaUrl(v.file);
  const poster = image(v.poster);
  if ((!url && !file) || !poster) return undefined;
  return {
    title: v.title || "Film",
    url,
    file,
    poster,
    duration: opt(v.duration) || undefined,
    captions: file ? mediaUrl(v.captions) : undefined,
    transcript: opt(v.transcript) || undefined,
  };
}

function seo(s: Project["seo"] | null | undefined) {
  if (!s) return undefined;
  return {
    title: opt(s.title) || undefined,
    description: opt(s.description) || undefined,
    image: image(s.image),
    noIndex: opt(s.noIndex),
  };
}

const slugs = (values: Rel<{ slug: string }>[] | null | undefined) =>
  (values ?? []).map(slugOf).filter((s): s is string => Boolean(s));

function toDiscipline(d: Discipline, order: number): DisciplineContent {
  return {
    slug: d.slug,
    title: d.title,
    shortDescription: opt(d.shortDescription) || undefined,
    introduction: opt(d.introduction) || undefined,
    cover: image(d.cover),
    layout: d.layout,
    showreel: video(d.showreel),
    featuredProjects: list(slugs(d.featuredProjects)),
    order,
    previousSlugs: list(d.previousSlugs),
    seo: seo(d.seo),
  };
}

function toSection(block: NonNullable<Project["sections"]>[number]): ProjectSectionContent | null {
  const heading = opt(block.heading) || undefined;
  if (block.blockType === "text") return block.body ? { type: "text", heading, body: block.body } : null;
  if (block.blockType === "images") {
    const imgs = images(block.images);
    return imgs.length ? { type: "images", heading, layout: opt(block.layout), images: imgs } : null;
  }
  const v = video(block.video);
  return v ? { type: "video", heading, video: v } : null;
}

function toProject(p: Project, order: number): ProjectContent | null {
  const cover = image(p.cover);
  if (!cover) return null;
  const heroVideo = p.heroType === "video" ? video(p.heroVideo) : undefined;
  const heroImage = p.heroType === "image" ? image(p.heroImage) : undefined;
  return {
    slug: p.slug,
    title: p.title,
    summary: opt(p.summary) || undefined,
    disciplines: slugs(p.disciplines),
    cover,
    hero: heroVideo ? { video: heroVideo } : heroImage ? { image: heroImage } : undefined,
    year: opt(p.year),
    client: opt(p.client) || undefined,
    role: opt(p.role) || undefined,
    duration: opt(p.duration) || undefined,
    brief: opt(p.brief) || undefined,
    approach: opt(p.approach) || undefined,
    sections: list((p.sections ?? []).map(toSection).filter((s): s is ProjectSectionContent => s !== null)),
    deliverables: list(p.deliverables),
    collaborators: list(p.collaborators),
    credits: list((p.credits ?? []).map((c) => ({ role: c.role, name: c.name, url: opt(c.url) || undefined }))),
    related: list(slugs(p.related)),
    featured: opt(p.featured),
    order,
    previousSlugs: list(p.previousSlugs),
    seo: seo(p.seo),
  };
}

function toArtwork(a: Artwork, order: number): ArtworkContent | null {
  const img = image(a.image);
  const discipline = slugOf(a.discipline);
  if (!img || !discipline) return null;
  return {
    slug: a.slug,
    title: a.title,
    discipline,
    image: img,
    description: opt(a.description) || undefined,
    series: opt(a.series) || undefined,
    year: opt(a.year),
    medium: opt(a.medium) || undefined,
    dimensions: opt(a.dimensions) || undefined,
    project: slugOf(a.project),
    rights: opt(a.rights) || undefined,
    featured: opt(a.featured),
    order,
    previousSlugs: list(a.previousSlugs),
  };
}

function toSite(s: SiteSetting): SiteContent {
  const selectedWork = (s.selectedWork ?? []).flatMap((ref): WorkReference[] => {
    const slug = slugOf(ref.value);
    if (!slug) return [];
    return [ref.relationTo === "artworks" ? `artwork:${slug}` : `project:${slug}`];
  });
  const cta = s.contactCta;
  return {
    siteName: s.siteName || "Portfolio",
    siteDescription: opt(s.siteDescription) || undefined,
    accentColor: opt(s.accentColor) || undefined,
    announcement: opt(s.announcement) || undefined,
    hero: { artwork: slugOf(s.heroArtwork) ?? "", loop: mediaUrl(s.heroLoop) },
    selectedWork,
    featuredProject: slugOf(s.featuredProject),
    footerLinks: list((s.footerLinks ?? []).map((l) => ({ label: l.label, href: l.href }))),
    privacyPolicy: opt(s.privacyPolicy) || undefined,
    contactCta: cta
      ? { heading: opt(cta.heading) || undefined, text: opt(cta.text) || undefined, buttonLabel: opt(cta.buttonLabel) || undefined }
      : undefined,
    enquiryTypes: list(s.enquiryTypes),
    defaultShareImage: image(s.defaultShareImage),
  };
}

function toProfile(p: Profile): ProfileContent {
  return {
    name: p.name || "Artist",
    headline: opt(p.headline) || undefined,
    shortBio: opt(p.shortBio) || undefined,
    fullBio: opt(p.fullBio) || undefined,
    statement: opt(p.statement) || undefined,
    approach: opt(p.approach) || undefined,
    location: opt(p.location) || undefined,
    email: opt(p.email) || undefined,
    socialLinks: list(
      (p.socialLinks ?? []).map((l) => ({ platform: l.platform, label: opt(l.label) || undefined, url: l.url })),
    ),
    resume: mediaUrl(p.resume),
    portrait: image(p.portrait),
    studioImages: list(images(p.studioImages)),
    experience: list(
      (p.experience ?? []).map((e) => ({ period: e.period, title: e.title, organisation: opt(e.organisation) || undefined })),
    ),
    recognition: list(
      (p.recognition ?? []).map((r) => ({
        category: r.category,
        title: r.title,
        detail: opt(r.detail) || undefined,
        year: opt(r.year),
        url: opt(r.url) || undefined,
      })),
    ),
    seo: seo(p.seo),
  };
}

const ordered = <T, R>(docs: T[], map: (doc: T, order: number) => R | null): R[] =>
  docs.map((d, i) => map(d, (i + 1) * 10)).filter((x): x is R => x !== null);

/** Everything the site shows. With `draft`, unpublished changes are included (preview). */
export async function loadFromPayload(draft: boolean): Promise<Content> {
  const payload = await getPayload({ config });
  const published: Where | undefined = draft ? undefined : { _status: { equals: "published" } };
  const query = { depth: 1, pagination: false, draft, where: published, sort: "_order" } as const;

  const [disciplines, projects, artworks, site, profile] = await Promise.all([
    payload.find({ collection: "disciplines", ...query }),
    payload.find({ collection: "projects", ...query }),
    payload.find({ collection: "artworks", ...query }),
    payload.findGlobal({ slug: "site-settings", depth: 1, draft }),
    payload.findGlobal({ slug: "profile", depth: 1, draft }),
  ]);

  return {
    site: toSite(site),
    profile: toProfile(profile),
    disciplines: ordered(disciplines.docs, toDiscipline),
    projects: ordered(projects.docs, toProject),
    artworks: ordered(artworks.docs, toArtwork),
  };
}
