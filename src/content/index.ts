import { artworks as artworkFiles } from "@content/artworks";
import { disciplines as disciplineFiles } from "@content/disciplines";
import { projects as projectFiles } from "@content/projects";
import { profile as profileFile, site as siteFile } from "@content/site";
import type { ArtImage, ArtworkContent, DisciplineContent, ProjectContent } from "./types";
import { validateContent, type Content } from "./validate";

/*
 * The single source of page data. Everything is read from /content at build
 * time, validated once, and shaped into the view models the pages render.
 * Hidden items are removed here, so no page can show them by accident.
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

let cached: Content | null = null;

/** Validated content. Exposed for tests, which pass fixtures through the same checks. */
export function loadContent(content?: Content): Content {
  if (content) return validateContent(content);
  cached ??= validateContent({
    site: siteFile,
    profile: profileFile,
    disciplines: disciplineFiles,
    projects: projectFiles,
    artworks: artworkFiles,
  });
  return cached;
}

/** Overrides the content source (tests only). */
export function __setContentForTests(content: Content | null) {
  cached = content ? validateContent(content) : null;
}

// ---------------------------------------------------------------- helpers

const byOrder = <T extends { order: number; featured?: boolean; year?: number; title: string }>(a: T, b: T) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
  a.order - b.order ||
  (b.year ?? 0) - (a.year ?? 0) ||
  a.title.localeCompare(b.title);

function visibleDisciplines() {
  return loadContent()
    .disciplines.filter((d) => !d.hidden)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

function disciplineRef(slug: string): DisciplineRef | null {
  const d = visibleDisciplines().find((x) => x.slug === slug);
  return d ? { _id: `discipline:${d.slug}`, title: d.title, slug: d.slug, layout: d.layout } : null;
}

function visibleProjects() {
  return loadContent().projects.filter((p) => !p.hidden).sort(byOrder);
}

function visibleArtworks() {
  return loadContent()
    .artworks.filter((a) => !a.hidden && !loadContent().disciplines.find((d) => d.slug === a.discipline)?.hidden)
    .sort(byOrder);
}

function toProjectCard(p: ProjectContent): ProjectCard {
  return {
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
  };
}

function toArtworkCard(a: ArtworkContent): ArtworkCard {
  return {
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
  };
}

function findWork(ref: string): WorkCard | null {
  const [type, slug] = ref.split(":");
  if (type === "artwork") {
    const a = visibleArtworks().find((x) => x.slug === slug);
    return a ? toArtworkCard(a) : null;
  }
  const p = visibleProjects().find((x) => x.slug === slug);
  return p ? toProjectCard(p) : null;
}

// ---------------------------------------------------------------- site-wide

export function getSettings() {
  return loadContent().site;
}

export function getProfile() {
  return loadContent().profile;
}

export function getDisciplines() {
  const projects = visibleProjects();
  const artworks = visibleArtworks();
  return visibleDisciplines().map((d) => ({
    _id: `discipline:${d.slug}`,
    title: d.title,
    slug: d.slug,
    layout: d.layout,
    shortDescription: d.shortDescription ?? null,
    coverImage: d.cover ?? null,
    workCount:
      projects.filter((p) => p.disciplines.includes(d.slug)).length + artworks.filter((a) => a.discipline === d.slug).length,
  }));
}

// ---------------------------------------------------------------- pages

export function getHome() {
  const site = getSettings();
  const hero = visibleArtworks().find((a) => a.slug === site.hero.artwork);
  const featured = site.featuredProject ? visibleProjects().find((p) => p.slug === site.featuredProject) : undefined;
  return {
    heroArtwork: hero ? toArtworkCard(hero) : null,
    heroLoop: site.hero.loop ?? null,
    selectedWork: site.selectedWork.map(findWork).filter((w): w is WorkCard => w !== null),
    featuredProject: featured ? { ...toProjectCard(featured), hero: featured.hero ?? null } : null,
  };
}

/** Projects plus standalone artworks (works that belong to a project appear on its page instead). */
export function getWorkIndex(): WorkCard[] {
  const projects = visibleProjects().map(toProjectCard);
  const artworks = visibleArtworks()
    .filter((a) => !a.project || !visibleProjects().some((p) => p.slug === a.project))
    .map(toArtworkCard);
  return [...projects, ...artworks].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0),
  );
}

export function getDisciplinePage(slug: string) {
  const d = visibleDisciplines().find((x) => x.slug === slug);
  if (!d) return null;
  const projects = visibleProjects().filter((p) => p.disciplines.includes(d.slug));
  const featured = (d.featuredProjects ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is ProjectContent => Boolean(p));
  const ordered = [...featured, ...projects.filter((p) => !featured.includes(p))];
  return {
    ...d,
    projects: ordered.map(toProjectCard),
    artworks: visibleArtworks()
      .filter((a) => a.discipline === d.slug)
      .map(toArtworkCard),
  };
}

export function getProject(slug: string) {
  const p = visibleProjects().find((x) => x.slug === slug);
  if (!p) return null;
  const all = visibleProjects();
  const curated = (p.related ?? []).map((s) => all.find((x) => x.slug === s)).filter((x): x is ProjectContent => Boolean(x));
  const related = curated.length
    ? curated
    : all.filter((x) => x.slug !== p.slug && x.disciplines.includes(p.disciplines[0])).slice(0, 3);
  return {
    ...p,
    card: toProjectCard(p),
    artworks: visibleArtworks()
      .filter((a) => a.project === p.slug)
      .map(toArtworkCard),
    related: related.map(toProjectCard),
  };
}

export function getArtwork(slug: string) {
  const a = visibleArtworks().find((x) => x.slug === slug);
  if (!a) return null;
  const sequence = visibleArtworks().filter((x) => x.discipline === a.discipline);
  const project = a.project ? visibleProjects().find((p) => p.slug === a.project) : undefined;
  const related = visibleArtworks()
    .filter((x) => x.slug !== a.slug && ((a.project && x.project === a.project) || (a.series && x.series === a.series)))
    .slice(0, 4);
  return {
    ...a,
    card: toArtworkCard(a),
    discipline: disciplineRef(a.discipline),
    project: project ? { title: project.title, slug: project.slug } : null,
    sequence: sequence.map((x) => ({ _id: `artwork:${x.slug}`, title: x.title, slug: x.slug })),
    related: related.map(toArtworkCard),
  };
}

// ---------------------------------------------------------------- routing

export type SlugType = "discipline" | "project" | "artwork";

function listFor(type: SlugType): { slug: string; previousSlugs?: string[] }[] {
  if (type === "discipline") return visibleDisciplines();
  if (type === "project") return visibleProjects();
  return visibleArtworks();
}

/** Every public slug plus former slugs, so renamed pages can redirect. */
export function getStaticSlugs(type: SlugType): { slug: string }[] {
  return listFor(type).flatMap((item) => [item.slug, ...(item.previousSlugs ?? [])]).map((slug) => ({ slug }));
}

/** The current slug for a document that used to live at `slug`. */
export function findRedirect(type: SlugType, slug: string): string | null {
  return listFor(type).find((item) => item.previousSlugs?.includes(slug))?.slug ?? null;
}

export function getSitemapEntries() {
  return [
    ...visibleDisciplines()
      .filter((d) => !d.seo?.noIndex)
      .map((d) => ({ _type: "discipline", slug: d.slug })),
    ...visibleProjects()
      .filter((p) => !p.seo?.noIndex)
      .map((p) => ({ _type: "project", slug: p.slug })),
    ...visibleArtworks().map((a) => ({ _type: "artwork", slug: a.slug })),
  ];
}

/** Works that carry a credits/rights line, for the image credits list. */
export function getImageCredits() {
  return visibleArtworks()
    .filter((a) => a.rights)
    .map((a) => ({ title: a.title, credit: a.rights!, href: `/artwork/${a.slug}` }));
}

/** Topics offered as quick-start emails on the contact page. */
export function getEnquiryTopics(): string[] {
  return [...new Set((getSettings().enquiryTypes ?? []).map((s) => s.trim()).filter(Boolean))];
}
