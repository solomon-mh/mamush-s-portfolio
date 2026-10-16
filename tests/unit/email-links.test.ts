import { describe, expect, it } from "vitest";
import { enquiryDraft, gmailHref, mailtoHref } from "@/lib/email-links";

describe("email contact links", () => {
  const draft = enquiryDraft("Mamush", "Editorial illustration");

  it("writes a short, friendly draft for the chosen topic", () => {
    expect(draft.subject).toBe("Editorial illustration enquiry");
    expect(draft.body).toMatch(/^Hello Mamush,/);
    expect(draft.body).toContain("editorial illustration project");
    expect(draft.body).toContain("Timeline:");
    expect(enquiryDraft("Mamush").subject).toBe("Project enquiry");
  });

  it("opens the visitor's email app with subject and body encoded", () => {
    const url = new URL(mailtoHref("studio@example.com", draft));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("studio@example.com");
    expect(url.searchParams.get("subject")).toBe("Editorial illustration enquiry");
    expect(url.searchParams.get("body")).toContain("Hello Mamush,");
    expect(mailtoHref("studio@example.com")).toBe("mailto:studio@example.com");
  });

  it("opens Gmail's compose window addressed to the artist", () => {
    const url = new URL(gmailHref("studio@example.com", draft));
    expect(url.origin).toBe("https://mail.google.com");
    expect(url.searchParams.get("view")).toBe("cm");
    expect(url.searchParams.get("to")).toBe("studio@example.com");
    expect(url.searchParams.get("su")).toBe("Editorial illustration enquiry");
  });

  it("keeps line breaks out of the subject", () => {
    const url = new URL(mailtoHref("s@example.com", { subject: "Hi\r\nBcc: x@example.com" }));
    expect(url.searchParams.get("subject")).not.toMatch(/[\r\n]/);
  });
});
