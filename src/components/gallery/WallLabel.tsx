import { cx } from "@/lib/utils";

interface WallLabelProps {
  title: string;
  year?: number | null;
  /** Discipline, client or medium line. */
  lines?: Array<string | null | undefined>;
  /** Render the title as a heading at this level, or as a paragraph. */
  as?: "h2" | "h3" | "p";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * The site's signature device: artwork metadata set like a museum wall label —
 * italic title with year, then quiet supporting lines. Used everywhere work
 * is shown so visitors learn to read it once.
 */
export function WallLabel({ title, year, lines = [], as: Title = "h3", size = "md", className }: WallLabelProps) {
  const visibleLines = lines.filter((line): line is string => Boolean(line && line.trim()));
  return (
    <div className={cx("max-w-prose", className)}>
      <Title
        className={cx(
          "font-display italic leading-tight text-ink",
          size === "sm" && "text-[1.0625rem]",
          size === "md" && "text-[1.25rem]",
          size === "lg" && "text-title",
        )}
      >
        {title}
        {year ? <span className="font-sans not-italic text-graphite">, {year}</span> : null}
      </Title>
      {visibleLines.length > 0 && (
        <p className="mt-1 text-label text-graphite">
          {visibleLines.map((line, i) => (
            <span key={`${line}-${i}`} className="block">
              {line}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
