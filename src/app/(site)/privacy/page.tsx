import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { getProfile, getSettings } from "@/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description: "How this website handles personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const policy = getSettings().privacyPolicy;
  const profile = getProfile();

  return (
    <>
      <PageHeader title="Privacy" intro="How this website handles personal information." />
      <div className="page-gutter mx-auto max-w-page pb-24">
      <div className="border-t border-rule pt-10 md:ml-[calc(100%/12*4)]">
        {policy ? (
          <Prose text={policy} />
        ) : (
          // Factual description of what this website does. Replace it with `privacyPolicy` in content/site.ts.
          <div className="prose-editorial">
            <h2>Contacting the studio</h2>
            <p>
              This website has no contact form. The contact buttons open your own email app or Gmail with a message
              addressed to the studio; nothing is sent until you press send there, and this website doesn&apos;t
              collect or store your details. Emails you send are used only to reply to you.
            </p>
            <h2>Cookies and analytics</h2>
            <p>
              This website does not use cookies for advertising or analytics.
            </p>
            <h2>Embedded video</h2>
            <p>
              Videos hosted on YouTube or Vimeo load only after you press play. YouTube videos use its
              privacy-enhanced mode and Vimeo videos are loaded with tracking disabled where Vimeo supports it.
            </p>
            <h2>Hosting</h2>
            <p>
              Like most websites, the hosting provider may record technical information such as IP addresses in server
              logs to keep the service secure and working.
            </p>
            {profile.email && (
              <>
                <h2>Your information</h2>
                <p>
                  To ask about or delete any information you have sent, write to{" "}
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
