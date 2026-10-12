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
    <footer className="bg-paper-deep">
      <div className="page-gutter mx-auto grid max-w-page gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-5">
          <p className="font-display text-title">{siteName}</p>
          {location && <p className="mt-2 text-graphite">{location}</p>}
          {email && (
            <a href={`mailto:${email}`} className="link-quiet mt-4 inline-flex min-h-11 items-center text-lede">
              {email}
            </a>
          )}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4">
          <ul role="list" className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet inline-flex min-h-11 items-center">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {disciplines.length > 0 && (
            <ul role="list" className="flex flex-col">
              {disciplines.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="link-quiet inline-flex min-h-11 items-center">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="md:col-span-3">
          <SocialLinks links={socialLinks} className="flex-col gap-0" />
        </div>
      </div>

      <div className="page-gutter mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule py-6 text-label text-graphite">
        <p>
          © {year} {siteName}. Artwork may not be reproduced without permission.
        </p>
        <ul role="list" className="flex flex-wrap gap-x-5">
          <li>
            <Link href="/privacy" className="link-quiet inline-flex min-h-11 items-center">
              Privacy
            </Link>
          </li>
          {extra.map((link) => (
            <li key={link.href}>
              {isExternal(link.href) ? (
                <a href={link.href} className="link-quiet inline-flex min-h-11 items-center">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className="link-quiet inline-flex min-h-11 items-center">
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
