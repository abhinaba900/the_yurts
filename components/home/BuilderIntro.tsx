import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const axes = [
  "Yurt Diameter & Size",
  "Exterior Colours & Coverings",
  "Roof & Dome Options",
  "Door Type & Placement",
  "Window Style & Placement",
  "Flooring & Finishes",
  "Interior Design & Layout",
];

/**
 * 08. 3D BUILDER
 *
 * Small label: DESIGN YOURS
 * Heading: Customise your yurt in 3D before ordering.
 * CTA: Customise your yurt in 3D →
 */
export function BuilderIntro() {
  return (
    <section className="py-(--spacing-section-lg) lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-20">
      <div className="u-container">
        <div className="u-grid items-center gap-y-12">
          <Reveal
            kind="media"
            className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-1"
          >
            <div className="overflow-hidden rounded-sm bg-surface-alt border border-line shadow-2xl">
              <Media id="home.builder" sizes="(min-width: 1024px) 46vw, 92vw" />
            </div>
          </Reveal>

          <div className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-8">
            <Reveal kind="up">
              <Metadata className="text-accent-text">Design Yours</Metadata>
              <h2 className="mt-4 font-display text-display-lg u-optical-left">
                Customise Your Yurt in 3D Before Ordering.
              </h2>
              <p className="mt-6 u-measure font-sans text-lead text-text-muted leading-relaxed">
                Not sure which design will work best for your property? Use our
                interactive 3D Yurt Builder to explore different sizes, exterior
                finishes, roof options, doors, windows, flooring and interior
                arrangements.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                See how your selections look together and share your preferred
                configuration with our team to discuss feasibility and pricing.
              </p>
            </Reveal>

            <Reveal kind="up" delay={0.1}>
              <div className="mt-10 border-t border-line pt-6">
                <span className="font-sans text-meta uppercase text-accent-text text-xs">
                  What You Can Customise
                </span>
                <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-text-muted font-sans text-meta uppercase text-xs">
                  {axes.map((axis, i) => (
                    <li key={axis} className="flex items-center gap-3">
                      <span>{axis}</span>
                      {i < axes.length - 1 ? (
                        <span className="text-accent-text opacity-40">&middot;</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-9">
                <ArrowLink href="/experiences/builder">Customise Your Yurt in 3D</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
