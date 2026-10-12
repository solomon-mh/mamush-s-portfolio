import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext, type Locator } from "@playwright/test";

/*
 * Content-agnostic end-to-end tests: pages are discovered from the sitemap
 * and navigation, so these keep passing as the artist's content changes.
 */

async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

const first = (paths: string[], prefix: string) => paths.find((p) => p.startsWith(prefix));

test.describe("accessibility", () => {
  test("every page in the sitemap has no automatically detectable WCAG 2.2 AA violations", async ({ page, request }) => {
    test.setTimeout(600_000); // scans every page
    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations.map((v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    }
  });

  test("skip link moves keyboard focus to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard-only check");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const duration = await page.getByRole("heading", { level: 1 }).evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
    expect(duration).toBeLessThan(0.01);
  });

  test("shows a visible focus indicator", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard-only check");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)).not.toBe("none");
  });
});

test.describe("navigation", () => {
  test("mobile menu opens, lists disciplines, closes with Escape and after navigating", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const disciplineLink = menu.locator('a[href^="/work/"]').first();
    const href = await disciplineLink.getAttribute("href");
    await disciplineLink.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(menu).toBeHidden();
  });

  test("desktop navigation marks the current section", async ({ page, isMobile, request }) => {
    test.skip(isMobile, "desktop only");
    const project = first(await sitemapPaths(request), "/projects/");
    test.skip(!project, "no projects published");
    await page.goto(project!);
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  test("work filters are shareable URLs", async ({ page }) => {
    await page.goto("/work");
    const filters = page.getByRole("navigation", { name: "Filter by discipline" });
    const filter = filters.locator('a[href^="/work?discipline="]').first();
    const name = (await filter.textContent())!.trim();
    await filter.click();
    await expect(page).toHaveURL(/\/work\?discipline=/);
    await expect(filter).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("list", { name: `${name} works` })).toBeVisible();
  });
});

test.describe("artwork viewing", () => {
  test("lightbox opens, steps with arrow keys, closes with Escape and restores focus", async ({ page, isMobile, request }) => {
    test.skip(isMobile, "keyboard flow");
    // Find a viewer holding more than one work (each series has its own viewer).
    let trigger: Locator | null = null;
    for (const path of (await sitemapPaths(request)).filter((p) => p.startsWith("/work/"))) {
      await page.goto(path);
      for (const candidate of await page.getByRole("button", { name: /^View larger:/ }).all()) {
        await candidate.click();
        const many = await page.getByRole("dialog").getByText(/^\d+ of \d+$/).count();
        await page.keyboard.press("Escape");
        if (many) {
          trigger = candidate;
          break;
        }
      }
      if (trigger) break;
    }
    test.skip(!trigger, "no viewer with more than one work");
    await trigger!.click();
    const viewer = page.getByRole("dialog");
    const firstTitle = await viewer.getByRole("heading").textContent();
    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByRole("heading")).not.toHaveText(firstTitle!);
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    await expect(trigger!).toBeFocused();
  });

  test("videos load only when played, using privacy-enhanced embeds", async ({ page }) => {
    const embeds: string[] = [];
    page.on("request", (r) => {
      if (/youtube|vimeo/.test(r.url())) embeds.push(r.url());
    });
    await page.goto("/");
    const play = page.getByRole("button", { name: /^Play video:/ }).first();
    test.skip((await play.count()) === 0, "no video on the homepage");
    expect(embeds).toEqual([]);
    await play.click();
    await expect(page.locator("iframe").first()).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\//);
  });
});

test.describe("performance safeguards", () => {
  test("homepage layout stays stable while images load", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(total), 500);
        }),
    );
    expect(cls).toBeLessThan(0.1);
  });

  test("gallery thumbnails request resized images, not originals", async ({ page, isMobile }) => {
    test.skip(isMobile, "a full-width card on a high-density phone legitimately needs a larger file");
    const widths: number[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/_next/image")) widths.push(Number(new URL(r.url()).searchParams.get("w")));
    });
    await page.goto("/work");
    await page.waitForLoadState("networkidle");
    expect(widths.length).toBeGreaterThan(0);
    expect(Math.max(...widths)).toBeLessThanOrEqual(1080);
  });

  test("only one image is preloaded", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('img[fetchpriority="high"]')).toHaveCount(1);
  });
});

test.describe("contact", () => {
  test("validates in the browser with accessible errors", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    const name = page.getByLabel("Your name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
  });

  test("never pretends to send when email delivery isn't configured", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(3_200); // people take a few seconds; instant submissions are treated as spam
    await page.getByLabel("Your name").fill("Ada Client");
    await page.getByLabel("Email").fill("ada@agency.example");
    await page.getByLabel("What is this about?").selectOption({ index: 1 });
    await page.getByLabel("Tell me about the project").fill("A series of editorial illustrations for a spring campaign.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send message" }).click();
    // (Next.js also renders an empty route announcer with role="alert".)
    await expect(page.getByRole("alert").filter({ hasText: "isn't accepting messages right now" })).toBeVisible();
    await expect(page.getByText(/has been sent/)).toHaveCount(0);
  });
});

test.describe("routing and SEO", () => {
  test("returns 404 for unknown pages", async ({ request }) => {
    for (const path of [`/projects/missing-${Date.now()}`, "/artwork/Not_A_Slug", "/work/nope", "/nothing-here"]) {
      expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(404);
    }
  });

  test("every sitemap page responds and has a canonical URL and title", async ({ page, request }) => {
    test.setTimeout(300_000);
    const titles = new Set<string>();
    for (const path of await sitemapPaths(request)) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(path === "/" ? "^https?://[^/]+/?$" : `${path}$`));
      titles.add(await page.title());
    }
    expect(titles.size).toBe((await sitemapPaths(request)).length); // every title is unique
  });
});
