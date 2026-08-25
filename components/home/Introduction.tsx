import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Opening statement. Deliberately sparse — a single indented block of display
 * type with a lot of air around it. The first thing after a full-bleed image
 * should be quiet.
 */
export function Introduction() {
  return (
    <section className="u-container py-(--spacing-section-lg) lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-16">
      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-2">
          <Reveal kind="up">
            <Metadata>What we do</Metadata>
          </Reveal>
        </div>

        <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <Reveal kind="up">
            <p className="u-measure-wide font-display text-display-md">
              Theyurts designs and manufactures yurts in India, and installs them
              on the land they are meant for.
            </p>
          </Reveal>

          <Reveal kind="up" delay={0.1}>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12">
              <p className="font-sans text-body text-text-muted">
                A yurt is a circular timber frame under a tensioned cover. It is
                one of the oldest ways of making a room, and it happens to solve
                a set of very current problems: building on land that will not
                take foundations, opening a site before it is fully developed,
                and putting up something guests actually want to stay in.
              </p>
              <p className="font-sans text-body text-text-muted">
                We are building this company around structures that are properly
                designed and properly made — for resort operators, glamping
                sites, retreats, farm stays and landowners who want something
                more considered than a tent and less permanent than a building.
              </p>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.15}>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/about">About Theyurts</ArrowLink>
              <ArrowLink href="/yurts">See the range</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
