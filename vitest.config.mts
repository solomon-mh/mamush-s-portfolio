import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["tests/support/setup.ts"],
    restoreMocks: true,
    // The first page render imports the whole app, which can pass 5s on a busy machine.
    testTimeout: 15_000,
  },
});
