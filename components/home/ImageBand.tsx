import Link from "next/link";
import { Media } from "@/components/primitives/Media";
import { rangeFallback } from "@/data/range";

/**
 * The range band that sits between the hero and the introduction.
 *
 * A single run of models drifting right to left in clean, uniform square cards
 * of identical size.
 */
function Run({ duplicate }: { duplicate?: boolean }) {
  return (
    <ul
      {...(duplicate ? { "aria-hidden": true, inert: true } : {})}
      className="flex shrink-0 items-center gap-4 pr-4 lg:gap-6 lg:pr-6"
    >
      {rangeFallback.map((model) => (
        <li
          key={model.slug}
          className="w-(--tile-size) h-(--tile-size) shrink-0"
        >
          <Link
            href={`/yurts/${model.slug}`}
            tabIndex={duplicate ? -1 : undefined}
            className="group/tile relative block h-full w-full aspect-square overflow-hidden rounded-sm border border-line bg-surface-alt shadow-lg transition-colors duration-(--duration-base) hover:border-accent"
          >
            {model.media ? (
              <Media
                id={model.media}
                ratio="square"
                sizes="(min-width: 1024px) 300px, 240px"
                className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/tile:scale-[1.04]"
                quality={100}
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-surface-alt" />
            )}

            {/* Shade at the foot of each tile: makes the run read as one band,
                and gives the name something to sit on. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-walnut-deep/95 via-walnut-deep/30 to-transparent"
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
          "--tile-size": "clamp(220px, 20vw, 290px)",
          "--marquee-duration": "60s",
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
