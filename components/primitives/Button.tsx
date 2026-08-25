import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "solid" | "hairline";
type Size = "sm" | "md";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden " +
  "font-sans text-meta uppercase tracking-wider select-none " +
  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-40 disabled:transform-none";

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.6875rem]",
  md: "h-13 px-8 text-[0.75rem]",
};

const variants: Record<Variant, string> = {
  // High-contrast solid block with subtle elevation glow on hover
  solid:
    "bg-text text-surface shadow-sm hover:bg-accent-text hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] " +
    "after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-white/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
  // Hairline border that fills smoothly from the bottom on hover
  hairline:
    "border border-line-strong text-text hover:border-text hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)] " +
    "before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-text " +
    "before:transition-[height] before:duration-300 before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "hover:before:h-full hover:text-surface",
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
  const inner = <span className="relative z-10">{children}</span>;

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
