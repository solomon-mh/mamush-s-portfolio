import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

/** Fallback for URLs outside the site layout. */
export default function RootNotFound() {
  return (
    <main className="page-gutter mx-auto max-w-page py-24 md:py-36">
      <h1 className="font-display text-display">Page not found</h1>
      <p className="mt-6 max-w-prose text-lede text-graphite">The page may have moved, or the link may be mistyped.</p>
      <Link href="/" className="link-quiet mt-8 inline-flex min-h-12 items-center">
        Go to the homepage
      </Link>
    </main>
  );
}
