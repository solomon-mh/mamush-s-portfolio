import { getEnquiryOptions } from "@/features/contact/options";
import { handleContactRequest } from "@/features/contact/handler";
import { createRateLimiter } from "@/features/contact/rate-limit";
import { sendEnquiryEmail } from "@/features/contact/send-email";
import { getEmailConfig } from "@/lib/env.server";

// Five enquiries per connection every ten minutes is generous for people and tight for scripts.
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const recent = new Map<string, number>();

export async function POST(request: Request) {
  return handleContactRequest(request, {
    limiter,
    recent,
    getEmailConfig,
    send: (config, data) => sendEnquiryEmail(config, data),
    getEnquiryTypes: async () => (await getEnquiryOptions()).enquiryTypes,
  });
}
