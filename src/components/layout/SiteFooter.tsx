import Link from "next/link";
import { mainNav } from "@/lib/routes";
import { SocialLinks, type SocialLinkData } from "./SocialLinks";

export interface FooterLink {
  label?: string | null;
  href?: string | null;
}

function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href);
}

const footerLink = "inline-flex min-h-10 items-center text-paper/75 transition-colors hover:text-paper";

export function SiteFooter({
  siteName,
  year,
  email,
  location,
  socialLinks,
  footerLinks,
  disciplines,
}: {
  siteName: string;
  year: number;
  email?: string | null;
  location?: string | null;
  socialLinks?: SocialLinkData[] | null;
  footerLinks?: FooterLink[] | null;
  disciplines: { title: string; href: string }[];
}) {
  const extra = (footerLinks ?? []).filter((l): l is FooterLink & { href: string; label: string } =>
    Boolean(l.href && l.label),
  );

  return (
    <footer data-surface="night" className="bg-ink text-paper">
      <div className="page-gutter mx-auto grid max-w-page gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" className="block w-fit font-display text-[2rem] leading-none">
            {siteName}
          </Link>
          {location && <p className="mt-3 text-paper/70">{location}</p>}
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-5 flex min-h-11 w-fit items-center text-lede underline decoration-paper/30 underline-offset-[0.25em] transition-colors hover:decoration-paper"
            >
              {email}
            </a>
          )}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="mb-3 text-label text-paper/50">Explore</h2>
            <ul role="list">
              <li>
                <Link href="/" className={footerLink}>
                  Home
                </Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {disciplines.length > 0 && (
            <div>
              <h2 className="mb-3 text-label text-paper/50">Disciplines</h2>
              <ul role="list">
                {disciplines.map((d) => (
                  <li key={d.href}>
                    <Link href={d.href} className={footerLink}>
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {socialLinks && socialLinks.length > 0 && (
            <div>
              <h2 className="mb-3 text-label text-paper/50">Follow</h2>
              <SocialLinks links={socialLinks} tone="night" className="flex-col gap-0" />
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-paper/10">
        <div className="page-gutter mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-label text-paper/55">
          <p>
            © {year} {siteName}. Artwork may not be reproduced without permission.
          </p>
          <ul role="list" className="flex flex-wrap gap-x-5">
            <li>
              <Link href="/privacy" className="inline-flex min-h-10 items-center hover:text-paper">
                Privacy
              </Link>
            </li>
            {extra.map((link) => (
              <li key={link.href}>
                {isExternal(link.href) ? (
                  <a href={link.href} className="inline-flex min-h-10 items-center hover:text-paper">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="inline-flex min-h-10 items-center hover:text-paper">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
