import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * The read client.
 *
 * `null` when Sanity is not configured. Nothing in the app touches this
 * directly — go through `sanityFetch`, which handles the null case and returns
 * the caller's fallback.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Published content only. Drafts are fetched separately, with a token,
      // by the preview route — they must never leak into a cached page.
      perspective: "published",
      useCdn: true,
    })
  : null;
