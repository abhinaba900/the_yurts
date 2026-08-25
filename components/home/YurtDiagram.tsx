import { cn } from "@/lib/cn";

/**
 * Cutaway elevation of a yurt, drawn rather than illustrated.
 *
 * The geometry is parametric — two ellipses (the crown and the top of the wall)
 * with the roof poles interpolated between them — so the drawing is consistent
 * rather than eyeballed, and the proportions can be adjusted in one place.
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

function Leader({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function YurtDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 860 560"
      className={cn("w-full", className)}
      role="img"
      aria-label="Cutaway elevation of a yurt, showing the crown wheel at the centre of the roof, roof poles running out to the top of the wall, the tension band around the wall head, the lattice wall below it, and the door."
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
      <g clipPath="url(#yurt-wall-face)" className="text-emerald-light">
        {lattice().map((l, i) => (
          <line
            key={i}
            {...l}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.55}
            vectorEffect="non-scaling-stroke"
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
        {/* Roof silhouette */}
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

        {/* Roof poles */}
        {poles.map((p, i) => (
          <line
            key={i}
            x1={p.from.x}
            y1={p.from.y}
            x2={p.to.x}
            y2={p.to.y}
            opacity={0.7}
          />
        ))}

        {/* Crown wheel */}
        <ellipse cx={CROWN.cx} cy={CROWN.cy} rx={CROWN.rx} ry={CROWN.ry} />
        <ellipse
          cx={CROWN.cx}
          cy={CROWN.cy}
          rx={CROWN.rx - 9}
          ry={CROWN.ry - 3}
          opacity={0.5}
        />

        {/* Wall head and tension band */}
        <ellipse
          cx={WALL_TOP.cx}
          cy={WALL_TOP.cy}
          rx={WALL_TOP.rx}
          ry={WALL_TOP.ry}
        />
        <path
          d={`M ${WALL_TOP.cx - WALL_TOP.rx} ${WALL_TOP.cy + 12} A ${WALL_TOP.rx} ${WALL_TOP.ry} 0 0 0 ${WALL_TOP.cx + WALL_TOP.rx} ${WALL_TOP.cy + 12}`}
          className="text-accent"
          strokeWidth={1.75}
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
        <path d="M 388 484 L 388 388 L 472 388 L 472 484" />
        <line x1={430} y1={392} x2={430} y2={480} opacity={0.45} />
      </g>

      {/* Annotations — desktop only */}
      <g className="hidden text-text-muted md:block">
        <g>
          <Leader d="M 484 150 L 620 100 L 690 100" />
          <Leader d="M 556 232 L 640 198 L 690 198" />
          <Leader d="M 670 342 L 690 342" />
          <Leader d="M 300 214 L 200 182 L 168 182" />
          <Leader d="M 250 400 L 196 412 L 168 412" />
          <Leader d="M 430 486 L 430 516" />
        </g>
        <g
          fill="currentColor"
          className="font-sans"
          fontSize={11}
          letterSpacing="1.6"
        >
          <text x={700} y={104}>
            CROWN WHEEL
          </text>
          <text x={700} y={202}>
            ROOF POLES
          </text>
          <text x={700} y={346}>
            TENSION BAND
          </text>
          <text x={160} y={186} textAnchor="end">
            COVER
          </text>
          <text x={160} y={416} textAnchor="end">
            LATTICE WALL
          </text>
          <text x={430} y={532} textAnchor="middle">
            DOOR
          </text>
        </g>
      </g>
    </svg>
  );
}
