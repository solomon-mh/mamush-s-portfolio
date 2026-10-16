import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/*
 * Every public page is generated ahead of time. When the artist saves
 * something in the admin, the whole site is refreshed so the change shows
 * everywhere it appears (home, work index, discipline pages, sitemap…).
 * The site is small, so refreshing everything is simpler and safer than
 * tracking which pages a change touches.
 */
function refreshSite(context: Record<string, unknown>) {
  if (context.disableRevalidate) return;
  try {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
  } catch {
    // Outside a Next.js request (e.g. the seed script) there is nothing to refresh.
  }
}

type Versioned = { _status?: "draft" | "published" | null };

/** Refreshes after publishing or unpublishing — not after every draft autosave. */
export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  const now = (doc as Versioned)._status;
  const before = (previousDoc as Versioned | undefined)?._status;
  if (now === undefined || now === "published" || before === "published") refreshSite(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  refreshSite(req.context);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  refreshSite(req.context);
  return doc;
};
