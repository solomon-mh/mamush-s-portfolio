import type { Access } from "payload";

/*
 * The public site reads content on the server, so the admin API only needs
 * to answer signed-in users. Media files are the exception: browsers load
 * them directly.
 */
export const signedIn: Access = ({ req }) => Boolean(req.user);

/**
 * Anyone may load a media file by its URL, but only signed-in users may list
 * or query the library through the API, which would otherwise reveal uploads
 * that belong to unpublished drafts.
 */
export const filesOrSignedIn: Access = ({ req, isReadingStaticFile }) => Boolean(req.user) || Boolean(isReadingStaticFile);
