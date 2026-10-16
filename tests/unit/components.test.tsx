// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", async () => import("../support/next-image-mock"));
let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

import { Lightbox, LightboxTrigger, type LightboxItem } from "@/components/gallery/Lightbox";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";
import { img } from "../fixtures/content";

/** jsdom serialises `aspect-ratio: 0.8` as "0.8 / 1". */
const ratioOf = (el: HTMLElement) => {
  const [a, b = "1"] = el.style.aspectRatio.split("/").map((x) => x.trim());
  return Number(a) / Number(b);
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("navigation", () => {
  it("marks the current section for assistive technology", () => {
    pathname = "/projects/some-project";
    render(<PrimaryNav />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });

  it("opens the mobile menu as a dialog and closes it with the close button", async () => {
    pathname = "/";
    const user = userEvent.setup();
    render(<MobileNavigation siteName="Test Artist" disciplines={[{ title: "Painting", href: "/work/painting" }]} />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    expect(dialog).toHaveAttribute("open");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("link", { name: "Painting" })).toHaveAttribute("href", "/work/painting");

    await user.click(within(dialog).getByRole("button", { name: "Close menu" }));
    expect(dialog).not.toHaveAttribute("open");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Lightbox", () => {
  const items: LightboxItem[] = ["One", "Two", "Three"].map((title, i) => ({
    id: String(i),
    title,
    year: 2024,
    lines: ["Oil on linen"],
    image: img(`img${i}`, 1600, 2000).src,
    alt: `${title} alt`,
    href: `/artwork/${title.toLowerCase()}`,
  }));

  it("opens on the chosen work, moves with arrow keys and returns focus on close", async () => {
    const user = userEvent.setup();
    render(
      <Lightbox items={items} label="Painting viewer">
        {items.map((item, i) => (
          <LightboxTrigger key={item.id} index={i} label={item.title}>
            <span>{item.title} thumbnail</span>
          </LightboxTrigger>
        ))}
      </Lightbox>,
    );
    const trigger = screen.getByRole("button", { name: /View larger: Two/ });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Painting viewer" });
    expect(within(dialog).getByRole("heading", { name: /Two/ })).toBeInTheDocument();
    expect(within(dialog).getByText("2 of 3")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByRole("heading", { name: /Three/ })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByRole("heading", { name: /One/ })).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByRole("heading", { name: /Three/ })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "View details" })).toHaveAttribute("href", "/artwork/three");

    await user.click(within(dialog).getAllByRole("button", { name: "Close viewer" })[0]);
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
  });
});

describe("VideoPlayer", () => {
  it("loads nothing until play is pressed, then a privacy-enhanced embed", async () => {
    const user = userEvent.setup();
    render(
      <VideoPlayer
        video={{ title: "Showreel", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "1:30", transcript: "Narration text" }}
        poster={<div>poster</div>}
      />,
    );
    expect(document.querySelector("iframe")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Play video: Showreel, 1:30" }));
    const frame = document.querySelector("iframe")!;
    expect(frame.src).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(frame).toHaveAttribute("title", "Showreel");
    expect(screen.getByText("Transcript")).toBeInTheDocument();
  });

  it("plays only one video at a time", async () => {
    const user = userEvent.setup();
    render(
      <>
        <VideoPlayer video={{ title: "First", url: "https://vimeo.com/111111111" }} poster={<div />} />
        <VideoPlayer video={{ title: "Second", url: "https://vimeo.com/222222222" }} poster={<div />} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Play video: First" }));
    await user.click(screen.getByRole("button", { name: "Play video: Second" }));
    const frames = [...document.querySelectorAll("iframe")];
    expect(frames).toHaveLength(1);
    expect(frames[0]).toHaveAttribute("title", "Second");
  });

  it("explains when a video can't be played instead of showing a dead button", () => {
    render(<VideoPlayer video={{ title: "Broken", url: "https://example.com/video" }} poster={<div />} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("This video is unavailable.")).toBeInTheDocument();
  });
});

describe("ArtworkImage layout stability", () => {
  const image = img("tall", 1600, 2000, "A tall painting");

  it("reserves the artwork's exact proportions before the image loads", () => {
    render(<ArtworkImage image={image} fallbackAlt="x" sizes="50vw" />);
    const el = screen.getByRole("img", { name: "A tall painting" });
    expect(el).toHaveAttribute("width", "1600");
    expect(el).toHaveAttribute("height", "2000");
    expect(ratioOf(el.parentElement!)).toBeCloseTo(0.8, 3);
    expect(el).toHaveAttribute("loading", "lazy");
  });

  it("offers responsive widths with a sizes hint instead of the original file", () => {
    render(<ArtworkImage image={image} fallbackAlt="x" sizes="(min-width: 768px) 30vw, 100vw" />);
    const el = screen.getByRole("img");
    expect(el).toHaveAttribute("sizes", "(min-width: 768px) 30vw, 100vw");
    expect(el.getAttribute("srcset")).toContain(" 640w");
  });

  it("crops to a deliberate aspect ratio around the focal point", () => {
    render(<ArtworkImage image={{ ...image, focus: { x: 0.3, y: 0.6 } }} fallbackAlt="x" sizes="100vw" aspectRatio={16 / 9} />);
    const el = screen.getByRole("img");
    expect(el).toHaveAttribute("data-fill", "true");
    expect(el.style.objectPosition).toBe("30% 60%");
    expect(ratioOf(el.parentElement!)).toBeCloseTo(16 / 9, 3);
  });

  it("keeps the layout and announces a missing image instead of breaking", () => {
    render(<ArtworkImage image={null} fallbackAlt="Blue Hour" sizes="100vw" />);
    expect(screen.getByRole("img", { name: "Blue Hour (image unavailable)" })).toBeInTheDocument();
  });
});
