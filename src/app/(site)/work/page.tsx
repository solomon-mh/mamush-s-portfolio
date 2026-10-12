import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/gallery/WorkCard";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { EmptyState } from "@/components/ui/States";
import { getDisciplines, getProfile, getSettings, getWorkIndex } from "@/content";
import { filterByDiscipline } from "@/features/work/filter";
import { buildPageMetadata } from "@/lib/seo";
import { cx } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Work",
  description: "Selected paintings, illustrations, animation and projects.",
  path: "/work",
});

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cx(
        "inline-flex min-h-11 items-center rounded-full px-4 transition-colors",
        active ? "bg-ink text-paper" : "hover:bg-paper-deep",
      )}
    >
      {label}
    </Link>
  );
}

/** The filter lives in the URL (?discipline=…) so filtered views can be shared. */
export default async function WorkPage({ searchParams }: PageProps<"/work">) {
  const { discipline: rawFilter } = await searchParams;
  const site = getSettings();
  const profile = getProfile();
  const disciplines = getDisciplines();
  const requested = typeof rawFilter === "string" ? rawFilter : null;
  const active = disciplines.find((d) => d.slug === requested) ?? null;
  const shown = filterByDiscipline(getWorkIndex(), active?.slug ?? null);

  return (
    <>
      <div className="page-gutter mx-auto max-w-page pb-16 pt-10 md:pt-16">
        <header className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12">
          <h1 className="font-display text-display md:col-span-6">Work</h1>
          {(profile.headline || site.siteDescription) && (
            <p className="max-w-prose text-lede text-graphite md:col-span-5 md:col-start-8 md:pt-4">
              {profile.headline || site.siteDescription}
            </p>
          )}
        </header>

        {disciplines.length > 1 && (
          <nav aria-label="Filter by discipline" className="mb-14 border-y border-rule py-2 md:mb-20">
            <ul role="list" className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <FilterLink href="/work" active={!active} label="All" />
              </li>
              {disciplines.map((d) => (
                <li key={d._id}>
                  <FilterLink href={`/work?discipline=${d.slug}`} active={active?._id === d._id} label={d.title} />
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p className="sr-only" aria-live="polite">
          {active ? `Showing ${shown.length} works in ${active.title}` : `Showing all ${shown.length} works`}
        </p>

        {active && (
          <p className="mb-10 text-graphite">
            {active.shortDescription}{" "}
            <Link href={`/work/${active.slug}`} className="link-quiet text-ink">
              Visit the {active.title.toLowerCase()} page
            </Link>
          </p>
        )}

        {shown.length === 0 ? (
          <EmptyState
            title={active ? `No ${active.title.toLowerCase()} work is published yet` : "No work is published yet"}
            action={active ? { href: "/work", label: "Show all work" } : undefined}
          />
        ) : (
          <ul role="list" aria-label={active ? `${active.title} works` : "All works"} className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {shown.map((item) => (
              <li key={item._id} className="mb-14 break-inside-avoid">
                <WorkCard
                  item={item}
                  morph
                  showDiscipline={!active}
                  headingLevel="h2"
                  sizes="(min-width: 1440px) 430px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
