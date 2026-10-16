import type { AccessArgs } from "payload";
import { describe, expect, it } from "vitest";
import { filesOrSignedIn } from "@/payload/access";

const args = (user: object | null, isReadingStaticFile?: boolean) => ({ req: { user }, isReadingStaticFile }) as unknown as AccessArgs;

describe("media access", () => {
  it("lets anyone load a file by its URL", () => {
    expect(filesOrSignedIn(args(null, true))).toBe(true);
  });

  it("keeps the media API to signed-in users", () => {
    expect(filesOrSignedIn(args(null))).toBe(false);
    expect(filesOrSignedIn(args({ id: 1 }))).toBe(true);
  });
});
