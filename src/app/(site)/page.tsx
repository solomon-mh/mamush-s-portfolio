import { ContactCTA } from "@/components/layout/ContactCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { getContactCta, getDisciplines, getHome, getProfile, getSettings } from "@/content";
import { ArtistIntro } from "@/features/home/ArtistIntro";
import { DisciplineEntries } from "@/features/home/DisciplineEntries";
import { FeaturedProject } from "@/features/home/FeaturedProject";
import { HomeHero } from "@/features/home/HomeHero";
import { Recognition } from "@/features/home/Recognition";
import { SelectedWork } from "@/features/home/SelectedWork";
import { enquiryDraft, mailtoHref } from "@/lib/email-links";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

/** The opening sentence of a bio, short enough to sit under the hero portrait. */
function firstSentence(text?: string | null): string | null {
  return text?.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text ?? null;
}

export default async function HomePage() {
  const home = await getHome();
  const profile = await getProfile();
  const site = await getSettings();
  const disciplines = await getDisciplines();

  return (
    <>
      <JsonLd data={personJsonLd(profile)} />
      <JsonLd data={websiteJsonLd(site.siteName)} />
      <HomeHero
        name={profile.name}
        headline={profile.headline}
        availability={site.announcement}
        availabilityHref={profile.email ? mailtoHref(profile.email, enquiryDraft(profile.name, "Commission")) : null}
        portrait={profile.portrait}
        location={profile.location}
        intro={firstSentence(profile.shortBio)}
        disciplines={disciplines}
      />
      <SelectedWork items={home.selectedWork} />
      <DisciplineEntries disciplines={disciplines} />
      {/* The portrait already opens the page, so the introduction is text only. */}
      <ArtistIntro name={profile.name} shortBio={profile.shortBio} statement={profile.statement} />
      {home.featuredProject && <FeaturedProject project={home.featuredProject} />}
      <Recognition items={profile.recognition} />
      <div className="pt-16 md:pt-24">
        <ContactCTA {...await getContactCta()} />
      </div>
    </>
  );
}
