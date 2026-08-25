import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 12. SUSTAINABILITY
 *
 * Heading: A lighter footprint on the land.
 * Lead: Yurts offer a different approach to construction — modular, adaptable and designed to work with the landscape rather than dominate it.
 * Points: Modular, Adaptable, Low-Impact.
 */
export function Sustainability() {
  return (
    <Section
      tone="light"
      surface="alt"
      space="none"
      className="py-16 lg:py-20 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden"
    >
      <div className="u-container">
        <div className="u-grid items-center gap-y-10 lg:gap-x-12">
          {/* Left Column: Image */}
          <div className="col-span-4 md:col-span-6 lg:col-span-5 flex flex-col items-center">
            <Reveal kind="media" className="w-full max-w-[420px] lg:max-w-none">
              <div className="group overflow-hidden rounded-sm bg-surface shadow-xl w-full">
                <Media
                  id="home.application-eco"
                  ratio="editorial"
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="h-[min(48vh,460px)] w-full max-h-[50vh] object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-sans text-meta uppercase text-text-muted text-xs">
                <span>Low Impact Architecture</span>
                <span>Zero Ground Scar</span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Narrative & Key Principles */}
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <Reveal kind="up">
              <Metadata className="text-accent">Sustainability</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left leading-tight">
                A lighter footprint on the land.
              </h2>

              <p className="mt-5 u-measure font-sans text-lead text-text-muted leading-relaxed">
                Yurts offer a different approach to construction &mdash; modular,
                adaptable and designed to work with the landscape rather than
                dominate it.
              </p>

              {/* 3 Core Principles */}
              <div className="mt-8 grid grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <span className="font-display text-display-sm text-accent-text">01</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Modular
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    Built in components and assembled on site.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-accent-text">02</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Adaptable
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    Designed around different sites and uses.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-accent-text">03</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Low-Impact
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    A construction approach intended to minimise unnecessary intervention.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-line/70 pt-5">
                <ArrowLink href="/about">Read our environmental commitments</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
