import { describe, expect, it } from "vitest";
import { Media } from "@/payload/collections/Media";
import { fetchPublicFile, isPublicAddress, pasteURLEndpoint } from "@/payload/endpoints/pasteURL";
// Payload's own matcher, which decides whether the admin falls back to the server. It isn't a public export.
import { isURLAllowed } from "../../node_modules/payload/dist/utilities/isURLAllowed.js";

const pasteURL = Media.upload && typeof Media.upload === "object" ? Media.upload.pasteURL : undefined;
const allowList = pasteURL && typeof pasteURL === "object" ? pasteURL.allowList : [];

describe("pasting an image link in the admin", () => {
  it("falls back to the server for https links, so sites that block browser downloads still work", () => {
    expect(allowList.length).toBeGreaterThan(0); // the admin only falls back to the server with an allow-list
    for (const url of ["https://upload.wikimedia.org/a.jpg", "https://i.pinimg.com/736x/b.png"]) {
      expect(isURLAllowed(url, allowList)).toBe(true);
    }
    expect(isURLAllowed("http://example.com/a.jpg", allowList)).toBe(false);
  });

  it("replaces Payload's endpoint, which skips SSRF checks for allow-listed links", () => {
    expect(Media.endpoints && Media.endpoints[0]).toBe(pasteURLEndpoint);
    expect(pasteURLEndpoint.path).toBe("/paste-url/:id?");
  });

  it("tells public addresses from internal ones", () => {
    for (const ip of ["93.184.216.34", "2606:4700::6810:85e5"]) expect(isPublicAddress(ip)).toBe(true);
    for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:7f00:1",
      "::127.0.0.1", "2002:7f00:1::1", "2001:0:4136:e378:8000:63bf:3fff:fdd2", "64:ff9b::7f00:1", "64:ff9b:1::a00:1", "2001:db8::1", "ff02::1", "not-an-ip"]) {
      expect(isPublicAddress(ip)).toBe(false);
    }
  });

  it("refuses insecure and internal links before fetching anything", async () => {
    for (const src of ["http://example.com/a.jpg", "https://127.0.0.1/a.jpg", "https://169.254.169.254/latest/meta-data", "https://[::1]/a.jpg", "not a url"]) {
      await expect(fetchPublicFile(src)).rejects.toThrow();
    }
  });

  it("refuses names that resolve to internal addresses", async () => {
    await expect(fetchPublicFile("https://localhost/a.jpg")).rejects.toThrow(/isn't a public website/);
  });
});
