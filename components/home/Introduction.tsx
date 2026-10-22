import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 02. INTRODUCTION
 *
 * What exactly is a yurt? The answer in plain terms: where the form comes
 * from, what the circle gives you inside, how a modern one is built, and only
 * at the end what Theyurts does with it.
 */
export function Introduction() {
  return (
    <section className="u-container py-(--spacing-section-lg) lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-20">
      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-2">
          <Reveal kind="up">
            <Metadata className="text-accent-text">The Yurt</Metadata>
          </Reveal>
        </div>

        <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <Reveal kind="up">
            <h2 className="u-measure-wide font-display text-display-lg leading-tight">
              What Exactly Is a Yurt?
            </h2>
          </Reveal>

          <Reveal kind="up" delay={0.08}>
            <p className="mt-8 u-measure-wide font-display text-display-sm text-accent-text">
              A circular structure that combines the comfort of a room with the
              flexibility of modular construction.
            </p>
          </Reveal>

          <Reveal kind="up" delay={0.1}>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-12">
              <p className="font-sans text-body text-text-muted leading-relaxed">
                A yurt is a round, single-room structure originally developed by
                nomadic communities in Mongolia. Unlike a conventional camping
                tent, a modern yurt has a strong timber framework, a structured
                roof, protective outer coverings and options for insulation,
                flooring, doors and windows.
              </p>

              <p className="font-sans text-body text-text-muted leading-relaxed">
                Its circular design creates a spacious interior without
                supporting pillars in the middle. Depending on the size and
                layout, it can be fitted out as a comfortable guest room, private
                retreat, yoga studio or hospitality space.
              </p>

              <p className="font-sans text-body text-text-muted leading-relaxed sm:col-span-2">
                Modern yurts are manufactured in sections and assembled on a
                prepared base at your location. This makes them an option worth
                considering when you want a distinctive, customisable space
                without undertaking conventional brick-and-concrete
                construction.
              </p>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.14}>
            <div className="mt-10 border-t border-line pt-8">
              <p className="u-measure font-sans text-lead text-text leading-relaxed">
                At Theyurts, we adapt this traditional structure for modern
                Indian properties, with designs tailored to your intended use,
                local climate and site conditions.
              </p>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.18}>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/why-theyurts">Why Choose a Yurt?</ArrowLink>
              <ArrowLink href="/yurts">View Yurt Models</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
