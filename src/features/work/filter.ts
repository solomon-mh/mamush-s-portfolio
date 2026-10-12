import type { WorkCard } from "@/content";

/** Keeps items belonging to the discipline (projects may belong to several). */
export function filterByDiscipline(items: WorkCard[], slug: string | null): WorkCard[] {
  if (!slug) return items;
  return items.filter((item) =>
    item._type === "project"
      ? item.disciplines.some((d) => d.slug === slug)
      : item.discipline?.slug === slug,
  );
}
