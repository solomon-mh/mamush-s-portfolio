import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ViewTransition } from "react";
import { ArtworkGallery } from "@/components/gallery/ArtworkGallery";
import { RelatedWork } from "@/components/gallery/RelatedWork";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { JsonLd } from "@/components/ui/JsonLd";
import { Prose } from "@/components/ui/Prose";
import { findRedirect, getProfile, getProject, getSettings, getStaticSlugs } from "@/content";
import { primaryDiscipline } from "@/content/cards";
import { CreditList, ProjectMetadata } from "@/features/projects/ProjectMetadata";
import { ProjectSections } from "@/features/projects/ProjectSections";
import { hrefFor } from "@/lib/routes";
import { buildPageMetadata, creativeWorkJsonLd, videoJsonLd } from "@/lib/seo";
import { durationToIso, parseVideoUrl } from "@/lib/video";

/** Every page is generated at build time; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticSlugs("project");
}

function load(slug: string) {
  const project = getProject(slug);
  if (project) return project;
  const current = findRedirect("project", slug);
  if (current) permanentRedirect(`/projects/${current}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    seo: project.seo,
    image: project.cover,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = load((await params).slug);
  const site = getSettings();
  const profile = getProfile();

  const discipline = primaryDiscipline(project.card);
  const heroVideo = project.hero && "video" in project.hero ? project.hero.video : null;
  const heroImage = project.hero && "image" in project.hero ? project.hero.image : project.cover;
  const embed = heroVideo?.url ? parseVideoUrl(heroVideo.url) : null;

  return (
    <>
      <JsonLd
        data={creativeWorkJsonLd({
          title: project.title,
          path: `/projects/${project.slug}`,
          description: project.summary,
          year: project.year,
          image: project.cover,
          creatorName: profile.name,
        })}
      />
      {heroVideo && (
        <JsonLd
          data={videoJsonLd({
            title: heroVideo.title,
            description: project.summary,
            thumbnail: heroVideo.poster,
            embedUrl: embed?.embedUrl.split("?")[0],
            contentUrl: heroVideo.file,
            duration: durationToIso(heroVideo.duration),
            uploadYear: project.year,
          })}
        />
      )}

      <article className="page-gutter mx-auto max-w-page pb-10 pt-10 md:pt-16">
        <header className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-12">
          <nav aria-label="Breadcrumb" className="lg:col-span-12">
            <ol className="flex flex-wrap gap-x-2 text-label text-graphite">
              <li>
                <Link href="/work" className="link-quiet inline-flex min-h-11 items-center">
                  Work
                </Link>
              </li>
              {discipline && (
                <li className="before:mr-2 before:content-['/']">
                  <Link href={hrefFor("discipline", discipline.slug)!} className="link-quiet inline-flex min-h-11 items-center">
                    {discipline.title}
                  </Link>
                </li>
              )}
            </ol>
          </nav>
          <div className="lg:col-span-8">
            <h1 className="font-display text-display text-balance">{project.title}</h1>
            {project.summary && <p className="mt-6 max-w-[48ch] text-lede text-graphite">{project.summary}</p>}
          </div>
          <div className="lg:col-span-3 lg:col-start-10 lg:pt-4">
            <ProjectMetadata
              client={project.client}
              year={project.year}
              role={project.role}
              duration={project.duration}
              disciplines={project.card.disciplines}
            />
          </div>
        </header>

        <div className="mb-24 md:mb-36">
          {heroVideo ? (
            <VideoPlayer
              video={heroVideo}
              poster={<ArtworkImage image={heroVideo.poster} fallbackAlt="" aspectRatio={16 / 9} priority sizes="(min-width: 1440px) 1280px, 100vw" />}
            />
          ) : (
            <ViewTransition name={`work-project-${project.slug}`} share="morph" default="none">
              <ArtworkImage image={heroImage} fallbackAlt={project.title} priority sizes="(min-width: 1440px) 1280px, 100vw" />
            </ViewTransition>
          )}
        </div>

        {(project.brief || project.approach) && (
          <div className="mb-24 grid gap-16 md:mb-36 md:grid-cols-2 md:gap-8">
            {project.brief && (
              <section aria-labelledby="brief-heading">
                <h2 id="brief-heading" className="mb-5 font-display text-title">
                  The brief
                </h2>
                <Prose text={project.brief} />
              </section>
            )}
            {project.approach && (
              <section aria-labelledby="approach-heading">
                <h2 id="approach-heading" className="mb-5 font-display text-title">
                  Approach
                </h2>
                <Prose text={project.approach} />
              </section>
            )}
          </div>
        )}

        <ProjectSections sections={project.sections} projectTitle={project.title} />

        {project.artworks.length > 0 && (
          <section aria-labelledby="project-works" className="mt-24 md:mt-36">
            <h2 id="project-works" className="mb-10 font-display text-title">
              Works from this project
            </h2>
            <ArtworkGallery artworks={project.artworks} arrangement="masonry" label={`${project.title} works viewer`} />
          </section>
        )}

        <div className="mt-24 flex flex-col gap-24 md:mt-36">
          <CreditList credits={project.credits} collaborators={project.collaborators} deliverables={project.deliverables} />
          <RelatedWork title="More projects" items={project.related} />
        </div>
      </article>

      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
