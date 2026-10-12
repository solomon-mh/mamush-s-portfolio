import type { Metadata } from "next";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { getProfile } from "@/content";
import { ContactForm } from "@/features/contact/ContactForm";
import { getEnquiryOptions } from "@/features/contact/options";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Get in touch about commissions, collaborations and creative projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const profile = getProfile();
  const options = await getEnquiryOptions();

  return (
    <div className="page-gutter mx-auto max-w-page pb-24 pt-10 md:pb-36 md:pt-16">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <header className="lg:col-span-4">
          <h1 className="font-display text-display">Contact</h1>
          <p className="mt-6 max-w-[36ch] text-lede text-graphite">
            {options.ctaText || "For commissions, collaborations and creative projects, send a few details and I'll reply by email."}
          </p>
          {profile.email && (
            <div className="mt-10">
              <h2 className="text-label text-graphite">Prefer email?</h2>
              <a href={`mailto:${profile.email}`} className="link-quiet mt-1 inline-flex min-h-11 items-center text-lede">
                {profile.email}
              </a>
            </div>
          )}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-label text-graphite">Elsewhere</h2>
              <SocialLinks links={profile.socialLinks} className="mt-1" />
            </div>
          )}
        </header>
        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm enquiryTypes={options.enquiryTypes} budgetRanges={options.budgetRanges} fallbackEmail={profile.email} />
        </div>
      </div>
    </div>
  );
}
