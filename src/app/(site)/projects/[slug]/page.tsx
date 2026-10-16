import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ViewTransition } from "react";
import { ArtworkGallery } from "@/components/gallery/ArtworkGallery";
import { RelatedWork } from "@/components/gallery/RelatedWork";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { PageHeader } from "@/components/layout/PageHeader";
import { SplitSection } from "@/components/layout/SplitSection";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { JsonLd } from "@/components/ui/JsonLd";
import { Prose } from "@/components/ui/Prose";
import { findRedirect, getContactCta, getProfile, getProject, getStaticSlugs } from "@/content";
import { primaryDiscipline } from "@/content/cards";
import { CreditList, ProjectMetadata } from "@/features/projects/ProjectMetadata";
import { ProjectSections } from "@/features/projects/ProjectSections";
import { hrefFor } from "@/lib/routes";
import { buildPageMetadata, creativeWorkJsonLd, videoJsonLd } from "@/lib/seo";
import { durationToIso, parseVideoUrl } from "@/lib/video";

/*
 * Pages are generated at build time. Works published later render on their
 * first visit; unknown slugs are a 404.
 */
export async function generateStaticParams() {
  return await getStaticSlugs("project");
}

async function load(slug: string) {
  const project = await getProject(slug);
  if (project) return project;
  const current = await findRedirect("project", slug);
  if (current) permanentRedirect(`/projects/${current}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProject((await params).slug);
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
  const project = await load((await params).slug);
  const profile = await getProfile();

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

      <article>
        <PageHeader
          title={project.title}
          intro={project.summary}
          breadcrumb={[{ href: "/work", label: "Work" }, ...(discipline ? [{ href: hrefFor("discipline", discipline.slug)!, label: discipline.title }] : [])]}
        >
          <ProjectMetadata
            client={project.client}
            year={project.year}
            role={project.role}
            duration={project.duration}
            disciplines={project.card.disciplines}
          />
        </PageHeader>

        <div className="page-gutter mx-auto max-w-page">
          <div className="mb-16 md:mb-24">
            {heroVideo ? (
              <VideoPlayer
                video={heroVideo}
                poster={<ArtworkImage image={heroVideo.poster} fallbackAlt="" aspectRatio={16 / 9} priority sizes="(min-width: 1440px) 1280px, 100vw" />}
              />
            ) : (
              <div className="flex justify-center bg-paper-deep p-6 sm:p-10 lg:p-14">
                <div className="w-full" style={{ maxWidth: `min(100%, calc(72svh * ${(heroImage.src.width / heroImage.src.height).toFixed(4)}))` }}>
                  <ViewTransition name={`work-project-${project.slug}`} share="morph" default="none">
                    <ArtworkImage image={heroImage} fallbackAlt={project.title} priority sizes="(min-width: 1440px) 1100px, 100vw" />
                  </ViewTransition>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {project.brief && (
              <SplitSection id="brief-heading" title="The brief">
                <Prose text={project.brief} className="text-lede text-ink-soft" />
              </SplitSection>
            )}
            {project.approach && (
              <SplitSection id="approach-heading" title="Approach">
                <Prose text={project.approach} className="text-lede text-ink-soft" />
              </SplitSection>
            )}

            <ProjectSections sections={project.sections} projectTitle={project.title} />

            {project.artworks.length > 0 && (
              <section aria-labelledby="project-works">
                <h2 id="project-works" className="mb-8 border-t border-rule pt-8 font-display text-title md:pt-10">
                  Works from this project
                </h2>
                <ArtworkGallery artworks={project.artworks} scale="grid" label={`${project.title} works viewer`} />
              </section>
            )}

            {Boolean(project.credits?.length || project.collaborators?.length || project.deliverables?.length) && (
              <SplitSection id="credits-heading" title="Credits">
                <CreditList credits={project.credits} collaborators={project.collaborators} deliverables={project.deliverables} />
              </SplitSection>
            )}

            <RelatedWork title="More projects" items={project.related} />
          </div>
        </div>
      </article>

      <div className="pt-16 md:pt-24">
      <ContactCTA {...await getContactCta()} />
      </div>
    </>
  );
}
