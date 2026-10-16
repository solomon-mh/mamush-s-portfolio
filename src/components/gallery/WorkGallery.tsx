import type { WorkCard as WorkCardData } from "@/content";
import { workImage } from "@/content/cards";
import { JustifiedRows } from "./JustifiedRows";
import { WorkCard } from "./WorkCard";

/** Projects and artworks in justified rows, each linking to its page. */
export function WorkGallery({
  items,
  rowHeight,
  maxRowHeight,
  maxPerRow,
  headingLevel = "h3",
  showDiscipline = true,
  morph = false,
  label,
}: {
  items: WorkCardData[];
  rowHeight?: number;
  maxRowHeight?: number;
  maxPerRow?: number;
  headingLevel?: "h2" | "h3";
  showDiscipline?: boolean;
  /** Morph thumbnails into detail pages (only where each work appears once). */
  morph?: boolean;
  label?: string;
}) {
  const entries = items.map((item) => {
    const src = workImage(item).src;
    return { key: item._id, ratio: src.width / src.height, item };
  });
  return (
    <JustifiedRows
      items={entries}
      rowHeight={rowHeight}
      maxRowHeight={maxRowHeight}
      maxPerRow={maxPerRow}
      label={label}
      renderItem={({ item }, sizes) => (
        <WorkCard item={item} sizes={sizes} headingLevel={headingLevel} showDiscipline={showDiscipline} morph={morph} />
      )}
    />
  );
}
