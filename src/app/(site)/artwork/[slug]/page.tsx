import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ViewTransition } from "react";
import { toLightboxItems } from "@/components/gallery/ArtworkGallery";
import { Lightbox, LightboxTrigger } from "@/components/gallery/Lightbox";
import { RelatedWork } from "@/components/gallery/RelatedWork";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { EmailButtons } from "@/components/ui/EmailButtons";
import { JsonLd } from "@/components/ui/JsonLd";
import { paragraphs, Prose } from "@/components/ui/Prose";
import { findRedirect, getArtwork, getProfile, getStaticSlugs } from "@/content";
import { getSequenceNeighbours } from "@/features/artwork/sequence";
import { hrefFor } from "@/lib/routes";
import { buildPageMetadata, creativeWorkJsonLd } from "@/lib/seo";

/** Every page is generated at build time; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticSlugs("artwork");
}

function load(slug: string) {
  const artwork = getArtwork(slug);
  if (artwork) return artwork;
  const current = findRedirect("artwork", slug);
  if (current) permanentRedirect(`/artwork/${current}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/artwork/[slug]">): Promise<Metadata> {
  const artwork = getArtwork((await params).slug);
  if (!artwork) return {};
  return buildPageMetadata({
    title: artwork.title,
    description: paragraphs(artwork.description)[0] || artwork.image.alt,
    path: `/artwork/${artwork.slug}`,
    image: artwork.image,
    type: "article",
  });
}

export default async function ArtworkPage({ params }: PageProps<"/artwork/[slug]">) {
  const artwork = load((await params).slug);
  const profile = getProfile();
  const { previous, next } = getSequenceNeighbours(artwork.sequence, `artwork:${artwork.slug}`);
  const ratio = artwork.image.src.width / artwork.image.src.height;

  return (
    <>
      <JsonLd
        data={creativeWorkJsonLd({
          type: "VisualArtwork",
          title: artwork.title,
          path: `/artwork/${artwork.slug}`,
          description: paragraphs(artwork.description).join(" "),
          year: artwork.year,
          image: artwork.image,
          creatorName: profile.name,
          medium: artwork.medium,
        })}
      />
      <article className="page-gutter mx-auto max-w-page pb-16 pt-6 md:pb-24 md:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-2 text-label text-graphite">
            <li className="flex items-center gap-2 after:opacity-50 after:content-['/']">
              <Link href="/work" className="link-quiet inline-flex min-h-8 items-center">
                Work
              </Link>
            </li>
            {artwork.discipline && (
              <li>
                <Link href={hrefFor("discipline", artwork.discipline.slug)!} className="link-quiet inline-flex min-h-8 items-center">
                  {artwork.discipline.title}
                </Link>
              </li>
            )}
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* The work first, as large as the screen allows, never cropped. */}
          <div className="flex items-center justify-center bg-paper-deep p-5 sm:p-10 lg:col-span-8 lg:min-h-[calc(100svh-var(--header-height)-6rem)] lg:p-14">
            <div className="w-full" style={{ maxWidth: `min(100%, calc((100svh - var(--header-height) - 13rem) * ${ratio.toFixed(4)}))` }}>
              <Lightbox items={toLightboxItems([artwork.card])} label={`${artwork.title}, full screen`}>
                <LightboxTrigger index={0} label={artwork.title}>
                  <ViewTransition name={`work-artwork-${artwork.slug}`} share="morph" default="none">
                    <ArtworkImage
                      image={artwork.image}
                      fallbackAlt={artwork.title}
                      priority
                      quality={85}
                      className="shadow-[0_18px_40px_-24px_rgba(24,24,26,0.45)]"
                      sizes="(min-width: 1440px) 820px, (min-width: 1024px) 60vw, 100vw"
                    />
                  </ViewTransition>
                </LightboxTrigger>
              </Lightbox>
              <p className="mt-3 text-center text-label text-graphite">Select the image to view it full screen.</p>
            </div>
          </div>

          <aside aria-labelledby="artwork-title" className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <h1 id="artwork-title" className="font-display text-title italic text-balance">
                {artwork.title}
              </h1>
              {artwork.year && <p className="mt-1 text-lede text-graphite">{artwork.year}</p>}

              <dl className="mt-8 divide-y divide-rule border-y border-rule">
                {[
                  ["Medium", artwork.medium],
                  ["Dimensions", artwork.dimensions],
                  ["Series", artwork.series],
                ]
                  .filter((row): row is [string, string] => Boolean(row[1]))
                  .map(([term, value]) => (
                    <div key={term} className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                      <dt className="text-label text-graphite">{term}</dt>
                      <dd className="text-small">{value}</dd>
                    </div>
                  ))}
                {artwork.project && (
                  <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                    <dt className="text-label text-graphite">Project</dt>
                    <dd className="text-small">
                      <Link href={hrefFor("project", artwork.project.slug)!} className="link-quiet">
                        {artwork.project.title}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>

              {artwork.image.caption && <p className="mt-6 text-graphite">{artwork.image.caption}</p>}
              <Prose text={artwork.description} className="mt-6 text-ink-soft" />
              {artwork.rights && <p className="mt-6 text-label text-graphite">{artwork.rights}</p>}

              {profile.email && (
                <EmailButtons
                  to={profile.email}
                  artistName={profile.name}
                  subject={`Enquiry about “${artwork.title}”`}
                  primaryLabel="Enquire about this work"
                  className="mt-8"
                />
              )}
              {artwork.discipline && (
                <Link href={hrefFor("discipline", artwork.discipline.slug)!} className="link-quiet mt-5 inline-flex min-h-11 items-center text-small">
                  More {artwork.discipline.title.toLowerCase()}
                </Link>
              )}

              {(previous || next) && (
                <nav aria-label="More artworks" className="mt-10">
                  <ul role="list" className="grid grid-cols-2 gap-6 border-t border-rule pt-5">
                    <li>
                      {previous && (
                        <Link href={hrefFor("artwork", previous.slug)!} rel="prev" className="group inline-flex min-h-11 flex-col">
                          <span className="text-label text-graphite">Previous</span>
                          <span className="font-display italic leading-snug decoration-1 underline-offset-[0.18em] group-hover:underline">{previous.title}</span>
                        </Link>
                      )}
                    </li>
                    <li className="text-right">
                      {next && (
                        <Link href={hrefFor("artwork", next.slug)!} rel="next" className="group inline-flex min-h-11 flex-col items-end">
                          <span className="text-label text-graphite">Next</span>
                          <span className="font-display italic leading-snug decoration-1 underline-offset-[0.18em] group-hover:underline">{next.title}</span>
                        </Link>
                      )}
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </aside>
        </div>

        {artwork.related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <RelatedWork title={artwork.series ? `More from ${artwork.series}` : "Related works"} items={artwork.related} />
          </div>
        )}
      </article>
      <ContactCTA />
    </>
  );
}
