import { draftMode } from "next/headers";
import { cache } from "react";
import type { ArtImage, ArtworkContent, DisciplineContent, ProjectContent } from "./types";
import { validateContent, type Content } from "./validate";

/*
 * The single source of page data. Content comes from Payload CMS when a
 * database is configured (DATABASE_URL), otherwise from the starter files in
 * /content — used by tests, and to seed the CMS. Either way it is shaped
 * into the same view models, and hidden or unpublished items are removed
 * here, so no page can show them by accident.
 */

export type { ArtImage, VideoContent } from "./types";
export interface DisciplineRef {
  _id: string;
  title: string;
  slug: string;
  layout: DisciplineContent["layout"];
}

export interface ProjectCard {
  _id: string;
  _type: "project";
  title: string;
  slug: string;
  summary: string | null;
  year: number | null;
  client: string | null;
  role: string | null;
  duration: string | null;
  featured: boolean;
  coverImage: ArtImage;
  disciplines: DisciplineRef[];
}

export interface ArtworkCard {
  _id: string;
  _type: "artwork";
  title: string;
  slug: string;
  year: number | null;
  medium: string | null;
  dimensions: string | null;
  series: string | null;
  featured: boolean;
  image: ArtImage;
  discipline: DisciplineRef | null;
}

export type WorkCard = ProjectCard | ArtworkCard;

/** True when the site reads from Payload CMS rather than the starter files. */
export function cmsEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

let override: Content | null = null;
let starter: Content | null = null;

async function starterContent(): Promise<Content> {
  if (!starter) {
    const [{ artworks }, { disciplines }, { projects }, { profile, site }] = await Promise.all([
      import("@content/artworks"),
      import("@content/disciplines"),
      import("@content/projects"),
      import("@content/site"),
    ]);
    starter = validateContent({ site, profile, disciplines, projects, artworks });
  }
  return starter;
}

/** Draft mode is on while a signed-in editor previews unpublished changes. */
async function previewing(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request, e.g. generateStaticParams
  }
}

/** One read per request, shared by the layout, page and metadata. */
const read = cache(async (draft: boolean): Promise<Content> => {
  if (override) return override;
  if (!cmsEnabled()) return starterContent();
  const { loadFromPayload } = await import("./payload-source");
  return loadFromPayload(draft);
});

export async function loadContent(): Promise<Content> {
  return read(await previewing());
}

/** Overrides the content source (tests only). Fixtures pass through the same checks as the starter files. */
export function __setContentForTests(content: Content | null) {
  override = content ? validateContent(content) : null;
}

// ---------------------------------------------------------------- helpers

const byOrder = <T extends { order: number; featured?: boolean; year?: number; title: string }>(a: T, b: T) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
  a.order - b.order ||
  (b.year ?? 0) - (a.year ?? 0) ||
  a.title.localeCompare(b.title);

/** Visible content, sorted for display, with lookups the getters share. */
function view(c: Content) {
  const disciplines = c.disciplines
    .filter((d) => !d.hidden)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  const projects = c.projects.filter((p) => !p.hidden).sort(byOrder);
  // A work disappears with its discipline.
  const artworks = c.artworks.filter((a) => !a.hidden && disciplines.some((d) => d.slug === a.discipline)).sort(byOrder);

  const disciplineRef = (slug: string): DisciplineRef | null => {
    const d = disciplines.find((x) => x.slug === slug);
    return d ? { _id: `discipline:${d.slug}`, title: d.title, slug: d.slug, layout: d.layout } : null;
  };

  const toProjectCard = (p: ProjectContent): ProjectCard => ({
    _id: `project:${p.slug}`,
    _type: "project",
    title: p.title,
    slug: p.slug,
    summary: p.summary ?? null,
    year: p.year ?? null,
    client: p.client ?? null,
    role: p.role ?? null,
    duration: p.duration ?? null,
    featured: Boolean(p.featured),
    coverImage: p.cover,
    disciplines: p.disciplines.map(disciplineRef).filter((d): d is DisciplineRef => d !== null),
  });

  const toArtworkCard = (a: ArtworkContent): ArtworkCard => ({
    _id: `artwork:${a.slug}`,
    _type: "artwork",
    title: a.title,
    slug: a.slug,
    year: a.year ?? null,
    medium: a.medium ?? null,
    dimensions: a.dimensions ?? null,
    series: a.series ?? null,
    featured: Boolean(a.featured),
    image: a.image,
    discipline: disciplineRef(a.discipline),
  });

  const findWork = (ref: string): WorkCard | null => {
    const [type, slug] = ref.split(":");
    if (type === "artwork") {
      const a = artworks.find((x) => x.slug === slug);
      return a ? toArtworkCard(a) : null;
    }
    const p = projects.find((x) => x.slug === slug);
    return p ? toProjectCard(p) : null;
  };

  return { site: c.site, profile: c.profile, disciplines, projects, artworks, disciplineRef, toProjectCard, toArtworkCard, findWork };
}

const load = async () => view(await loadContent());

// ---------------------------------------------------------------- site-wide

export async function getSettings() {
  return (await loadContent()).site;
}

export async function getProfile() {
  return (await loadContent()).profile;
}

export async function getDisciplines() {
  const v = await load();
  return v.disciplines.map((d) => ({
    _id: `discipline:${d.slug}`,
    title: d.title,
    slug: d.slug,
    layout: d.layout,
    shortDescription: d.shortDescription ?? null,
    coverImage: d.cover ?? null,
    workCount:
      v.projects.filter((p) => p.disciplines.includes(d.slug)).length + v.artworks.filter((a) => a.discipline === d.slug).length,
  }));
}

/** Wording and address for the invitation at the end of each page. */
export async function getContactCta() {
  const { site, profile } = await loadContent();
  return {
    heading: site.contactCta?.heading || "Have a project in mind?",
    text: site.contactCta?.text || "Commissions, collaborations and creative projects are welcome.",
    buttonLabel: site.contactCta?.buttonLabel || "Start a conversation",
    email: profile.email ?? null,
    artistName: profile.name,
  };
}

// ---------------------------------------------------------------- pages

export async function getHome() {
  const v = await load();
  const hero = v.artworks.find((a) => a.slug === v.site.hero.artwork);
  const featured = v.site.featuredProject ? v.projects.find((p) => p.slug === v.site.featuredProject) : undefined;
  return {
    heroArtwork: hero ? v.toArtworkCard(hero) : null,
    heroLoop: v.site.hero.loop ?? null,
    selectedWork: v.site.selectedWork.map(v.findWork).filter((w): w is WorkCard => w !== null),
    featuredProject: featured ? { ...v.toProjectCard(featured), hero: featured.hero ?? null } : null,
  };
}

/** Projects plus standalone artworks (works that belong to a project appear on its page instead). */
export async function getWorkIndex(): Promise<WorkCard[]> {
  const v = await load();
  const projects = v.projects.map(v.toProjectCard);
  const artworks = v.artworks
    .filter((a) => !a.project || !v.projects.some((p) => p.slug === a.project))
    .map(v.toArtworkCard);
  return [...projects, ...artworks].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0),
  );
}

export async function getDisciplinePage(slug: string) {
  const v = await load();
  const d = v.disciplines.find((x) => x.slug === slug);
  if (!d) return null;
  const projects = v.projects.filter((p) => p.disciplines.includes(d.slug));
  const featured = (d.featuredProjects ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is ProjectContent => Boolean(p));
  const ordered = [...featured, ...projects.filter((p) => !featured.includes(p))];
  return {
    ...d,
    projects: ordered.map(v.toProjectCard),
    artworks: v.artworks.filter((a) => a.discipline === d.slug).map(v.toArtworkCard),
  };
}

export async function getProject(slug: string) {
  const v = await load();
  const p = v.projects.find((x) => x.slug === slug);
  if (!p) return null;
  const curated = (p.related ?? []).map((s) => v.projects.find((x) => x.slug === s)).filter((x): x is ProjectContent => Boolean(x));
  const related = curated.length
    ? curated
    : v.projects.filter((x) => x.slug !== p.slug && x.disciplines.includes(p.disciplines[0])).slice(0, 3);
  return {
    ...p,
    card: v.toProjectCard(p),
    artworks: v.artworks.filter((a) => a.project === p.slug).map(v.toArtworkCard),
    related: related.map(v.toProjectCard),
  };
}

export async function getArtwork(slug: string) {
  const v = await load();
  const a = v.artworks.find((x) => x.slug === slug);
  if (!a) return null;
  const sequence = v.artworks.filter((x) => x.discipline === a.discipline);
  const project = a.project ? v.projects.find((p) => p.slug === a.project) : undefined;
  const related = v.artworks
    .filter((x) => x.slug !== a.slug && ((a.project && x.project === a.project) || (a.series && x.series === a.series)))
    .slice(0, 4);
  return {
    ...a,
    card: v.toArtworkCard(a),
    discipline: v.disciplineRef(a.discipline),
    project: project ? { title: project.title, slug: project.slug } : null,
    sequence: sequence.map((x) => ({ _id: `artwork:${x.slug}`, title: x.title, slug: x.slug })),
    related: related.map(v.toArtworkCard),
  };
}

// ---------------------------------------------------------------- routing

export type SlugType = "discipline" | "project" | "artwork";

async function listFor(type: SlugType): Promise<{ slug: string; previousSlugs?: string[] }[]> {
  const v = await load();
  if (type === "discipline") return v.disciplines;
  if (type === "project") return v.projects;
  return v.artworks;
}

/** Every public slug plus former slugs, so renamed pages can redirect. */
export async function getStaticSlugs(type: SlugType): Promise<{ slug: string }[]> {
  return (await listFor(type)).flatMap((item) => [item.slug, ...(item.previousSlugs ?? [])]).map((slug) => ({ slug }));
}

/** The current slug for a document that used to live at `slug`. */
export async function findRedirect(type: SlugType, slug: string): Promise<string | null> {
  return (await listFor(type)).find((item) => item.previousSlugs?.includes(slug))?.slug ?? null;
}

export async function getSitemapEntries() {
  const v = await load();
  return [
    ...v.disciplines.filter((d) => !d.seo?.noIndex).map((d) => ({ _type: "discipline", slug: d.slug })),
    ...v.projects.filter((p) => !p.seo?.noIndex).map((p) => ({ _type: "project", slug: p.slug })),
    ...v.artworks.map((a) => ({ _type: "artwork", slug: a.slug })),
  ];
}

/** Works that carry a credits/rights line, for the image credits list. */
export async function getImageCredits() {
  return (await load()).artworks
    .filter((a) => a.rights)
    .map((a) => ({ title: a.title, credit: a.rights!, href: `/artwork/${a.slug}` }));
}

/** Topics offered as quick-start emails on the contact page. */
export async function getEnquiryTopics(): Promise<string[]> {
  return [...new Set(((await getSettings()).enquiryTypes ?? []).map((s) => s.trim()).filter(Boolean))];
}

export type HomeData = Awaited<ReturnType<typeof getHome>>;
export type DisciplinePageData = NonNullable<Awaited<ReturnType<typeof getDisciplinePage>>>;
export type DisciplineSummary = Awaited<ReturnType<typeof getDisciplines>>[number];
export type ContactCtaData = Awaited<ReturnType<typeof getContactCta>>;
