import { cn } from "@/lib/cn";

/**
 * Authentic Indian Flag (Tricolor) SVG.
 * Renders consistently across all OS platforms (including Windows where Unicode flag emojis are rendered as text letters).
 */
export function IndiaFlag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center align-middle overflow-hidden rounded-[2px] shadow-xs shrink-0",
        className ?? "h-3.5 w-5"
      )}
      aria-label="India Flag"
      title="India"
    >
      <svg
        viewBox="0 0 24 16"
        className="h-full w-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top: Saffron */}
        <rect width="24" height="5.333" fill="#FF9933" />
        {/* Middle: White */}
        <rect y="5.333" width="24" height="5.334" fill="#FFFFFF" />
        {/* Bottom: India Green */}
        <rect y="10.667" width="24" height="5.333" fill="#138808" />
        {/* Center: Ashoka Chakra (Navy Blue) */}
        <g transform="translate(12, 8)">
          <circle r="2.1" fill="none" stroke="#000080" strokeWidth="0.4" />
          <circle r="0.45" fill="#000080" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-2.0"
              stroke="#000080"
              strokeWidth="0.22"
              transform={`rotate(${i * 15})`}
            />
          ))}
        </g>
      </svg>
    </span>
  );
}
