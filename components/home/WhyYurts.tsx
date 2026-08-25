import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { whyYurts } from "@/data/home";

const featureIcons = [
  // 01 Workshop prefabricated
  (
    <svg aria-hidden="true" className="size-5 text-accent-text opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M11.42 15.17l2.496-3.034a2.6 2.6 0 00-.73-3.66l-.78-.585a2.6 2.6 0 00-3.66.73L5.71 11.66M11.42 15.17l-5.71-3.51M5.71 11.66A2.6 2.6 0 002.05 15.32l.585.78a2.6 2.6 0 003.66.73l3.034-2.496" />
    </svg>
  ),
  // 02 Difficult topography
  (
    <svg aria-hidden="true" className="size-5 text-accent-text opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  ),
  // 03 Demountable / Reversible
  (
    <svg aria-hidden="true" className="size-5 text-accent-text opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  // 04 Circular sanctuary
  (
    <svg aria-hidden="true" className="size-5 text-accent-text opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
    </svg>
  ),
];

/**
 * Why a yurt section.
 *
 * Redesigned into a prominent, modern 4-pillar architectural card grid:
 * - Eliminates disjointed horizontal gaps.
 * - Distinct tactile card surfaces with smooth hover elevations.
 * - Fits cleanly within desktop viewport height.
 */
export function WhyYurts() {
  return (
    <section className="u-container py-14 lg:py-8 xl:py-10 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6 lg:pb-8">
        <div>
          <Reveal kind="up">
            <Metadata className="text-accent-text">The Case For It</Metadata>
            <h2 className="mt-2 font-display text-display-lg u-optical-left">
              Why build this way.
            </h2>
          </Reveal>
        </div>
        <Reveal kind="up" delay={0.08} className="max-w-md">
          <p className="font-sans text-small text-text-muted">
            Four fundamental structural advantages over conventional permanent construction.
          </p>
        </Reveal>
      </div>

      {/* 2x2 Prominent Interactive Pillars Grid */}
      <div className="mt-6 lg:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
        {whyYurts.map((item, i) => (
          <Reveal
            key={item.title}
            kind="up"
            delay={i * 0.04}
            className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-line/70 bg-surface-alt/40 p-6 lg:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-surface-alt/70 hover:shadow-xl"
          >
            {/* Top Accent Numerals & Category Icon */}
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display text-display-md text-accent-text group-hover:scale-105 transition-transform duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex size-9 items-center justify-center rounded-full bg-surface/80 border border-line/60 shadow-inner group-hover:border-accent/30 transition-colors duration-300">
                  {featureIcons[i]}
                </div>
              </div>

              {/* Title & Narrative */}
              <h3 className="mt-4 font-display text-display-md text-text leading-tight group-hover:text-accent-text transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-2.5 font-sans text-body text-text-muted text-small sm:text-body leading-relaxed">
                {item.body}
              </p>
            </div>

            {/* Subtle bottom active glow line */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Reveal>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 lg:mt-8 border-t border-line pt-4 flex items-center justify-between">
        <ArrowLink href="/why-theyurts">
          Where a yurt is the wrong answer
        </ArrowLink>
        <span className="font-sans text-meta uppercase text-text-muted">
          04 Architectural Properties
        </span>
      </div>
    </section>
  );
}
