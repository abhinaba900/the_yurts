"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { cn } from "@/lib/cn";
import { rangeFallback as range } from "@/data/range";

/**
 * Split Sticky Range Showcase:
 *
 * Left Column: Sticky pinned image stage with live photo crossfade,
 * model index badge, and dynamic spec summary below the image.
 *
 * Right Column: Numbered scroll sequence (01, 02, 03... 10) where
 * the active item expands upon scroll and previous items collapse.
 */
export function RangeRail() {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll position to expand active item and update sticky image
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.42;
      for (let i = itemRefs.current.length - 1; i >= 0; i--) {
        const el = itemRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            setActiveIdx(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  const activeModel = range[activeIdx];

  return (
    <section className="bg-surface py-16 lg:py-12">
      <div className="u-container">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6 lg:pb-8">
          <div>
            <Reveal kind="up">
              <Metadata className="text-accent-text">The Range</Metadata>
              <h2 className="mt-2 font-display text-display-lg u-optical-left">
                Ten starting points.
              </h2>
            </Reveal>
          </div>
          <Reveal kind="up" delay={0.08} className="max-w-md">
            <p className="font-sans text-small text-text-muted">
              Each structure is a customizable foundation engineered for durability,
              rapid site assembly, and low-impact installation across India.
            </p>
          </Reveal>
        </div>

        {/* Split-Screen Sticky Showcase */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start relative">
          {/* Left Column: Sticky Stage dynamically filling viewport height */}
          <div className="lg:col-span-6 lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] lg:flex lg:flex-col lg:justify-between self-start">
            {/* Dynamic Image Container that consumes all remaining screen height */}
            <div className="relative overflow-hidden rounded-sm bg-surface-alt shadow-2xl flex-1 min-h-[240px] w-full border border-line/60">
              {range.map((item, i) => (
                <div
                  key={item.name}
                  className={cn(
                    "absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === activeIdx
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-105 pointer-events-none z-0",
                  )}
                >
                  {item.media ? (
                    <Media
                      id={item.media}
                      ratio="landscape"
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-end bg-surface-alt p-6">
                      <span className="font-sans text-meta uppercase text-text-muted">
                        Photography in workshop
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-xs bg-surface-deep/85 backdrop-blur-xs border border-line/40 shadow-lg">
                <span className="font-sans text-meta text-accent-text uppercase font-semibold">
                  {String(activeIdx + 1).padStart(2, "0")} / {String(range.length).padStart(2, "0")}
                </span>
                <span className="text-text-muted opacity-40">&middot;</span>
                <span className="font-display text-small text-text">
                  {activeModel.name}
                </span>
              </div>
            </div>

            {/* Bottom Specs Summary under the image */}
            <div className="mt-3 shrink-0 rounded-sm border border-line/70 bg-surface-alt/40 p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-sans text-meta uppercase text-accent-text">
                  Specification Summary
                </span>
                <span className="font-sans text-small font-medium text-text">
                  {activeModel.name} Structure
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3 font-sans text-[0.8125rem]">
                <div>
                  <span className="block text-meta uppercase text-text-muted">Diameter</span>
                  <span className="mt-0.5 block font-medium text-text">{activeModel.diameter}</span>
                </div>
                <div>
                  <span className="block text-meta uppercase text-text-muted">Capacity</span>
                  <span className="mt-0.5 block font-medium text-text">{activeModel.capacity}</span>
                </div>
                <div>
                  <span className="block text-meta uppercase text-text-muted">Ideal For</span>
                  <span className="mt-0.5 block font-medium text-text truncate" title={activeModel.idealFor}>
                    {activeModel.idealFor}
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-line/80 pt-2.5 flex items-center justify-between">
                <Link
                  href="/enquire"
                  className="u-link-underline font-sans text-meta uppercase text-accent-text flex items-center gap-1.5"
                >
                  <span>Enquire about {activeModel.name}</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/yurts"
                  className="u-link-underline font-sans text-meta uppercase text-text-muted hover:text-text transition-colors duration-300"
                >
                  View full catalogue
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Numbered List (01, 02, 03...) with scroll-driven accordion */}
          <div className="lg:col-span-6 space-y-4">
            {range.map((item, i) => {
              const isActive = activeIdx === i;
              return (
                <div
                  key={item.name}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={cn(
                    "rounded-sm border transition-all duration-500 overflow-hidden",
                    isActive
                      ? "border-accent/40 bg-surface-alt/70 shadow-xl p-6 lg:p-7"
                      : "border-line/60 bg-surface-alt/20 hover:border-line hover:bg-surface-alt/40 p-5 cursor-pointer",
                  )}
                  onClick={() => setActiveIdx(i)}
                >
                  {/* Item Header */}
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                      <span
                        className={cn(
                          "font-display text-display-md transition-colors duration-300",
                          isActive ? "text-accent-text" : "text-text-muted",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3
                          className={cn(
                            "font-display text-display-md transition-colors duration-300",
                            isActive ? "text-text" : "text-text-muted hover:text-text",
                          )}
                        >
                          {item.name}
                        </h3>
                        <span className="font-sans text-meta uppercase text-accent-text/80 block mt-0.5">
                          {item.tagline}
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden
                      className={cn(
                        "font-sans text-xl transition-all duration-300",
                        isActive ? "text-accent-text rotate-90" : "text-text-muted",
                      )}
                    >
                      &rarr;
                    </span>
                  </div>

                  {/* Expanded Content when active */}
                  {isActive ? (
                    <div className="mt-4 border-t border-line/80 pt-4 font-sans animate-in fade-in slide-in-from-top-1 duration-300">
                      <p className="text-body text-text-muted leading-relaxed">
                        {item.use}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line/60 pt-3 text-[0.8125rem]">
                        <div>
                          <span className="text-meta uppercase text-text-muted">Footprint:</span>{" "}
                          <span className="font-medium text-text">{item.diameter}</span>
                        </div>
                        <div>
                          <span className="text-meta uppercase text-text-muted">Occupancy:</span>{" "}
                          <span className="font-medium text-text">{item.capacity}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <Link
                          href="/enquire"
                          className="u-link-underline font-sans text-meta uppercase text-accent-text flex items-center gap-1.5"
                        >
                          <span>Request quote for this model</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 font-sans text-small text-text-muted/70 line-clamp-1">
                      {item.use}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Footer */}
        <div className="mt-14 border-t border-line pt-6 flex items-center justify-between">
          <ArrowLink href="/yurts">View all 10 models in catalogue</ArrowLink>
          <span className="font-sans text-meta uppercase text-text-muted">
            10 Architectural Configurations
          </span>
        </div>
      </div>
    </section>
  );
}
