import { describe, expect, it } from "vitest";
import { getSequenceNeighbours } from "@/features/artwork/sequence";
import { groupBySeries } from "@/features/disciplines/DisciplineView";
import { groupRecognition } from "@/features/home/Recognition";
import { filterByDiscipline } from "@/features/work/filter";
import { hrefFor, isActivePath } from "@/lib/routes";
import { isSafeInternalPath, isValidSlug, truncate } from "@/lib/utils";
import { durationToIso, parseVideoUrl } from "@/lib/video";
import type { ArtworkCard, ProjectCard } from "@/content";
import { img } from "../fixtures/content";

const project = (id: string, extra: Partial<ProjectCard> = {}): ProjectCard => ({
  _id: `project:${id}`,
  _type: "project",
  title: id,
  slug: id,
  summary: null,
  year: null,
  client: null,
  role: null,
  duration: null,
  featured: false,
  coverImage: img(id, 10, 10),
  disciplines: [],
  ...extra,
});

const artwork = (id: string, extra: Partial<ArtworkCard> = {}): ArtworkCard => ({
  _id: id,
  _type: "artwork",
  title: id,
  slug: id,
  year: null,
  medium: null,
  dimensions: null,
  series: null,
  featured: false,
  image: img(id, 10, 10),
  discipline: null,
  ...extra,
});

describe("route parameter validation", () => {
  it("accepts human-readable slugs and rejects anything else", () => {
    expect(isValidSlug("blue-hour-2")).toBe(true);
    for (const bad of ["", "Blue", "a_b", "-lead", "trail-", "a--b", "../etc", "a/b", "x".repeat(97), 42]) {
      expect(isValidSlug(bad)).toBe(false);
    }
  });

  it("only allows same-site paths for redirects", () => {
    expect(isSafeInternalPath("/work")).toBe(true);
    expect(isSafeInternalPath("//evil.example")).toBe(false);
    expect(isSafeInternalPath("https://evil.example")).toBe(false);
    expect(isSafeInternalPath("/\\evil")).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
  });
});

describe("canonical URLs and navigation state", () => {
  it("maps each document type to exactly one canonical route", () => {
    expect(hrefFor("project", "a")).toBe("/projects/a");
    expect(hrefFor("artwork", "a")).toBe("/artwork/a");
    expect(hrefFor("discipline", "a")).toBe("/work/a");
    expect(hrefFor("siteSettings", "a")).toBeNull();
    expect(hrefFor("project", null)).toBeNull();
  });

  it("marks Work active on every work, project and artwork page", () => {
    for (const path of ["/work", "/work/painting", "/projects/x", "/artwork/y"]) {
      expect(isActivePath(path, "/work")).toBe(true);
    }
    expect(isActivePath("/about", "/work")).toBe(false);
    expect(isActivePath("/contact", "/contact")).toBe(true);
    expect(isActivePath("/contactless", "/contact")).toBe(false);
  });
});

describe("video links", () => {
  it("turns YouTube links into privacy-enhanced embeds", () => {
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://youtube.com/shorts/dQw4w9WgXcQ",
    ]) {
      const info = parseVideoUrl(url);
      expect(info?.provider).toBe("youtube");
      expect(info?.embedUrl).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/);
    }
  });

  it("supports public and unlisted Vimeo links with tracking disabled", () => {
    expect(parseVideoUrl("https://vimeo.com/123456789")?.embedUrl).toContain("player.vimeo.com/video/123456789?");
    expect(parseVideoUrl("https://vimeo.com/123456789")?.embedUrl).toContain("dnt=1");
    expect(parseVideoUrl("https://vimeo.com/123456789/abcdef1234")?.embedUrl).toContain("h=abcdef1234");
  });

  it("rejects other hosts and malformed input", () => {
    expect(parseVideoUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(parseVideoUrl("javascript:alert(1)")).toBeNull();
    expect(parseVideoUrl("not a url")).toBeNull();
    expect(parseVideoUrl(null)).toBeNull();
  });

  it("formats durations for structured data", () => {
    expect(durationToIso("3:42")).toBe("PT3M42S");
    expect(durationToIso("1:02:03")).toBe("PT1H2M3S");
    expect(durationToIso("abc")).toBeUndefined();
  });
});

describe("curation and ordering", () => {
  it("groups artworks by series, keeping order and unnamed works first", () => {
    const groups = groupBySeries([
      artwork("1", { series: "Tides" }),
      artwork("2"),
      artwork("3", { series: "Tides" }),
      artwork("4", { series: " Night " }),
    ]);
    expect(groups.map((g) => [g.series, g.artworks.map((a) => a._id)])).toEqual([
      [null, ["2"]],
      ["Tides", ["1", "3"]],
      ["Night", ["4"]],
    ]);
  });

  it("filters the work index by discipline, including multi-discipline projects", () => {
    const painting = { _id: "p", title: "Painting", slug: "painting", layout: "gallery" as const };
    const other = { _id: "o", title: "Other", slug: "other", layout: "index" as const };
    const items = [
      artwork("a1", { discipline: painting }),
      project("p1", { disciplines: [other, painting] }),
      project("p2", { disciplines: [other] }),
    ];
    expect(filterByDiscipline(items, "painting").map((i) => i.slug)).toEqual(["a1", "p1"]);
    expect(filterByDiscipline(items, null)).toHaveLength(3);
  });
});

describe("artwork sequence", () => {
  const seq = ["a", "b", "c"].map((id) => ({ _id: id, title: id.toUpperCase(), slug: id }));

  it("links previous and next, wrapping around a gallery of three or more", () => {
    expect(getSequenceNeighbours(seq, "b")).toMatchObject({ previous: { _id: "a" }, next: { _id: "c" } });
    expect(getSequenceNeighbours(seq, "a")).toMatchObject({ previous: { _id: "c" }, next: { _id: "b" } });
  });

  it("does not wrap a pair, and offers nothing for a single or unknown work", () => {
    expect(getSequenceNeighbours(seq.slice(0, 2), "a")).toMatchObject({ previous: null, next: { _id: "b" } });
    expect(getSequenceNeighbours(seq.slice(0, 1), "a")).toEqual({ previous: null, next: null });
    expect(getSequenceNeighbours(seq, "zzz")).toEqual({ previous: null, next: null });
  });
});

describe("professional credibility", () => {
  it("shows nothing when the artist has not approved any entries", () => {
    expect(groupRecognition([])).toEqual([]);
    expect(groupRecognition(null)).toEqual([]);
  });

  it("groups approved entries by category, newest first, ignoring incomplete ones", () => {
    const groups = groupRecognition([
      { category: "award", title: "Award A", year: 2021 },
      { category: "client", title: "Client A" },
      { category: "award", title: "Award B", year: 2024 },
      { category: "award", title: "", year: 2025 },
    ]);
    expect(groups.map((g) => g.title)).toEqual(["Clients", "Awards"]);
    expect(groups[1].items.map((i) => i.title)).toEqual(["Award B", "Award A"]);
  });
});

describe("text helpers", () => {
  it("truncates on word boundaries for meta descriptions", () => {
    const text = "Paintings and illustrations exploring light, memory and the edges of cities at dusk.";
    const short = truncate(text, 40);
    expect(short.length).toBeLessThanOrEqual(40);
    expect(short.endsWith("…")).toBe(true);
    expect(truncate("Short.", 40)).toBe("Short.");
  });
});
