/**
 * Formatting helpers.
 *
 * Dates are formatted with an explicit locale and time zone. Left to the
 * runtime's defaults, a date rendered on the server and re-rendered on the
 * client can disagree by a day and produce a hydration mismatch.
 */

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Machine-readable date for <time datetime> and schema. */
export function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * Estimated reading time from Portable Text, used only when an editor has not
 * set one. 200 words per minute, which is deliberately conservative for
 * long-form prose.
 */
export function readingTimeFrom(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 1;

  const words = blocks
    .flatMap((block) =>
      block && typeof block === "object" && "children" in block && Array.isArray(block.children)
        ? block.children.map((child: unknown) =>
            child && typeof child === "object" && "text" in child ? String(child.text) : "",
          )
        : [],
    )
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "PDF";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
