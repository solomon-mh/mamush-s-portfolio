"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, mainNav } from "@/lib/routes";
import { cx } from "@/lib/utils";

/** Desktop navigation with clear active states (aria-current + underline). */
export function PrimaryNav() {
  const pathname = usePathname() ?? "/";
  return (
    <ul className="hidden items-center gap-1 md:flex" role="list">
      {mainNav.map((item) => {
        const active = isActivePath(pathname, item.href);
        const isContact = item.href === "/contact";
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "inline-flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors",
                isContact
                  ? "ml-3 rounded-full border border-ink/80 px-5 hover:bg-ink hover:text-paper"
                  : "underline-offset-[0.45em] hover:underline",
                active && !isContact && "underline decoration-accent decoration-2",
                active && isContact && "bg-ink text-paper",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
