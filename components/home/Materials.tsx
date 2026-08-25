import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";

const materialsList = [
  {
    id: "home.material-timber" as const,
    title: "Timber Lattice",
    subtitle: "Steam-bent ash wood with copper rivets",
  },
  {
    id: "home.material-canvas" as const,
    title: "Organic Canvas",
    subtitle: "Heavyweight breathable weatherproof weave",
  },
  {
    id: "home.material-crown" as const,
    title: "Crown Wheel",
    subtitle: "Solid timber ring radiating roof poles",
  },
  {
    id: "home.gallery-3" as const,
    title: "Joinery & Hardware",
    subtitle: "Handcrafted door and forged tension bands",
  },
];

/**
 * Materials and craftsmanship section.
 *
 * Balanced editorial showcase:
 * Header: Display headline with concise material philosophy narrative.
 * Grid: 4 tight, responsive material cards with dynamic viewport height fitting.
 */
export function Materials() {
  return (
    <section className="u-container py-14 lg:py-8 xl:py-10 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6 lg:pb-8">
        <div>
          <Reveal kind="up">
            <Metadata className="text-accent-text">Materials & Craft</Metadata>
            <h2 className="mt-2 font-display text-display-lg u-optical-left">
              Made of what it looks like.
            </h2>
          </Reveal>
        </div>
        <Reveal kind="up" delay={0.08} className="max-w-xl">
          <p className="font-sans text-body text-text-muted text-small sm:text-body">
            Timber, canvas, rope and steel, cut and joined so the structure can
            be read from inside it. Nothing is clad to look like something else.
          </p>
        </Reveal>
      </div>

      {/* 4-Item Material Cards Grid */}
      <div className="mt-8 lg:mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {materialsList.map((item, i) => (
          <Reveal
            key={item.title}
            kind="media"
            delay={i * 0.05}
            className="group flex flex-col justify-between"
          >
            <div className="relative overflow-hidden rounded-sm bg-surface-alt shadow-lg w-full">
              <Media
                id={item.id}
                ratio="square"
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-[min(30vh,280px)] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-display-sm text-text leading-tight group-hover:text-accent-text transition-colors duration-300">
                  {item.title}
                </h3>
                <span className="font-sans text-meta text-accent-text uppercase">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-1 font-sans text-small text-text-muted text-[0.8125rem] leading-snug">
                {item.subtitle}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
