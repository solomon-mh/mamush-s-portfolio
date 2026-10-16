import { describe, expect, it, vi } from "vitest";
import { buildRows } from "@/components/gallery/JustifiedRows";
import { altText, imageDimensions, objectPosition } from "@/lib/images";
import { absoluteUrl, buildPageMetadata, creativeWorkJsonLd, serializeJsonLd, videoJsonLd } from "@/lib/seo";
import { img } from "../fixtures/content";

describe("images", () => {
  it("reads intrinsic dimensions from the imported file", () => {
    expect(imageDimensions(img("a", 2000, 1000))).toEqual({ width: 2000, height: 1000 });
    expect(imageDimensions(null)).toBeNull();
  });

  it("uses empty alt text for decorative images and a fallback when alt is missing", () => {
    expect(altText({ ...img("a", 10, 10), decorative: true }, "Title")).toBe("");
    expect(altText({ ...img("a", 10, 10), alt: "" }, "Title")).toBe("Title");
    expect(altText(img("a", 10, 10, "A description"), "Title")).toBe("A description");
  });

  it("centres deliberate crops on the author's focal point", () => {
    expect(objectPosition(img("a", 10, 10))).toBe("50% 50%");
    expect(objectPosition({ ...img("a", 10, 10), focus: { x: 0.25, y: 0.8 } })).toBe("25% 80%");
  });
});

describe("justified gallery rows", () => {
  const item = (key: string, ratio: number) => ({ key, ratio });

  it("keeps order and groups works so each row approaches the target height", () => {
    // Target 3.2 ≈ a 1280px row at 400px tall.
    const rows = buildRows([item("a", 1.5), item("b", 0.8), item("c", 1), item("d", 1.5), item("e", 1.5)], 3.2, 3);
    expect(rows.map((r) => r.items.map((i) => i.key))).toEqual([["a", "b", "c"], ["d", "e"]]);
    expect(rows[0].ratioSum).toBeCloseTo(3.3);
  });

  it("never puts more than the maximum in a row", () => {
    const rows = buildRows(Array.from({ length: 6 }, (_, i) => item(String(i), 0.5)), 10, 2);
    expect(rows.every((r) => r.items.length <= 2)).toBe(true);
    expect(rows).toHaveLength(3);
  });

  it("gives a very wide work a row of its own", () => {
    const rows = buildRows([item("pano", 3.5), item("p", 0.8), item("q", 0.8)], 3.2, 3);
    expect(rows[0].items.map((i) => i.key)).toEqual(["pano"]);
  });
});

describe("metadata and structured data", () => {
  it("builds canonical, Open Graph and noindex metadata with fallbacks", () => {
    const meta = buildPageMetadata({
      title: "Blue Hour",
      description: "Fallback description",
      path: "/artwork/blue-hour",
      seo: { title: "Custom title", noIndex: true },
      image: img("blue", 1600, 2000),
    });
    expect(meta.title).toBe("Custom title");
    expect(meta.description).toBe("Fallback description");
    expect(meta.alternates?.canonical).toBe("/artwork/blue-hour");
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: absoluteUrl("/_next/static/media/blue.jpg"), width: 1600, height: 2000 }),
    ]);
  });

  it("escapes JSON-LD so content text can't break out of the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });

  it("describes artworks as VisualArtwork only with real data", () => {
    const ld = creativeWorkJsonLd({ type: "VisualArtwork", title: "Blue Hour", path: "/artwork/blue-hour", medium: "Oil" });
    expect(ld).toMatchObject({ "@type": "VisualArtwork", name: "Blue Hour", artMedium: "Oil" });
    expect(ld).not.toHaveProperty("dateCreated");
  });

  it("omits VideoObject data rather than guessing required fields", () => {
    const thumbnail = img("poster", 1920, 1080);
    expect(videoJsonLd({ title: "Film", thumbnail, embedUrl: "y" })).toBeNull(); // no upload year
    expect(videoJsonLd({ title: "Film", thumbnail, embedUrl: "y", uploadYear: 2024 })).toMatchObject({
      "@type": "VideoObject",
      uploadDate: "2024-01-01",
    });
  });
});

describe("robots", () => {
  it("keeps preview deployments out of search engines", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const { default: robots } = await import("@/app/robots");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots()).toMatchObject({ rules: { allow: "/" } });
    vi.unstubAllEnvs();
  });
});
