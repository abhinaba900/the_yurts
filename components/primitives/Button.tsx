import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "solid" | "hairline" | "inverse";
type Size = "sm" | "md";

/**
 * Buttons are content-sized with a 2.75rem minimum touch target. Sentence case,
 * medium weight — the tracked uppercase label is kept for editorial metadata,
 * where it is rare enough to mean something.
 */
const base =
  "group relative inline-flex items-center justify-center gap-[0.5em] select-none " +
  "rounded-(--radius-control) font-sans font-medium leading-[1.3] tracking-[0.01em] " +
  "transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-(--duration-quick) ease-(--ease-out-soft) " +
  "active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 py-2 text-small",
  md: "min-h-11 px-6 py-3 text-small sm:text-body",
};

const variants: Record<Variant, string> = {
  // Espresso on linen and sand; sand on espresso. The primary action, everywhere.
  solid:
    "bg-accent text-on-accent shadow-(--shadow-card) " +
    "hover:bg-accent-hover hover:shadow-(--shadow-lift)",
  // Secondary: a quiet outline that fills with the selected surface on hover.
  hairline:
    "border border-line-strong text-text bg-transparent " +
    "hover:border-text hover:bg-surface-selected",
  // A light button for use directly over photography.
  inverse:
    "bg-linen text-espresso shadow-(--shadow-card) hover:bg-white hover:shadow-(--shadow-lift)",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

export function Button({
  variant = "solid",
  size = "md",
  href,
  className,
  children,
  ...props
}: Props) {
  const classes = cn(base, sizes[size], variants[variant], className);
  const inner = children;

  // In-page anchors stay plain links, so SmoothScroll's anchor handler owns
  // the scroll rather than the router.
  if (href?.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  if (href && /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {inner}
    </button>
  );
}
