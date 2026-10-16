import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/** The shared opening of every inner page: breadcrumb, title, intro and optional controls. */
export function PageHeader({
  title,
  intro,
  breadcrumb,
  children,
  tone = "paper",
}: {
  title: ReactNode;
  intro?: ReactNode;
  breadcrumb?: { href: string; label: string }[];
  children?: ReactNode;
  tone?: "paper" | "night";
}) {
  const muted = tone === "night" ? "text-paper/65" : "text-graphite";
  return (
    <header className="page-gutter mx-auto max-w-page pb-10 pt-10 md:pb-14 md:pt-16">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className={cx("flex flex-wrap items-center gap-x-2 text-label", muted)}>
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2 after:content-['/'] after:opacity-50 last:after:content-none">
                <Link href={crumb.href} className="link-quiet inline-flex min-h-8 items-center">
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="grid gap-5 md:grid-cols-12 md:items-end md:gap-8">
        <h1 className="font-display text-display text-balance md:col-span-7">{title}</h1>
        {intro && <div className={cx("max-w-[44ch] text-lede md:col-span-5 md:pb-2", muted)}>{intro}</div>}
      </div>
      {children && <div className="mt-10 md:mt-12">{children}</div>}
    </header>
  );
}
