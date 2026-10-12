import type { StaticImageData } from "next/image";
import type { ImgHTMLAttributes } from "react";

/**
 * Stand-in for next/image in jsdom: renders a plain <img> with the attributes
 * the real component would set, plus a srcset of optimised widths, so tests
 * can assert sizing, loading priority and alt text.
 */
const WIDTHS = [640, 750, 828, 1080, 1200, 1920];

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: StaticImageData | string;
  fill?: boolean;
  quality?: number;
  preload?: boolean;
  placeholder?: string;
  blurDataURL?: string;
};

export default function MockImage({ src, fill, quality, preload, placeholder, blurDataURL, ...rest }: Props) {
  void quality;
  void placeholder;
  void blurDataURL;
  const data = typeof src === "string" ? { src, width: undefined, height: undefined } : src;
  const url = (w: number) => `/_next/image?url=${encodeURIComponent(data.src)}&w=${w}&q=75`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={rest.alt}
      src={url(1920)}
      srcSet={WIDTHS.map((w) => `${url(w)} ${w}w`).join(", ")}
      width={fill ? undefined : data.width}
      height={fill ? undefined : data.height}
      data-fill={fill ? "true" : undefined}
      data-preload={preload ? "true" : undefined}
    />
  );
}

/** Mirrors next/image's getImageProps for server code that needs a URL (e.g. video posters). */
export function getImageProps({ src, width }: { src: StaticImageData | string; width?: number }) {
  const path = typeof src === "string" ? src : src.src;
  return { props: { src: `/_next/image?url=${encodeURIComponent(path)}&w=${width ?? 1920}&q=75` } };
}
