import { cn } from "@/lib/cn";
import type { SpecRow } from "@/sanity/lib/types";

/**
 * Specifications set as typography rather than stacked into a table.
 *
 * The figure is the display serif at numeral size, the unit and label are
 * tracked metadata. This is the site's primary device for product data — it is
 * why `specRow` stores value and unit separately in the CMS.
 */
export function SpecList({
  specs,
  size = "large",
  className,
}: {
  specs: SpecRow[] | null | undefined;
  size?: "large" | "small";
  className?: string;
}) {
  if (!specs?.length) return null;

  return (
    <dl
      className={cn(
        "flex flex-wrap",
        size === "large" ? "gap-x-14 gap-y-8" : "gap-x-10 gap-y-5",
        className,
      )}
    >
      {specs.map((spec) => (
        <div key={`${spec.label}-${spec.value}`}>
          <dd
            className={cn(
              "font-display",
              size === "large" ? "text-numeral" : "text-display-sm",
            )}
          >
            {spec.value}
            {spec.unit ? (
              <span className="ml-2 font-sans text-meta uppercase text-text-muted">
                {spec.unit}
              </span>
            ) : null}
          </dd>
          <dt className="mt-2 font-sans text-meta uppercase text-text-muted">
            {spec.label}
          </dt>
          {spec.note ? (
            <p className="mt-1 font-sans text-small text-text-muted opacity-80">
              {spec.note}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
