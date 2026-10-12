export interface SequenceItem {
  _id: string;
  title: string;
  slug: string;
}

/**
 * Previous and next works in the discipline's display order. Wraps around
 * only when there are more than two works, so the sequence feels like a
 * gallery loop rather than a toggle.
 */
export function getSequenceNeighbours(sequence: SequenceItem[] | null | undefined, currentId: string) {
  const items = (sequence ?? []).filter((item) => item.slug);
  const index = items.findIndex((item) => item._id === currentId);
  if (index === -1 || items.length < 2) return { previous: null, next: null };
  const wrap = items.length > 2;
  const previous = index > 0 ? items[index - 1] : wrap ? items[items.length - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : wrap ? items[0] : null;
  return { previous, next };
}
