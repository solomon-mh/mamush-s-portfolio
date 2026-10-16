// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { __setContentForTests } from "@/content";
import { fixtureContent } from "../fixtures/content";

/* Route-level tests: the real page components rendered with fixture content. */

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  permanentRedirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
  usePathname: () => "/",
}));
vi.mock("next/link", () => ({
  default: ({ href, children, prefetch, scroll, ...rest }: { href: string; children: ReactNode; prefetch?: unknown; scroll?: unknown }) => {
    void prefetch;
    void scroll;
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));
vi.mock("next/image", async () => import("../support/next-image-mock"));

beforeAll(() => __setContentForTests(fixtureContent()));
afterAll(() => __setContentForTests(null));
afterEach(cleanup);

type PageProps = { params: Promise<Record<string, string>>; searchParams: Promise<Record<string, string>> };
type PageModule = { default: (props: PageProps) => Promise<ReactNode> | ReactNode };

async function renderPage(load: () => Promise<unknown>, params: Record<string, string> = {}, searchParams: Record<string, string> = {}) {
  const Page = ((await load()) as PageModule).default;
  render(await Page({ params: Promise.resolve(params), searchParams: Promise.resolve(searchParams) }));
}

describe("homepage", () => {
  const load = () => import("@/app/(site)/page");

  it("renders the artist, curated work, disciplines and featured project", async () => {
    await renderPage(load);
    expect(screen.getByRole("heading", { level: 1, name: "Test Artist" })).toBeInTheDocument();
    expect(screen.getByText("Fixture positioning statement.")).toBeInTheDocument();

    const selected = screen.getByRole("region", { name: "Selected work" });
    const links = within(selected)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((h) => h !== "/work");
    expect(links).toEqual(["/projects/commission", "/artwork/blue-hour", "/artwork/field-study", "/artwork/character-sheet"]);
    expect(screen.queryByText("Hidden Artwork")).not.toBeInTheDocument();

    const disciplines = screen.getByRole("region", { name: "Disciplines" });
    expect(within(disciplines).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Painting",
      "Illustration",
      "Animation",
      "Fixture Discipline",
    ]);
    expect(screen.getByRole("heading", { name: "Fixture Film" })).toBeInTheDocument();
    // No approved recognition, so the section is omitted entirely.
    expect(screen.queryByText("Selected recognition")).not.toBeInTheDocument();
  });

  it("prioritises only the hero image and lazy-loads the rest", async () => {
    await renderPage(load);
    const images = screen.getAllByRole("img");
    const preloaded = images.filter((img) => img.getAttribute("data-preload") === "true");
    expect(preloaded).toHaveLength(1);
    expect(preloaded[0]).toHaveAccessibleName("Fixture description of a tall painting");
    expect(images.filter((img) => img.getAttribute("loading") === "lazy").length).toBeGreaterThan(3);
  });
});

describe("work index", () => {
  const load = () => import("@/app/(site)/work/page");

  it("filters by the discipline in the URL", async () => {
    await renderPage(load, {}, { discipline: "painting" });
    const list = screen.getByRole("list", { name: "Painting works" });
    expect(within(list).getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Fixture Field Study, 2024",
      "Fixture Blue Hour, 2023",
    ]);
    const filters = screen.getByRole("navigation", { name: "Filter by discipline" });
    expect(within(filters).getByRole("link", { name: /^Painting/ })).toHaveAttribute("aria-current", "page");
  });

  it("ignores an unknown filter and shows everything", async () => {
    await renderPage(load, {}, { discipline: "nonsense" });
    expect(screen.getByRole("list", { name: "All works" })).toBeInTheDocument();
  });
});

describe("discipline pages", () => {
  const load = () => import("@/app/(site)/work/[discipline]/page");

  it("renders each discipline with its configured layout", async () => {
    await renderPage(load, { discipline: "painting" });
    expect(screen.getByRole("heading", { level: 1, name: "Painting" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fixture Series" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /View larger/ })).toHaveLength(2);
    cleanup();

    await renderPage(load, { discipline: "animation" });
    expect(screen.getByRole("button", { name: "Play video: Fixture showreel" })).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull(); // nothing loads until play is pressed
  });

  it("serves a renamed fourth discipline from content alone", async () => {
    await renderPage(load, { discipline: "fixture-discipline" });
    expect(screen.getByRole("heading", { level: 1, name: "Fixture Discipline" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Fixture Commission/ })).toHaveAttribute("href", "/projects/commission");
  });

  it("returns 404 for hidden and unknown slugs, and redirects former ones", async () => {
    await expect(renderPage(load, { discipline: "hidden-discipline" })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(renderPage(load, { discipline: "does-not-exist" })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(renderPage(load, { discipline: "old-discipline" })).rejects.toThrow("NEXT_REDIRECT:/work/fixture-discipline");
  });

  it("pre-generates public and former slugs, and 404s on unknown ones", async () => {
    const { generateStaticParams } = (await load()) as unknown as {
      generateStaticParams: () => Promise<{ discipline: string }[]>;
    };
    expect((await generateStaticParams()).map((p) => p.discipline)).toEqual(["painting", "illustration", "animation", "fixture-discipline", "old-discipline"]);
    // Disciplines published later render on demand; anything unknown is a 404.
    await expect(renderPage(load, { discipline: "hidden-discipline" })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("project and artwork pages", () => {
  const project = () => import("@/app/(site)/projects/[slug]/page");
  const artwork = () => import("@/app/(site)/artwork/[slug]/page");

  it("renders a project case study with only the sections it has", async () => {
    await renderPage(project, { slug: "commission" });
    expect(screen.getByRole("heading", { level: 1, name: "Fixture Commission" })).toBeInTheDocument();
    expect(screen.getByText("Fixture Client")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The brief" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Approach" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Process" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Works from this project" })).toBeInTheDocument();
    expect(screen.getByText("Fixture Collaborator")).toBeInTheDocument();
  });

  it("renders an artwork with its label, credits, sequence and structured data", async () => {
    await renderPage(artwork, { slug: "blue-hour" });
    expect(screen.getByRole("heading", { level: 1, name: "Fixture Blue Hour" })).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Oil on linen")).toBeInTheDocument();
    expect(screen.getByText("Fixture rights line")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next/ })).toHaveAttribute("href", "/artwork/field-study");
    const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(jsonLd).toMatchObject({ "@type": "VisualArtwork", name: "Fixture Blue Hour", artMedium: "Oil on linen" });
  });

  it("handles hidden and renamed documents", async () => {
    await expect(renderPage(project, { slug: "hidden-project" })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(renderPage(project, { slug: "old-commission" })).rejects.toThrow("NEXT_REDIRECT:/projects/commission");
    await expect(renderPage(artwork, { slug: "old-blue-hour" })).rejects.toThrow("NEXT_REDIRECT:/artwork/blue-hour");
  });
});

describe("contact by email", () => {
  it("offers email-app and Gmail links addressed to the artist, with topic shortcuts", async () => {
    await renderPage(() => import("@/app/(site)/contact/page"));
    expect(document.querySelector("form")).toBeNull(); // no contact form
    const write = screen.getByRole("link", { name: "Write an email" });
    expect(write.getAttribute("href")).toMatch(/^mailto:studio@example\.com\?subject=Project%20enquiry/);
    expect(screen.getAllByRole("link", { name: /^Open in Gmail/ })[0].getAttribute("href")).toContain("https://mail.google.com/mail/?view=cm");
    const commission = screen.getByRole("link", { name: /Email app for a commission enquiry/ });
    expect(commission.getAttribute("href")).toContain("subject=Commission%20enquiry");
  });

  it("makes every 'Start a conversation' button open an email", async () => {
    await renderPage(() => import("@/app/(site)/about/page"));
    const start = screen.getByRole("link", { name: "Write to the studio" }); // fixture's CTA label
    expect(start.getAttribute("href")).toMatch(/^mailto:studio@example\.com/);
  });

  it("lets visitors enquire about a specific artwork by email", async () => {
    await renderPage(() => import("@/app/(site)/artwork/[slug]/page"), { slug: "blue-hour" });
    const enquire = screen.getByRole("link", { name: "Enquire about this work" });
    expect(decodeURIComponent(enquire.getAttribute("href")!)).toContain("Enquiry about “Fixture Blue Hour”");
  });
});

describe("metadata and sitemap", () => {
  it("builds unique metadata with a canonical URL and sharing image for a project", async () => {
    const { generateMetadata } = await import("@/app/(site)/projects/[slug]/page");
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "commission" }) } as never);
    expect(meta).toMatchObject({
      title: "Fixture Commission",
      description: "Fixture project summary.",
      alternates: { canonical: "/projects/commission" },
    });
    expect(JSON.stringify(meta.openGraph)).toContain("/_next/static/media/wide.jpg");
  });

  it("generates a sitemap of public pages only", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const urls = (await sitemap()).map((e) => e.url.replace(/^https?:\/\/[^/]+/, ""));
    expect(urls).toEqual(expect.arrayContaining(["/", "/work", "/work/fixture-discipline", "/projects/film", "/artwork/blue-hour"]));
    expect(urls.some((u) => /hidden/.test(u))).toBe(false);
  });
});
