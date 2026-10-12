export type EmbedInfo = { provider: "youtube" | "vimeo"; id: string; embedUrl: string };

/** Turns a normal YouTube/Vimeo link into a privacy-friendly embed URL. Returns null for anything else. */
export function parseVideoUrl(raw: string | null | undefined): EmbedInfo | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] || null;
    else if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
      id = match?.[1] ?? null;
    }
    if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/(?:^|\/)(?:video\/)?(\d{5,12})(?:\/([0-9a-f]{6,20}))?/);
    if (!match) return null;
    const [, id, hash] = match;
    const params = new URLSearchParams({ autoplay: "1", dnt: "1", title: "0", byline: "0", portrait: "0" });
    const privateHash = hash ?? url.searchParams.get("h");
    if (privateHash) params.set("h", privateHash);
    return { provider: "vimeo", id, embedUrl: `https://player.vimeo.com/video/${id}?${params}` };
  }

  return null;
}

/** "3:42" → "PT3M42S" for VideoObject structured data. */
export function durationToIso(duration: string | null | undefined): string | undefined {
  if (!duration) return undefined;
  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ?? 0}S`;
}
