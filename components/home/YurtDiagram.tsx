"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Cutaway elevation of a yurt, drawn rather than illustrated.
 *
 * The geometry is parametric — two ellipses (the crown and the top of the wall)
 * with the roof poles interpolated between them — so the drawing is consistent
 * rather than eyeballed, and the proportions can be adjusted in one place.
 *
 * The drawing walks itself: every 2.5s one part lights up and a callout opens
 * beside its label naming it and saying what it does. The cycle lives in this
 * component rather than at either call site, so every place the diagram is used
 * animates identically and a new usage needs no wiring.
 *
 * It stops when the visitor is reading it (hover or keyboard focus) and when
 * the drawing is off screen.
 *
 * It does NOT stop for `prefers-reduced-motion`. That is a deliberate client
 * decision, not an oversight: the cycle is the point of the drawing here. It is
 * kept as gentle as that decision allows — a colour and opacity cross-fade with
 * nothing translating, sliding or flashing — which is the part of the motion
 * guidance that matters most for vestibular triggers.
 *
 * Annotations are hidden below md. A shrunken technical drawing is unreadable,
 * so on small screens the labelled list beside it carries the same information
 * as text instead.
 */

const CROWN = { cx: 430, cy: 150, rx: 54, ry: 17 };
const WALL_TOP = { cx: 430, cy: 330, rx: 240, ry: 32 };
const WALL_BOTTOM = { cx: 430, cy: 452, rx: 240, ry: 32 };

const pt = (e: typeof CROWN, deg: number) => {
  const t = (deg * Math.PI) / 180;
  return { x: e.cx + e.rx * Math.cos(t), y: e.cy + e.ry * Math.sin(t) };
};

/** Roof poles across the visible front half of the roof. */
const poles = Array.from({ length: 10 }, (_, i) => {
  const deg = (i / 9) * 180;
  return { from: pt(CROWN, deg), to: pt(WALL_TOP, deg) };
});

/** Front face of the wall, used to clip the lattice hatching. */
const wallFace = [
  `M ${WALL_TOP.cx - WALL_TOP.rx} ${WALL_TOP.cy}`,
  `A ${WALL_TOP.rx} ${WALL_TOP.ry} 0 0 0 ${WALL_TOP.cx + WALL_TOP.rx} ${WALL_TOP.cy}`,
  `L ${WALL_BOTTOM.cx + WALL_BOTTOM.rx} ${WALL_BOTTOM.cy}`,
  `A ${WALL_BOTTOM.rx} ${WALL_BOTTOM.ry} 0 0 1 ${WALL_BOTTOM.cx - WALL_BOTTOM.rx} ${WALL_BOTTOM.cy}`,
  "Z",
].join(" ");

const lattice = () => {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let x = 110; x <= 800; x += 26) {
    lines.push({ x1: x, y1: 310, x2: x + 150, y2: 500 });
    lines.push({ x1: x, y1: 500, x2: x + 150, y2: 310 });
  }
  return lines;
};

/* -------------------------------------------------------------------------- */
/* The parts, in the order the callout walks them                             */
/* -------------------------------------------------------------------------- */

/**
 * `card` is the top-left of the callout in viewBox units. Left-hand parts open
 * into the margin beside the drawing, right-hand parts into the annotation
 * column, and the door into the empty ground below — chosen so an open callout
 * never sits on top of the structure it is pointing at.
 *
 * Descriptions are pre-split into lines: SVG text does not wrap, and a measured
 * break is more reliable than a foreignObject here.
 */
const PART_IDS = [
  "crown",
  "poles",
  "tension",
  "lattice",
  "cover",
  "door",
] as const;

type PartId = (typeof PART_IDS)[number];

const CARD_W = 190;
const CARD_H = 60;

const parts: Record<
  PartId,
  { name: string; lines: [string, string]; card: { x: number; y: number } }
> = {
  crown: {
    name: "Crown wheel",
    lines: ["The structural heart", "of the roof."],
    card: { x: 650, y: 112 },
  },
  poles: {
    name: "Roof poles",
    lines: ["A radial timber structure", "that distributes the load."],
    card: { x: 650, y: 210 },
  },
  tension: {
    name: "Tension band",
    lines: ["The element that holds", "the structure together."],
    card: { x: 650, y: 354 },
  },
  lattice: {
    name: "Lattice wall",
    lines: ["The flexible circular", "wall system."],
    card: { x: 6, y: 424 },
  },
  cover: {
    name: "Cover",
    lines: ["Insulation and outer layers", "adapted to the environment."],
    card: { x: 6, y: 194 },
  },
  door: {
    name: "Door",
    lines: ["The opening set into", "the lattice wall."],
    card: { x: 470, y: 494 },
  },
};

const CYCLE_MS = 2500;

function Leader({ d, active }: { d: string; active?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1}
      className={cn(
        "transition-[stroke-width,color] duration-(--duration-base)",
        active && "text-accent-text",
      )}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** The callout. Rendered for every part and faded in one at a time. */
function Callout({ part, active }: { part: PartId; active: boolean }) {
  const { name, lines, card } = parts[part];
  return (
    <g
      aria-hidden
      className={cn(
        "transition-opacity duration-(--duration-base) ease-(--ease-out-soft)",
        active ? "opacity-100" : "opacity-0",
      )}
      style={{ pointerEvents: "none" }}
    >
      <rect
        x={card.x}
        y={card.y}
        width={CARD_W}
        height={CARD_H}
        rx={3}
        className="text-surface-deep"
        fill="currentColor"
        opacity={0.96}
      />
      <rect
        x={card.x}
        y={card.y}
        width={CARD_W}
        height={CARD_H}
        rx={3}
        fill="none"
        className="text-accent"
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={card.x + 12}
        y={card.y + 21}
        className="fill-current font-sans text-accent-text"
        fontSize={10}
        letterSpacing="1.4"
      >
        {name.toUpperCase()}
      </text>
      <text
        x={card.x + 12}
        y={card.y + 38}
        className="fill-current font-sans text-text"
        fontSize={10.5}
      >
        {lines[0]}
      </text>
      <text
        x={card.x + 12}
        y={card.y + 51}
        className="fill-current font-sans text-text"
        fontSize={10.5}
      >
        {lines[1]}
      </text>
    </g>
  );
}

export function YurtDiagram({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Starts true so the cycle runs even where IntersectionObserver never
  // reports — the observer's job here is to pause it, not to start it.
  const [inView, setInView] = useState(true);
  const ref = useRef<SVGSVGElement | null>(null);

  // Only run while the drawing is actually on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % PART_IDS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [running]);

  const activeId: PartId = PART_IDS[index];
  const on = (id: PartId) => activeId === id;

  return (
    <svg
      ref={ref}
      viewBox="0 0 860 560"
      className={cn("w-full", className)}
      role="img"
      aria-label="Cutaway elevation of a yurt, showing the crown wheel at the centre of the roof, roof poles running out to the top of the wall, the tension band around the wall head, the lattice wall below it, and the door."
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Ground */}
      <g className="text-line">
        <line
          x1={30}
          y1={484}
          x2={830}
          y2={484}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Lattice, clipped to the front face of the wall */}
      <defs>
        <clipPath id="yurt-wall-face">
          <path d={wallFace} />
        </clipPath>
      </defs>
      <g
        clipPath="url(#yurt-wall-face)"
        className={cn(
          "transition-colors duration-(--duration-base)",
          on("lattice") ? "text-accent-text" : "text-emerald-light",
        )}
      >
        {lattice().map((l, i) => (
          <line
            key={i}
            {...l}
            stroke="currentColor"
            strokeWidth={1}
            opacity={on("lattice") ? 0.9 : 0.55}
            vectorEffect="non-scaling-stroke"
            className="transition-opacity duration-(--duration-base)"
          />
        ))}
      </g>

      {/* Structure */}
      <g
        className="text-line-strong"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
      >
        {/* Roof silhouette — the cover */}
        <g
          className={cn(
            "transition-colors duration-(--duration-base)",
            on("cover") && "text-accent-text",
          )}
          strokeWidth={on("cover") ? 2 : 1.25}
        >
          <line
            x1={WALL_TOP.cx - WALL_TOP.rx}
            y1={WALL_TOP.cy}
            x2={CROWN.cx - CROWN.rx}
            y2={CROWN.cy}
          />
          <line
            x1={WALL_TOP.cx + WALL_TOP.rx}
            y1={WALL_TOP.cy}
            x2={CROWN.cx + CROWN.rx}
            y2={CROWN.cy}
          />
        </g>

        {/* Roof poles */}
        <g
          className={cn(
            "transition-colors duration-(--duration-base)",
            on("poles") && "text-accent-text",
          )}
          strokeWidth={on("poles") ? 1.9 : 1.25}
        >
          {poles.map((p, i) => (
            <line
              key={i}
              x1={p.from.x}
              y1={p.from.y}
              x2={p.to.x}
              y2={p.to.y}
              opacity={on("poles") ? 1 : 0.7}
              className="transition-opacity duration-(--duration-base)"
            />
          ))}
        </g>

        {/* Crown wheel */}
        <g
          className={cn(
            "transition-colors duration-(--duration-base)",
            on("crown") && "text-accent-text",
          )}
          strokeWidth={on("crown") ? 2.25 : 1.25}
        >
          <ellipse cx={CROWN.cx} cy={CROWN.cy} rx={CROWN.rx} ry={CROWN.ry} />
          <ellipse
            cx={CROWN.cx}
            cy={CROWN.cy}
            rx={CROWN.rx - 9}
            ry={CROWN.ry - 3}
            opacity={0.5}
          />
        </g>

        {/* Wall head */}
        <ellipse
          cx={WALL_TOP.cx}
          cy={WALL_TOP.cy}
          rx={WALL_TOP.rx}
          ry={WALL_TOP.ry}
        />

        {/* Tension band */}
        <path
          d={`M ${WALL_TOP.cx - WALL_TOP.rx} ${WALL_TOP.cy + 12} A ${WALL_TOP.rx} ${WALL_TOP.ry} 0 0 0 ${WALL_TOP.cx + WALL_TOP.rx} ${WALL_TOP.cy + 12}`}
          className={cn(
            "transition-colors duration-(--duration-base)",
            on("tension") ? "text-accent-text" : "text-accent",
          )}
          strokeWidth={on("tension") ? 3 : 1.75}
        />

        {/* Wall sides and base */}
        <line
          x1={WALL_TOP.cx - WALL_TOP.rx}
          y1={WALL_TOP.cy}
          x2={WALL_BOTTOM.cx - WALL_BOTTOM.rx}
          y2={WALL_BOTTOM.cy}
        />
        <line
          x1={WALL_TOP.cx + WALL_TOP.rx}
          y1={WALL_TOP.cy}
          x2={WALL_BOTTOM.cx + WALL_BOTTOM.rx}
          y2={WALL_BOTTOM.cy}
        />
        <path
          d={`M ${WALL_BOTTOM.cx - WALL_BOTTOM.rx} ${WALL_BOTTOM.cy} A ${WALL_BOTTOM.rx} ${WALL_BOTTOM.ry} 0 0 0 ${WALL_BOTTOM.cx + WALL_BOTTOM.rx} ${WALL_BOTTOM.cy}`}
        />

        {/* Door */}
        <g
          className={cn(
            "transition-colors duration-(--duration-base)",
            on("door") && "text-accent-text",
          )}
          strokeWidth={on("door") ? 2.25 : 1.25}
        >
          <path d="M 388 484 L 388 388 L 472 388 L 472 484" />
          <line x1={430} y1={392} x2={430} y2={480} opacity={0.45} />
        </g>
      </g>

      {/* Annotations — desktop only */}
      <g className="hidden text-text-muted md:block">
        <g>
          <Leader d="M 484 150 L 620 100 L 690 100" active={on("crown")} />
          <Leader d="M 556 232 L 640 198 L 690 198" active={on("poles")} />
          <Leader d="M 670 342 L 690 342" active={on("tension")} />
          <Leader d="M 300 214 L 200 182 L 168 182" active={on("cover")} />
          <Leader d="M 250 400 L 196 412 L 168 412" active={on("lattice")} />
          <Leader d="M 430 486 L 430 516" active={on("door")} />
        </g>

        <g fill="currentColor" className="font-sans" fontSize={11} letterSpacing="1.6">
          <text
            x={700}
            y={104}
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("crown") && "text-accent-text",
            )}
          >
            CROWN WHEEL
          </text>
          <text
            x={700}
            y={202}
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("poles") && "text-accent-text",
            )}
          >
            ROOF POLES
          </text>
          <text
            x={700}
            y={346}
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("tension") && "text-accent-text",
            )}
          >
            TENSION BAND
          </text>
          <text
            x={160}
            y={186}
            textAnchor="end"
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("cover") && "text-accent-text",
            )}
          >
            COVER
          </text>
          <text
            x={160}
            y={416}
            textAnchor="end"
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("lattice") && "text-accent-text",
            )}
          >
            LATTICE WALL
          </text>
          <text
            x={430}
            y={532}
            textAnchor="middle"
            className={cn(
              "transition-colors duration-(--duration-base)",
              on("door") && "text-accent-text",
            )}
          >
            DOOR
          </text>
        </g>

        {/* The callouts */}
        {PART_IDS.map((id) => (
          <Callout key={id} part={id} active={on(id)} />
        ))}
      </g>
    </svg>
  );
}
