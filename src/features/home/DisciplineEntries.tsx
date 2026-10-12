import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { hrefFor } from "@/lib/routes";
import { cx } from "@/lib/utils";
import type { getDisciplines } from "@/content";

type Discipline = ReturnType<typeof getDisciplines>[number];

function countLabel(count: number | null) {
  if (!count) return null;
  return count === 1 ? "1 work" : `${count} works`;
}

/**
 * Entry points to each discipline. Each one's presentation follows the
 * layout the artist chose for it in the CMS, so a screening discipline reads
 * as cinema, a gallery discipline as a hung work, and an index as pure type.
 */
export function DisciplineEntries({ disciplines }: { disciplines: Discipline[] }) {
  const visible = disciplines.filter((d) => d.slug && d.title);
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="disciplines-heading" className="pb-24 md:pb-40">
      <div className="page-gutter mx-auto max-w-page">
        <h2 id="disciplines-heading" className="mb-10 font-display text-title md:mb-16">
          Disciplines
        </h2>
      </div>
      <ul role="list" className="flex flex-col">
        {visible.map((d, i) => (
          <li key={d._id}>
            <DisciplineEntry discipline={d} flip={i % 2 === 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DisciplineEntry({ discipline: d, flip }: { discipline: Discipline; flip: boolean }) {
  const href = hrefFor("discipline", d.slug)!;
  const count = countLabel(d.workCount);
  const title = d.title ?? "";

  if (d.layout === "screening") {
    return (
      <Link href={href} data-surface="night" className="group block bg-ink text-paper">
        <div className="page-gutter mx-auto grid max-w-page gap-8 py-14 md:grid-cols-12 md:items-end md:py-20">
          <div className="md:col-span-8">
            <ArtworkImage
              image={d.coverImage}
              fallbackAlt={title}
              aspectRatio={16 / 9}
              sizes="(min-width: 1440px) 860px, (min-width: 768px) 66vw, 100vw"
            />
          </div>
          <div className="md:col-span-4">
            <h3 className="font-display text-display italic group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">
              {title}
            </h3>
            {d.shortDescription && <p className="mt-4 max-w-[34ch] text-paper/80">{d.shortDescription}</p>}
            {count && <p className="mt-4 text-label text-paper/60">{count}</p>}
          </div>
        </div>
      </Link>
    );
  }

  if (d.layout === "index" || !d.coverImage) {
    return (
      <Link href={href} className="group block border-t border-rule">
        <div className="page-gutter mx-auto grid max-w-page gap-4 py-10 md:grid-cols-12 md:items-baseline md:py-14">
          <h3 className="font-display text-display group-hover:italic md:col-span-7">{title}</h3>
          <div className="md:col-span-5">
            {d.shortDescription && <p className="max-w-[40ch] text-graphite">{d.shortDescription}</p>}
            {count && <p className="mt-2 text-label text-graphite">{count}</p>}
          </div>
        </div>
      </Link>
    );
  }

  // Gallery (large, uncropped) and grid (smaller, denser) layouts.
  const large = d.layout !== "grid";
  return (
    <Link href={href} className="group block border-t border-rule">
      <div className="page-gutter mx-auto grid max-w-page items-center gap-8 py-12 md:grid-cols-12 md:py-16">
        <div
          className={cx(
            large ? "md:col-span-6" : "md:col-span-4",
            flip ? "md:order-2 md:col-start-7" : "md:order-1",
            flip && !large && "md:col-start-9",
          )}
        >
          <ArtworkImage
            image={d.coverImage}
            fallbackAlt={title}
            sizes={large ? "(min-width: 1440px) 640px, (min-width: 768px) 48vw, 100vw" : "(min-width: 768px) 32vw, 100vw"}
            imgClassName="transition-transform duration-700 ease-gallery group-hover:scale-[1.015] motion-reduce:transform-none"
          />
        </div>
        <div
          className={cx(
            "md:col-span-5",
            flip ? "md:order-1 md:col-start-1" : "md:order-2",
            !flip && (large ? "md:col-start-8" : "md:col-start-6"),
          )}
        >
          <h3 className="font-display text-display group-hover:italic">{title}</h3>
          {d.shortDescription && <p className="mt-4 max-w-[40ch] text-graphite">{d.shortDescription}</p>}
          {count && <p className="mt-3 text-label text-graphite">{count}</p>}
        </div>
      </div>
    </Link>
  );
}
