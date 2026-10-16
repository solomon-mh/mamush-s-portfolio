import type { Access } from "payload";

/*
 * The public site reads content on the server, so the admin API only needs
 * to answer signed-in users. Media files are the exception: browsers load
 * them directly.
 */
export const signedIn: Access = ({ req }) => Boolean(req.user);
export const anyone: Access = () => true;
