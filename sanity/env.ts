/**
 * Sanity environment.
 *
 * The site is built to run WITHOUT Sanity configured. Until a project id is set
 * every query returns empty, and sections that have no content hide themselves —
 * which is the same behaviour they have for a configured-but-empty dataset.
 *
 * That is deliberate: the build must never depend on a third-party service being
 * reachable, and a missing environment variable must not take the site down.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Pin this. Bumping it is a deliberate migration, never an accident. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";

/** Server-only. Used for draft previews; never exposed to the browser. */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const isSanityConfigured = projectId.length > 0;

export const studioUrl = "/studio";
