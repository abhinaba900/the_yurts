import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const climatePillars = [
  {
    name: "Climate",
    desc: "Specified around the temperature range your location actually sees.",
  },
  {
    name: "Insulation",
    desc: "Layered to suit the season, altitude and comfort you need indoors.",
  },
  {
    name: "Ventilation",
    desc: "Airflow planned through the crown and the wall openings.",
  },
  {
    name: "Rain",
    desc: "Roof geometry and outer layers configured for monsoon exposure.",
  },
  {
    name: "Heat",
    desc: "Outer finishes and shading chosen to manage daytime solar gain.",
  },
  {
    name: "Wind",
    desc: "Frame and anchoring specified for the exposure of your site.",
  },
  {
    name: "Site conditions",
    desc: "Foundations adapted to sloped, uneven or low-intervention ground.",
  },
];

/**
 * 05. BUILT FOR INDIA
 *
 * Heading: Made for the Indian landscape.
 * Description: From monsoon-heavy coasts to dry interiors and cooler mountain regions, every site has its own requirements.
 */
export function BuiltForIndia() {
  return (
    <Section tone="light" space="lg">
      <div className="u-container">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <Reveal kind="up">
              <Metadata className="text-accent-text">Built For India</Metadata>
              <h2 className="mt-4 font-display text-display-lg u-optical-left">
                Made for the Indian landscape.
              </h2>
            </Reveal>
          </div>

          <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-4">
            <Reveal kind="up" delay={0.08}>
              <p className="u-measure font-sans text-lead text-text-muted leading-relaxed">
                From monsoon-heavy coasts to dry interiors and cooler mountain
                regions, every site has its own requirements.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                Theyurts are designed and made in India, and every structure is
                configured around the conditions of the place it will stand in.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Configuration Pills & Specs Grid */}
        <div className="mt-12 lg:mt-16">
          <Reveal kind="up">
            <span className="font-sans text-meta uppercase tracking-wider text-text-muted">
              Configured Around Your Site:
            </span>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {climatePillars.map((p, i) => (
              <Reveal
                key={p.name}
                kind="up"
                delay={i * 0.03}
                className="rounded-sm border border-line bg-surface p-5 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-display-xs text-text font-medium block">
                    {p.name}
                  </span>
                  <p className="mt-2 font-sans text-small text-text-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <span className="mt-4 block font-sans text-[0.625rem] uppercase text-accent-text font-semibold">
                  0{i + 1}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Action CTA */}
        <div className="mt-12 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
          <ArrowLink href="/enquire?topic=Site+Assessment">
            Talk to us about your site
          </ArrowLink>
          <span className="font-sans text-meta uppercase text-text-muted text-xs">
            Site-Specific Engineering
          </span>
        </div>
      </div>
    </Section>
  );
}
