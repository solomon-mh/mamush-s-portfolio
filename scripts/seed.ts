/*
 * Copies the starter content in /content (texts and images) into Payload CMS.
 * Run once on an empty database:  npm run seed
 * Refuses to run when the CMS already has disciplines, so nothing is duplicated.
 */
import nextEnv from "@next/env";
import { getPayload } from "payload";
import { artworks } from "../content/artworks";
import { disciplines } from "../content/disciplines";
import { projects } from "../content/projects";
import { profile, site } from "../content/site";
import type { ArtImage, VideoContent } from "../src/content/types";
import { validateContent } from "../src/content/validate";

nextEnv.loadEnvConfig(process.cwd());

const { default: config } = await import("../src/payload.config");
const payload = await getPayload({ config });
const context = { disableRevalidate: true };
const published = { _status: "published" as const };

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  throw new Error("Set DATABASE_URL in .env.local first.");
}
const existing = await payload.count({ collection: "disciplines" });
if (existing.totalDocs > 0) {
  console.log("The CMS already has content — nothing was changed.");
  process.exit(0);
}

validateContent({ site, profile, disciplines, projects, artworks });

// ---------------------------------------------------------------- media

const uploaded = new Map<string, number>();

/** Uploads an image once per file + description, and returns its media ID. */
async function media(image: ArtImage | undefined): Promise<number | undefined> {
  if (!image) return undefined;
  const file = image.src.src;
  const key = `${file}|${image.alt}|${Boolean(image.decorative)}|${image.caption ?? ""}`;
  if (!uploaded.has(key)) {
    const doc = await payload.create({
      collection: "media",
      filePath: file,
      context,
      data: {
        alt: image.alt,
        decorative: image.decorative ?? false,
        caption: image.caption,
        focalX: Math.round((image.focus?.x ?? 0.5) * 100),
        focalY: Math.round((image.focus?.y ?? 0.5) * 100),
      },
    });
    uploaded.set(key, doc.id);
    console.log(`  image  ${file.split("/").pop()}`);
  }
  return uploaded.get(key);
}

async function mediaList(images: ArtImage[] | undefined) {
  const ids: number[] = [];
  for (const image of images ?? []) {
    const id = await media(image);
    if (id) ids.push(id);
  }
  return ids;
}

async function video(v: VideoContent | undefined) {
  if (!v) return undefined;
  return { title: v.title, url: v.url, poster: await media(v.poster), duration: v.duration, transcript: v.transcript };
}

const seo = async (s: { title?: string; description?: string; image?: ArtImage; noIndex?: boolean } | undefined) =>
  s ? { title: s.title, description: s.description, image: await media(s.image), noIndex: s.noIndex } : undefined;

const byOrder = <T extends { order: number }>(list: T[]) => [...list].sort((a, b) => a.order - b.order);

// ---------------------------------------------------------------- documents

const disciplineIds = new Map<string, number>();
const projectIds = new Map<string, number>();
const artworkIds = new Map<string, number>();

console.log("Disciplines");
for (const d of byOrder(disciplines)) {
  const doc = await payload.create({
    collection: "disciplines",
    context,
    draft: false,
    data: {
      ...published,
      title: d.title,
      slug: d.slug,
      layout: d.layout,
      shortDescription: d.shortDescription,
      introduction: d.introduction,
      cover: await media(d.cover),
      showreel: await video(d.showreel),
      previousSlugs: d.previousSlugs,
      seo: await seo(d.seo),
    },
  });
  disciplineIds.set(d.slug, doc.id);
  console.log(`  ${d.title}`);
}

console.log("Projects");
for (const p of byOrder(projects)) {
  const heroVideo = p.hero && "video" in p.hero ? p.hero.video : undefined;
  const heroImage = p.hero && "image" in p.hero ? p.hero.image : undefined;
  const sections = [];
  for (const s of p.sections ?? []) {
    if (s.type === "text") sections.push({ blockType: "text" as const, heading: s.heading, body: s.body });
    else if (s.type === "images")
      sections.push({ blockType: "images" as const, heading: s.heading, layout: s.layout ?? "stack", images: await mediaList(s.images) });
    else sections.push({ blockType: "video" as const, heading: s.heading, video: await video(s.video) });
  }
  const doc = await payload.create({
    collection: "projects",
    context,
    draft: false,
    data: {
      ...published,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      disciplines: p.disciplines.map((s) => disciplineIds.get(s)!),
      cover: (await media(p.cover))!,
      heroType: heroVideo ? "video" : heroImage ? "image" : "cover",
      heroImage: await media(heroImage),
      heroVideo: await video(heroVideo),
      brief: p.brief,
      approach: p.approach,
      sections,
      year: p.year,
      client: p.client,
      role: p.role,
      duration: p.duration,
      deliverables: p.deliverables,
      collaborators: p.collaborators,
      credits: p.credits,
      featured: p.featured ?? false,
      previousSlugs: p.previousSlugs,
      seo: await seo(p.seo),
    },
  });
  projectIds.set(p.slug, doc.id);
  console.log(`  ${p.title}`);
}

// Links between documents, now that every one exists.
for (const p of projects.filter((x) => x.related?.length)) {
  await payload.update({
    collection: "projects",
    id: projectIds.get(p.slug)!,
    context,
    draft: false,
    data: { related: p.related!.map((s) => projectIds.get(s)!) },
  });
}
for (const d of disciplines.filter((x) => x.featuredProjects?.length)) {
  await payload.update({
    collection: "disciplines",
    id: disciplineIds.get(d.slug)!,
    context,
    draft: false,
    data: { featuredProjects: d.featuredProjects!.map((s) => projectIds.get(s)!) },
  });
}

console.log("Artworks");
for (const a of byOrder(artworks)) {
  const doc = await payload.create({
    collection: "artworks",
    context,
    draft: false,
    data: {
      ...published,
      title: a.title,
      slug: a.slug,
      image: (await media(a.image))!,
      discipline: disciplineIds.get(a.discipline)!,
      series: a.series,
      year: a.year,
      medium: a.medium,
      dimensions: a.dimensions,
      description: a.description,
      project: a.project ? projectIds.get(a.project) : undefined,
      rights: a.rights,
      featured: a.featured ?? false,
      previousSlugs: a.previousSlugs,
    },
  });
  artworkIds.set(a.slug, doc.id);
  console.log(`  ${a.title}`);
}

console.log("Site settings and profile");
await payload.updateGlobal({
  slug: "site-settings",
  context,
  data: {
    siteName: site.siteName,
    siteDescription: site.siteDescription,
    accentColor: site.accentColor,
    announcement: site.announcement,
    heroArtwork: artworkIds.get(site.hero.artwork),
    selectedWork: site.selectedWork.map((ref) => {
      const [type, slug] = ref.split(":");
      return type === "artwork"
        ? { relationTo: "artworks" as const, value: artworkIds.get(slug)! }
        : { relationTo: "projects" as const, value: projectIds.get(slug)! };
    }),
    featuredProject: site.featuredProject ? projectIds.get(site.featuredProject) : undefined,
    footerLinks: site.footerLinks,
    privacyPolicy: site.privacyPolicy,
    contactCta: site.contactCta,
    enquiryTypes: site.enquiryTypes,
    defaultShareImage: await media(site.defaultShareImage),
  },
});

await payload.updateGlobal({
  slug: "profile",
  context,
  data: {
    name: profile.name,
    headline: profile.headline,
    shortBio: profile.shortBio,
    fullBio: profile.fullBio,
    statement: profile.statement,
    approach: profile.approach,
    location: profile.location,
    email: profile.email,
    socialLinks: profile.socialLinks?.map((l) => ({ ...l, platform: l.platform as "instagram" })),
    portrait: await media(profile.portrait),
    studioImages: await mediaList(profile.studioImages),
    experience: profile.experience,
    recognition: profile.recognition,
    seo: await seo(profile.seo),
  },
});

console.log(`Done: ${disciplines.length} disciplines, ${projects.length} projects, ${artworks.length} artworks, ${uploaded.size} images.`);
process.exit(0);
