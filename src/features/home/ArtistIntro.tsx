import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ArtImage } from "@/content/types";

/** Short introduction. Renders only what the artist has written; nothing is inferred. */
export function ArtistIntro({
  name,
  shortBio,
  statement,
  portrait,
}: {
  name: string;
  shortBio?: string | null;
  statement?: string | null;
  portrait?: ArtImage | null;
}) {
  if (!shortBio && !portrait) return null;
  const quote = statement?.split(/\n\s*\n/)[0]?.trim();
  return (
    <section aria-labelledby="artist-intro" className="page-gutter section-space mx-auto max-w-page">
      <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
        {portrait && (
          <div className="md:col-span-5 lg:col-span-4 lg:col-start-2">
            <ArtworkImage image={portrait} fallbackAlt={`Portrait of ${name}`} aspectRatio={4 / 5} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw" />
          </div>
        )}
        <div className={portrait ? "md:col-span-7 lg:col-span-6 lg:col-start-7" : "md:col-span-8 md:col-start-3"}>
          <p className="kicker">About</p>
          <h2 id="artist-intro" className="mt-4 font-display text-title">
            {name}
          </h2>
          {quote && (
            <blockquote className="mt-6 border-l-2 border-accent pl-5 font-display text-[1.375rem] italic leading-snug text-ink">
              {quote}
            </blockquote>
          )}
          {shortBio && <p className="mt-6 max-w-[56ch] text-ink-soft">{shortBio}</p>}
          <Link href="/about" className="btn btn-secondary mt-8">
            Read the full biography
          </Link>
        </div>
      </div>
    </section>
  );
}
