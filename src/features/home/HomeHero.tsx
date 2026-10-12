import Link from "next/link";
import { WallLabel } from "@/components/gallery/WallLabel";
import { HeroLoop } from "@/components/media/HeroLoop";
import { getImageProps } from "next/image";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { hrefFor } from "@/lib/routes";
import type { ArtworkCard } from "@/content";
import { altText, imageDimensions } from "@/lib/images";

/**
 * The opening wall: the artist's name set at monumental scale, interlocking
 * with one signature work shown uncropped. The name rises in once; the
 * artwork appears immediately (it is the LCP element, so it is never delayed).
 */
export function HomeHero({
  name,
  headline,
  artwork,
  loopUrl,
}: {
  name: string;
  headline?: string | null;
  artwork: ArtworkCard | null;
  loopUrl?: string | null;
}) {
  const image = artwork?.image ?? null;
  const dims = imageDimensions(image);
  const ratio = dims ? dims.width / dims.height : 4 / 5;
  const href = artwork ? hrefFor("artwork", artwork.slug) : null;
  const title = artwork?.title ?? "Untitled";
  // An optimised poster URL for the optional animation loop.
  const poster = image ? getImageProps({ src: image.src, alt: "", width: 1600, quality: 75 }).props.src : "";

  return (
    <section aria-labelledby="hero-name" className="page-gutter mx-auto max-w-page pb-20 pt-6 md:pb-32 md:pt-10">
      <h1
        id="hero-name"
        className="hero-rise font-display text-monument text-balance tracking-[-0.025em] [hyphens:manual]"
      >
        {name}
      </h1>

      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
        <div className="hero-fade flex flex-col justify-end gap-8 md:order-1 md:col-span-4 md:pb-2">
          {headline && <p className="max-w-[26ch] text-lede text-ink">{headline}</p>}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/work"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-paper transition-colors hover:bg-accent"
            >
              Explore the work
            </Link>
            <Link href="/about" className="link-quiet inline-flex min-h-12 items-center">
              About the artist
            </Link>
          </div>
        </div>

        {artwork && image && dims && (
          <figure className="md:order-2 md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
            {/* Cap the height so tall works stay within the first screen, preserving proportions. */}
            <div className="ml-auto" style={{ width: `min(100%, calc(72svh * ${ratio.toFixed(4)}))` }}>
              {loopUrl ? (
                <HeroLoop
                  src={loopUrl}
                  poster={poster}
                  width={dims.width}
                  height={dims.height}
                  label={`Animation preview: ${altText(image, title) || title}`}
                />
              ) : href ? (
                <Link href={href} className="block">
                  <ArtworkImage
                    image={image}
                    fallbackAlt={title}
                    priority
                    sizes="(min-width: 1440px) 820px, (min-width: 768px) 60vw, 100vw"
                  />
                </Link>
              ) : (
                <ArtworkImage image={image} fallbackAlt={title} priority sizes="(min-width: 768px) 60vw, 100vw" />
              )}
              <figcaption className="mt-3">
                {href ? (
                  <Link href={href} className="inline-block hover:underline">
                    <WallLabel
                      title={title}
                      year={artwork.year}
                      lines={[artwork.medium, artwork.dimensions]}
                      as="p"
                      size="sm"
                    />
                  </Link>
                ) : (
                  <WallLabel title={title} year={artwork.year} lines={[artwork.medium]} as="p" size="sm" />
                )}
              </figcaption>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}
