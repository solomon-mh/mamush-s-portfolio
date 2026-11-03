import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/env";

describe("the site's public address", () => {
  it("uses NEXT_PUBLIC_SITE_URL when it is set", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://mamush.art", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "mamush.vercel.app" })).toBe("https://mamush.art");
  });

  it("uses Vercel's production domain in production, never localhost", () => {
    expect(resolveSiteUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "mamush.vercel.app", VERCEL_URL: "mamush-abc123.vercel.app" })).toBe("https://mamush.vercel.app");
  });

  it("ignores a localhost NEXT_PUBLIC_SITE_URL on Vercel", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "mamush.vercel.app" })).toBe("https://mamush.vercel.app");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" })).toBe("http://localhost:3000");
  });

  it("uses the deployment's own URL for previews", () => {
    expect(resolveSiteUrl({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "mamush.vercel.app", VERCEL_URL: "mamush-git-feature.vercel.app" })).toBe("https://mamush-git-feature.vercel.app");
  });

  it("falls back to localhost for local development", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});
