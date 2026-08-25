import Link from "next/link";
import { Media } from "@/components/primitives/Media";
import { rangeFallback } from "@/data/range";

/**
 * The range band that sits between the hero and the introduction.
 *
 * A single run of models drifting right to left, edge to edge, at a pace slow
 * enough to read as a moving photograph rather than a carousel. It is the hinge
 * between the hero's one big statement and the introduction's argument — and
 * every tile is a way into that model's own page, not decoration.
 *
 * Decisions worth keeping:
 *
 * - **Uneven widths, one height.** Every tile shares the band height while the
 *   widths alternate, giving the run an editorial rhythm instead of the even
 *   tick of identical slides.
 * - **It stops when you reach for it.** Hover pauses the drift, and so does
 *   keyboard focus — without that, tabbing into a moving strip would chase the
 *   focused link off the screen. That pause is what makes the links usable
 *   rather than a trap, so `:focus-within` in `base.css` is load-bearing.
 * - **The second run is inert.** It is the same ten models again purely so the
 *   loop has somewhere to go; leaving it reachable would mean twenty tab stops
 *   and every model announced twice.
 *
 * The motion itself lives in `base.css` as `.u-marquee` — one compositor
 * transform, no JavaScript, so it stays smooth on a page already running Lenis
 * and a WebGL canvas.
 */

/** Widths in px at the band's fixed height, sequenced for rhythm not meaning. */
const WIDTHS = [380, 250, 330, 250, 400, 240, 320, 250, 360, 300];

function Run({ duplicate }: { duplicate?: boolean }) {
  return (
    <ul
      {...(duplicate ? { "aria-hidden": true, inert: true } : {})}
      className="flex shrink-0 items-center gap-4 pr-4 lg:gap-6 lg:pr-6"
    >
      {rangeFallback.map((model, i) => (
        <li
          key={model.slug}
          style={{ width: `${WIDTHS[i % WIDTHS.length]}px` }}
          className="shrink-0"
        >
          <Link
            href={`/yurts/${model.slug}`}
            tabIndex={duplicate ? -1 : undefined}
            className="group/tile relative block overflow-hidden rounded-sm border border-line bg-surface-alt shadow-lg transition-colors duration-(--duration-base) hover:border-accent"
          >
            {model.media ? (
              <Media
                id={model.media}
                sizes={`${WIDTHS[i % WIDTHS.length]}px`}
                className="h-(--band-h) w-full transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/tile:scale-[1.04]"
              />
            ) : (
              <div className="h-(--band-h) w-full bg-surface-alt" />
            )}

            {/* Shade at the foot of each tile: makes the run read as one band,
                and gives the name something to sit on. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-walnut-deep/90 via-walnut-deep/20 to-transparent"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <div>
                <span className="block font-display text-display-xs text-cream">
                  {model.name}
                </span>
                <span className="mt-0.5 block font-sans text-meta uppercase text-cream/70">
                  {model.tagline}
                </span>
              </div>
              <span
                aria-hidden
                className="translate-y-1 font-sans text-cream opacity-0 transition-all duration-(--duration-base) ease-(--ease-out-soft) group-hover/tile:translate-y-0 group-hover/tile:opacity-100"
              >
                &rarr;
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ImageBand() {
  return (
    <section
      aria-label="The range"
      className="relative overflow-hidden border-y border-line bg-surface py-10 lg:py-14"
      style={
        {
          "--band-h": "clamp(170px, 21vw, 290px)",
          "--marquee-duration": "68s",
        } as React.CSSProperties
      }
    >
      <div className="u-marquee w-full">
        <div className="u-marquee-track flex w-max">
          <Run />
          <Run duplicate />
        </div>
      </div>
    </section>
  );
}
