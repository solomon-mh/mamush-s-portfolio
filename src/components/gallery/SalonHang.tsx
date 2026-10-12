import type { WorkCard as WorkCardData } from "@/content";
import { workImage } from "@/content/cards";
import { imageDimensions } from "@/lib/images";
import { WorkCard } from "./WorkCard";

type Orientation = "landscape" | "portrait" | "square";

export function orientationOf(item: WorkCardData): Orientation {
  const dims = imageDimensions(workImage(item));
  if (!dims) return "portrait";
  const ratio = dims.width / dims.height;
  if (ratio > 1.15) return "landscape";
  if (ratio < 0.87) return "portrait";
  return "square";
}

type Placement = { item: WorkCardData; className: string; sizes: string };
export type Row = Placement[];

// Literal class strings so Tailwind can see them.
const SOLO_LANDSCAPE = ["md:col-span-8 md:col-start-1", "md:col-span-8 md:col-start-5", "md:col-span-9 md:col-start-2"];
const SOLO_UPRIGHT = ["md:col-span-5 md:col-start-3", "md:col-span-5 md:col-start-7"];
const PAIR_LEFT = "md:col-span-5 md:col-start-1";
const PAIR_RIGHT = "md:col-span-4 md:col-start-8 md:mt-[min(14vw,12rem)]";
const PAIR_LEFT_MIRROR = "md:col-span-4 md:col-start-2 md:mt-[min(14vw,12rem)]";
const PAIR_RIGHT_MIRROR = "md:col-span-5 md:col-start-8";

/**
 * Arranges work like a salon hang: landscape pieces get a wide row of their
 * own, upright pieces are hung in staggered pairs, alternating sides. The
 * layout follows each work's real proportions — nothing is cropped.
 */
export function arrangeSalon(items: WorkCardData[]): Row[] {
  const rows: Row[] = [];
  let soloCount = 0;
  let pairCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const orientation = orientationOf(item);
    const next = items[i + 1];

    if (orientation === "landscape") {
      rows.push([
        {
          item,
          className: SOLO_LANDSCAPE[soloCount++ % SOLO_LANDSCAPE.length],
          sizes: "(min-width: 1440px) 900px, (min-width: 768px) 66vw, 100vw",
        },
      ]);
      continue;
    }

    if (next && orientationOf(next) !== "landscape") {
      const mirrored = pairCount++ % 2 === 1;
      rows.push([
        {
          item,
          className: mirrored ? PAIR_LEFT_MIRROR : PAIR_LEFT,
          sizes: "(min-width: 1440px) 560px, (min-width: 768px) 40vw, 100vw",
        },
        {
          item: next,
          className: mirrored ? PAIR_RIGHT_MIRROR : PAIR_RIGHT,
          sizes: "(min-width: 1440px) 560px, (min-width: 768px) 40vw, 100vw",
        },
      ]);
      i++;
      continue;
    }

    rows.push([
      {
        item,
        className: SOLO_UPRIGHT[soloCount++ % SOLO_UPRIGHT.length],
        sizes: "(min-width: 1440px) 560px, (min-width: 768px) 42vw, 100vw",
      },
    ]);
  }
  return rows;
}

export function SalonHang({ items, headingLevel = "h3" }: { items: WorkCardData[]; headingLevel?: "h2" | "h3" }) {
  const rows = arrangeSalon(items);
  return (
    <ul className="flex flex-col gap-16 md:gap-28" role="list">
      {rows.map((row, r) => (
        <li key={row.map((p) => p.item._id).join("-")} className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          {row.map((placement, p) => (
            <WorkCard
              key={placement.item._id}
              item={placement.item}
              sizes={placement.sizes}
              headingLevel={headingLevel}
              // Gentle inset on small screens keeps the column from feeling like a feed.
              className={`${placement.className} ${(r + p) % 2 === 1 ? "pl-10 sm:pl-24 md:pl-0" : ""}`}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}
