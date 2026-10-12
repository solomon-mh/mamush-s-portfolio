import Link from "next/link";

export interface ContactCtaData {
  heading?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
}

/**
 * A large typographic invitation. Copy comes from Site settings; the
 * fallbacks are neutral and make no claims about the artist.
 */
export function ContactCTA({ cta, email }: { cta?: ContactCtaData | null; email?: string | null }) {
  const heading = cta?.heading || "Have a project in mind?";
  const text = cta?.text || "Commissions, collaborations and creative projects are welcome.";
  const label = cta?.buttonLabel || "Start a conversation";

  return (
    <section aria-labelledby="contact-cta-heading" className="page-gutter mx-auto max-w-page py-24 md:py-36">
      <div className="grid gap-10 border-t border-ink pt-10 md:grid-cols-12 md:gap-8">
        <h2 id="contact-cta-heading" className="font-display text-display text-balance md:col-span-8">
          {heading}
        </h2>
        <div className="flex flex-col items-start gap-6 md:col-span-4 md:pt-4">
          <p className="max-w-[32ch] text-lede text-graphite">{text}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-paper transition-colors hover:bg-accent"
            >
              {label}
            </Link>
            {email && (
              <a href={`mailto:${email}`} className="link-quiet inline-flex min-h-11 items-center">
                {email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
