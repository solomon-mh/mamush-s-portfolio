import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import { request } from "node:https";
import type { IncomingMessage } from "node:http";
import type { LookupFunction } from "node:net";
import { BlockList, isIP } from "node:net";
import { Readable } from "node:stream";
import { APIError, executeAccess, Forbidden, type Endpoint, type PayloadRequest } from "payload";

/*
 * Replaces Payload's own "Paste URL" endpoint for Media. Payload fetches
 * allow-listed links with plain fetch, skipping its SSRF protection, and an
 * allow-list is what makes the admin fall back to the server when a site
 * blocks the browser download. This version accepts any https link but
 * refuses any host that resolves to a loopback, private, link-local or
 * otherwise internal address. The check runs when each connection is made,
 * so DNS rebinding can't get past it, and again on every redirect.
 */

const internalV4 = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
  ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) internalV4.addSubnet(net, prefix, "ipv4");
// IPv6 is allow-listed: only global unicast (2000::/3), which rules out
// loopback, IPv4-mapped and -compatible forms, NAT64, unique-local,
// link-local and multicast. Inside it, refuse the ranges that embed or relay
// to other addresses (6to4, Teredo) or are reserved.
const globalUnicast = new BlockList();
globalUnicast.addSubnet("2000::", 3, "ipv6");
const reservedV6 = new BlockList();
for (const [net, prefix] of [
  ["2001::", 32], // Teredo
  ["2001:2::", 48], // benchmarking
  ["2001:10::", 28], // ORCHID
  ["2001:20::", 28], // ORCHIDv2
  ["2001:db8::", 32], // documentation
  ["2002::", 16], // 6to4, embeds an IPv4 address
  ["3fff::", 20], // documentation
] as const) reservedV6.addSubnet(net, prefix, "ipv6");

/** True for addresses on the public internet. */
export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return !internalV4.check(address, "ipv4");
  if (family === 6) return globalUnicast.check(address, "ipv6") && !reservedV6.check(address, "ipv6");
  return false;
}

const blocked = (host: string) => new APIError(`Links to ${host} aren't allowed: it isn't a public website.`, 400);

/** DNS lookup that refuses to connect anywhere internal. */
const publicOnlyLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses: LookupAddress[]) => {
    if (err) return callback(err, "", 0);
    const list = Array.isArray(addresses) ? addresses : [];
    if (list.length === 0 || list.some((a) => !isPublicAddress(a.address))) return callback(blocked(hostname), "", 0);
    if (options.all) return (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

function get(url: URL): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    // Many sites (Wikimedia among them) refuse requests without a User-Agent.
    const headers = { "Accept-Encoding": "identity", "User-Agent": "Mozilla/5.0 (compatible; portfolio-admin/1.0)" };
    const req = request(url, { lookup: publicOnlyLookup, headers, timeout: 30_000 }, resolve);
    req.on("timeout", () => req.destroy(new APIError("The link took too long to respond.", 504)));
    req.on("error", reject);
    req.end();
  });
}

/** Fetches a public https URL, following up to three redirects. */
export async function fetchPublicFile(src: string): Promise<{ response: IncomingMessage; url: URL }> {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    throw new APIError("A valid URL string is required.", 400);
  }
  for (let hop = 0; hop <= 3; hop++) {
    if (url.protocol !== "https:") throw new APIError("Only https links can be added.", 400);
    const host = url.hostname.replace(/^\[|\]$/g, "");
    if (isIP(host) && !isPublicAddress(host)) throw blocked(host);
    const response = await get(url);
    const status = response.statusCode ?? 500;
    const location = response.headers.location;
    if (status >= 300 && status < 400 && location) {
      response.resume();
      url = new URL(location, url);
      continue;
    }
    if (status < 200 || status >= 300) {
      response.resume();
      throw new APIError(`Failed to fetch the file from the provided URL (status ${status}).`, status >= 400 && status < 600 ? status : 502);
    }
    return { response, url };
  }
  throw new APIError("Too many redirects.", 403);
}

export const pasteURLEndpoint: Endpoint = {
  path: "/paste-url/:id?",
  method: "get",
  handler: async (req: PayloadRequest) => {
    if (!req.user) throw new Forbidden(req.t);
    const collection = req.payload.collections.media.config;
    const id = req.routeParams?.id;
    const allowed = await executeAccess({ req }, id ? collection.access.update : collection.access.create);
    if (!allowed) throw new Forbidden(req.t);

    const src = req.url ? new URL(req.url).searchParams.get("src") : null;
    if (!src) throw new APIError("A valid URL string is required.", 400);

    const { response, url } = await fetchPublicFile(src);
    const name = decodeURIComponent(url.pathname.split("/").pop() || "file").replace(/[^\w.-]+/g, "-");
    return new Response(Readable.toWeb(response) as ReadableStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${name}"`,
        "Content-Type": String(response.headers["content-type"] ?? "application/octet-stream"),
        ...(response.headers["content-length"] ? { "Content-Length": String(response.headers["content-length"]) } : {}),
      },
    });
  },
};
