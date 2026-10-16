import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { EmailButtons } from "@/components/ui/EmailButtons";
import { getEnquiryTopics, getProfile, getSettings } from "@/content";
import { enquiryDraft, gmailHref, mailtoHref } from "@/lib/email-links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Get in touch about commissions, collaborations and creative projects.",
  path: "/contact",
});

/** Contact happens by email: every button opens the visitor's email app or Gmail, addressed to the artist. */
export default function ContactPage() {
  const profile = getProfile();
  const site = getSettings();
  const topics = getEnquiryTopics();
  const email = profile.email;

  return (
    <>
      <PageHeader
        title="Let's talk"
        intro={site.contactCta?.text || "For commissions, collaborations and creative projects, write a few lines by email."}
      />
      <div className="page-gutter mx-auto max-w-page pb-16 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {site.announcement && (
              <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper-raised px-3.5 py-1.5 text-label text-ink-soft">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent ring-4 ring-accent/15" />
                {site.announcement}
              </p>
            )}

            {email ? (
              <>
                <h2 className="text-label text-graphite">Email</h2>
                <a
                  href={mailtoHref(email, enquiryDraft(profile.name))}
                  className="mt-2 block w-fit break-all font-display text-title underline decoration-rule decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-ink"
                >
                  {email}
                </a>
                <EmailButtons to={email} artistName={profile.name} className="mt-8" />

                {topics.length > 0 && (
                  <section aria-labelledby="topics-heading" className="mt-14">
                    <h2 id="topics-heading" className="font-display text-[1.5rem]">
                      Start with a topic
                    </h2>
                    <p className="mt-2 text-small text-graphite">Each opens an email with the subject already filled in.</p>
                    <ul role="list" className="mt-6 border-b border-rule">
                      {topics.map((topic) => {
                        const draft = enquiryDraft(profile.name, topic);
                        return (
                          <li key={topic} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule py-4">
                            <span className="text-lede">{topic}</span>
                            <span className="flex gap-2">
                              <a href={mailtoHref(email, draft)} className="chip" aria-label={`Email app for a ${topic.toLowerCase()} enquiry`}>
                                Email app
                              </a>
                              <a
                                href={gmailHref(email, draft)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chip"
                                aria-label={`Gmail for a ${topic.toLowerCase()} enquiry (opens in a new tab)`}
                              >
                                Gmail
                              </a>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <p className="text-lede text-graphite">An email address will be added here soon.</p>
            )}
          </div>

          <aside className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
            <div className="bg-paper-deep p-6 sm:p-8">
              <h2 className="font-display text-[1.375rem]">What to include</h2>
              <ul role="list" className="mt-4 flex flex-col gap-3 text-small text-ink-soft">
                <li className="border-t border-ink/10 pt-3">What you&apos;d like made, and what it&apos;s for</li>
                <li className="border-t border-ink/10 pt-3">Where it will appear — print, screen, gallery</li>
                <li className="border-t border-ink/10 pt-3">Your timeline and any fixed dates</li>
                <li className="border-t border-ink/10 pt-3">A budget range, if you have one</li>
                <li className="border-t border-ink/10 pt-3">Links to references or examples you like</li>
              </ul>
            </div>
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="border-t border-rule pt-5">
                <h2 className="text-label text-graphite">Elsewhere</h2>
                <SocialLinks links={profile.socialLinks} className="mt-1" />
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
