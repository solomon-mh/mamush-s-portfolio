import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { getHome } from "@/content";
import { primaryDiscipline } from "@/content/cards";
import { hrefFor } from "@/lib/routes";
import { joinParts } from "@/lib/utils";

type Featured = NonNullable<ReturnType<typeof getHome>["featuredProject"]>;

/** One significant project on a dark ground — the homepage's cinematic moment. */
export function FeaturedProject({ project }: { project: Featured }) {
  const href = hrefFor("project", project.slug)!;
  const discipline = primaryDiscipline(project);
  const hero = project.hero;
  const video = hero && "video" in hero ? hero.video : null;
  const image = hero && "image" in hero ? hero.image : project.coverImage;
  const meta = joinParts([project.client, project.year, project.role], ", ");

  return (
    <section aria-labelledby="featured-project" data-surface="night" className="bg-ink text-paper">
      <div className="page-gutter mx-auto grid max-w-page gap-10 py-20 md:grid-cols-12 md:gap-8 md:py-32">
        <div className="md:col-span-8">
          {video ? (
            <VideoPlayer
              video={video}
              tone="night"
              poster={
                <ArtworkImage image={video.poster} fallbackAlt="" aspectRatio={16 / 9} sizes="(min-width: 1440px) 860px, (min-width: 768px) 66vw, 100vw" />
              }
            />
          ) : (
            <Link href={href} tabIndex={-1} aria-hidden="true">
              <ArtworkImage image={image} fallbackAlt={project.title} sizes="(min-width: 1440px) 860px, (min-width: 768px) 66vw, 100vw" />
            </Link>
          )}
        </div>
        <div className="flex flex-col justify-end md:col-span-4">
          <p className="text-label text-paper/70">
            Featured project{discipline ? `, ${discipline.title}` : ""}
          </p>
          <h2 id="featured-project" className="mt-3 font-display text-display text-balance">
            {project.title}
          </h2>
          {project.summary && <p className="mt-5 max-w-[38ch] text-paper/85">{project.summary}</p>}
          {meta && <p className="mt-4 text-label text-paper/70">{meta}</p>}
          <Link
            href={href}
            className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-paper/70 px-7 transition-colors hover:bg-paper hover:text-ink"
          >
            View the project
          </Link>
        </div>
      </div>
    </section>
  );
}
