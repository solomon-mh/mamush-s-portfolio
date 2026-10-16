import { Mail } from "lucide-react";
import { enquiryDraft, gmailHref, mailtoHref } from "@/lib/email-links";
import { cx } from "@/lib/utils";

/**
 * "Write an email" (the visitor's email app) and "Open in Gmail" (browser),
 * both addressed to the artist with a short draft filled in.
 */
export function EmailButtons({
  to,
  artistName,
  topic,
  subject,
  primaryLabel = "Write an email",
  tone = "paper",
  className,
}: {
  to: string;
  artistName: string;
  topic?: string;
  /** Overrides the draft subject, e.g. for a specific artwork. */
  subject?: string;
  primaryLabel?: string;
  tone?: "paper" | "night";
  className?: string;
}) {
  const draft = enquiryDraft(artistName, topic);
  if (subject) draft.subject = subject;
  return (
    <div className={cx("flex flex-wrap items-center gap-3", className)}>
      <a href={mailtoHref(to, draft)} className={cx("btn", tone === "night" ? "btn-light" : "btn-primary")}>
        <Mail aria-hidden="true" className="size-4" />
        {primaryLabel}
      </a>
      <a href={gmailHref(to, draft)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
        Open in Gmail
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
