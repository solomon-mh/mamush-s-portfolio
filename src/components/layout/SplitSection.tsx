import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/** A labelled band: heading on the left, content on the right. Used for story and biography sections. */
export function SplitSection({
  id,
  title,
  children,
  className,
}: {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={title ? id : undefined} className={cx("grid gap-5 border-t border-rule pt-8 md:grid-cols-12 md:gap-8 md:pt-10", className)}>
      {title ? (
        <h2 id={id} className="font-display text-title md:col-span-4">
          {title}
        </h2>
      ) : (
        <div className="md:col-span-4" />
      )}
      <div className="md:col-span-8 lg:col-span-7">{children}</div>
    </section>
  );
}
