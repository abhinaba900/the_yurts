import { cn } from "@/lib/cn";

/**
 * The wordmark. Set in the display serif with a tracked, smaller domain suffix —
 * the two typefaces of the system stated together, once, at the top of the page.
 *
 * Replace with the client's supplied logotype when one exists.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-1.5", className)}>
      <span className="font-display text-[1.55rem] leading-none tracking-[-0.02em]">
        Theyurts
      </span>
      <span className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-text-muted">
        .in
      </span>
    </span>
  );
}
