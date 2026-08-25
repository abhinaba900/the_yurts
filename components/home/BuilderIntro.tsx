import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const axes = [
  "Size",
  "Exterior",
  "Roof",
  "Doors",
  "Windows",
  "Flooring",
  "Interior",
];

/**
 * 08. 3D BUILDER
 *
 * Small label: DESIGN YOURS
 * Heading: Build your yurt before we build it.
 * Description: Choose your size, openings, finishes and interiors. See your choices come together in real time and create a yurt that's uniquely yours.
 * CTA: Start building →
 * Small line: Size · Exterior · Roof · Doors · Windows · Flooring · Interior
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
                Build your yurt before we build it.
              </h2>
              <p className="mt-6 u-measure font-sans text-lead text-text-muted leading-relaxed">
                Choose your size, openings, finishes and interiors. See your
                choices come together in real time and create a yurt that&apos;s
                uniquely yours.
              </p>
            </Reveal>

            <Reveal kind="up" delay={0.1}>
              <div className="mt-10 border-t border-line pt-6">
                <span className="font-sans text-meta uppercase text-accent-text text-xs">
                  Configurable Parameters:
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
                <ArrowLink href="/experiences/builder">Start building</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
