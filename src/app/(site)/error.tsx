"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/States";

/** Shown when content can't be loaded (for example, the CMS is unreachable). */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorState onRetry={retry} />;
}
