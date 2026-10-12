import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleContactRequest, MAX_BODY_BYTES, type ContactDeps } from "@/features/contact/handler";
import { createRateLimiter } from "@/features/contact/rate-limit";
import { contactSchema } from "@/features/contact/schema";
import { EmailDeliveryError, formatEnquiry, sendEnquiryEmail } from "@/features/contact/send-email";

const NOW = 1_800_000_000_000;
const config = { apiKey: "re_test", from: "Studio <studio@example.com>", to: "inbox@example.com" };

const valid = {
  name: "Ada Client",
  email: "ada@agency.example",
  organisation: "Agency",
  enquiryType: "Commission",
  message: "We would like to commission a series of editorial illustrations for a spring campaign.",
  timeline: "By June",
  budget: "",
  consent: true,
  website: "",
  startedAt: NOW - 60_000,
};

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

let deps: ContactDeps & { send: ReturnType<typeof vi.fn> };

beforeEach(() => {
  deps = {
    limiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
    recent: new Map(),
    getEmailConfig: () => config,
    send: vi.fn().mockResolvedValue(undefined),
    getEnquiryTypes: async () => ["Commission", "Collaboration"],
    now: () => NOW,
    log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  };
});

describe("contact form validation", () => {
  it("accepts a complete enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("explains each problem in plain language", () => {
    const result = contactSchema.safeParse({ ...valid, name: "", email: "nope", message: "short", consent: false });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => `${String(i.path[0])}: ${i.message}`);
    expect(messages).toEqual(
      expect.arrayContaining([
        "name: Please enter your name.",
        "email: Please enter a valid email address, e.g. name@studio.com.",
        expect.stringMatching(/^message: Please tell me a little more/),
        "consent: Please confirm you have read how your details are used.",
      ]),
    );
  });
});

describe("contact API", () => {
  it("delivers a valid enquiry and reports success", async () => {
    const res = await handleContactRequest(request(valid), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deps.send).toHaveBeenCalledOnce();
    expect(deps.send.mock.calls[0][1]).toMatchObject({ name: "Ada Client", email: "ada@agency.example" });
  });

  it("never reports success when delivery fails", async () => {
    deps.send.mockRejectedValue(new EmailDeliveryError("Email provider responded 500", 500));
    const res = await handleContactRequest(request(valid), deps);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, code: "delivery_failed" });
  });

  it("says plainly when email delivery isn't configured, without pretending to send", async () => {
    deps.getEmailConfig = () => null;
    const res = await handleContactRequest(request(valid), deps);
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, code: "not_configured" });
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("validates again on the server and returns field errors", async () => {
    const res = await handleContactRequest(request({ ...valid, email: "broken" }), deps);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ code: "invalid", fieldErrors: { email: expect.any(String) } });
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("only accepts enquiry types the form offers", async () => {
    const res = await handleContactRequest(request({ ...valid, enquiryType: "Crypto opportunity" }), deps);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ fieldErrors: { enquiryType: expect.any(String) } });
  });

  it("silently discards honeypot and instant submissions without sending", async () => {
    expect((await handleContactRequest(request({ ...valid, website: "http://spam" }), deps)).status).toBe(200);
    expect((await handleContactRequest(request({ ...valid, startedAt: NOW - 500 }), deps)).status).toBe(200);
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from one connection", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await handleContactRequest(request({ ...valid, message: `${valid.message} ${i}` }), deps);
      statuses.push(res.status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    // A different connection is unaffected.
    const other = await handleContactRequest(request(valid, { "x-forwarded-for": "198.51.100.1" }), deps);
    expect(other.status).toBe(200);
  });

  it("sends a duplicate submission only once", async () => {
    await handleContactRequest(request(valid), deps);
    const again = await handleContactRequest(request(valid), deps);
    expect(again.status).toBe(200);
    expect(deps.send).toHaveBeenCalledOnce();
  });

  it("rejects oversized and malformed requests before parsing", async () => {
    const big = { ...valid, message: "x".repeat(MAX_BODY_BYTES) };
    expect((await handleContactRequest(request(big), deps)).status).toBe(413);
    expect((await handleContactRequest(request("{not json"), deps)).status).toBe(400);
    const form = new Request("http://localhost/api/contact", { method: "POST", body: "a=b", headers: { "content-type": "application/x-www-form-urlencoded" } });
    expect((await handleContactRequest(form, deps)).status).toBe(415);
    expect(deps.send).not.toHaveBeenCalled();
  });
});

describe("email delivery", () => {
  const data = contactSchema.parse(valid);

  it("posts a plain-text email to Resend with reply-to set to the sender", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    await sendEnquiryEmail(config, data, fetchImpl);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ from: config.from, to: [config.to], reply_to: "ada@agency.example" });
    expect(body.text).toContain(valid.message);
  });

  it("throws on provider errors and network failures", async () => {
    const rejected = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Invalid from" }), { status: 422 }));
    await expect(sendEnquiryEmail(config, data, rejected)).rejects.toThrow(/422: Invalid from/);
    const offline = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    await expect(sendEnquiryEmail(config, data, offline)).rejects.toBeInstanceOf(EmailDeliveryError);
  });

  it("strips line breaks from the subject to prevent header injection", () => {
    const { subject } = formatEnquiry({ ...data, name: "Eve\r\nBcc: victim@example.com" });
    expect(subject).not.toMatch(/[\r\n]/);
  });
});
