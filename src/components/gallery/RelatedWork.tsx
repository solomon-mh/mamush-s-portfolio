import type { WorkCard as WorkCardData } from "@/content";
import { WorkGallery } from "./WorkGallery";

export function RelatedWork({ title = "Related work", items }: { title?: string; items: WorkCardData[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-8 border-t border-rule pt-8 font-display text-title md:pt-10">
        {title}
      </h2>
      <WorkGallery items={items} rowHeight={260} maxRowHeight={340} maxPerRow={4} />
    </section>
  );
}
