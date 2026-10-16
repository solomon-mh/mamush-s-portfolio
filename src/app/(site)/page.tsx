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
        artwork={home.heroArtwork}
        loopUrl={home.heroLoop}
        disciplines={disciplines}
      />
      <SelectedWork items={home.selectedWork} />
      <DisciplineEntries disciplines={disciplines} />
      <ArtistIntro name={profile.name} shortBio={profile.shortBio} statement={profile.statement} portrait={profile.portrait} />
      {home.featuredProject && <FeaturedProject project={home.featuredProject} />}
      <Recognition items={profile.recognition} />
      <div className="pt-16 md:pt-24">
        <ContactCTA {...await getContactCta()} />
      </div>
    </>
  );
}
