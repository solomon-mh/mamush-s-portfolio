import Link from "next/link";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import type { ArtImage } from "@/content/types";

/** Short introduction. Renders only what the artist has written; nothing is inferred. */
export function ArtistIntro({
  name,
  shortBio,
  portrait,
}: {
  name: string;
  shortBio?: string | null;
  portrait?: ArtImage | null;
}) {
  if (!shortBio && !portrait) return null;
  return (
    <section aria-labelledby="artist-intro" className="page-gutter mx-auto max-w-page py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        {portrait && (
          <div className="md:col-span-4 md:col-start-2">
            <ArtworkImage image={portrait} fallbackAlt={`Portrait of ${name}`} sizes="(min-width: 768px) 30vw, 80vw" />
          </div>
        )}
        <div className={portrait ? "md:col-span-6 md:col-start-7" : "md:col-span-8 md:col-start-3"}>
          <h2 id="artist-intro" className="font-display text-title">
            About {name}
          </h2>
          {shortBio && <p className="mt-6 whitespace-pre-line text-lede">{shortBio}</p>}
          <Link href="/about" className="link-quiet mt-8 inline-flex min-h-11 items-center">
            Read the full biography
          </Link>
        </div>
      </div>
    </section>
  );
}
