import Link from "next/link";
import { ViewTransition } from "react";
import { WorkCard } from "@/components/gallery/WorkCard";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ProjectCard } from "@/content";
import { hrefFor } from "@/lib/routes";
import { joinParts } from "@/lib/utils";

/** Two-column editorial grid of project cards at natural proportions. */
export function ProjectGrid({ projects, headingLevel = "h3" }: { projects: ProjectCard[]; headingLevel?: "h2" | "h3" }) {
  if (projects.length === 0) return null;
  return (
    <ul role="list" className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p._id} className={i % 2 === 1 ? "md:mt-24" : undefined}>
          <WorkCard item={p} morph headingLevel={headingLevel} sizes="(min-width: 1440px) 640px, (min-width: 768px) 46vw, 100vw" />
        </li>
      ))}
    </ul>
  );
}

/** Films as wide stills with running time — for the Screening layout. */
export function ScreeningList({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;
  return (
    <ul role="list" className="flex flex-col gap-16 md:gap-24">
      {projects.map((p) => (
        <li key={p._id}>
          <Link href={hrefFor("project", p.slug)!} className="group grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <div className="md:col-span-8">
              <ViewTransition name={`work-project-${p.slug}`} share="morph" default="none">
                <ArtworkImage
                  image={p.coverImage}
                  fallbackAlt={p.title}
                  aspectRatio={16 / 9}
                  sizes="(min-width: 1440px) 860px, (min-width: 768px) 66vw, 100vw"
                />
              </ViewTransition>
            </div>
            <div className="md:col-span-4">
              <h3 className="font-display text-title italic group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">
                {p.title}
              </h3>
              {p.summary && <p className="mt-3 max-w-[38ch] text-paper/80">{p.summary}</p>}
              <p className="mt-3 text-label text-paper/60">{joinParts([p.duration, p.year, p.role, p.client])}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Typographic index of projects with a small thumbnail — for the Index layout. */
export function ProjectIndex({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) return null;
  return (
    <ul role="list" className="border-b border-rule">
      {projects.map((p) => (
        <li key={p._id} className="border-t border-rule">
          <Link href={hrefFor("project", p.slug)!} className="group grid grid-cols-[1fr_auto] items-center gap-6 py-6 md:grid-cols-12 md:gap-8 md:py-8">
            <h3 className="font-display text-title group-hover:italic md:col-span-6">{p.title}</h3>
            <p className="hidden text-graphite md:col-span-3 md:block">{joinParts([p.client, p.role])}</p>
            <p className="hidden text-label text-graphite md:col-span-1 md:block">{p.year}</p>
            <div className="w-24 md:col-span-2 md:w-auto">
              <ArtworkImage image={p.coverImage} fallbackAlt="" aspectRatio={4 / 3} sizes="(min-width: 768px) 14vw, 96px" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
