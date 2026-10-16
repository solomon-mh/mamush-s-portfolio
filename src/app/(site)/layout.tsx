import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import type { CSSProperties } from "react";
import { PreviewBanner } from "@/components/layout/PreviewBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getDisciplines, getHome, getProfile, getSettings } from "@/content";
import { publicEnv } from "@/lib/env";
import { hrefFor } from "@/lib/routes";
import { buildSiteMetadata } from "@/lib/seo";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

/* The public site's root layout. The admin (/admin) has its own, in app/(payload). */

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings();
  const profile = await getProfile();
  return {
    metadataBase: new URL(publicEnv.siteUrl),
    ...buildSiteMetadata({
      siteName: site.siteName,
      description: profile.seo?.description || site.siteDescription || profile.headline,
      seo: profile.seo,
      // Fall back to the hero artwork when no dedicated sharing image is set.
      image: site.defaultShareImage ?? (await getHome()).heroArtwork?.image,
    }),
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSettings();
  const profile = await getProfile();
  const disciplines = (await getDisciplines()).map((d) => ({ title: d.title, href: hrefFor("discipline", d.slug)! }));
  const style = site.accentColor ? ({ "--accent": site.accentColor } as CSSProperties) : undefined;
  const { isEnabled: previewing } = await draftMode();

  return (
    // data-scroll-behavior: Next.js turns smooth scrolling off during page changes,
    // so every navigation lands instantly at the top of the new page.
    <html lang="en" data-scroll-behavior="smooth" className={fontVariables}>
      <body>
        <div className="flex min-h-dvh flex-col" style={style}>
          <a
            href="#main"
            className="sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          {previewing && <PreviewBanner />}
          <SiteHeader siteName={site.siteName} disciplines={disciplines} />
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
      </body>
    </html>
  );
}
