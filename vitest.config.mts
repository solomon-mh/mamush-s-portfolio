import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws outside React Server Components; it is a no-op guard in tests.
      "server-only": path.resolve(import.meta.dirname, "tests/support/empty.ts"),
    },
  },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["tests/support/setup.ts"],
    restoreMocks: true,
  },
});
