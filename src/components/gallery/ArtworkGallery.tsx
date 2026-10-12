import Link from "next/link";
import { ViewTransition } from "react";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ArtworkCard } from "@/content";
import { altText } from "@/lib/images";
import { hrefFor } from "@/lib/routes";
import { cx } from "@/lib/utils";
import { Lightbox, LightboxTrigger, type LightboxItem } from "./Lightbox";
import { WallLabel } from "./WallLabel";

export type GalleryArrangement = "wall" | "masonry";

export function toLightboxItems(artworks: ArtworkCard[]): LightboxItem[] {
  return artworks.map((a) => ({
    id: a._id,
    title: a.title,
    year: a.year,
    lines: [a.medium, a.dimensions].filter((l): l is string => Boolean(l)),
    image: a.image.src,
    alt: altText(a.image, a.title),
    href: hrefFor("artwork", a.slug),
  }));
}

/**
 * Artworks with an immersive viewer. "wall" hangs large works one by one,
 * alternating sides like a gallery wall (painting); "masonry" packs works
 * into columns at their natural proportions (illustration, stills).
 */
export function ArtworkGallery({
  artworks,
  arrangement,
  label,
  headingLevel = "h3",
}: {
  artworks: ArtworkCard[];
  arrangement: GalleryArrangement;
  label: string;
  headingLevel?: "h2" | "h3";
}) {
  if (artworks.length === 0) return null;
  const items = toLightboxItems(artworks);

  return (
    <Lightbox items={items} label={label}>
      <ul
        role="list"
        className={cx(
          arrangement === "wall" && "flex flex-col gap-20 md:gap-32",
          arrangement === "masonry" && "columns-1 gap-8 sm:columns-2 lg:columns-3",
        )}
      >
        {artworks.map((artwork, index) => {
          const href = hrefFor("artwork", artwork.slug);
          const landscape = artwork.image.src.width / artwork.image.src.height > 1.15;
          return (
            <li
              key={artwork._id}
              className={cx(
                arrangement === "masonry" && "mb-12 break-inside-avoid",
                arrangement === "wall" && "md:grid md:grid-cols-12 md:gap-8",
              )}
            >
              <div
                className={cx(
                  arrangement === "wall" &&
                    (landscape
                      ? index % 2 === 0
                        ? "md:col-span-9"
                        : "md:col-span-9 md:col-start-4"
                      : index % 2 === 0
                        ? "md:col-span-6 md:col-start-2"
                        : "md:col-span-6 md:col-start-6"),
                )}
              >
                <LightboxTrigger index={index} label={artwork.title}>
                  <ViewTransition name={`work-artwork-${artwork.slug}`} share="morph" default="none">
                    <ArtworkImage
                      image={artwork.image}
                      fallbackAlt={artwork.title}
                      sizes={
                        arrangement === "wall"
                          ? landscape
                            ? "(min-width: 1440px) 960px, (min-width: 768px) 72vw, 100vw"
                            : "(min-width: 1440px) 640px, (min-width: 768px) 48vw, 100vw"
                          : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      }
                    />
                  </ViewTransition>
                </LightboxTrigger>
                <div className="mt-3">
                  {href ? (
                    <Link href={href} className="hover:underline">
                      <WallLabel
                        title={artwork.title}
                        year={artwork.year}
                        lines={[artwork.medium, artwork.dimensions]}
                        as={headingLevel}
                        size="sm"
                      />
                    </Link>
                  ) : (
                    <WallLabel title={artwork.title} year={artwork.year} lines={[artwork.medium]} as={headingLevel} size="sm" />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Lightbox>
  );
}
