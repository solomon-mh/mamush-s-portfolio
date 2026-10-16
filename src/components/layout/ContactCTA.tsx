import Link from "next/link";
import { EmailButtons } from "@/components/ui/EmailButtons";
import { getProfile, getSettings } from "@/content";

/**
 * A calm, consistent invitation near the end of each page. "Start a
 * conversation" opens the visitor's own email, addressed to the artist.
 * Copy comes from content/site.ts; fallbacks make no claims about the artist.
 */
export function ContactCTA() {
  const site = getSettings();
  const profile = getProfile();
  const cta = site.contactCta;
  const heading = cta?.heading || "Have a project in mind?";
  const text = cta?.text || "Commissions, collaborations and creative projects are welcome.";
  const label = cta?.buttonLabel || "Start a conversation";

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
          {profile.email ? (
            <>
              <EmailButtons to={profile.email} artistName={profile.name} primaryLabel={label} className="md:justify-end" />
              <p className="text-small text-ink-soft">
                Or write to <span className="select-all font-medium text-ink">{profile.email}</span>
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
