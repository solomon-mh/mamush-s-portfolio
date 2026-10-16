import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SplitSection } from "@/components/layout/SplitSection";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { Prose } from "@/components/ui/Prose";
import { getContactCta, getDisciplines, getImageCredits, getProfile } from "@/content";
import { Recognition } from "@/features/home/Recognition";
import { hrefFor } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return buildPageMetadata({
    title: `About ${profile.name}`,
    description: profile.shortBio || profile.headline,
    path: "/about",
    image: profile.portrait,
  });
}

export default async function AboutPage() {
  const profile = await getProfile();
  const disciplines = await getDisciplines();
  const studio = profile.studioImages ?? [];
  const credits = await getImageCredits();

  return (
    <>
      <PageHeader title={`About ${profile.name}`} intro={profile.headline} />

      <div className="page-gutter mx-auto max-w-page pb-16 md:pb-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          {profile.portrait && (
            <figure className="md:col-span-5">
              <ArtworkImage
                image={profile.portrait}
                fallbackAlt={`Portrait of ${profile.name}`}
                priority
                aspectRatio={4 / 5}
                sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
              />
              {profile.portrait.caption && <figcaption className="mt-3 text-label text-graphite">{profile.portrait.caption}</figcaption>}
            </figure>
          )}
          <div className={profile.portrait ? "md:col-span-7 lg:col-span-6 lg:col-start-7" : "md:col-span-8 md:col-start-3"}>
            <section aria-labelledby="bio-heading">
              <h2 id="bio-heading" className="sr-only">
                Biography
              </h2>
              <Prose text={profile.fullBio || profile.shortBio} className="text-lede text-ink-soft" />
            </section>
            {profile.location && <p className="mt-8 text-graphite">Based in {profile.location}</p>}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
              <Link href="/contact" className="btn btn-primary">
                Get in touch
              </Link>
              {profile.resume && (
                <a href={profile.resume} download className="btn btn-secondary">
                  Download CV (PDF)
                </a>
              )}
              <SocialLinks links={profile.socialLinks} />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-16 md:mt-28 md:gap-20">
          {profile.statement && (
            <SplitSection id="statement-heading" title="Artist statement">
              <div className="border-l-2 border-accent pl-6">
                <Prose text={profile.statement} className="font-display text-[1.5rem] italic leading-snug text-ink md:text-[1.75rem]" />
              </div>
            </SplitSection>
          )}

          {profile.approach && (
            <SplitSection id="approach-heading" title="Working together">
              <Prose text={profile.approach} className="text-lede text-ink-soft" />
            </SplitSection>
          )}

          {disciplines.length > 0 && (
            <SplitSection id="disciplines-heading" title="Disciplines">
              <ul role="list" className="grid gap-x-8 sm:grid-cols-2">
                {disciplines.map((d) => (
                  <li key={d._id} className="border-b border-rule">
                    <Link href={hrefFor("discipline", d.slug)!} className="group block py-4">
                      <span className="font-display text-[1.375rem] decoration-1 underline-offset-[0.18em] group-hover:underline">{d.title}</span>
                      {d.shortDescription && <span className="mt-1 block text-small text-graphite">{d.shortDescription}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </SplitSection>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <SplitSection id="experience-heading" title="Experience">
              <dl className="flex flex-col">
                {profile.experience.map((item) => (
                  <div key={`${item.period}-${item.title}`} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-rule py-3">
                    <dt className="text-label text-graphite">{item.period}</dt>
                    <dd>
                      {item.title}
                      {item.organisation && <span className="text-graphite">, {item.organisation}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </SplitSection>
          )}

          {studio.length > 0 && (
            <SplitSection id="studio-heading" title="In the studio">
              <ul role="list" className="grid gap-6 sm:grid-cols-2">
                {studio.map((img, i) => (
                  <li key={i}>
                    <figure>
                      <ArtworkImage image={img} fallbackAlt="Studio" sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw" />
                      {img.caption && <figcaption className="mt-2 text-label text-graphite">{img.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            </SplitSection>
          )}
        </div>
      </div>

      <Recognition items={profile.recognition} />

      {credits.length > 0 && (
        <div id="credits" className="page-gutter mx-auto max-w-page scroll-mt-24 pb-16 md:pb-24">
          <SplitSection id="credits-heading" title="Image credits">
            <ul role="list" className="flex flex-col text-small text-graphite">
              {credits.map((c) => (
                <li key={c.href} className="border-b border-rule py-2.5">
                  <Link href={c.href} className="link-quiet text-ink">
                    {c.title}
                  </Link>
                  <span> — {c.credit}</span>
                </li>
              ))}
            </ul>
          </SplitSection>
        </div>
      )}

      <ContactCTA {...await getContactCta()} />
    </>
  );
}
