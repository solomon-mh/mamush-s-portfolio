import { ContactCTA } from "@/components/layout/ContactCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { getDisciplines, getHome, getProfile, getSettings } from "@/content";
import { ArtistIntro } from "@/features/home/ArtistIntro";
import { DisciplineEntries } from "@/features/home/DisciplineEntries";
import { FeaturedProject } from "@/features/home/FeaturedProject";
import { HomeHero } from "@/features/home/HomeHero";
import { Recognition } from "@/features/home/Recognition";
import { SelectedWork } from "@/features/home/SelectedWork";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  const home = getHome();
  const profile = getProfile();
  const site = getSettings();

  return (
    <>
      <JsonLd data={personJsonLd(profile)} />
      <JsonLd data={websiteJsonLd(site.siteName)} />
      <HomeHero name={profile.name} headline={profile.headline} artwork={home.heroArtwork} loopUrl={home.heroLoop} />
      <SelectedWork items={home.selectedWork} />
      <DisciplineEntries disciplines={getDisciplines()} />
      {home.featuredProject && <FeaturedProject project={home.featuredProject} />}
      <ArtistIntro name={profile.name} shortBio={profile.shortBio} portrait={profile.portrait} />
      <Recognition items={profile.recognition} />
      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
