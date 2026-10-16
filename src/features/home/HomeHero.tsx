import Link from "next/link";
import { getImageProps } from "next/image";
import { WallLabel } from "@/components/gallery/WallLabel";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { HeroLoop } from "@/components/media/HeroLoop";
import type { ArtworkCard } from "@/content";
import { altText, imageDimensions } from "@/lib/images";
import { hrefFor } from "@/lib/routes";

interface HeroDiscipline {
  title: string;
  slug: string;
  workCount: number;
}

/**
 * The opening screen, sized to fit the viewport: who the artist is, what they
 * make and where to go next on the left; one signature work hung on a
 * "gallery wall" on the right. The artwork is the LCP element, so it is never
 * delayed by animation.
 */
export function HomeHero({
  name,
  headline,
  availability,
  availabilityHref,
  artwork,
  loopUrl,
  disciplines,
}: {
  name: string;
  headline?: string | null;
  availability?: string | null;
  /** Where the availability note leads, e.g. a mailto: link. */
  availabilityHref?: string | null;
  artwork: ArtworkCard | null;
  loopUrl?: string | null;
  disciplines: HeroDiscipline[];
}) {
  const image = artwork?.image ?? null;
  const dims = imageDimensions(image);
  const ratio = dims ? dims.width / dims.height : 4 / 5;
  const href = artwork ? hrefFor("artwork", artwork.slug) : null;
  const title = artwork?.title ?? "Untitled";
  // An optimised poster URL for the optional animation loop.
  const poster = image ? getImageProps({ src: image.src, alt: "", width: 1600, quality: 75 }).props.src : "";
  // Fit the work inside the wall panel without cropping or overflowing the screen.
  const artWidth = `min(100%, calc((100svh - var(--header-height) - 15rem) * ${ratio.toFixed(4)}))`;

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

        {artwork && image && dims && (
          <figure className="flex flex-col justify-center bg-paper-deep p-6 sm:p-10 lg:col-span-6 lg:p-12">
            <div className="mx-auto w-full" style={{ maxWidth: artWidth }}>
              {loopUrl ? (
                <HeroLoop
                  src={loopUrl}
                  poster={poster}
                  width={dims.width}
                  height={dims.height}
                  label={`Animation preview: ${altText(image, title) || title}`}
                />
              ) : href ? (
                <Link href={href} className="group block shadow-[0_18px_40px_-24px_rgba(24,24,26,0.45)]">
                  <ArtworkImage
                    image={image}
                    fallbackAlt={title}
                    priority
                    className="card-media"
                    sizes="(min-width: 1440px) 600px, (min-width: 1024px) 42vw, 92vw"
                  />
                </Link>
              ) : (
                <ArtworkImage image={image} fallbackAlt={title} priority sizes="(min-width: 1024px) 42vw, 92vw" />
              )}
              <figcaption className="mt-4">
                {href ? (
                  <Link href={href} className="group inline-block">
                    <WallLabel title={title} year={artwork.year} lines={[artwork.medium, artwork.dimensions]} as="p" size="sm" />
                  </Link>
                ) : (
                  <WallLabel title={title} year={artwork.year} lines={[artwork.medium]} as="p" size="sm" />
                )}
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
