import Link from "next/link";
import { cx } from "@/lib/utils";

/** Pills for moving between disciplines (or filtering the work index). */
export function DisciplineSwitcher({
  items,
  label,
  tone = "paper",
}: {
  items: { href: string; label: string; count?: number; active: boolean }[];
  label: string;
  tone?: "paper" | "night";
}) {
  if (items.length < 2) return null;
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto pb-1">
      <ul role="list" className="flex w-max gap-2 px-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}

              aria-current={item.active ? "page" : undefined}
              className={cx("chip", tone === "night" && "border-paper/20 aria-[current=page]:border-paper aria-[current=page]:bg-paper aria-[current=page]:text-ink hover:border-paper")}
            >
              {item.label}
              {item.count !== undefined && <span className="chip-count">{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
