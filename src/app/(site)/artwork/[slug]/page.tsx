import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ViewTransition } from "react";
import { toLightboxItems } from "@/components/gallery/ArtworkGallery";
import { Lightbox, LightboxTrigger } from "@/components/gallery/Lightbox";
import { RelatedWork } from "@/components/gallery/RelatedWork";
import { ContactCTA } from "@/components/layout/ContactCTA";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { JsonLd } from "@/components/ui/JsonLd";
import { paragraphs, Prose } from "@/components/ui/Prose";
import { findRedirect, getArtwork, getProfile, getSettings, getStaticSlugs } from "@/content";
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
  const site = getSettings();
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
      <article className="pb-10 pt-6 md:pt-10">
        {/* The work first, as large as the screen allows, never cropped. */}
        <div className="page-gutter mx-auto max-w-page">
          <div className="mx-auto" style={{ width: `min(100%, calc(84svh * ${ratio.toFixed(4)}))` }}>
            <Lightbox items={toLightboxItems([artwork.card])} label={`${artwork.title}, full screen`}>
              <LightboxTrigger index={0} label={artwork.title}>
                <ViewTransition name={`work-artwork-${artwork.slug}`} share="morph" default="none">
                  <ArtworkImage image={artwork.image} fallbackAlt={artwork.title} priority quality={85} sizes="(min-width: 1440px) 1280px, 100vw" />
                </ViewTransition>
              </LightboxTrigger>
            </Lightbox>
          </div>
        </div>

        <div className="page-gutter mx-auto mt-10 grid max-w-page gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
          <header className="md:col-span-4">
            <h1 className="font-display text-title italic">
              {artwork.title}
              {artwork.year ? <span className="font-sans not-italic text-graphite">, {artwork.year}</span> : null}
            </h1>
            <dl className="mt-4 flex flex-col gap-1 text-graphite">
              {artwork.medium && (
                <div>
                  <dt className="sr-only">Medium</dt>
                  <dd>{artwork.medium}</dd>
                </div>
              )}
              {artwork.dimensions && (
                <div>
                  <dt className="sr-only">Dimensions</dt>
                  <dd>{artwork.dimensions}</dd>
                </div>
              )}
              {artwork.series && (
                <div>
                  <dt className="sr-only">Series</dt>
                  <dd>From the series {artwork.series}</dd>
                </div>
              )}
              {artwork.rights && (
                <div>
                  <dt className="sr-only">Credits and rights</dt>
                  <dd className="text-label">{artwork.rights}</dd>
                </div>
              )}
            </dl>
            <ul role="list" className="mt-6 flex flex-col">
              {artwork.discipline && (
                <li>
                  <Link href={hrefFor("discipline", artwork.discipline.slug)!} className="link-quiet inline-flex min-h-11 items-center">
                    More {artwork.discipline.title.toLowerCase()}
                  </Link>
                </li>
              )}
              {artwork.project && (
                <li>
                  <Link href={hrefFor("project", artwork.project.slug)!} className="link-quiet inline-flex min-h-11 items-center">
                    Part of the project {artwork.project.title}
                  </Link>
                </li>
              )}
            </ul>
          </header>
          <div className="md:col-span-7 md:col-start-6">
            {artwork.image.caption && <p className="mb-6 text-graphite">{artwork.image.caption}</p>}
            <Prose text={artwork.description} className="text-lede" />
          </div>
        </div>

        {(previous || next) && (
          <nav aria-label="More artworks" className="page-gutter mx-auto mt-20 max-w-page">
            <ul role="list" className="grid grid-cols-2 gap-8 border-t border-rule pt-6">
              <li>
                {previous && (
                  <Link href={hrefFor("artwork", previous.slug)!} rel="prev" className="group inline-flex min-h-11 flex-col">
                    <span className="text-label text-graphite">Previous</span>
                    <span className="font-display italic group-hover:underline">{previous.title}</span>
                  </Link>
                )}
              </li>
              <li className="text-right">
                {next && (
                  <Link href={hrefFor("artwork", next.slug)!} rel="next" className="group inline-flex min-h-11 flex-col items-end">
                    <span className="text-label text-graphite">Next</span>
                    <span className="font-display italic group-hover:underline">{next.title}</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}

        {artwork.related.length > 0 && (
          <div className="page-gutter mx-auto mt-24 max-w-page">
            <RelatedWork title={artwork.series ? `More from ${artwork.series}` : "Related works"} items={artwork.related} />
          </div>
        )}
      </article>
      <ContactCTA cta={site.contactCta} email={profile.email} />
    </>
  );
}
