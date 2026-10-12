import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { findRedirect, getDisciplinePage, getProfile, getSettings, getStaticSlugs } from "@/content";
import { DisciplineView } from "@/features/disciplines/DisciplineView";
import { buildPageMetadata } from "@/lib/seo";

/** Every page is generated at build time; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticSlugs("discipline").map(({ slug }) => ({ discipline: slug }));
}

function load(slug: string) {
  const discipline = getDisciplinePage(slug);
  if (discipline) return discipline;
  const current = findRedirect("discipline", slug);
  if (current) permanentRedirect(`/work/${current}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/work/[discipline]">): Promise<Metadata> {
  const discipline = getDisciplinePage((await params).discipline);
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
  const discipline = load((await params).discipline);
  const site = getSettings();
  const profile = getProfile();
  return (
    <>
      <DisciplineView discipline={discipline} />
      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
