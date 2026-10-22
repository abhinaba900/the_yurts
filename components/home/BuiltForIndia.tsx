import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { IndiaFlag } from "@/components/primitives/IndiaFlag";

/**
 * One line-drawn mark per configuration pillar, in the same idiom as the icons
 * in WhyYurts: 24px box, 1.5 stroke, currentColor so each inherits the card's
 * accent. Ventilation and Wind are deliberately drawn differently — a stack
 * rising through the crown versus air moving across the site — so the two do
 * not read as the same idea twice.
 */
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {children}
    </svg>
  );
}

const climatePillars = [
  {
    name: "Climate",
    desc: "We review the seasonal temperatures and weather conditions at your location to determine the appropriate yurt specifications.",
    icon: (
      <IconFrame>
        <path d="M14 14.8V5.5a2.5 2.5 0 0 0-5 0v9.3a4.5 4.5 0 1 0 5 0Z" />
        <path d="M11.5 8.5h-2M11.5 11.5h-2" />
      </IconFrame>
    ),
  },
  {
    name: "Insulation",
    desc: "Roof and wall insulation options are selected according to your climate and indoor comfort requirements, including whether the space will be used throughout the year.",
    icon: (
      <IconFrame>
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
        <path d="m3 12 9 4.5L21 12" />
        <path d="m3 16.5 9 4.5 9-4.5" />
      </IconFrame>
    ),
  },
  {
    name: "Ventilation",
    desc: "Openable windows and roof ventilation can be positioned to improve airflow and help release warm air from inside the yurt.",
    icon: (
      <IconFrame>
        <circle cx="12" cy="4.5" r="2.5" />
        <path d="M8 21v-8.5m0 0L6 15m2-2.5 2 2.5" />
        <path d="M16 21v-8.5m0 0L14 15m2-2.5 2 2.5" />
        <path d="M12 21v-11" />
      </IconFrame>
    ),
  },
  {
    name: "Rain Protection",
    desc: "Roof coverings, drainage details and platform height are planned around your site's rainfall and monsoon exposure.",
    icon: (
      <IconFrame>
        <path d="M7 16.5a3.75 3.75 0 0 1 .4-7.48 5.25 5.25 0 0 1 10.1.98A3.25 3.25 0 0 1 17.2 16.5H7Z" />
        <path d="m8.5 19-.8 1.8M12 19l-.8 1.8M15.5 19l-.8 1.8" />
      </IconFrame>
    ),
  },
  {
    name: "Heat Management",
    desc: "Roof materials, insulation, shading and ventilation are considered to help manage heat. Electrical provisions for fans or air conditioning can also be planned where required.",
    icon: (
      <IconFrame>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
      </IconFrame>
    ),
  },
  {
    name: "Wind Resistance",
    desc: "The frame, connections and anchoring system must be specified according to the wind exposure and structural requirements of your site.",
    icon: (
      <IconFrame>
        <path d="M3 8.5h10a2.75 2.75 0 1 0-2.75-2.75" />
        <path d="M3 12.5h13a2.75 2.75 0 1 1-2.75 2.75" />
        <path d="M3 16.5h6" />
      </IconFrame>
    ),
  },
  {
    name: "Site Conditions",
    desc: "We review slope, soil conditions, site access and platform requirements to help determine whether a yurt can be installed on your property.",
    icon: (
      <IconFrame>
        <path d="m2.5 14.5 5.5-7.5 3.5 4.5L15 6.5l6.5 8" />
        <path d="M2.5 17.5h19" />
      </IconFrame>
    ),
  },
];

/**
 * 05. BUILT FOR INDIA
 *
 * Heading: Yurts designed for Indian weather & site conditions.
 */
export function BuiltForIndia() {
  return (
    <Section tone="light" space="lg">
      <div className="u-container">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <Reveal kind="up">
              <Metadata className="inline-flex items-center gap-2 text-accent-text">
                <span>Built For India</span>
                <IndiaFlag className="h-3 w-4.5 rounded-[1px]" />
              </Metadata>
              <h2 className="mt-4 font-display text-display-lg u-optical-left">
                Yurts Designed for Indian Weather &amp; Site Conditions.
              </h2>
            </Reveal>
          </div>

          <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-4">
            <Reveal kind="up" delay={0.08}>
              <p className="u-measure font-sans text-lead text-text-muted leading-relaxed">
                India has very different climatic conditions. A yurt installed
                in a humid coastal resort needs different planning from one
                built on a dry farm or in a cool mountain region.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                We consider your location, temperature, rainfall, wind
                exposure, terrain and intended use before recommending the right
                materials, insulation, ventilation and installation approach.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Configuration Pills & Specs Grid */}
        <div className="mt-12 lg:mt-16">
          <Reveal kind="up">
            <span className="font-sans text-meta uppercase tracking-wider text-text-muted">
              What We Consider for Your Location
            </span>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {climatePillars.map((p, i) => (
              <Reveal
                key={p.name}
                kind="up"
                delay={i * 0.03}
                className="group rounded-sm border border-line bg-surface p-5 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md flex flex-col"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-line/60 bg-surface-alt/40 text-accent-text transition-colors duration-300 group-hover:border-accent/40">
                  {p.icon}
                </span>
                <span className="mt-4 font-display text-display-xs text-text font-medium block">
                  {p.name}
                </span>
                <p className="mt-2 font-sans text-small text-text-muted leading-relaxed">
                  {p.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Action CTA */}
        <div className="mt-12 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
          <ArrowLink href="/enquire?topic=Site+Assessment">
            Check if a Yurt Suits My Property
          </ArrowLink>
          <span className="font-sans text-meta uppercase text-text-muted text-xs">
            Site-Specific Design &amp; Installation Planning
          </span>
        </div>
      </div>
    </Section>
  );
}
