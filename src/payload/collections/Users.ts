import type { CollectionConfig } from "payload";
import { signedIn } from "../access";

/** People who can sign in to the admin. Create the first one at /admin. */
export const Users: CollectionConfig = {
  slug: "users",
  admin: { group: "Admin", useAsTitle: "email", defaultColumns: ["name", "email"] },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  fields: [{ name: "name", type: "text", label: "Name" }],
};
