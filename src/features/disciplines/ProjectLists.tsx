import Link from "next/link";
import { ViewTransition } from "react";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ProjectCard } from "@/content";
import { hrefFor } from "@/lib/routes";
import { joinParts } from "@/lib/utils";

/** Projects in justified rows at their natural proportions. */
export function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;
  return <WorkGallery items={projects} morph rowHeight={360} maxRowHeight={460} maxPerRow={3} showDiscipline={false} />;
}

/** Films as wide stills beside their details — for the Screening layout. */
export function ScreeningList({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;
  return (
    <ul role="list" className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {projects.map((p) => (
        <li key={p._id}>
          <Link href={hrefFor("project", p.slug)!} className="group block">
            <ViewTransition name={`work-project-${p.slug}`} share="morph" default="none">
              <ArtworkImage
                image={p.coverImage}
                fallbackAlt={p.title}
                aspectRatio={16 / 9}
                className="card-media"
                sizes="(min-width: 1440px) 620px, (min-width: 768px) 46vw, 100vw"
              />
            </ViewTransition>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[1.625rem] italic leading-tight transition-colors group-hover:text-paper/70">{p.title}</h3>
              <span className="shrink-0 text-label text-paper/55">{joinParts([p.duration, p.year])}</span>
            </div>
            {p.summary && <p className="mt-2 max-w-[52ch] text-small text-paper/70">{p.summary}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Typographic index of projects with a thumbnail — for the Index layout. */
export function ProjectIndex({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;
  return (
    <ul role="list" className="border-b border-rule">
      {projects.map((p) => (
        <li key={p._id} className="border-t border-rule first:border-t-0">
          <Link
            href={hrefFor("project", p.slug)!}
            className="group grid grid-cols-[6rem_1fr] items-center gap-5 py-5 md:grid-cols-12 md:gap-8 md:py-6"
          >
            <div className="md:col-span-2">
              <ArtworkImage image={p.coverImage} fallbackAlt="" aspectRatio={4 / 3} className="card-media" sizes="(min-width: 768px) 14vw, 96px" />
            </div>
            <div className="md:col-span-6">
              <h3 className="font-display text-[1.5rem] leading-tight decoration-1 underline-offset-[0.18em] group-hover:underline md:text-[1.75rem]">
                {p.title}
              </h3>
              {p.summary && <p className="mt-1 line-clamp-2 hidden max-w-[56ch] text-small text-graphite md:block">{p.summary}</p>}
            </div>
            <p className="hidden text-small text-graphite md:col-span-3 md:block">{joinParts([p.client, p.role])}</p>
            <p className="hidden text-right text-label text-graphite md:col-span-1 md:block">{p.year}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
