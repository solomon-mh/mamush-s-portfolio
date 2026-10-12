"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isActivePath, mainNav } from "@/lib/routes";
import { cx } from "@/lib/utils";

export interface MobileNavDiscipline {
  title: string;
  href: string;
}

/**
 * Full-screen menu for small screens, built on <dialog> for focus trapping
 * and Escape-to-close. Closes automatically after navigating.
 */
export function MobileNavigation({
  siteName,
  disciplines,
}: {
  siteName: string;
  disciplines: MobileNavDiscipline[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      buttonRef.current?.setAttribute("aria-expanded", "false");
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function open() {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    buttonRef.current?.setAttribute("aria-expanded", "true");
  }

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={open}
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-haspopup="dialog"
        className="-mr-3 inline-flex min-h-11 items-center px-3 text-[0.9375rem]"
      >
        Menu
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-paper p-0 text-ink backdrop:bg-ink/20 open:flex open:flex-col"
      >
        <div className="page-gutter flex items-center justify-between py-4">
          <span className="font-display text-[1.375rem] leading-none">{siteName}</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="-mr-3 inline-flex size-11 items-center justify-center"
          >
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Main" className="page-gutter flex flex-1 flex-col overflow-y-auto pb-10 pt-6">
          <ul role="list" className="flex flex-col gap-2">
            <li>
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={cx("block py-1 font-display text-[2.5rem] leading-tight", pathname === "/" && "italic")}
              >
                Home
              </Link>
            </li>
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx("block py-1 font-display text-[2.5rem] leading-tight", active && "italic")}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/work" && disciplines.length > 0 && (
                    <ul role="list" className="mb-3 mt-1 flex flex-col border-l border-rule pl-4">
                      {disciplines.map((d) => (
                        <li key={d.href}>
                          <Link
                            href={d.href}
                            aria-current={pathname === d.href ? "page" : undefined}
                            className={cx(
                              "inline-flex min-h-11 items-center text-lede",
                              pathname === d.href && "underline decoration-accent decoration-2 underline-offset-4",
                            )}
                          >
                            {d.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
