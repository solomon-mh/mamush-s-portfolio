import { SalonHang } from "@/components/gallery/SalonHang";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { WorkCard } from "@/content";

export function SelectedWork({ items }: { items: WorkCard[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="selected-work" className="page-gutter mx-auto max-w-page pb-24 md:pb-40">
      <SectionHeading id="selected-work" title="Selected work" link={{ href: "/work", label: "See all work" }} />
      <SalonHang items={items} />
    </section>
  );
}
