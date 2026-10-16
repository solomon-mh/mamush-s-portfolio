import Link from "next/link";
import { ViewTransition } from "react";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ArtworkCard } from "@/content";
import { altText } from "@/lib/images";
import { hrefFor } from "@/lib/routes";
import { JustifiedRows } from "./JustifiedRows";
import { Lightbox, LightboxTrigger, type LightboxItem } from "./Lightbox";
import { WallLabel } from "./WallLabel";

/**
 * "exhibition": larger works, at most two to a row (painting).
 * "grid": denser rows for illustration, stills and project works.
 */
export type GalleryScale = "exhibition" | "grid";

const SCALES: Record<GalleryScale, { rowHeight: number; maxRowHeight: number; maxPerRow: number; mobileMaxVh: 56 | 70 }> = {
  exhibition: { rowHeight: 470, maxRowHeight: 600, maxPerRow: 2, mobileMaxVh: 70 },
  grid: { rowHeight: 320, maxRowHeight: 440, maxPerRow: 4, mobileMaxVh: 56 },
};

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

/** Artworks in justified rows with an immersive full-screen viewer. */
export function ArtworkGallery({
  artworks,
  scale = "grid",
  label,
  headingLevel = "h3",
}: {
  artworks: ArtworkCard[];
  scale?: GalleryScale;
  label: string;
  headingLevel?: "h2" | "h3";
}) {
  if (artworks.length === 0) return null;
  const items = toLightboxItems(artworks);
  const entries = artworks.map((artwork, index) => ({
    key: artwork._id,
    ratio: artwork.image.src.width / artwork.image.src.height,
    artwork,
    index,
  }));

  return (
    <Lightbox items={items} label={label}>
      <JustifiedRows
        items={entries}
        {...SCALES[scale]}
        renderItem={({ artwork, index }, sizes) => {
          const href = hrefFor("artwork", artwork.slug);
          return (
            <figure className="group">
              <LightboxTrigger index={index} label={artwork.title}>
                <ViewTransition name={`work-artwork-${artwork.slug}`} share="morph" default="none">
                  <ArtworkImage image={artwork.image} fallbackAlt={artwork.title} sizes={sizes} className="card-media" />
                </ViewTransition>
              </LightboxTrigger>
              <figcaption className="mt-3.5">
                {href ? (
                  <Link href={href} className="block">
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
              </figcaption>
            </figure>
          );
        }}
      />
    </Lightbox>
  );
}
