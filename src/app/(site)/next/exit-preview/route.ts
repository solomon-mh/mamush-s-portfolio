import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { sameSitePath } from "../same-site-path";

/** Leaves draft preview and returns to the published site. */
export async function GET(request: Request) {
  (await draftMode()).disable();
  redirect(sameSitePath(request));
}
