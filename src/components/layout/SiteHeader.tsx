import Link from "next/link";
import { MobileNavigation, type MobileNavDiscipline } from "@/components/navigation/MobileNavigation";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";

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
    <header>
      {announcement && (
        <p className="page-gutter border-b border-rule py-2 text-center text-label text-graphite">{announcement}</p>
      )}
      <div className="page-gutter mx-auto flex max-w-page items-center justify-between py-4 md:py-6">
        <Link
          href="/"
          className="font-display text-[1.375rem] leading-none tracking-[-0.01em] md:text-[1.625rem]"
        >
          {siteName}
          <span className="sr-only">, home</span>
        </Link>
        <nav aria-label="Main">
          <PrimaryNav />
          <MobileNavigation siteName={siteName} disciplines={disciplines} />
        </nav>
      </div>
    </header>
  );
}
