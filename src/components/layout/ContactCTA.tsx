import Link from "next/link";
import { EmailButtons } from "@/components/ui/EmailButtons";
import type { ContactCtaData } from "@/content";

/**
 * A calm, consistent invitation near the end of each page. "Start a
 * conversation" opens the visitor's own email, addressed to the artist.
 * Wording comes from Site settings (see getContactCta); fallbacks make no
 * claims about the artist.
 */
export function ContactCTA({ heading, text, buttonLabel, email, artistName }: ContactCtaData) {
  return (
    <section aria-labelledby="contact-cta-heading" className="page-gutter mx-auto max-w-page pb-16 md:pb-24">
      <div className="grid gap-8 bg-paper-deep px-6 py-12 sm:px-10 md:grid-cols-12 md:items-center md:gap-8 md:px-14 md:py-16">
        <div className="md:col-span-7">
          <h2 id="contact-cta-heading" className="font-display text-display text-balance">
            {heading}
          </h2>
          <p className="mt-4 max-w-[42ch] text-lede text-ink-soft">{text}</p>
        </div>
        <div className="flex flex-col items-start gap-4 md:col-span-5 md:items-end">
          {email ? (
            <>
              <EmailButtons to={email} artistName={artistName} primaryLabel={buttonLabel} className="md:justify-end" />
              <p className="text-small text-ink-soft">
                Or write to <span className="select-all font-medium text-ink">{email}</span>
              </p>
            </>
          ) : (
            <Link href="/about" className="btn btn-primary">
              About the artist
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
