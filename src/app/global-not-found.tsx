import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = { title: "Page not found" };

/*
 * The site and the admin each have their own root layout, so URLs that match
 * no route at all get this standalone page.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="page-gutter mx-auto max-w-page py-24 md:py-36">
          <h1 className="font-display text-display">Page not found</h1>
          <p className="mt-6 max-w-prose text-lede text-graphite">The page may have moved, or the link may be mistyped.</p>
          <Link href="/" className="link-quiet mt-8 inline-flex min-h-12 items-center">
            Go to the homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
