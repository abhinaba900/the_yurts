import Link from "next/link";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

const researchPapers = [
  {
    number: "01",
    tag: "Hospitality Economics",
    title: "The Unit Economics of a 6-Yurt Glamping Resort: Capex, ARR & Payback Horizons.",
    excerpt: "A line-by-line financial model comparing traditional brick-and-mortar masonry suites against modular circular timber yurts across Himachal, Goa, and Maharashtra. How non-permanent installations reach full operational breakeven in 14–18 months.",
    readTime: "8 min read",
    status: "Working Paper",
    metrics: [
      { label: "Capex per key", value: "₹18L – ₹24L" },
      { label: "Avg Occupancy", value: "72% High Season" },
      { label: "Foundation Footprint", value: "Zero Concrete" },
    ],
    mediaId: "home.range-luxury" as const,
  },
  {
    number: "02",
    tag: "Land & Permitting",
    title: "Navigating Agricultural Land, Forest Clearings & Non-Permanent Permits in India.",
    excerpt: "Why yurts qualify as non-permanent modular installations, sidestepping prolonged commercial land conversion cycles under state eco-tourism guidelines in Uttarakhand, Himachal Pradesh, and CRZ zones.",
    readTime: "6 min read",
    status: "Policy Brief",
    metrics: [
      { label: "Approval Cycle", value: "3–6 Weeks" },
      { label: "Relocatability", value: "100% Retrievable" },
    ],
    mediaId: "home.application-farmstay" as const,
  },
  {
    number: "03",
    tag: "Thermal Engineering",
    title: "Thermal Retention & Monsoonal Weatherproofing: Ash Lattice, Wool & Breathable Canvas.",
    excerpt: "Engineering data on sub-zero winter heat retention in Himalayan snow zones versus humidity management and mold prevention in Western Ghats monsoons using multi-layer breathable membranes.",
    readTime: "7 min read",
    status: "Engineering Note",
    metrics: [
      { label: "Temp Tolerance", value: "-15°C to 45°C" },
      { label: "Wind Rating", value: "120 km/h Tested" },
    ],
    mediaId: "home.process" as const,
  },
  {
    number: "04",
    tag: "Spatial Psychology",
    title: "Acoustics & The Circular Space: Why Guests Pay a Premium for Circular Rooms.",
    excerpt: "How the column-free dome and tensioned fabric ceiling create a tranquil acoustic envelope, dampening external wind while diffusing soft natural daylight from the central crown wheel.",
    readTime: "5 min read",
    status: "Design Essay",
    metrics: [
      { label: "RevPAR Lift", value: "+35% vs Cabins" },
      { label: "Usable Volume", value: "100% Column-free" },
    ],
    mediaId: "home.range-wellness" as const,
  },
];

const researchTopics = [
  { name: "All Intelligence", count: 8, active: true },
  { name: "Resort & Glamping Economics", count: 3, active: false },
  { name: "Land Zoning & Permitting", count: 2, active: false },
  { name: "Thermal & Climate Engineering", count: 2, active: false },
  { name: "Interior & Spatial Acoustics", count: 1, active: false },
];

/**
 * Editorial Research & Working Papers Hub.
 *
 * Provides authoritative architectural, economic, and land planning
 * intelligence for prospective landowners and hospitality founders.
 */
export function JournalResearchHub() {
  const [featured, ...rest] = researchPapers;

  return (
    <div className="space-y-16">
      {/* Interactive Topics / Filters */}
      <div className="border-t border-line pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-sans text-meta uppercase text-text-muted">
            Knowledge Streams:
          </span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {researchTopics.map((topic) => (
              <li key={topic.name}>
                <span
                  className={`inline-flex items-center gap-1.5 font-sans text-meta uppercase cursor-pointer transition-colors duration-200 ${
                    topic.active
                      ? "text-accent-text font-semibold border-b border-accent-text pb-0.5"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {topic.name}
                  <span className="text-[10px] opacity-60">({topic.count})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Featured Lead Research Paper */}
      <Reveal kind="media" className="border-t border-line pt-10">
        <div className="group rounded-sm bg-surface-alt/40 border border-line/80 overflow-hidden transition-all duration-500 hover:border-accent">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Lead Image with Prominent Height */}
            <div className="lg:col-span-7 overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px] w-full relative">
              <Media
                id={featured.mediaId}
                ratio="landscape"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-surface-deep/90 backdrop-blur-xs rounded-xs border border-line/60">
                <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                  Featured Research &middot; {featured.tag}
                </span>
              </div>
            </div>

            {/* Lead Content & Financial Metrics */}
            <div className="lg:col-span-5 p-6 lg:p-8 lg:pl-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-text-muted font-sans text-meta uppercase">
                  <span>{featured.status} #{featured.number}</span>
                  <span>&bull;</span>
                  <span>{featured.readTime}</span>
                </div>

                <h2 className="mt-4 font-display text-display-md text-text leading-tight group-hover:text-accent-text transition-colors duration-300">
                  {featured.title}
                </h2>

                <p className="mt-4 font-sans text-body text-text-muted text-[0.9375rem] leading-relaxed">
                  {featured.excerpt}
                </p>

                {/* Key Metrics Chips */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-line/60 pt-4">
                  {featured.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col">
                      <span className="font-sans text-[0.6875rem] uppercase text-text-muted tracking-wider">
                        {m.label}
                      </span>
                      <span className="mt-0.5 font-display text-display-xs sm:text-base text-accent-text font-medium">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-line/70 pt-5 flex items-center justify-between">
                <ArrowLink href="/enquire?topic=Resort+Economics">
                  Request paper & full financial model
                </ArrowLink>
                <span className="font-sans text-meta uppercase text-text-muted">
                  Full PDF Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 3 Secondary In-Depth Working Papers */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((paper, i) => (
          <Reveal
            key={paper.number}
            kind="up"
            delay={i * 0.08}
            className="group flex flex-col justify-between rounded-sm border border-line bg-surface p-6 sm:p-7 transition-all duration-300 hover:border-accent hover:shadow-lg"
          >
            <div>
              {/* Paper Visual Thumbnail */}
              <div className="relative overflow-hidden rounded-xs h-[200px] sm:h-[220px] w-full bg-surface-alt">
                <Media
                  id={paper.mediaId}
                  ratio="landscape"
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface-deep/90 backdrop-blur-xs rounded-xs border border-line/50 font-sans text-meta uppercase text-accent-text text-[0.6875rem]">
                  {paper.tag}
                </div>
              </div>

              {/* Meta */}
              <div className="mt-5 flex items-center gap-3 text-text-muted font-sans text-meta uppercase text-xs">
                <span>{paper.status} #{paper.number}</span>
                <span>&bull;</span>
                <span>{paper.readTime}</span>
              </div>

              {/* Title & Excerpt */}
              <h3 className="mt-3 font-display text-display-sm text-text leading-snug group-hover:text-accent-text transition-colors duration-300">
                {paper.title}
              </h3>
              <p className="mt-3 font-sans text-small text-text-muted line-clamp-3 leading-relaxed">
                {paper.excerpt}
              </p>
            </div>

            {/* Bottom Action */}
            <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between">
              <ArrowLink href={`/enquire?topic=${encodeURIComponent(paper.title)}`}>
                Read summary
              </ArrowLink>
              <span className="font-sans text-meta uppercase text-text-muted text-[0.6875rem]">
                {paper.metrics[0]?.value}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
