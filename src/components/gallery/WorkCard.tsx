import Link from "next/link";
import { ViewTransition } from "react";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { hrefFor } from "@/lib/routes";
import type { WorkCard as WorkCardData } from "@/content";
import { primaryDiscipline, workImage } from "@/content/cards";
import { WallLabel } from "./WallLabel";

interface WorkCardProps {
  item: WorkCardData;
  sizes: string;
  priority?: boolean;
  /** Optional art-directed crop; omitted by default to preserve the original proportions. */
  aspectRatio?: number;
  headingLevel?: "h2" | "h3";
  showDiscipline?: boolean;
  /**
   * Morph this image into the detail page's image on navigation. Only enable
   * where the work appears once on the page (transition names must be unique).
   */
  morph?: boolean;
  className?: string;
}

/** A linked image with its wall label. The whole card is one link with a clear accessible name. */
export function WorkCard({
  item,
  sizes,
  priority,
  aspectRatio,
  headingLevel = "h3",
  showDiscipline = true,
  morph = false,
  className,
}: WorkCardProps) {
  const href = hrefFor(item._type, item.slug);
  const title = item.title;
  const discipline = primaryDiscipline(item);

  const lines =
    item._type === "project"
      ? [showDiscipline ? discipline?.title : null, item.client]
      : [showDiscipline ? discipline?.title : null, item.medium];

  const image = (
    <ArtworkImage
      image={workImage(item)}
      fallbackAlt={title}
      sizes={sizes}
      priority={priority}
      aspectRatio={aspectRatio}
      className="card-media"
    />
  );

  const content = (
    <>
      {morph ? (
        <ViewTransition name={`work-${item._type}-${item.slug}`} share="morph" default="none">
          {image}
        </ViewTransition>
      ) : (
        image
      )}
      <WallLabel title={title} year={item.year} lines={lines} as={headingLevel} className="mt-3.5" />
    </>
  );

  if (!href) return <article className={className}>{content}</article>;

  return (
    <article className={className}>
      <Link href={href} className="group block focus-visible:outline-offset-4">
        {content}
      </Link>
    </article>
  );
}
