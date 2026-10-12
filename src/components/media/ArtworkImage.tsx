import Image from "next/image";
import type { ArtImage } from "@/content/types";
import { altText, objectPosition } from "@/lib/images";
import { cx } from "@/lib/utils";

interface ArtworkImageProps {
  image: ArtImage | null | undefined;
  /** Used when the image has no alt text (and isn't decorative). */
  fallbackAlt: string;
  /** Responsive `sizes` hint — always set it so small cards never download large files. */
  sizes: string;
  /** Only for the single largest above-the-fold image (the LCP element). */
  priority?: boolean;
  /**
   * Intentional crop to a fixed aspect ratio (width / height), centred on the
   * image's focal point. Omit to keep the artwork's original proportions.
   */
  aspectRatio?: number;
  quality?: number;
  className?: string;
  imgClassName?: string;
}

/** Responsive image with reserved space (no layout shift) and a blurred preview. */
export function ArtworkImage({
  image,
  fallbackAlt,
  sizes,
  priority = false,
  aspectRatio,
  quality,
  className,
  imgClassName,
}: ArtworkImageProps) {
  if (!image?.src) {
    return (
      <div
        className={cx("bg-paper-deep", className)}
        style={{ aspectRatio: aspectRatio ?? 4 / 5 }}
        role="img"
        aria-label={`${fallbackAlt} (image unavailable)`}
      />
    );
  }

  const ratio = aspectRatio ?? image.src.width / image.src.height;
  const alt = altText(image, fallbackAlt);
  const common = {
    src: image.src,
    sizes,
    quality,
    preload: priority,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
    placeholder: image.src.blurDataURL ? ("blur" as const) : ("empty" as const),
  };

  return (
    <div className={cx("relative overflow-hidden bg-paper-deep", className)} style={{ aspectRatio: ratio }}>
      {aspectRatio ? (
        <Image {...common} alt={alt} fill className={cx("object-cover", imgClassName)} style={{ objectPosition: objectPosition(image) }} />
      ) : (
        <Image {...common} alt={alt} className={cx("h-full w-full object-cover", imgClassName)} />
      )}
    </div>
  );
}
