import type { ArtImage } from "@/content/types";

/** Intrinsic dimensions of a content image. */
export function imageDimensions(image: ArtImage | null | undefined): { width: number; height: number } | null {
  if (!image?.src?.width || !image.src.height) return null;
  return { width: image.src.width, height: image.src.height };
}

/** Text alternative: empty for decorative images, otherwise the author's alt or a fallback. */
export function altText(image: ArtImage | null | undefined, fallback: string): string {
  if (!image || image.decorative) return "";
  return image.alt?.trim() || fallback;
}

/** Focal point as a CSS object-position, for layouts that deliberately crop. */
export function objectPosition(image: ArtImage): string {
  const { x = 0.5, y = 0.5 } = image.focus ?? {};
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}
