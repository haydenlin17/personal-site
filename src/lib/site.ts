/**
 * The site's own address, in one place.
 *
 * Change `FALLBACK` (or set NEXT_PUBLIC_SITE_URL) when the custom domain is
 * live and everything that prints or links the address follows: canonical URLs,
 * Open Graph tags, and the address on the share card.
 */
const FALLBACK = "https://haydenlin.com";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK;

/** Bare host, for showing the address rather than linking it. */
export const siteHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
