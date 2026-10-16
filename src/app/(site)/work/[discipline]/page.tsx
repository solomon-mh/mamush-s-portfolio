import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { findRedirect, getContactCta, getDisciplinePage, getDisciplines, getStaticSlugs } from "@/content";
import { DisciplineView } from "@/features/disciplines/DisciplineView";
import { buildPageMetadata } from "@/lib/seo";

/*
 * Pages are generated at build time. Works published later render on their
 * first visit; unknown slugs are a 404.
 */
export async function generateStaticParams() {
  return (await getStaticSlugs("discipline")).map(({ slug }) => ({ discipline: slug }));
}

async function load(slug: string) {
  const discipline = await getDisciplinePage(slug);
  if (discipline) return discipline;
  const current = await findRedirect("discipline", slug);
  if (current) permanentRedirect(`/work/${current}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/work/[discipline]">): Promise<Metadata> {
  const discipline = await getDisciplinePage((await params).discipline);
  if (!discipline) return {};
  return buildPageMetadata({
    title: discipline.title,
    description: discipline.seo?.description ?? discipline.shortDescription,
    path: `/work/${discipline.slug}`,
    seo: discipline.seo,
    image: discipline.cover,
  });
}

export default async function DisciplinePage({ params }: PageProps<"/work/[discipline]">) {
  const discipline = await load((await params).discipline);
  return (
    <>
      <DisciplineView
        discipline={discipline}
        switcher={(await getDisciplines()).map((d) => ({
          href: `/work/${d.slug}`,
          label: d.title,
          count: d.workCount,
          active: d.slug === discipline.slug,
        }))}
      />
      <div className="pt-16 md:pt-24">
        <ContactCTA {...await getContactCta()} />
      </div>
    </>
  );
}
