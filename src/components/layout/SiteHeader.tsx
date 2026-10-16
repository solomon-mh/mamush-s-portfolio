import Link from "next/link";
import { MobileNavigation, type MobileNavDiscipline } from "@/components/navigation/MobileNavigation";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";

/** Sticky, translucent header: the work scrolls beneath it, navigation stays in reach. */
export function SiteHeader({
  siteName,
  announcement,
  disciplines,
}: {
  siteName: string;
  announcement?: string | null;
  disciplines: MobileNavDiscipline[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <div className="page-gutter mx-auto flex h-[var(--header-height)] max-w-page items-center justify-between gap-6">
        <Link href="/" className="font-display text-[1.5rem] leading-none tracking-[-0.02em] md:text-[1.625rem]">
          {siteName}
          <span className="sr-only">, home</span>
        </Link>
        <div className="flex items-center gap-6">
          {announcement && (
            <p className="hidden items-center gap-2 text-label text-graphite lg:flex">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent ring-4 ring-accent/15" />
              {announcement}
            </p>
          )}
          <nav aria-label="Main">
            <PrimaryNav />
            <MobileNavigation siteName={siteName} disciplines={disciplines} />
          </nav>
        </div>
      </div>
    </header>
  );
}
