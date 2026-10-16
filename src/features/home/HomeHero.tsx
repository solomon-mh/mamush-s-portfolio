import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ArtImage } from "@/content";
import { imageDimensions } from "@/lib/images";

interface HeroDiscipline {
  title: string;
  slug: string;
  workCount: number;
}

/**
 * The opening screen, sized to fit the viewport: who the artist is, what they
 * make and where to go next on the left; the artist's portrait, name, location
 * and a short introduction on the right. Selecting the portrait opens it full
 * size in a new tab. The portrait is the LCP element, so it is never delayed
 * by animation.
 */
export function HomeHero({
  name,
  headline,
  availability,
  availabilityHref,
  portrait,
  location,
  intro,
  disciplines,
}: {
  name: string;
  headline?: string | null;
  availability?: string | null;
  /** Where the availability note leads, e.g. a mailto: link. */
  availabilityHref?: string | null;
  portrait?: ArtImage | null;
  location?: string | null;
  /** One or two short sentences under the portrait. */
  intro?: string | null;
  disciplines: HeroDiscipline[];
}) {
  const dims = imageDimensions(portrait);
  const ratio = dims ? dims.width / dims.height : 4 / 5;
  // Fit the portrait inside the panel without cropping or overflowing the screen.
  const portraitWidth = `min(100%, calc((100svh - var(--header-height) - 15rem) * ${ratio.toFixed(4)}))`;

  return (
    <section aria-labelledby="hero-name" className="page-gutter mx-auto max-w-page pb-4 pt-8 md:pb-12 lg:pt-10">
      <div className="grid gap-10 lg:min-h-[calc(100svh-var(--header-height)-5rem)] lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-6 lg:justify-center lg:py-6">
          <div className="hero-rise">
            {availability && (
              <a
                href={availabilityHref ?? "/contact"}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper-raised px-3.5 py-1.5 text-label text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <span aria-hidden="true" className="size-2 rounded-full bg-accent ring-4 ring-accent/15" />
                {availability}
                <span className="text-graphite">— get in touch</span>
              </a>
            )}
            <h1 id="hero-name" className="type-hero text-balance">
              {name}
            </h1>
          </div>
          <div className="hero-fade">
            {headline && <p className="mt-6 max-w-[30ch] text-lede text-ink-soft md:mt-8">{headline}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/work" className="btn btn-primary">
                Explore the work
              </Link>
              <Link href="/about" className="btn btn-secondary">
                About the artist
              </Link>
            </div>
          </div>

          {disciplines.length > 0 && (
            <nav aria-label="Disciplines" className="hero-fade-late mt-14 hidden lg:block">
              <ul role="list" className="grid grid-cols-2 border-t border-rule sm:grid-cols-4">
                {disciplines.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/work/${d.slug}`}
                      className="group flex min-h-16 flex-col justify-center border-b border-rule py-3 pr-3 sm:border-b-0"
                    >
                      <span className="font-display text-[1.1875rem] leading-tight decoration-1 underline-offset-[0.18em] group-hover:underline">
                        {d.title}
                      </span>
                      <span className="text-label text-graphite">
                        {d.workCount} {d.workCount === 1 ? "work" : "works"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {portrait && dims && (
          <figure className="flex flex-col justify-center bg-paper-deep p-6 sm:p-10 lg:col-span-6 lg:p-12">
            <div className="mx-auto w-full" style={{ maxWidth: portraitWidth }}>
              <a
                href={portrait.src.src}
                target="_blank"
                rel="noopener"
                aria-label={`Open the portrait of ${name} full size in a new tab`}
                className="block shadow-[0_18px_40px_-24px_rgba(24,24,26,0.45)]"
              >
                <ArtworkImage
                  image={portrait}
                  fallbackAlt={`Portrait of ${name}`}
                  priority
                  className="card-media"
                  sizes="(min-width: 1440px) 600px, (min-width: 1024px) 42vw, 92vw"
                />
              </a>
              <figcaption className="mt-4">
                <p className="font-display text-[1.1875rem] leading-snug text-ink">{name}</p>
                {location && <p className="mt-0.5 text-label text-graphite">{location}</p>}
                {intro && <p className="mt-2 max-w-[44ch] text-label leading-relaxed text-ink-soft">{intro}</p>}
              </figcaption>
            </div>
          </figure>
        )}

        {disciplines.length > 0 && (
          <nav aria-label="Disciplines" className="lg:hidden">
            <ul role="list" className="grid grid-cols-2 border-t border-rule">
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link href={`/work/${d.slug}`} className="group flex min-h-16 flex-col justify-center border-b border-rule py-3 pr-3">
                    <span className="font-display text-[1.125rem] leading-tight decoration-1 underline-offset-[0.18em] group-hover:underline">{d.title}</span>
                    <span className="text-label text-graphite">
                      {d.workCount} {d.workCount === 1 ? "work" : "works"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
