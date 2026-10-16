import { WorkGallery } from "@/components/gallery/WorkGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { WorkCard } from "@/content";

export function SelectedWork({ items }: { items: WorkCard[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="selected-work" className="page-gutter section-space mx-auto max-w-page">
      <SectionHeading
        id="selected-work"
        title="Selected work"
        description="A short, curated selection — start here."
        link={{ href: "/work", label: "View all work" }}
      />
      <WorkGallery items={items} rowHeight={340} maxRowHeight={460} maxPerRow={3} />
    </section>
  );
}
