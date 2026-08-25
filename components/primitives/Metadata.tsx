import { cn } from "@/lib/cn";

/**
 * Small uppercase tracked label. The counterweight to the serif display type —
 * used for eyebrows, section indices, spec labels and captions.
 */
export function Metadata({
  as: Tag = "span",
  className,
  children,
}: {
  as?: "span" | "p" | "div" | "dt" | "h2" | "h3";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "font-sans text-meta uppercase text-text-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
