import { joinParts } from "@/lib/utils";

const CATEGORY_TITLES: Record<string, string> = {
  client: "Clients",
  exhibition: "Exhibitions",
  publication: "Publications",
  award: "Awards",
  collaborator: "Collaborators",
  credit: "Credits",
};
const ORDER = ["client", "exhibition", "publication", "award", "collaborator", "credit"];

export interface RecognitionItem {
  category: string;
  title: string;
  detail?: string;
  year?: number;
  url?: string;
}

/** Group recognition by category, newest first. Exported for testing. */
export function groupRecognition(items: RecognitionItem[] | null | undefined) {
  const groups = new Map<string, RecognitionItem[]>();
  for (const item of items ?? []) {
    if (!item.title || !item.category || !(item.category in CATEGORY_TITLES)) continue;
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return ORDER.filter((c) => groups.has(c)).map((category) => ({
    category,
    title: CATEGORY_TITLES[category],
    items: groups.get(category)!.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  }));
}

/**
 * Professional credibility, only from details the artist has approved and
 * entered. The whole section is omitted when there is nothing to show.
 */
export function Recognition({
  items,
  headingLevel = "h2",
  title = "Selected recognition",
}: {
  items: RecognitionItem[] | null | undefined;
  headingLevel?: "h2" | "h3";
  title?: string;
}) {
  const groups = groupRecognition(items);
  if (groups.length === 0) return null;
  const Heading = headingLevel;
  const SubHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section aria-labelledby="recognition" className="page-gutter mx-auto max-w-page py-16 md:py-24">
      <Heading id="recognition" className="mb-10 font-display text-title">
        {title}
      </Heading>
      <div className="grid gap-x-8 gap-y-12 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.category}>
            <SubHeading className="mb-4 text-label text-graphite">{group.title}</SubHeading>
            <ul role="list" className="flex flex-col gap-3">
              {group.items.map((item) => {
                const detail = joinParts([item.detail, item.year]);
                const content = (
                  <>
                    <span className="block">{item.title}</span>
                    {detail && <span className="block text-label text-graphite">{detail}</span>}
                  </>
                );
                return (
                  <li key={`${item.category}-${item.title}-${item.year ?? ""}`}>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {content}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
