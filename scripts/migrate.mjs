/*
 * Runs before every build: applies pending database migrations once, before
 * Next.js starts its parallel build workers. Skipped when no database is
 * configured (e.g. tests, which build from the starter content).
 */
import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.log("No DATABASE_URL — building from the starter content in /content.");
  process.exit(0);
}

const result = spawnSync("payload", ["migrate"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
