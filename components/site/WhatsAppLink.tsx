import { cn } from "@/lib/cn";

/**
 * WhatsApp link. Renders nothing until the client has supplied a number —
 * a dead WhatsApp button is worse than none, because someone will tap it.
 *
 * A plain wa.me link rather than the official widget: no third-party script, no
 * tracking, and it behaves correctly on desktop and mobile alike.
 */
export function WhatsAppLink({
  number,
  message,
  className,
  children,
}: {
  number: string | null;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!number) return null;

  const digits = number.replace(/\D/g, "");
  const href = `https://wa.me/${digits}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group inline-flex items-center gap-2.5 py-1.5 font-sans text-meta uppercase text-text",
        className,
      )}
    >
      {children ?? "Message on WhatsApp"}
      <span
        aria-hidden
        className="translate-y-px transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}
