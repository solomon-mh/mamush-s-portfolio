import type { Access } from "payload";

/*
 * The public site reads content on the server, so the admin API only needs
 * to answer signed-in users. Media files are the exception: browsers load
 * them directly.
 */
export const signedIn: Access = ({ req }) => Boolean(req.user);

/**
 * Anyone may load a media file by its URL, but only signed-in users may list
 * or query the library through the REST or GraphQL API, which would otherwise
 * reveal uploads that belong to unpublished drafts. Server code using the
 * Local API (the seed script) is trusted: Payload checks references from
 * globals with the caller's access, so it must be able to see the library.
 */
export const filesOrSignedIn: Access = ({ req, isReadingStaticFile }) =>
  Boolean(req.user) || Boolean(isReadingStaticFile) || req.payloadAPI === "local";
