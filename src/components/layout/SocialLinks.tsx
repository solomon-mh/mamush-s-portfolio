import { cx } from "@/lib/utils";

const PLATFORM_NAMES: Record<string, string> = {
  instagram: "Instagram",
  behance: "Behance",
  vimeo: "Vimeo",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  artstation: "ArtStation",
  dribbble: "Dribbble",
  tiktok: "TikTok",
  bluesky: "Bluesky",
  x: "X",
};

export interface SocialLinkData {
  platform?: string | null;
  label?: string | null;
  url?: string | null;
}

/** Text links rather than icons: clearer, and they need no explanation. */
export function SocialLinks({
  links,
  className,
  tone = "paper",
}: {
  links: SocialLinkData[] | null | undefined;
  className?: string;
  tone?: "paper" | "night";
}) {
  const valid = (links ?? []).filter((l): l is SocialLinkData & { url: string } => Boolean(l.url));
  if (valid.length === 0) return null;
  return (
    <ul role="list" className={cx("flex flex-wrap gap-x-5 gap-y-1", className)}>
      {valid.map((link) => {
        const name = link.label || PLATFORM_NAMES[link.platform ?? ""] || link.platform || "Profile";
        return (
          <li key={link.url}>
            <a
              href={link.url}
              rel="me noopener noreferrer"
              target="_blank"
              className={cx("link-quiet inline-flex min-h-11 items-center", tone === "night" && "text-paper")}
            >
              {name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
