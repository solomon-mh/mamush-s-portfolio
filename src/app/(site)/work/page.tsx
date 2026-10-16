import type { Metadata } from "next";
import Link from "next/link";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { PageHeader } from "@/components/layout/PageHeader";
import { DisciplineSwitcher } from "@/components/navigation/DisciplineSwitcher";
import { EmptyState } from "@/components/ui/States";
import { getContactCta, getDisciplines, getProfile, getSettings, getWorkIndex } from "@/content";
import { filterByDiscipline } from "@/features/work/filter";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Work",
  description: "Selected paintings, illustrations, animation and projects.",
  path: "/work",
});

/** The filter lives in the URL (?discipline=…) so filtered views can be shared. */
export default async function WorkPage({ searchParams }: PageProps<"/work">) {
  const { discipline: rawFilter } = await searchParams;
  const site = await getSettings();
  const profile = await getProfile();
  const disciplines = await getDisciplines();
  const all = await getWorkIndex();
  const requested = typeof rawFilter === "string" ? rawFilter : null;
  const active = disciplines.find((d) => d.slug === requested) ?? null;
  const shown = filterByDiscipline(all, active?.slug ?? null);

  const filters = [
    { href: "/work", label: "All", count: all.length, active: !active },
    ...disciplines.map((d) => ({
      href: `/work?discipline=${d.slug}`,
      label: d.title,
      count: filterByDiscipline(all, d.slug).length,
      active: active?._id === d._id,
    })),
  ];

  return (
    <>
      <PageHeader title="Work" intro={profile.headline || site.siteDescription}>
        <DisciplineSwitcher items={filters} label="Filter by discipline" />
      </PageHeader>

      <div className="page-gutter mx-auto max-w-page pb-16 md:pb-24">
        <p className="sr-only" aria-live="polite">
          {active ? `Showing ${shown.length} works in ${active.title}` : `Showing all ${shown.length} works`}
        </p>

        {active && (
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-5">
            <p className="max-w-[60ch] text-graphite">{active.shortDescription}</p>
            <Link href={`/work/${active.slug}`} className="link-quiet inline-flex min-h-11 items-center text-small">
              Open the {active.title.toLowerCase()} room
            </Link>
          </div>
        )}

        {shown.length === 0 ? (
          <EmptyState
            title={active ? `No ${active.title.toLowerCase()} work is published yet` : "No work is published yet"}
            action={active ? { href: "/work", label: "Show all work" } : undefined}
          />
        ) : (
          <WorkGallery
            items={shown}
            morph
            showDiscipline={!active}
            headingLevel="h2"
            rowHeight={320}
            maxRowHeight={430}
            maxPerRow={4}
            label={active ? `${active.title} works` : "All works"}
          />
        )}
      </div>
      <ContactCTA {...await getContactCta()} />
    </>
  );
}
