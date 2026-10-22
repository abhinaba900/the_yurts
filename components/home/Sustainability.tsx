import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 12. SUSTAINABILITY
 *
 * Heading: A more considered approach to building on your land.
 * Points: Modular construction, adaptable design, reduced ground disturbance.
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
                  quality={100}
                  unoptimized
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-sans text-meta uppercase text-text-muted text-xs">
                <span>Site-Conscious Design</span>
                <span>Modular Construction</span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Narrative & Key Principles */}
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <Reveal kind="up">
              <Metadata className="text-accent">Sustainability</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left leading-tight">
                A More Considered Approach to Building on Your Land.
              </h2>

              <p className="mt-5 u-measure font-sans text-lead text-text-muted leading-relaxed">
                Yurts are built using modular components that can be
                manufactured off-site and assembled on a prepared base.
              </p>
              <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                Depending on the site and foundation design, this approach can
                reduce the need for extensive excavation and prolonged on-site
                construction. It also offers flexibility for projects that may
                need to expand, change or relocate in the future.
              </p>

              {/* 3 Core Principles */}
              <div className="mt-8 grid grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <span className="font-display text-display-sm text-accent-text">01</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Modular Construction
                  </h3>
                  <p className="mt-1 font-sans text-small font-medium text-text">
                    Less Work at the Installation Site
                  </p>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    Major structural components are prepared in advance and
                    transported for assembly, reducing the amount of
                    construction activity required directly on your property.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-accent-text">02</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Adaptable Design
                  </h3>
                  <p className="mt-1 font-sans text-small font-medium text-text">
                    Built with Future Flexibility in Mind
                  </p>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    The modular structure allows components to be dismantled for
                    maintenance or, where practical, relocation and reuse.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-accent-text">03</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text font-semibold">
                    Reduced Ground Disturbance
                  </h3>
                  <p className="mt-1 font-sans text-small font-medium text-text">
                    An Alternative to Extensive Construction
                  </p>
                  <p className="mt-1 font-sans text-small text-text-muted leading-relaxed">
                    For suitable sites, a yurt can be installed on a planned
                    platform or footing system that may require less excavation
                    than conventional construction. Foundation requirements
                    depend on site conditions and engineering.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-line/70 pt-5">
                <ArrowLink href="/about">Learn About Our Construction Approach</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
