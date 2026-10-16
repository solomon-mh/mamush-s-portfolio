import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against a production build of the site with its real
 * content. They discover pages from the sitemap and navigation, so they keep
 * working as content changes.
 *
 * Browsers: run `npx playwright install chromium` once, or set
 * PLAYWRIGHT_CHANNEL=chrome to use an installed Google Chrome.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
    timeout: 600_000,
    reuseExistingServer: !process.env.CI,
  },
});
