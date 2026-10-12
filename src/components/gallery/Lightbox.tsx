"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface LightboxItem {
  id: string;
  title: string;
  year?: number | null;
  lines: string[];
  image: StaticImageData;
  alt: string;
  href?: string | null;
}

interface LightboxContextValue {
  open: (index: number, trigger: HTMLElement) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

/**
 * Immersive, accessible artwork viewer built on the native <dialog> element:
 * focus is trapped while open, Escape closes it, arrow keys and swipes move
 * between works, and focus returns to the image that opened it.
 */
export function Lightbox({ items, label, children }: { items: LightboxItem[]; label: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const current = index === null ? null : items[index];
  const hasMany = items.length > 1;

  const open = useCallback((i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIndex(i);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog || dialog.open) return;
    dialog.showModal();
    // Browsers differ in what they focus on open; put focus on Close so keys work immediately.
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIndex(null);
      document.documentElement.style.overflow = "";
      triggerRef.current?.focus();
    };
    const onOpen = () => {
      document.documentElement.style.overflow = "hidden";
    };
    dialog.addEventListener("close", onClose);
    // `toggle` fires for dialogs in modern browsers; fall back gracefully if not.
    dialog.addEventListener("toggle", onOpen);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("toggle", onOpen);
    };
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (!hasMany) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !hasMany) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={label}
        data-surface="night"
        onKeyDown={onKeyDown}
        onClick={(event) => {
          // Clicking the backdrop (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-ink/90 open:flex open:flex-col"
      >
        {current && (
          <>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-label text-paper/70" aria-live="polite">
                {hasMany ? `${index! + 1} of ${items.length}` : ""}
              </p>
              <button
                type="button"
                onClick={close}
                data-autofocus
                className="-mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-paper/10"
              >
                <X aria-hidden="true" className="size-6" />
                <span className="sr-only">Close viewer</span>
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                key={current.id}
                src={current.image}
                alt={current.alt}
                sizes="100vw"
                quality={85}
                className="media-fade h-auto max-h-full w-auto max-w-full object-contain"
                style={{ maxHeight: "calc(100dvh - 11rem)" }}
              />
              {hasMany && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full hover:bg-paper/10 sm:inline-flex"
                  >
                    <ChevronLeft aria-hidden="true" className="size-7" />
                    <span className="sr-only">Previous work</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full hover:bg-paper/10 sm:inline-flex"
                  >
                    <ChevronRight aria-hidden="true" className="size-7" />
                    <span className="sr-only">Next work</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-5 pt-4 sm:px-6">
              <div>
                <h2 className="font-display text-[1.25rem] italic leading-tight">
                  {current.title}
                  {current.year ? <span className="font-sans not-italic text-paper/70">, {current.year}</span> : null}
                </h2>
                {current.lines.length > 0 && (
                  <p className="mt-1 text-label text-paper/70">{current.lines.join(" / ")}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasMany && (
                  <span className="flex gap-2 sm:hidden">
                    <button type="button" onClick={() => step(-1)} className="inline-flex size-11 items-center justify-center rounded-full border border-paper/30">
                      <ChevronLeft aria-hidden="true" className="size-5" />
                      <span className="sr-only">Previous work</span>
                    </button>
                    <button type="button" onClick={() => step(1)} className="inline-flex size-11 items-center justify-center rounded-full border border-paper/30">
                      <ChevronRight aria-hidden="true" className="size-5" />
                      <span className="sr-only">Next work</span>
                    </button>
                  </span>
                )}
                {current.href && (
                  <Link href={current.href} className="link-quiet px-1 py-2 text-label" onClick={close}>
                    View details
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </dialog>
    </LightboxContext.Provider>
  );
}

/** Wraps a server-rendered image in a button that opens the viewer at `index`. */
export function LightboxTrigger({ index, label, children }: { index: number; label: string; children: ReactNode }) {
  const context = useContext(LightboxContext);
  if (!context) return <>{children}</>;
  return (
    <button
      type="button"
      onClick={(event) => context.open(index, event.currentTarget)}
      className="group block w-full cursor-zoom-in text-left"
    >
      <span className="sr-only">{`View larger: ${label}`}</span>
      {children}
    </button>
  );
}
