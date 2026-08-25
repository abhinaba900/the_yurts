import "server-only";

import { client } from "./client";
import { isSanityConfigured } from "../env";

/**
 * The only way content is read.
 *
 * Two guarantees, both of which matter more than they look:
 *
 * 1. It never throws. An unconfigured project, an unreachable API or a bad
 *    response all resolve to the caller's `fallback`. A CMS outage must degrade
 *    the site to its empty state, not return a 500 — every section is already
 *    built to hide itself when it has no content.
 *
 * 2. It is cached and tagged. Pages stay static and are revalidated by tag from
 *    the webhook route, so publishing in the Studio updates the site without a
 *    deploy and without putting the Sanity API in front of every visitor.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  fallback,
  revalidate = 3600,
}: {
  query: string;
  params?: Record<string, unknown>;
  /** Revalidation tags. Use the document types the query reads. */
  tags?: string[];
  /** Returned when Sanity is unconfigured or the request fails. */
  fallback: T;
  revalidate?: number | false;
}): Promise<T> {
  if (!isSanityConfigured || !client) return fallback;

  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    });

    return result ?? fallback;
  } catch (error) {
    // Logged, not thrown. A page that renders without its CMS content is a
    // far better outcome than a page that does not render.
    console.error(
      `[sanity] query failed, falling back to empty content:`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
}
