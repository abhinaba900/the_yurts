import { cn } from "@/lib/cn";

type Tone = "light" | "dark";
type Surface = "base" | "alt" | "deep";
type Space = "none" | "base" | "lg";

/**
 * Section wrapper. Owns tone, surface and vertical rhythm — nothing else.
 * Setting tone="light" re-maps every semantic colour token for the subtree,
 * so children need no dark-specific classes.
 */
export function Section({
  tone = "light",
  surface = "base",
  space = "base",
  className,
  children,
  ...props
}: {
  /** Omit to inherit. "light" makes this section the pale punctuation. */
  tone?: Tone;
  surface?: Surface;
  space?: Space;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      {...(tone ? { "data-tone": tone } : {})}
      className={cn(
        surface === "base" && "bg-surface",
        surface === "alt" && "bg-surface-alt",
        surface === "deep" && "bg-surface-deep",
        "text-text",
        space === "base" && "py-(--spacing-section)",
        space === "lg" && "py-(--spacing-section-lg)",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
