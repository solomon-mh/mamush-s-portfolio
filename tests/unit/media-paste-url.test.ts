import { describe, expect, it } from "vitest";
import { Media } from "@/payload/collections/Media";
// Payload's own matcher, which its paste-url endpoint uses. It isn't a public export.
import { isURLAllowed } from "../../node_modules/payload/dist/utilities/isURLAllowed.js";

const pasteURL = Media.upload && typeof Media.upload === "object" ? Media.upload.pasteURL : undefined;
const allowList = pasteURL && typeof pasteURL === "object" ? pasteURL.allowList : [];

describe("pasting an image link in the admin", () => {
  it("fetches https links on the server, so sites that block browser downloads still work", () => {
    expect(allowList.length).toBeGreaterThan(0); // the admin only falls back to the server with an allow-list
    for (const url of ["https://upload.wikimedia.org/a.jpg", "https://i.pinimg.com/736x/b.png"]) {
      expect(isURLAllowed(url, allowList)).toBe(true);
    }
  });

  it("refuses insecure links", () => {
    expect(isURLAllowed("http://example.com/a.jpg", allowList)).toBe(false);
  });
});
