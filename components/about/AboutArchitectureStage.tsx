"use client";

import { useState } from "react";
import { YurtDiagram } from "@/components/home/YurtDiagram";
import { Media } from "@/components/primitives/Media";
import { ArrowLink } from "@/components/primitives/ArrowLink";

type SpecView = "blueprint" | "elevation" | "materials";

const specPoints = [
  {
    id: "blueprint" as const,
    label: "Blueprint Anatomy",
    heading: "Parametric Radial Engineering",
    sub: "Mathematical load distribution without a single internal column.",
    metrics: [
      { label: "Internal Span", value: "6.0m – 8.2m Ø" },
      { label: "Column Support", value: "Zero Columns" },
      { label: "Assembly Time", value: "3–4 Days" },
      { label: "Ground Invasiveness", value: "Zero Concrete" },
    ],
  },
  {
    id: "elevation" as const,
    label: "Landscape Siting",
    heading: "Light-Footprint Terrain Adaptation",
    sub: "Elevated timber decking on removable ground screws for slopes and CRZ zones.",
    metrics: [
      { label: "Slope Tolerance", value: "Up to 35°" },
      { label: "Soil Displacement", value: "< 2%" },
      { label: "Relocatability", value: "100% Demountable" },
      { label: "Permit Category", value: "Non-Permanent" },
    ],
  },
  {
    id: "materials" as const,
    label: "Climate Envelope",
    heading: "Multi-Layer Monsoonal & Snow Defense",
    sub: "Steam-bent ash lattice, wool insulation, and breathable organic canvas.",
    metrics: [
      { label: "Temp Envelope", value: "-15°C to 45°C" },
      { label: "Snow Load Rating", value: "180 kg/m²" },
      { label: "Wind Rating", value: "120 km/h" },
      { label: "Daylight Lux", value: "800+ Lux Zenith" },
    ],
  },
];

export function AboutArchitectureStage() {
  const [activeTab, setActiveTab] = useState<SpecView>("blueprint");

  const current = specPoints.find((p) => p.id === activeTab) ?? specPoints[0];

  return (
    <div className="rounded-sm border border-line bg-surface-alt/70 overflow-hidden shadow-2xl">
      {/* Top Precision Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8 bg-surface-deep/90">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-accent-text animate-pulse" />
          <span className="font-sans text-meta uppercase tracking-widest text-accent-text text-xs font-semibold">
            Architectural Specification &middot; Theyurts Engineering
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-xs bg-surface-alt p-1 border border-line/60">
          {specPoints.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 font-sans text-meta uppercase text-[0.6875rem] transition-all duration-200 cursor-pointer rounded-xs ${
                  isSelected
                    ? "bg-surface text-accent-text font-semibold shadow-xs border border-line/80"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Dynamic Blueprint / Visual Canvas */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-line relative bg-surface-deep/40 min-h-[380px] lg:min-h-[460px]">
          {/* Subtle architectural crosshair markings */}
          <span className="pointer-events-none absolute top-4 left-4 text-xs font-mono text-text-muted opacity-40">
            + 32°14′N 77°11′E
          </span>
          <span className="pointer-events-none absolute bottom-4 right-4 text-xs font-mono text-text-muted opacity-40">
            SEC_SPEC // 004
          </span>

          {activeTab === "blueprint" ? (
            <div className="py-4">
              <YurtDiagram className="text-text max-h-[360px] mx-auto drop-shadow-md" />
              <p className="mt-4 text-center font-sans text-meta uppercase text-text-muted text-[0.6875rem] tracking-wider">
                Parametric Elevation &middot; Solid Compression Crown & Diagonal Lattice Wall
              </p>
            </div>
          ) : activeTab === "elevation" ? (
            <div className="relative overflow-hidden rounded-xs h-[320px] sm:h-[360px] w-full group">
              <Media
                id="home.gallery-1"
                ratio="landscape"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-surface-deep/90 backdrop-blur-xs rounded-xs border border-line/60 font-sans text-meta uppercase text-accent-text text-xs">
                Zero-Excavation Siting &middot; Sloped Himalayan Terrain
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xs h-[320px] sm:h-[360px] w-full group">
              <Media
                id="home.material-crown"
                ratio="landscape"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-surface-deep/90 backdrop-blur-xs rounded-xs border border-line/60 font-sans text-meta uppercase text-accent-text text-xs">
                Radial Ash Joinery &middot; Multi-Layer Vapor Barrier
              </div>
            </div>
          )}
        </div>

        {/* Right: Architectural Data & Rationale */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-surface/90">
          <div>
            <div className="flex items-center gap-2 text-text-muted font-sans text-meta uppercase text-xs">
              <span className="text-accent-text font-semibold">Engineering Factsheet</span>
              <span>&bull;</span>
              <span>Modular Nomadic System</span>
            </div>

            <h3 className="mt-3 font-display text-display-md text-text leading-tight">
              {current.heading}
            </h3>

            <p className="mt-3 font-sans text-body text-text-muted text-[0.9375rem] leading-relaxed">
              {current.sub}
            </p>

            {/* Live Metrics Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line/80 pt-6">
              {current.metrics.map((m) => (
                <div key={m.label} className="flex flex-col border-b border-line/40 pb-3">
                  <span className="font-sans text-[0.6875rem] uppercase text-text-muted tracking-wider">
                    {m.label}
                  </span>
                  <span className="mt-1 font-display text-display-sm text-accent-text font-medium">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-line/80 pt-6 flex flex-wrap items-center justify-between gap-4">
            <ArrowLink href="/process">
              How we manufacture
            </ArrowLink>
            <span className="font-sans text-meta uppercase text-text-muted text-[0.6875rem]">
              Certified Tolerances
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
