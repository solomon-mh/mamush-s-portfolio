import Link from "next/link";
import { cx } from "@/lib/utils";

/** Section heading with an optional companion link aligned to the baseline. */
export function SectionHeading({
  id,
  title,
  link,
  as: Tag = "h2",
  className,
}: {
  id: string;
  title: string;
  link?: { href: string; label: string };
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cx("mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 md:mb-16", className)}>
      <Tag id={id} className="font-display text-title">
        {title}
      </Tag>
      {link && (
        <Link href={link.href} className="link-quiet inline-flex min-h-11 items-center">
          {link.label}
        </Link>
      )}
    </div>
  );
}
