import Link from "next/link";
import { cx } from "@/lib/utils";

/** Section heading with an optional short description and companion link. */
export function SectionHeading({
  id,
  title,
  description,
  link,
  as: Tag = "h2",
  tone = "paper",
  className,
}: {
  id: string;
  title: string;
  description?: string | null;
  link?: { href: string; label: string };
  as?: "h1" | "h2";
  tone?: "paper" | "night";
  className?: string;
}) {
  return (
    <div className={cx("mb-10 grid gap-4 md:mb-14 md:grid-cols-12 md:items-end md:gap-8", className)}>
      <div className="md:col-span-7">
        <Tag id={id} className="font-display text-title">
          {title}
        </Tag>
        {description && (
          <p className={cx("mt-3 max-w-[48ch]", tone === "night" ? "text-paper/70" : "text-graphite")}>{description}</p>
        )}
      </div>
      {link && (
        <div className="md:col-span-5 md:text-right">
          <Link href={link.href} className="link-quiet inline-flex min-h-11 items-center text-small">
            {link.label}
          </Link>
        </div>
      )}
    </div>
  );
}
