import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 02. INTRODUCTION
 *
 * Architecture that learned to move with the land.
 *
 * The origin story, told as an argument rather than a history lesson: the
 * question first, then the two problems the form solves — wind, then mobility —
 * and only at the end what Theyurts does with it. The closing statement is set
 * apart above the rule so the section lands on the present tense.
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
              Architecture that learned to move with the land.
            </h2>
          </Reveal>

          <Reveal kind="up" delay={0.08}>
            <p className="mt-8 u-measure-wide font-display text-display-sm text-accent-text">
              Why did the Mongolians unthink the square?
            </p>
          </Reveal>

          <Reveal kind="up" delay={0.1}>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-12">
              <div className="flex flex-col gap-5">
                <p className="font-sans text-body text-text-muted leading-relaxed">
                  For centuries, the yurt has been shaped by a simple idea: work
                  with nature, not against it.
                </p>
                <p className="font-sans text-body text-text-muted leading-relaxed">
                  Across the vast Mongolian steppe, where open grasslands leave
                  little to break the wind, a circular structure made sense. With
                  no sharp corners or flat faces to catch the force, wind can
                  move smoothly around a yurt rather than pushing against it.
                  What emerged was a home that was remarkably resilient,
                  comfortable and efficient.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <p className="font-sans text-body text-text leading-relaxed">
                  But the yurt had another challenge to solve: mobility.
                </p>
                <p className="font-sans text-body text-text-muted leading-relaxed">
                  For nomadic communities, a home could not be something
                  permanently fixed to the ground. It had to be built from
                  materials at hand, assembled quickly, taken apart just as
                  easily, and carried to the next place. Timber formed the
                  structure; natural coverings enclosed it. Simple, practical,
                  ingenious.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.14}>
            <div className="mt-10 border-t border-line pt-8">
              
              <p className="mt-5 u-measure font-sans text-lead text-text leading-relaxed">
                At Theyurts, we take that enduring idea and reimagine it for
                modern living &mdash; creating spaces that bring the warmth of a
                room together with the openness of the landscape.
              </p>
            </div>
          </Reveal>

          <Reveal kind="up" delay={0.18}>
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
