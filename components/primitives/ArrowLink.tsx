import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The site's default call-to-action: a tracked label, a rule that draws itself
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
        "group relative inline-flex items-center gap-2.5 py-1.5",
        "font-sans text-meta uppercase tracking-wider text-text transition-colors duration-300",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="transition-colors duration-300 group-hover:text-accent-text">{children}</span>
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
        className="absolute inset-x-0 bottom-0 h-px bg-line opacity-70"
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent-text",
          "transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
