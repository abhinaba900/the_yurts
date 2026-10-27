import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The site's default text call-to-action: an olive label, a rule that draws itself
 * on hover, and an arrow that steps once. No button chrome.
 */
export function ArrowLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const Arrow = external ? "↗" : "→";

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex min-h-11 items-center gap-[0.5em] py-1.5",
        "font-sans text-small font-medium text-accent-text transition-colors duration-(--duration-quick)",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="transition-colors duration-(--duration-quick) group-hover:text-text">{children}</span>
      <span
        aria-hidden
        className={cn(
          "inline-block translate-y-px transition-transform duration-300",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          external
            ? "group-hover:-translate-y-1 group-hover:translate-x-1"
            : "group-hover:translate-x-1.5",
        )}
      >
        {Arrow}
      </span>
      {/* The rule: full width at rest in line, redrawn in accent on hover. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-1.5 h-px bg-line-strong"
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-text",
          "transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
