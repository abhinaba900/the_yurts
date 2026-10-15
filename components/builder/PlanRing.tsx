"use client";

import { cn } from "@/lib/cn";

/**
 * The yurt's wall from above, as a clock: the main door at six o'clock, and a
 * place for a window at every other hour.
 *
 * Each free hour is a real toggle button, so placing windows works from the
 * keyboard and is announced; the drawing is the button's face. Door hours are
 * shown but fixed — the plan decides where the doors go.
 */
export function PlanRing({
  doors,
  windows,
  included,
  onToggle,
  className,
}: {
  doors: number[];
  windows: number[];
  /** How many windows the plan price includes, for the legend. */
  included: number;
  onToggle: (position: number) => void;
  className?: string;
}) {
  const size = 260;
  const c = size / 2;
  const ring = 84;
  const label = 112;

  const at = (hour: number, radius: number) => {
    const angle = (hour / 12) * Math.PI * 2;
    return { x: c + radius * Math.sin(angle), y: c - radius * Math.cos(angle) };
  };

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[17rem]", className)}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden className="absolute inset-0 size-full">
        <circle cx={c} cy={c} r={ring} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
        <circle cx={c} cy={c} r={ring - 7} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
          const isDoor = doors.includes(hour);
          const isWindow = windows.includes(hour);
          const { x, y } = at(hour, ring - 3.5);
          const text = at(hour, label);
          const rotate = (hour / 12) * 360;
          return (
            <g key={hour}>
              <rect
                x={x - (isDoor ? 14 : 11)}
                y={y - 4.5}
                width={isDoor ? 28 : 22}
                height={9}
                transform={`rotate(${rotate} ${x} ${y})`}
                className={cn(
                  isDoor
                    ? "fill-accent-text"
                    : isWindow
                      ? "fill-accent stroke-emerald-light"
                      : "fill-transparent stroke-current",
                )}
                strokeOpacity={isWindow ? 1 : 0.35}
                strokeDasharray={isDoor || isWindow ? undefined : "2 2"}
              />
              <text
                x={text.x}
                y={text.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  "font-sans text-[10px] tracking-wider",
                  isDoor ? "fill-accent-text" : isWindow ? "fill-current" : "fill-current opacity-40",
                )}
              >
                {isDoor ? `D${hour}` : isWindow ? `W${hour}` : hour}
              </text>
            </g>
          );
        })}
      </svg>

      {/* The hit areas: one button per free hour. */}
      {Array.from({ length: 12 }, (_, i) => i + 1)
        .filter((hour) => !doors.includes(hour))
        .map((hour) => {
          const { x, y } = at(hour, (ring + label) / 2);
          const on = windows.includes(hour);
          return (
            <button
              key={hour}
              type="button"
              aria-pressed={on}
              aria-label={`${on ? "Remove" : "Add"} a window at ${hour} o'clock`}
              onClick={() => onToggle(hour)}
              className="absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-accent-text hover:bg-cream/5"
              style={{ left: `${(x / size) * 100}%`, top: `${(y / size) * 100}%` }}
            />
          );
        })}

      <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-sans text-[0.625rem] uppercase tracking-[0.14em] text-text-muted">
        {windows.length} window{windows.length === 1 ? "" : "s"}
        <br />
        {included} included
      </p>
    </div>
  );
}
