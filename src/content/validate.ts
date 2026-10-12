import { z } from "zod";
import type { ArtworkContent, DisciplineContent, ProfileContent, ProjectContent, SiteContent } from "./types";

/*
 * Validates everything in /content when the site builds (and in development).
 * Mistakes fail fast with a list of readable problems instead of a broken page.
 */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase letters, numbers and single dashes, e.g. blue-hour");

const image = z
  .object({
    src: z.object({ src: z.string(), width: z.number().positive(), height: z.number().positive() }, {
      message: "import the image file from /content/images",
    }),
    alt: z.string(),
    decorative: z.boolean().optional(),
    caption: z.string().optional(),
    focus: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
  })
  .refine((img) => img.decorative || img.alt.trim().length >= 8, {
    message: "needs alt text describing the image (at least a short sentence), or `decorative: true`",
    path: ["alt"],
  });

const video = z
  .object({
    title: z.string().min(1),
    url: z
      .string()
      .regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//, "only YouTube and Vimeo links are supported")
      .optional(),
    file: z.string().startsWith("/", "use a path inside /public, e.g. /video/clip.mp4").optional(),
    poster: image,
    duration: z.string().regex(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, "use minutes:seconds, e.g. 3:42").optional(),
    captions: z.string().startsWith("/").optional(),
    transcript: z.string().optional(),
  })
  .refine((v) => Boolean(v.url) !== Boolean(v.file), { message: "set either `url` or `file`", path: ["url"] });

const seo = z
  .object({
    title: z.string().max(70).optional(),
    description: z.string().max(170).optional(),
    image: image.optional(),
    noIndex: z.boolean().optional(),
  })
  .optional();

const year = z.number().int().min(1000).max(2100).optional();

const discipline = z.object({
  slug,
  title: z.string().min(1).max(40),
  shortDescription: z.string().max(220).optional(),
  introduction: z.string().optional(),
  cover: image.optional(),
  layout: z.enum(["gallery", "grid", "screening", "index"]),
  showreel: video.optional(),
  featuredProjects: z.array(slug).optional(),
  order: z.number(),
  hidden: z.boolean().optional(),
  previousSlugs: z.array(z.string()).optional(),
  seo,
});

const section = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), heading: z.string().optional(), body: z.string().min(1) }),
  z.object({
    type: z.literal("images"),
    heading: z.string().optional(),
    layout: z.enum(["stack", "pairs", "sheet"]).optional(),
    images: z.array(image).min(1),
  }),
  z.object({ type: z.literal("video"), heading: z.string().optional(), video }),
]);

const project = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().max(400).optional(),
  disciplines: z.array(slug).min(1, "choose at least one discipline"),
  cover: image,
  hero: z.union([z.object({ image }), z.object({ video })]).optional(),
  year,
  client: z.string().optional(),
  role: z.string().optional(),
  duration: z.string().optional(),
  brief: z.string().optional(),
  approach: z.string().optional(),
  sections: z.array(section).optional(),
  deliverables: z.array(z.string()).optional(),
  collaborators: z.array(z.string()).optional(),
  credits: z.array(z.object({ role: z.string(), name: z.string(), url: z.url().optional() })).optional(),
  related: z.array(slug).max(4).optional(),
  featured: z.boolean().optional(),
  order: z.number(),
  hidden: z.boolean().optional(),
  previousSlugs: z.array(z.string()).optional(),
  seo,
});

const artwork = z.object({
  slug,
  title: z.string().min(1),
  discipline: slug,
  image,
  description: z.string().optional(),
  series: z.string().optional(),
  year,
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  project: slug.optional(),
  rights: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number(),
  hidden: z.boolean().optional(),
  previousSlugs: z.array(z.string()).optional(),
});

const profile = z.object({
  name: z.string().min(1),
  headline: z.string().max(160).optional(),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  statement: z.string().optional(),
  approach: z.string().optional(),
  location: z.string().optional(),
  email: z.email().optional(),
  socialLinks: z.array(z.object({ platform: z.string(), label: z.string().optional(), url: z.url() })).optional(),
  resume: z.string().startsWith("/").optional(),
  portrait: image.optional(),
  studioImages: z.array(image).max(6).optional(),
  experience: z.array(z.object({ period: z.string(), title: z.string(), organisation: z.string().optional() })).optional(),
  recognition: z
    .array(
      z.object({
        category: z.enum(["client", "exhibition", "publication", "award", "collaborator", "credit"]),
        title: z.string(),
        detail: z.string().optional(),
        year,
        url: z.url().optional(),
      }),
    )
    .optional(),
  seo,
});

const site = z.object({
  siteName: z.string().min(1),
  siteDescription: z.string().max(170).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "use a six-digit hex colour, e.g. #2B3A9E").optional(),
  announcement: z.string().max(120).optional(),
  hero: z.object({ artwork: slug, loop: z.string().startsWith("/").optional() }),
  selectedWork: z.array(z.string().regex(/^(artwork|project):[a-z0-9-]+$/, 'write references as "artwork:slug" or "project:slug"')),
  featuredProject: slug.optional(),
  footerLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  privacyPolicy: z.string().optional(),
  contactCta: z.object({ heading: z.string().optional(), text: z.string().optional(), buttonLabel: z.string().optional() }).optional(),
  enquiryTypes: z.array(z.string()).optional(),
  budgetRanges: z.array(z.string()).optional(),
  defaultShareImage: image.optional(),
});

export class ContentError extends Error {
  constructor(readonly problems: string[]) {
    super(`The portfolio content has ${problems.length} problem(s):\n${problems.map((p) => `  • ${p}`).join("\n")}`);
    this.name = "ContentError";
  }
}

export interface Content {
  site: SiteContent;
  profile: ProfileContent;
  disciplines: DisciplineContent[];
  projects: ProjectContent[];
  artworks: ArtworkContent[];
}

function issues(file: string, label: (index: number) => string, result: z.ZodSafeParseResult<unknown>, index?: number) {
  if (result.success) return [];
  return result.error.issues.map((issue) => {
    const where = [index !== undefined ? label(index) : null, issue.path.join(".")].filter(Boolean).join(" → ");
    return `${file}: ${where || "(root)"}: ${issue.message}`;
  });
}

function duplicates(values: string[]) {
  return [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];
}

/** Checks shapes and cross-references. Throws ContentError listing every problem found. */
export function validateContent(content: Content): Content {
  const problems: string[] = [];
  const name = <T extends { slug?: string; title?: string }>(list: T[]) => (i: number) =>
    `#${i + 1}${list[i]?.slug ? ` (${list[i].slug})` : ""}`;

  problems.push(...issues("content/site.ts (site)", () => "", site.safeParse(content.site)));
  problems.push(...issues("content/site.ts (profile)", () => "", profile.safeParse(content.profile)));
  content.disciplines.forEach((d, i) => problems.push(...issues("content/disciplines.ts", name(content.disciplines), discipline.safeParse(d), i)));
  content.projects.forEach((p, i) => problems.push(...issues("content/projects.ts", name(content.projects), project.safeParse(p), i)));
  content.artworks.forEach((a, i) => problems.push(...issues("content/artworks.ts", name(content.artworks), artwork.safeParse(a), i)));

  const disciplineSlugs = new Set(content.disciplines.map((d) => d.slug));
  const projectSlugs = new Set(content.projects.map((p) => p.slug));
  const artworkSlugs = new Set(content.artworks.map((a) => a.slug));

  for (const [file, list] of [
    ["content/disciplines.ts", content.disciplines],
    ["content/projects.ts", content.projects],
    ["content/artworks.ts", content.artworks],
  ] as const) {
    const slugs = list.map((item) => item.slug);
    for (const dup of duplicates(slugs)) problems.push(`${file}: the slug "${dup}" is used more than once`);
    const current = new Set(slugs);
    for (const item of list) {
      for (const old of item.previousSlugs ?? []) {
        if (current.has(old)) problems.push(`${file}: "${item.slug}" lists "${old}" as a former slug, but that slug is in use`);
      }
    }
  }

  for (const d of content.disciplines) {
    for (const p of d.featuredProjects ?? []) {
      if (!projectSlugs.has(p)) problems.push(`content/disciplines.ts: "${d.slug}" features unknown project "${p}"`);
    }
  }
  for (const p of content.projects) {
    for (const d of p.disciplines) {
      if (!disciplineSlugs.has(d)) problems.push(`content/projects.ts: "${p.slug}" uses unknown discipline "${d}"`);
    }
    for (const r of p.related ?? []) {
      if (!projectSlugs.has(r)) problems.push(`content/projects.ts: "${p.slug}" relates to unknown project "${r}"`);
    }
  }
  for (const a of content.artworks) {
    if (!disciplineSlugs.has(a.discipline)) problems.push(`content/artworks.ts: "${a.slug}" uses unknown discipline "${a.discipline}"`);
    if (a.project && !projectSlugs.has(a.project)) problems.push(`content/artworks.ts: "${a.slug}" belongs to unknown project "${a.project}"`);
  }

  if (!artworkSlugs.has(content.site.hero.artwork)) {
    problems.push(`content/site.ts: hero artwork "${content.site.hero.artwork}" doesn't exist`);
  }
  for (const ref of content.site.selectedWork) {
    const [type, s] = ref.split(":");
    const exists = type === "artwork" ? artworkSlugs.has(s) : projectSlugs.has(s);
    if (!exists) problems.push(`content/site.ts: selected work "${ref}" doesn't exist`);
  }
  if (content.site.featuredProject && !projectSlugs.has(content.site.featuredProject)) {
    problems.push(`content/site.ts: featured project "${content.site.featuredProject}" doesn't exist`);
  }

  if (problems.length > 0) throw new ContentError(problems);
  return content;
}
