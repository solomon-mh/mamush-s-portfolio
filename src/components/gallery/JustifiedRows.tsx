import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/utils";

/** Content width at the largest breakpoint (90rem page minus gutters). */
const MAX_CONTENT_PX = 1280;
const GAP_REM = 1.5;

export interface JustifiedItem {
  key: string;
  /** width / height of the image. */
  ratio: number;
}

export interface JustifiedRow<T extends JustifiedItem> {
  items: T[];
  /** Sum of aspect ratios in the row. */
  ratioSum: number;
}

/**
 * Splits items into rows whose combined aspect ratio is as close as possible
 * to `targetRatio` (container width ÷ target row height). Order is kept.
 * Exported for testing.
 */
export function buildRows<T extends JustifiedItem>(items: T[], targetRatio: number, maxPerRow: number): JustifiedRow<T>[] {
  const rows: JustifiedRow<T>[] = [];
  let current: T[] = [];
  let sum = 0;
  for (const item of items) {
    const ratio = Math.max(0.2, item.ratio);
    const closerWithItem = Math.abs(sum + ratio - targetRatio) <= Math.abs(sum - targetRatio);
    if (current.length > 0 && (current.length >= maxPerRow || !closerWithItem)) {
      rows.push({ items: current, ratioSum: sum });
      current = [];
      sum = 0;
    }
    current.push(item);
    sum += ratio;
  }
  if (current.length) rows.push({ items: current, ratioSum: sum });
  return rows;
}

interface JustifiedRowsProps<T extends JustifiedItem> {
  items: T[];
  /** Preferred row height on large screens, in pixels. */
  rowHeight?: number;
  /** Rows never get taller than this, so a lone portrait isn't blown up. */
  maxRowHeight?: number;
  maxPerRow?: number;
  /** On phones each work is at most this share of the screen height. */
  mobileMaxVh?: 56 | 70;
  /** Renders one item; `sizes` is the responsive hint for its image. */
  renderItem: (item: T, sizes: string) => ReactNode;
  className?: string;
  label?: string;
}

/**
 * Justified gallery rows: every work in a row shares one height and keeps its
 * real proportions (nothing is cropped), so rows read as calm, even bands.
 * On small screens works stack, each capped to most of the viewport height.
 */
export function JustifiedRows<T extends JustifiedItem>({
  items,
  rowHeight = 380,
  maxRowHeight = 520,
  maxPerRow = 3,
  mobileMaxVh = 56,
  renderItem,
  className,
  label,
}: JustifiedRowsProps<T>) {
  if (items.length === 0) return null;
  const rows = buildRows(items, MAX_CONTENT_PX / rowHeight, maxPerRow);

  return (
    <ul role="list" aria-label={label} className={cx("flex flex-col gap-10 md:gap-14", className)}>
      {rows.map((row) => {
        const gaps = row.items.length - 1;
        // Cap the row's width so its height never exceeds maxRowHeight.
        const rowStyle: CSSProperties = {
          maxWidth: `calc(${(row.ratioSum * maxRowHeight).toFixed(0)}px + ${gaps * GAP_REM}rem)`,
        };
        const rowPx = Math.min(MAX_CONTENT_PX, row.ratioSum * maxRowHeight + gaps * 24);
        return (
          <li key={row.items.map((i) => i.key).join("|")} style={rowStyle}>
            <ul role="list" className="flex flex-col gap-10 md:flex-row md:items-start md:gap-6">
              {row.items.map((item) => {
                const share = item.ratio / row.ratioSum;
                const px = Math.round(rowPx * share);
                const vw = Math.max(20, Math.round(share * 92));
                const sizes = `(min-width: 1440px) ${px}px, (min-width: 768px) ${vw}vw, 100vw`;
                return (
                  <li
                    key={item.key}
                    className={cx(
                      "min-w-0",
                      mobileMaxVh === 70 ? "max-md:max-w-[calc(70svh*var(--ratio))]" : "max-md:max-w-[calc(56svh*var(--ratio))]",
                    )}
                    style={{ flex: `${item.ratio} 1 0%`, ["--ratio" as string]: item.ratio.toFixed(4) } as CSSProperties}
                  >
                    {renderItem(item, sizes)}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
