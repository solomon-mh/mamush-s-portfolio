import { describe, expect, it } from "vitest";
import { sameSitePath } from "@/app/(site)/next/same-site-path";

const at = (path: string) => sameSitePath(new Request(`https://site.test/next/preview?path=${encodeURIComponent(path)}`));

describe("preview redirects", () => {
  it("keeps paths on this site", () => {
    expect(at("/artwork/blue-hour")).toBe("/artwork/blue-hour");
    expect(at("/work?discipline=painting#top")).toBe("/work?discipline=painting#top");
  });

  it("never leaves the site", () => {
    for (const path of ["//evil.com", "/\\evil.com", "\\\\evil.com", "https://evil.com/x", "javascript:alert(1)", "/.//evil.com", "/%2e//evil.com", "/a/..//evil.com"]) {
      expect(at(path)).not.toContain("evil.com");
      expect(at(path)).toMatch(/^\/(?!\/)/); // one leading slash: never a protocol-relative URL
    }
  });
});
