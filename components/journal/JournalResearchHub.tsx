"use client";

import { useState } from "react";
import { Media } from "@/components/primitives/Media";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import type { MediaId } from "@/data/media";

type ResearchCategory = "all" | "economics" | "permits" | "thermal" | "spatial";

type ResearchPaper = {
  number: string;
  category: "economics" | "permits" | "thermal" | "spatial";
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  status: string;
  metrics: { label: string; value: string }[];
  mediaId: MediaId;
};

const researchPapers: ResearchPaper[] = [
  {
    number: "01",
    category: "economics",
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
    mediaId: "home.range-luxury",
  },
  {
    number: "02",
    category: "permits",
    tag: "Land & Permitting",
    title: "Navigating Agricultural Land, Forest Clearings & Non-Permanent Permits in India.",
    excerpt: "Why yurts qualify as non-permanent modular installations, sidestepping prolonged commercial land conversion cycles under state eco-tourism guidelines in Uttarakhand, Himachal Pradesh, and CRZ zones.",
    readTime: "6 min read",
    status: "Policy Brief",
    metrics: [
      { label: "Approval Cycle", value: "3–6 Weeks" },
      { label: "Relocatability", value: "100% Retrievable" },
    ],
    mediaId: "home.application-farmstay",
  },
  {
    number: "03",
    category: "thermal",
    tag: "Thermal Engineering",
    title: "Thermal Retention & Monsoonal Weatherproofing: Ash Lattice, Wool & Breathable Canvas.",
    excerpt: "Engineering data on sub-zero winter heat retention in Himalayan snow zones versus humidity management and mold prevention in Western Ghats monsoons using multi-layer breathable membranes.",
    readTime: "7 min read",
    status: "Engineering Note",
    metrics: [
      { label: "Temp Tolerance", value: "-15°C to 45°C" },
      { label: "Wind Rating", value: "120 km/h Tested" },
    ],
    mediaId: "home.process",
  },
  {
    number: "04",
    category: "spatial",
    tag: "Spatial Psychology",
    title: "Acoustics & The Circular Space: Why Guests Pay a Premium for Circular Rooms.",
    excerpt: "How the column-free dome and tensioned fabric ceiling create a tranquil acoustic envelope, dampening external wind while diffusing soft natural daylight from the central crown wheel.",
    readTime: "5 min read",
    status: "Design Essay",
    metrics: [
      { label: "RevPAR Lift", value: "+35% vs Cabins" },
      { label: "Usable Volume", value: "100% Column-free" },
    ],
    mediaId: "home.range-wellness",
  },
  {
    number: "05",
    category: "economics",
    tag: "Hospitality Economics",
    title: "Phased Resort Expansion: Adding Yurts Season-by-Season Without Capital Lockup.",
    excerpt: "How boutique retreats scale inventory sequentially from 3 units to 12 units using operating cashflow, avoiding upfront debt and multi-year construction disruption.",
    readTime: "6 min read",
    status: "Financial Guide",
    metrics: [
      { label: "Deployment Speed", value: "4 Days / Unit" },
      { label: "Site Disruption", value: "Near Zero" },
    ],
    mediaId: "home.application-resorts",
  },
  {
    number: "06",
    category: "permits",
    tag: "Land & Permitting",
    title: "Zero-Ground-Impact Foundation Guidelines: Helical Screws vs Timber Post Stilts.",
    excerpt: "Meeting strict forest and ecologically sensitive zone regulations by utilizing ground screws that leave the soil profile completely undisturbed upon decommissioning.",
    readTime: "5 min read",
    status: "Technical Standard",
    metrics: [
      { label: "Ground Recovery", value: "Immediate" },
      { label: "Soil Displacement", value: "< 2%" },
    ],
    mediaId: "home.range-resort",
  },
  {
    number: "07",
    category: "thermal",
    tag: "Thermal Engineering",
    title: "High-Altitude Snow Loads: Crown Compression Physics & Steam-Bent Ash Rafters.",
    excerpt: "Stress analysis on conical yurt geometry during heavy 2-meter snow accumulation, and how radial rafter distribution naturally sheds peak structural load downward.",
    readTime: "7 min read",
    status: "Structural Study",
    metrics: [
      { label: "Snow Load Rating", value: "180 kg/m²" },
      { label: "Rafter Material", value: "Steam-Bent Ash" },
    ],
    mediaId: "home.material-crown",
  },
  {
    number: "08",
    category: "spatial",
    tag: "Spatial Psychology",
    title: "The Architecture of Natural Daylight: Crown Wheel Oculus Orientation in India.",
    excerpt: "Solar path mapping for aligning the 360-degree skylight to maximize morning sunrise illumination while preventing excessive afternoon solar heat gain in tropical climates.",
    readTime: "4 min read",
    status: "Design Standard",
    metrics: [
      { label: "Daylight Lux", value: "800+ Lux Ambient" },
      { label: "UV Filtering", value: "99.2% Block" },
    ],
    mediaId: "home.gallery-2",
  },
];

const categoryList: { id: ResearchCategory; name: string }[] = [
  { id: "all", name: "All Intelligence" },
  { id: "economics", name: "Resort & Glamping Economics" },
  { id: "permits", name: "Land Zoning & Permitting" },
  { id: "thermal", name: "Thermal & Climate Engineering" },
  { id: "spatial", name: "Interior & Spatial Acoustics" },
];

/**
 * Interactive Research & Working Papers Hub with dynamic client-side filtering.
 */
export function JournalResearchHub() {
  const [activeCategory, setActiveCategory] = useState<ResearchCategory>("all");

  const filteredPapers =
    activeCategory === "all"
      ? researchPapers
      : researchPapers.filter((paper) => paper.category === activeCategory);

  const [featured, ...rest] = filteredPapers;

  const getCount = (catId: ResearchCategory) => {
    if (catId === "all") return researchPapers.length;
    return researchPapers.filter((p) => p.category === catId).length;
  };

  return (
    <div className="space-y-14">
      {/* Interactive Filter Navigation */}
      <div className="border-t border-line pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-meta uppercase text-text-muted">
            Knowledge Streams:
          </span>

          <nav aria-label="Research categories">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {categoryList.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const count = getCount(cat.id);
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`group relative py-1 font-sans text-meta uppercase cursor-pointer transition-colors duration-200 ${
                        isSelected
                          ? "text-accent-text font-semibold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="ml-1.5 text-[10px] opacity-70">
                        ({count})
                      </span>
                      {/* Active indicator bar */}
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 bottom-0 h-0.5 bg-accent-text transition-transform duration-200 ${
                          isSelected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Featured Lead Research Paper */}
      {featured ? (
        <Reveal kind="media" key={featured.title} className="border-t border-line pt-10">
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
                    {featured.tag}
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
                  <ArrowLink href={`/enquire?topic=${encodeURIComponent(featured.title)}`}>
                    Request paper & full research model
                  </ArrowLink>
                  <span className="font-sans text-meta uppercase text-text-muted text-xs">
                    Full PDF Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      ) : null}

      {/* Secondary In-Depth Working Papers */}
      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((paper, i) => (
            <Reveal
              key={paper.title}
              kind="up"
              delay={i * 0.06}
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
      ) : null}
    </div>
  );
}
