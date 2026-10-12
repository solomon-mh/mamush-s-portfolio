import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getDisciplines, getHome, getProfile, getSettings } from "@/content";
import { hrefFor } from "@/lib/routes";
import { buildSiteMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const site = getSettings();
  const profile = getProfile();
  return buildSiteMetadata({
    siteName: site.siteName,
    description: profile.seo?.description || site.siteDescription || profile.headline,
    seo: profile.seo,
    // Fall back to the hero artwork when no dedicated sharing image is set.
    image: site.defaultShareImage ?? getHome().heroArtwork?.image,
  });
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const site = getSettings();
  const profile = getProfile();
  const disciplines = getDisciplines().map((d) => ({ title: d.title, href: hrefFor("discipline", d.slug)! }));
  const style = site.accentColor ? ({ "--accent": site.accentColor } as CSSProperties) : undefined;

  return (
    <div className="flex min-h-dvh flex-col" style={style}>
      <a
        href="#main"
        className="sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader siteName={site.siteName} announcement={site.announcement} disciplines={disciplines} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter
        siteName={site.siteName}
        year={new Date().getFullYear()}
        email={profile.email}
        location={profile.location}
        socialLinks={profile.socialLinks}
        footerLinks={site.footerLinks}
        disciplines={disciplines}
      />
    </div>
  );
}
