import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  __setContentForTests,
  findRedirect,
  getArtwork,
  getDisciplinePage,
  getDisciplines,
  getHome,
  getImageCredits,
  getProject,
  getSitemapEntries,
  getStaticSlugs,
  getWorkIndex,
} from "@/content";
import { ContentError, validateContent } from "@/content/validate";
import { fixtureContent, img } from "../fixtures/content";

beforeEach(() => __setContentForTests(fixtureContent()));
afterEach(() => __setContentForTests(null));

function problems(mutate: (c: ReturnType<typeof fixtureContent>) => void): string[] {
  const content = fixtureContent();
  mutate(content);
  try {
    validateContent(content);
    return [];
  } catch (error) {
    if (error instanceof ContentError) return error.problems;
    throw error;
  }
}

describe("content validation", () => {
  it("accepts the fixture content", () => {
    expect(problems(() => {})).toEqual([]);
  });

  it("requires meaningful alt text unless an image is decorative", () => {
    expect(problems((c) => (c.artworks[0].image = { ...img("x", 10, 10), alt: "" }))).toEqual([
      expect.stringMatching(/content\/artworks\.ts: #1 \(blue-hour\) → image\.alt: needs alt text/),
    ]);
    expect(problems((c) => (c.artworks[0].image = { ...img("x", 10, 10), alt: "", decorative: true }))).toEqual([]);
  });

  it("catches broken references between files", () => {
    const found = problems((c) => {
      c.artworks[0].discipline = "sculpture";
      c.projects[0].disciplines = ["nope"];
      c.site.selectedWork.push("artwork:missing");
      c.site.hero.artwork = "gone";
      c.site.featuredProject = "missing-project";
    });
    expect(found).toEqual(
      expect.arrayContaining([
        expect.stringContaining('"blue-hour" uses unknown discipline "sculpture"'),
        expect.stringContaining('"commission" uses unknown discipline "nope"'),
        expect.stringContaining('selected work "artwork:missing" doesn\'t exist'),
        expect.stringContaining('hero artwork "gone" doesn\'t exist'),
        expect.stringContaining('featured project "missing-project" doesn\'t exist'),
      ]),
    );
  });

  it("rejects duplicate slugs, bad slugs and former slugs that are still in use", () => {
    const found = problems((c) => {
      c.artworks[1].slug = "blue-hour";
      c.projects[0].slug = "Not A Slug";
      c.disciplines[0].previousSlugs = ["illustration"];
    });
    expect(found).toEqual(
      expect.arrayContaining([
        expect.stringContaining('the slug "blue-hour" is used more than once'),
        expect.stringContaining("use lowercase letters, numbers and single dashes"),
        expect.stringContaining('lists "illustration" as a former slug, but that slug is in use'),
      ]),
    );
  });

  it("only accepts YouTube/Vimeo links or local files for video", () => {
    const found = problems((c) => {
      c.disciplines[2].showreel!.url = "https://example.com/video";
    });
    expect(found).toEqual([expect.stringContaining("only YouTube and Vimeo links are supported")]);
  });
});

describe("derived page data", async () => {
  it("lists visible disciplines in order with counts that ignore hidden work", async () => {
    const list = (await getDisciplines());
    expect(list.map((d) => d.title)).toEqual(["Painting", "Illustration", "Animation", "Fixture Discipline"]);
    expect(list.find((d) => d.slug === "painting")?.workCount).toBe(2);
    expect(list.find((d) => d.slug === "illustration")?.workCount).toBe(2); // one project + one artwork
  });

  it("keeps the curated homepage order and drops hidden picks", async () => {
    const home = (await getHome());
    expect(home.selectedWork.map((w) => w.slug)).toEqual(["commission", "blue-hour", "field-study", "character-sheet"]);
    expect(home.heroArtwork?.slug).toBe("blue-hour");
    expect(home.featuredProject?.slug).toBe("film");
  });

  it("lists projects and standalone artworks, newest and featured first, without hidden ones", async () => {
    const slugs = (await getWorkIndex()).map((w) => w.slug);
    expect(slugs[0]).toBe("film"); // featured
    expect(slugs).toEqual(expect.arrayContaining(["commission", "blue-hour", "field-study"]));
    expect(slugs).not.toContain("character-sheet"); // shown on its project page
    expect(slugs).not.toContain("hidden-project");
    expect(slugs).not.toContain("hidden-artwork");
    expect(slugs).not.toContain("in-hidden-discipline");
  });

  it("builds discipline pages, including a renamed fourth discipline", async () => {
    expect((await getDisciplinePage("fixture-discipline"))?.projects.map((p) => p.slug)).toEqual(["commission"]);
    expect((await getDisciplinePage("painting"))?.artworks.map((a) => a.slug)).toEqual(["blue-hour", "field-study"]);
    expect((await getDisciplinePage("hidden-discipline"))).toBeNull();
  });

  it("builds project and artwork pages with related work and sequences", async () => {
    expect((await getProject("commission"))?.artworks.map((a) => a.slug)).toEqual(["character-sheet"]);
    expect((await getProject("hidden-project"))).toBeNull();
    const artwork = (await getArtwork("blue-hour"));
    expect(artwork?.sequence.map((s) => s.slug)).toEqual(["blue-hour", "field-study"]);
    expect(artwork?.related.map((r) => r.slug)).toEqual(["field-study"]); // same series
  });

  it("generates params for current and former slugs, and resolves redirects", async () => {
    expect((await getStaticSlugs("project"))).toEqual(
      expect.arrayContaining([{ slug: "commission" }, { slug: "old-commission" }, { slug: "film" }]),
    );
    expect((await getStaticSlugs("project"))).not.toContainEqual({ slug: "hidden-project" });
    expect((await findRedirect("project", "old-commission"))).toBe("commission");
    expect((await findRedirect("discipline", "old-discipline"))).toBe("fixture-discipline");
    expect((await findRedirect("artwork", "never-existed"))).toBeNull();
  });

  it("puts only public pages in the sitemap and credits list", async () => {
    const slugs = (await getSitemapEntries()).map((e) => e.slug);
    expect(slugs).toEqual(expect.arrayContaining(["painting", "fixture-discipline", "film", "blue-hour"]));
    expect(slugs.some((s) => s.startsWith("hidden"))).toBe(false);
    expect((await getImageCredits())).toEqual([{ title: "Fixture Blue Hour", credit: "Fixture rights line", href: "/artwork/blue-hour" }]);
  });
});
