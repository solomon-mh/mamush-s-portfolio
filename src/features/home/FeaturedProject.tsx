import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { HomeData } from "@/content";
import { primaryDiscipline } from "@/content/cards";
import { hrefFor } from "@/lib/routes";
import { joinParts } from "@/lib/utils";

type Featured = NonNullable<HomeData["featuredProject"]>;

/** One significant project on a dark ground — the homepage's cinematic moment. */
export function FeaturedProject({ project }: { project: Featured }) {
  const href = hrefFor("project", project.slug)!;
  const discipline = primaryDiscipline(project);
  const hero = project.hero;
  const video = hero && "video" in hero ? hero.video : null;
  const image = hero && "image" in hero ? hero.image : project.coverImage;
  const meta = joinParts([discipline?.title, project.year, project.client], ", ");

  return (
    <section aria-labelledby="featured-project" data-surface="night" className="bg-ink text-paper">
      <div className="page-gutter section-space mx-auto grid max-w-page gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-7">
          {video ? (
            <VideoPlayer
              video={video}
              tone="night"
              poster={
                <ArtworkImage image={video.poster} fallbackAlt="" aspectRatio={16 / 9} sizes="(min-width: 1440px) 760px, (min-width: 1024px) 55vw, 100vw" />
              }
            />
          ) : (
            <Link href={href} tabIndex={-1} aria-hidden="true" className="group block">
              <ArtworkImage
                image={image}
                fallbackAlt={project.title}
                aspectRatio={16 / 9}
                className="card-media"
                sizes="(min-width: 1440px) 760px, (min-width: 1024px) 55vw, 100vw"
              />
            </Link>
          )}
        </div>
        <div className="lg:col-span-5">
          <p className="kicker text-paper/60">Featured project</p>
          <h2 id="featured-project" className="mt-4 font-display text-display text-balance">
            {project.title}
          </h2>
          {meta && <p className="mt-3 text-small text-paper/60">{meta}</p>}
          {project.summary && <p className="mt-6 max-w-[40ch] text-lede text-paper/85">{project.summary}</p>}
          <Link href={href} className="btn btn-light mt-8">
            View the project
          </Link>
        </div>
      </div>
    </section>
  );
}
