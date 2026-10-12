import "server-only";
import { getEnquiryOptions as fromContent } from "@/content";
import { DEFAULT_ENQUIRY_TYPES } from "./schema";

/**
 * Enquiry and budget choices from content/site.ts, with defaults so the form
 * always works. Shared by the contact page and the API route, which only
 * accepts the choices the form offered.
 */
export async function getEnquiryOptions() {
  const options = fromContent();
  return {
    ...options,
    enquiryTypes: options.enquiryTypes.length > 0 ? options.enquiryTypes : [...DEFAULT_ENQUIRY_TYPES],
  };
}
