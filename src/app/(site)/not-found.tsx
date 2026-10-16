import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-gutter mx-auto max-w-page py-20 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="kicker">Page not found</p>
          <h1 className="mt-5 font-display text-display text-balance">This work isn&apos;t on the wall</h1>
        </div>
        <div className="md:col-span-5">
          <p className="max-w-prose text-lede text-graphite">
            The page may have moved, or the link may be mistyped. Everything currently on show is in the work index.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-primary">
              Browse the work
            </Link>
            <Link href="/" className="btn btn-secondary">
              Go to the homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
