import { cn } from "@/lib/cn";
import { Metadata } from "./Metadata";

/**
 * A hairline. Optionally with a label sitting on it.
 * This is the site's only divider — no boxes, no card borders.
 */
export function Rule({
  label,
  index,
  className,
}: {
  label?: string;
  index?: string;
  className?: string;
}) {
  if (!label && !index) {
    return <hr className={cn("u-rule", className)} />;
  }

  return (
    <div
      className={cn(
        "flex items-baseline gap-6 border-t border-line pt-3",
        className,
      )}
    >
      {index ? <Metadata className="text-accent-text">{index}</Metadata> : null}
      {label ? <Metadata>{label}</Metadata> : null}
    </div>
  );
}
