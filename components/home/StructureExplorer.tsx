"use client";

import { useEffect, useRef, useState } from "react";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { anatomy } from "@/data/home";
import { cn } from "@/lib/cn";

/**
 * The client's elevation drawings, one structural part highlighted in each.
 * The drawings carry their own labels; the name and line beside them repeat
 * it in the site's type so the slide reads without squinting at the image.
 */
const slides = [
  {
    id: "door",
    name: "Door",
    body: "Provides physical access, security and privacy.",
  },
  {
    id: "dome",
    name: "Dome",
    body: "An openable dome that works as a manual thermostat.",
  },
  {
    id: "centre-ring",
    name: "Centre ring",
    body: "Acts as a keystone, holding the rafters up.",
  },
  { id: "rafter", name: "Rafter", body: "Holds the structure in place." },
  {
    id: "tension-cable",
    name: "Tension cable",
    body: "Holds the structure in while the roof pushes it out.",
  },
  {
    id: "lattice-rods",
    name: "Lattice rods",
    body: "Put the yurt wall into a perfect circle.",
  },
  {
    id: "windows",
    name: "Windows",
    body: "Translucent openings that let in natural light and fresh air.",
  },
] as const;

/**
 * Indexed to `anatomy` (crown, roof, lattice, tension, envelope): the slide
 * each card opens. The envelope has no drawing of its own, so it stays text.
 */
const cardSlide: (number | null)[] = [2, 3, 5, 4, null];

const CYCLE_MS = 3500;

/**
 * The drawings and the five-part list below them, sharing one current slide.
 *
 * The cycle pauses while the visitor is reading it (hover or keyboard focus)
 * and while it is off screen. Like the drawn diagram it replaces, it does NOT
 * stop for `prefers-reduced-motion` — the client wants the cycle here — so the
 * change is a plain opacity cross-fade with nothing moving.
 */
export function StructureExplorer({
  header,
  icons,
}: {
  header: React.ReactNode;
  icons: React.ReactNode[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  // Bumped on every manual pick so the interval restarts and the chosen slide
  // gets its full turn.
  const [tick, setTick] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

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
      () => setIndex((i) => (i + 1) % slides.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [running, tick]);

  const go = (i: number) => {
    setIndex(i);
    setTick((t) => t + 1);
  };

  const current = slides[index];

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null))
        setPaused(false);
    },
  };

  return (
    <div className="u-container">
      <div className="u-grid">
        <header className="col-span-4 md:col-span-6 lg:col-span-4">
          {header}
        </header>

        <div className="col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <Reveal kind="media">
            <div
              ref={ref}
              role="region"
              aria-roledescription="carousel"
              aria-label="Parts of a yurt"
              {...pauseHandlers}
            >
              {/* White drawings multiplied onto the cream so they sit in the
                  section rather than on a card. The box carries the section's
                  own surface because Reveal isolates the blend from it. */}
              <div className="relative isolate aspect-[700/484] w-full bg-surface">
                {slides.map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={s.id}
                    src={`/media/structure/structure-${s.id}.png`}
                    alt={
                      i === index
                        ? `Front elevation of a yurt with the ${s.name.toLowerCase()} highlighted.`
                        : ""
                    }
                    aria-hidden={i !== index}
                    width={700}
                    height={484}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-contain mix-blend-multiply",
                      "transition-opacity duration-700 ease-(--ease-out-soft)",
                      i === index ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-start sm:justify-between">
                <div
                  aria-live={running ? "off" : "polite"}
                  className="min-h-[4.5rem]"
                >
                  <Metadata className="text-accent-text">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(slides.length).padStart(2, "0")}
                  </Metadata>
                  <p className="mt-2 font-display text-display-sm">
                    {current.name}
                  </p>
                  <p className="mt-1.5 font-sans text-small text-text-muted leading-relaxed">
                    {current.body}
                  </p>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 sm:pt-1"
                  role="group"
                  aria-label="Choose a part"
                >
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={s.name}
                      aria-current={i === index ? "true" : undefined}
                      className="group flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-all duration-(--duration-base)",
                          i === index
                            ? "w-4 bg-accent-text"
                            : "w-1.5 bg-line-strong group-hover:bg-text-muted",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Five Components Grid */}
      <div className="mt-16 lg:mt-24">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {anatomy.map((part, i) => {
            const target = cardSlide[i];
            const active = target === index;
            const title = (
              <>
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border text-accent-text transition-colors duration-(--duration-base)",
                    active
                      ? "border-accent-text bg-surface-alt"
                      : "border-line/60 bg-surface-alt/40",
                  )}
                >
                  {icons[i]}
                </span>
                <span className="mt-3.5 block font-display text-display-sm">
                  {part.label}
                </span>
              </>
            );
            return (
              <Reveal
                key={part.label}
                kind="up"
                delay={i * 0.04}
                className={cn(
                  "border-t pt-5 transition-colors duration-(--duration-base)",
                  active ? "border-accent-text" : "border-line",
                )}
              >
                <dt>
                  {target === null ? (
                    title
                  ) : (
                    <button
                      type="button"
                      onClick={() => go(target)}
                      aria-label={`Show the ${slides[target].name.toLowerCase()} in the drawing`}
                      className="block text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {title}
                    </button>
                  )}
                </dt>
                <dd className="mt-3 font-sans text-small text-text-muted leading-relaxed">
                  {part.body}
                </dd>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
