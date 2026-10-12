import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { Prose } from "@/components/ui/Prose";
import { getDisciplines, getImageCredits, getProfile, getSettings } from "@/content";
import { Recognition } from "@/features/home/Recognition";
import { hrefFor } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const profile = getProfile();
  return buildPageMetadata({
    title: `About ${profile.name}`,
    description: profile.shortBio || profile.headline,
    path: "/about",
    image: profile.portrait,
  });
}

export default function AboutPage() {
  const profile = getProfile();
  const site = getSettings();
  const disciplines = getDisciplines();
  const studio = profile.studioImages ?? [];
  const credits = getImageCredits();

  return (
    <>
      <div className="page-gutter mx-auto max-w-page pb-20 pt-10 md:pt-16">
        <header className="grid gap-10 md:grid-cols-12 md:gap-8">
          <h1 className="font-display text-display md:col-span-7">About {profile.name}</h1>
          {profile.headline && <p className="text-lede text-graphite md:col-span-5 md:pt-4">{profile.headline}</p>}
        </header>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-8">
          {profile.portrait && (
            <figure className="md:col-span-5">
              <ArtworkImage image={profile.portrait} fallbackAlt={`Portrait of ${profile.name}`} priority sizes="(min-width: 768px) 40vw, 100vw" />
              {profile.portrait.caption && <figcaption className="mt-2 text-label text-graphite">{profile.portrait.caption}</figcaption>}
            </figure>
          )}
          <div className={profile.portrait ? "md:col-span-6 md:col-start-7" : "md:col-span-8 md:col-start-3"}>
            <section aria-labelledby="bio-heading">
              <h2 id="bio-heading" className="sr-only">
                Biography
              </h2>
              <Prose text={profile.fullBio || profile.shortBio} className="text-lede" />
            </section>
            {profile.location && <p className="mt-8 text-graphite">Based in {profile.location}</p>}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {profile.resume && (
                <a
                  href={profile.resume}
                  download
                  className="inline-flex min-h-12 items-center rounded-full border border-ink px-6 hover:bg-ink hover:text-paper"
                >
                  Download CV (PDF)
                </a>
              )}
              <SocialLinks links={profile.socialLinks} />
            </div>
          </div>
        </div>

        {profile.statement && (
          <section aria-labelledby="statement-heading" className="mt-24 grid gap-8 border-t border-rule pt-10 md:mt-36 md:grid-cols-12">
            <h2 id="statement-heading" className="font-display text-title md:col-span-4">
              Artist statement
            </h2>
            <Prose text={profile.statement} className="text-lede md:col-span-7 md:col-start-6" />
          </section>
        )}

        {profile.approach && (
          <section aria-labelledby="approach-heading" className="mt-24 grid gap-8 border-t border-rule pt-10 md:grid-cols-12">
            <h2 id="approach-heading" className="font-display text-title md:col-span-4">
              Working together
            </h2>
            <Prose text={profile.approach} className="md:col-span-7 md:col-start-6" />
          </section>
        )}

        {disciplines.length > 0 && (
          <section aria-labelledby="disciplines-heading" className="mt-24 grid gap-8 border-t border-rule pt-10 md:grid-cols-12">
            <h2 id="disciplines-heading" className="font-display text-title md:col-span-4">
              Disciplines
            </h2>
            <ul role="list" className="md:col-span-7 md:col-start-6">
              {disciplines.map((d) => (
                <li key={d._id} className="border-b border-rule py-4 first:pt-0">
                  <Link href={hrefFor("discipline", d.slug)!} className="font-display text-lede hover:italic">
                    {d.title}
                  </Link>
                  {d.shortDescription && <p className="mt-1 text-graphite">{d.shortDescription}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.experience && profile.experience.length > 0 && (
          <section aria-labelledby="experience-heading" className="mt-24 grid gap-8 border-t border-rule pt-10 md:grid-cols-12">
            <h2 id="experience-heading" className="font-display text-title md:col-span-4">
              Experience
            </h2>
            <dl className="flex flex-col gap-4 md:col-span-7 md:col-start-6">
              {profile.experience.map((item) => (
                <div key={`${item.period}-${item.title}`} className="grid grid-cols-[8rem_1fr] gap-4">
                  <dt className="text-label text-graphite">{item.period}</dt>
                  <dd>
                    {item.title}
                    {item.organisation && <span className="text-graphite">, {item.organisation}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {studio.length > 0 && (
          <section aria-labelledby="studio-heading" className="mt-24 md:mt-36">
            <h2 id="studio-heading" className="mb-10 font-display text-title">
              In the studio
            </h2>
            <ul role="list" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {studio.map((img, i) => (
                <li key={i}>
                  <figure>
                    <ArtworkImage image={img} fallbackAlt="Studio" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                    {img.caption && <figcaption className="mt-2 text-label text-graphite">{img.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Recognition items={profile.recognition} />

      {credits.length > 0 && (
        <section id="credits" aria-labelledby="credits-heading" className="page-gutter mx-auto max-w-page scroll-mt-8 pb-12">
          <h2 id="credits-heading" className="mb-6 font-display text-title">
            Image credits
          </h2>
          <ul role="list" className="grid gap-x-8 gap-y-2 text-label text-graphite md:grid-cols-2">
            {credits.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-ink hover:underline">
                  {c.title}
                </Link>{" "}
                — {c.credit}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
