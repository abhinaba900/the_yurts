import Link from "next/link";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const advisoryCards = [
  {
    index: "01",
    tag: "Terrain & Foundation",
    title: "Sloped & Difficult Land Feasibility",
    body: "Upload your site topography or slope gradient. Our engineers evaluate elevated timber platforms, helical ground screws, and minimal-impact footings without pouring concrete.",
    deliverable: "Custom footing specification & site access plan",
    param: "terrain",
  },
  {
    index: "02",
    tag: "Climate & Insulation",
    title: "Thermal & Weatherproofing Package",
    body: "Provide your site altitude, winter lows, and monsoon intensity. We calculate the exact multi-layer organic canvas density, wool insulation thickness, and crown ventilation specs.",
    deliverable: "Climate-rated thermal membrane & snow load profile",
    param: "climate",
  },
  {
    index: "03",
    tag: "Hospitality & Economics",
    title: "Resort Unit Yield & Masterplan",
    body: "Share your land acreage, target guest profile, and budget. We model the optimal mix of 5m, 6m, and 8m yurts, bathroom pods, guest privacy buffers, and projected Capex payback.",
    deliverable: "Masterplan layout sketch & unit economics breakdown",
    param: "hospitality",
  },
];

const quickTopics = [
  { label: "Sloped mountain plot in Himachal / Uttarakhand", topic: "Sloped Mountain Land" },
  { label: "4–8 Yurt Glamping Resort in Goa / Maharashtra", topic: "Glamping Resort Development" },
  { label: "Farm stay & Wellness Studio on Agricultural Land", topic: "Farm Stay & Wellness" },
  { label: "Extreme Weather, High Snow Load & Monsoon", topic: "Extreme Weather Package" },
  { label: "Non-Permanent Permitting & CRZ Guidelines", topic: "Land Permissions & CRZ" },
];

/**
 * Interactive Direct Site Advisory Module.
 *
 * Explains clearly why this section exists: to provide bespoke site-specific
 * engineering, terrain analysis, and unit economics before a generalised
 * journal article is written.
 */
export function JournalAdvisory() {
  return (
    <section className="bg-surface-alt/60 border-t border-line py-16 lg:py-24 text-text">
      <div className="u-container">
        {/* Section Header */}
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-6">
            <Reveal kind="up">
              <Metadata className="text-accent-text">
                Direct Site Advisory & Land Consultation
              </Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                Got land? Let us run the engineering.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
            <Reveal kind="up" delay={0.08}>
              <p className="u-measure font-sans text-lead text-text-muted">
                Every research piece in this journal began as a real landowner
                asking a specific question about their site.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted">
                If you are planning an installation, skip the generalised
                reading. Our workshop will calculate your terrain slope, thermal
                membrane rating, and resort layout directly.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 3 Guided Advisory Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {advisoryCards.map((card, i) => (
            <Reveal
              key={card.index}
              kind="up"
              delay={i * 0.08}
              className="group relative flex flex-col justify-between rounded-sm border border-line bg-surface p-7 lg:p-8 transition-all duration-300 hover:border-accent hover:shadow-xl"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                    {card.index} &middot; {card.tag}
                  </span>
                  <span className="text-xs font-mono text-text-muted opacity-60">
                    Workshop Review
                  </span>
                </div>

                {/* Card Content */}
                <h3 className="mt-5 font-display text-display-sm text-text transition-colors duration-300 group-hover:text-accent-text">
                  {card.title}
                </h3>
                <p className="mt-3.5 font-sans text-body text-text-muted text-[0.9375rem] leading-relaxed">
                  {card.body}
                </p>
              </div>

              {/* Deliverable badge & Action */}
              <div className="mt-8 border-t border-line/70 pt-5">
                <div className="mb-4">
                  <span className="block font-sans text-[0.6875rem] uppercase tracking-widest text-text-muted opacity-75">
                    Deliverable:
                  </span>
                  <span className="font-sans text-small text-text font-medium">
                    {card.deliverable}
                  </span>
                </div>
                <ArrowLink
                  href={`/enquire?type=${card.param}`}
                  className="font-sans text-meta uppercase"
                >
                  Consult on this
                </ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Quick Topic Chips Bar */}
        <div className="mt-16 rounded-sm border border-line bg-surface/80 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
            <span className="font-sans text-meta uppercase text-text font-semibold">
              Or pick your immediate site scenario:
            </span>
            <span className="font-sans text-meta uppercase text-text-muted text-xs">
              Instant Workshop Routing
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
            {quickTopics.map((item) => (
              <Link
                key={item.topic}
                href={`/enquire?topic=${encodeURIComponent(item.topic)}`}
                className="group inline-flex items-center gap-2 rounded-xs border border-line bg-surface-alt px-4 py-2.5 font-sans text-small text-text-muted transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent-text"
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className="text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-text"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>

          {/* Guarantee Note */}
          <div className="mt-6 flex items-center gap-3 border-t border-line/60 pt-4 font-sans text-meta uppercase text-text-muted text-xs">
            <span className="size-1.5 rounded-full bg-accent-text" />
            <span>
              All inquiries receive dimensional sketches and climate feasibility recommendations within 24 hours.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
