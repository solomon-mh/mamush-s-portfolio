import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { sameSitePath } from "../same-site-path";

/**
 * The admin's Preview button: shows the site with unpublished drafts.
 * Only for people signed in to the admin.
 */
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("Sign in to the admin to preview drafts.", { status: 403 });

  (await draftMode()).enable();
  redirect(sameSitePath(request));
}
