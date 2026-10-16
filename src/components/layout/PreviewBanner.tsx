/** Shown while an editor previews unpublished drafts. */
export function PreviewBanner() {
  return (
    <div role="status" className="page-gutter flex items-center justify-center gap-4 bg-ink py-2 text-small text-paper">
      <span>Previewing drafts — visitors see the published version.</span>
      {/* A plain link: prefetching would end the preview by accident. */}
      <a href="/next/exit-preview" className="underline underline-offset-4">
        Exit preview
      </a>
    </div>
  );
}
