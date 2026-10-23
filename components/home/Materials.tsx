import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const materialsList = [
  {
    id: "home.material-timber" as const,
    title: "Timber",
    subtitle: "The Main Structural Framework",
    body: "The wall frame and roof, in a species and finish chosen for the project.",
  },
  {
    id: "home.material-canvas" as const,
    title: "Canvas / Outer Envelope",
    subtitle: "Protection from Rain, Sun & Weather",
    body: "Weather-resistant fabric and insulation, specified for the site.",
  },
  {
    id: "home.material-crown" as const,
    title: "Crown",
    subtitle: "The Central Roof Structure",
    body: "Joins the rafters at the centre, with an openable dome if you want one.",
  },
  {
    id: "home.gallery-3" as const,
    title: "Joinery",
    subtitle: "Doors, Windows & Fittings",
    body: "Doors, windows and fittings for light, air and everyday use.",
  },
  {
    id: "home.range-luxury" as const,
    title: "Interiors",
    subtitle: "Designed Around Your Requirements",
    body: "Fitted out as a bedroom, lounge, studio or café — planned with you.",
  },
];

/**
 * 11. MATERIALS & CRAFT
 *
 * Heading: What goes into building a quality yurt?
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
              What Goes Into Building a Quality Yurt?
            </h2>
          </Reveal>
        </div>
        <Reveal kind="up" delay={0.08} className="max-w-xl">
          <p className="font-sans text-lead text-text-muted leading-relaxed">
            The durability and comfort of a yurt depend on more than its
            appearance.
          </p>
          <p className="mt-3 font-sans text-small text-text-muted leading-relaxed">
            Its timber frame, roof structure, external covering, insulation,
            doors and windows all play an important role in how it performs. We
            select materials according to the yurt design, your location and
            intended use. The final specifications are confirmed as part of your
            project quotation.
          </p>
        </Reveal>
      </div>

      {/* The five materials: three to a row, all five in one from 1280px */}
      <div className="mt-8 lg:mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-5">
        {materialsList.map((item, i) => (
          <Reveal
            key={item.title}
            kind="media"
            delay={i * 0.04}
            className="group flex flex-col"
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
              <p className="mt-1 font-sans text-body font-medium text-text leading-snug">
                {item.subtitle}
              </p>
              <p className="mt-1.5 font-sans text-body text-text-muted leading-relaxed">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
        <ArrowLink href="/process">Explore Our Materials &amp; Construction</ArrowLink>
        <span className="font-sans text-meta uppercase text-text-muted text-xs">
          05 Main Construction Elements
        </span>
      </div>
    </section>
  );
}
