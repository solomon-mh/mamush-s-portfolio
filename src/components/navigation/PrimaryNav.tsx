"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, mainNav } from "@/lib/routes";
import { cx } from "@/lib/utils";

/** Desktop navigation with clear active states (aria-current + accent underline). */
export function PrimaryNav() {
  const pathname = usePathname() ?? "/";
  return (
    <ul className="hidden items-center gap-1 md:flex" role="list">
      {mainNav.map((item) => {
        const active = isActivePath(pathname, item.href);
        if (item.href === "/contact") {
          return (
            <li key={item.href} className="ml-3">
              <Link href={item.href} aria-current={active ? "page" : undefined} className="btn btn-primary min-h-10 px-5">
                {item.label}
              </Link>
            </li>
          );
        }
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "relative inline-flex min-h-11 items-center px-3 text-small transition-colors hover:text-ink",
                "after:absolute after:inset-x-3 after:bottom-2.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-300",
                active ? "text-ink after:scale-x-100" : "text-ink-soft after:scale-x-0 hover:after:scale-x-100",
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
