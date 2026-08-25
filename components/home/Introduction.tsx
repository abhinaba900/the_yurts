import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 02. INTRODUCTION
 *
 * Architecture that changes the way you experience a place.
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
              Architecture that changes the way you experience a place.
            </h2>
          </Reveal>

          <Reveal kind="up" delay={0.1}>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-12">
              <p className="font-sans text-body text-text-muted leading-relaxed">
                A yurt brings together the warmth of a room with the openness of
                the landscape. Its circular structure, natural materials and
                modular construction create a space that feels less like something
                placed on the land &mdash; and more like something that belongs
                there.
              </p>
              <p className="font-sans text-body text-text-muted leading-relaxed">
                Theyurts designs and builds these spaces for people who want to
                create something different.
              </p>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.15}>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/why-theyurts">
                Discover the idea behind yurts
              </ArrowLink>
              <ArrowLink href="/yurts">
                Explore the range
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
