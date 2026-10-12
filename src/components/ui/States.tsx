import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/** An empty area is an invitation to go somewhere useful, not a dead end. */
export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cx("border-t border-rule py-16", className)}>
      <h2 className="font-display text-title">{title}</h2>
      {children && <div className="mt-3 max-w-prose text-graphite">{children}</div>}
      {action && (
        <Link href={action.href} className="link-quiet mt-6 inline-flex min-h-11 items-center">
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** Placeholder shapes while content streams in; announced once to screen readers. */
export function LoadingState({ label = "Loading work", tiles = 4 }: { label?: string; tiles?: number }) {
  return (
    <div role="status" aria-live="polite" className="page-gutter mx-auto max-w-page py-16">
      <span className="sr-only">{label}…</span>
      <div aria-hidden="true" className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="h-[clamp(3rem,8vw,6rem)] w-2/3 bg-paper-deep md:col-span-8" />
        {Array.from({ length: tiles }, (_, i) => (
          <div
            key={i}
            className={cx(
              "animate-pulse bg-paper-deep motion-reduce:animate-none",
              i % 2 === 0 ? "aspect-[4/5] md:col-span-5" : "aspect-[5/4] md:col-span-6 md:col-start-7",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "This page couldn't be loaded",
  message = "The portfolio content is temporarily unavailable. Try again in a moment.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="page-gutter mx-auto max-w-page py-24 md:py-32">
      <h1 className="font-display text-display text-balance">{title}</h1>
      <p className="mt-6 max-w-prose text-lede text-graphite">{message}</p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-paper hover:bg-accent"
          >
            Try again
          </button>
        )}
        <Link href="/" className="link-quiet inline-flex min-h-12 items-center">
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
