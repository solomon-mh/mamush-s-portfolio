import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-gutter mx-auto max-w-page py-24 md:py-36">
      <p className="text-label text-graphite">Page not found</p>
      <h1 className="mt-3 max-w-[16ch] font-display text-display text-balance">This work isn&apos;t on the wall</h1>
      <p className="mt-6 max-w-prose text-lede text-graphite">
        The page may have moved, or the link may be mistyped. Everything that&apos;s currently on show is in the work
        index.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        <Link href="/work" className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-paper hover:bg-accent">
          Browse the work
        </Link>
        <Link href="/" className="link-quiet inline-flex min-h-12 items-center">
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
