import { cn } from "@/lib/cn";

type Network = "instagram" | "linkedin" | "youtube" | "pinterest";

/** Each network's mark, drawn on a 24px box in currentColor. */
const marks: Record<Network, { label: string; path: string }> = {
  instagram: {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z",
  },
  youtube: {
    label: "YouTube",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  pinterest: {
    label: "Pinterest",
    path: "M12 0a12 12 0 0 0-4.4 23.2c-.1-.9-.2-2.4 0-3.4l1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.4l-.3 1.4c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2 4.1 0 7.3 2.9 7.3 6.9 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.7 2.9c-.3 1-1 2.3-1.5 3.1A12 12 0 1 0 12 0z",
  },
};

const order: Network[] = ["instagram", "linkedin", "youtube", "pinterest"];

/**
 * The social profiles, as icons.
 *
 * Every network is shown, linked or not: the client wants the row in place
 * now and the profiles filled in later (Sanity → Site settings → Social, or
 * `site.social` in `lib/site.ts`). A network without a URL is drawn the same
 * but is not a link, so there is never a link to nowhere — and it starts
 * working the moment its URL is set.
 */
export function SocialLinks({
  links,
  className,
}: {
  links: Partial<Record<Network, string | null>>;
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {order.map((network) => {
        const { label, path } = marks[network];
        const href = links[network];
        const icon = (
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d={path} />
          </svg>
        );
        const box =
          "grid size-9 place-items-center rounded-full border border-line text-text-muted";

        return (
          <li key={network}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Theyurts on ${label}`}
                className={cn(
                  box,
                  "transition-colors duration-(--duration-quick) hover:border-accent-text hover:text-accent-text",
                )}
              >
                {icon}
              </a>
            ) : (
              <span className={box} title={`${label} — coming soon`}>
                {icon}
                <span className="sr-only">{label}, coming soon</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
