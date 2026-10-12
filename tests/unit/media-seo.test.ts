import { describe, expect, it, vi } from "vitest";
import { arrangeSalon, orientationOf } from "@/components/gallery/SalonHang";
import type { ArtworkCard } from "@/content";
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

describe("salon hang arrangement", () => {
  const work = (id: string, w: number, h: number): ArtworkCard => ({
    _id: id,
    _type: "artwork",
    title: id,
    slug: id,
    year: null,
    medium: null,
    dimensions: null,
    series: null,
    featured: false,
    image: img(id, w, h),
    discipline: null,
  });

  it("classifies works by their real proportions", () => {
    expect(orientationOf(work("a", 2400, 1600))).toBe("landscape");
    expect(orientationOf(work("b", 1600, 2000))).toBe("portrait");
    expect(orientationOf(work("c", 1800, 1800))).toBe("square");
  });

  it("gives landscapes their own row and pairs upright works, preserving order", () => {
    const rows = arrangeSalon([work("l1", 3, 2), work("p1", 4, 5), work("p2", 4, 5), work("p3", 4, 5)]);
    expect(rows.map((r) => r.map((p) => p.item._id))).toEqual([["l1"], ["p1", "p2"], ["p3"]]);
    // Every placement offers a responsive sizes hint, so small screens never get desktop files.
    expect(rows.flat().every((p) => p.sizes.includes("100vw"))).toBe(true);
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
