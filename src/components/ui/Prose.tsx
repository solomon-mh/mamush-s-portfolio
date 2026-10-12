import { cx } from "@/lib/utils";

/** Splits content text into paragraphs (separated by a blank line). */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Renders content text in the editorial prose style. Returns nothing for empty text. */
export function Prose({ text, className }: { text: string | null | undefined; className?: string }) {
  const parts = paragraphs(text);
  if (parts.length === 0) return null;
  return (
    <div className={cx("prose-editorial", className)}>
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
