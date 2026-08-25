import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const materialsList = [
  {
    id: "home.material-timber" as const,
    title: "Timber",
    subtitle: "The structure.",
  },
  {
    id: "home.material-canvas" as const,
    title: "Canvas / Outer Envelope",
    subtitle: "Protection from the elements.",
  },
  {
    id: "home.material-crown" as const,
    title: "Crown",
    subtitle: "The defining centre of the space.",
  },
  {
    id: "home.gallery-3" as const,
    title: "Joinery",
    subtitle: "Where craft meets engineering.",
  },
  {
    id: "home.range-luxury" as const,
    title: "Interiors",
    subtitle: "Where the structure becomes yours.",
  },
];

/**
 * 11. MATERIALS & CRAFT
 *
 * Heading: Made of what it looks like.
 * Lead: The beauty of a yurt comes from its structure being honest. Timber, fabric, light, joinery and carefully chosen finishes come together to create a space that feels natural because it is.
 */
export function Materials() {
  return (
    <section className="u-container py-16 lg:py-20 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
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
          <p className="font-sans text-lead text-text-muted leading-relaxed">
            The beauty of a yurt comes from its structure being honest. Timber,
            fabric, light, joinery and carefully chosen finishes come together to
            create a space that feels natural because it is.
          </p>
        </Reveal>
      </div>

      {/* 5-Item Material Showcase Cards Grid */}
      <div className="mt-8 lg:mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        {materialsList.map((item, i) => (
          <Reveal
            key={item.title}
            kind="media"
            delay={i * 0.04}
            className="group flex flex-col justify-between"
          >
            <div className="relative overflow-hidden rounded-sm bg-surface-alt shadow-lg w-full">
              <Media
                id={item.id}
                ratio="square"
                sizes="(min-width: 1024px) 18vw, 45vw"
                className="h-[190px] sm:h-[230px] lg:h-[260px] xl:h-[290px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-display-xs sm:text-base text-text leading-tight group-hover:text-accent-text transition-colors duration-300">
                  {item.title}
                </h3>
                <span className="font-sans text-meta text-accent-text uppercase text-[0.6875rem]">
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

      <div className="mt-10 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
        <ArrowLink href="/process">Learn about our craftsmanship standards</ArrowLink>
        <span className="font-sans text-meta uppercase text-text-muted text-xs">
          05 Core Architectural Elements
        </span>
      </div>
    </section>
  );
}
