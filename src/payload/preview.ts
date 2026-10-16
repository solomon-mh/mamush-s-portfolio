/** Opens a page of the site with unpublished drafts visible (signed-in users only). */
export function previewPath(path: string): string {
  return `/next/preview?path=${encodeURIComponent(path)}`;
}
