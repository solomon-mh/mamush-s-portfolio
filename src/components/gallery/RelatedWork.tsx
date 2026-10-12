import type { WorkCard as WorkCardData } from "@/content";
import { WorkCard } from "./WorkCard";

export function RelatedWork({ title = "Related work", items }: { title?: string; items: WorkCardData[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="border-t border-rule pt-10">
      <h2 id="related-heading" className="mb-10 font-display text-title">
        {title}
      </h2>
      <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item._id}>
            <WorkCard item={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
