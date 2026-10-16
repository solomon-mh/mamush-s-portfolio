import { Play } from "lucide-react";
import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { getDisciplines } from "@/content";
import { hrefFor } from "@/lib/routes";

type Discipline = ReturnType<typeof getDisciplines>[number];

/** Entry points to each discipline: consistent tiles, cropped around each cover's focal point. */
export function DisciplineEntries({ disciplines }: { disciplines: Discipline[] }) {
  if (disciplines.length === 0) return null;
  const cols = disciplines.length >= 4 ? "lg:grid-cols-4" : disciplines.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section aria-labelledby="disciplines-heading" className="border-y border-rule bg-paper-raised">
      <div className="page-gutter section-space mx-auto max-w-page">
        <SectionHeading
          id="disciplines-heading"
          title="Disciplines"
          description="One practice, several ways of working — each with a room of its own."
        />
        <ul role="list" className={`grid gap-x-6 gap-y-10 sm:grid-cols-2 ${cols}`}>
          {disciplines.map((d) => (
            <li key={d._id}>
              <Link href={hrefFor("discipline", d.slug)!} className="group block">
                <div className="relative">
                  {d.coverImage ? (
                    <ArtworkImage
                      image={d.coverImage}
                      fallbackAlt=""
                      aspectRatio={4 / 5}
                      className="card-media"
                      sizes="(min-width: 1440px) 300px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
                    />
                  ) : (
                    <div aria-hidden="true" className="flex aspect-[4/5] items-end bg-paper-deep p-5">
                      <span className="font-display text-[3.5rem] leading-none text-ink/15">{d.title.charAt(0)}</span>
                    </div>
                  )}
                  {d.layout === "screening" && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-paper/90 text-ink"
                    >
                      <Play className="size-4 translate-x-px fill-current" />
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                  <h3 className="font-display text-[1.5rem] leading-tight decoration-1 underline-offset-[0.18em] group-hover:underline">{d.title}</h3>
                  <span className="shrink-0 text-label text-graphite">
                    {d.workCount} {d.workCount === 1 ? "work" : "works"}
                  </span>
                </div>
                {d.shortDescription && <p className="mt-2 text-small text-graphite">{d.shortDescription}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
