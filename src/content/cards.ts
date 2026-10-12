import type { ArtImage } from "./types";
import type { DisciplineRef, WorkCard } from "./index";

export function workImage(item: WorkCard): ArtImage {
  return item._type === "project" ? item.coverImage : item.image;
}

export function primaryDiscipline(item: WorkCard): DisciplineRef | null {
  return item._type === "artwork" ? item.discipline : (item.disciplines[0] ?? null);
}
