"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Media } from "@/components/primitives/Media";
import { CmsImage } from "@/components/page/CmsImage";
import { cn } from "@/lib/cn";
import { rangeFallback as fallbackRange, type RangeEntry } from "@/data/range";
import type { SanityImage } from "@/sanity/lib/types";

export type RangeProductItem = {
  id: string;
  name: string;
  slug?: string;
  tagline?: string | null;
  use?: string | null;
  diameter?: string | null;
  capacity?: string | null;
  idealFor?: string | null;
  media?: RangeEntry["media"];
  heroImage?: SanityImage | null;
  specs?: any;
};

/**
 * Split Sticky Range Catalogue Showcase:
 *
 * Left Column: Sticky pinned image stage with dynamic photo cross-fade,
 * model index badge, and full structural specifications below the image.
 *
 * Right Column: Numbered scroll sequence (01, 02, 03... 10) where
 * the active item expands upon scroll and previous items collapse.
 */
export function RangeShowcase({
  products,
}: {
  products?: RangeProductItem[];
}) {
  const items: RangeProductItem[] =
    products && products.length > 0
      ? products
      : fallbackRange.map((entry, i) => ({
          id: entry.name,
          name: entry.name,
          slug: entry.name.toLowerCase(),
          tagline: entry.tagline,
          use: entry.use,
          diameter: entry.diameter,
          capacity: entry.capacity,
          idealFor: entry.idealFor,
          media: entry.media,
        }));

  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * The split sticky layout only works from 1024px up (iPad Pro and desktop).
   * Below that the sticky stage has nowhere to pin, so the section becomes a
   * plain click-driven accordion: each card carries its own image on top and
   * its text underneath. Scroll no longer drives the active index there.
   */
  const [isSplitLayout, setIsSplitLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsSplitLayout(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isSplitLayout) return;

    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.42;
      for (let i = items.length - 1; i >= 0; i--) {
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
  }, [items.length, isSplitLayout]);

  /** Compact layout: open the tapped card and bring its top edge into view. */
  const handleSelect = (i: number) => {
    setActiveIdx(i);
    if (isSplitLayout) return;

    const el = itemRefs.current[i];
    if (!el) return;

    requestAnimationFrame(() => {
      const lenis = window.__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(el, { offset: -88, duration: 0.8 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  };

  const activeItem = items[activeIdx] ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start relative">
      {/* Left Column: Sticky Stage dynamically filling viewport height */}
      <div className="hidden lg:col-span-6 lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] lg:flex lg:flex-col lg:justify-between self-start">
        {/* Dynamic Image Container that consumes all remaining screen height */}
        <div className="relative overflow-hidden rounded-sm bg-surface-alt shadow-2xl flex-1 min-h-[240px] w-full border border-line/60">
          {items.map((item, i) => (
            <div
              key={item.name}
              className={cn(
                "absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === activeIdx
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 pointer-events-none z-0",
              )}
            >
              {item.heroImage ? (
                <CmsImage
                  image={item.heroImage}
                  ratio="landscape"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  pendingLabel={`${item.name}-hero.jpg`}
                  className="h-full w-full object-cover"
                />
              ) : item.media ? (
                <Media
                  id={item.media}
                  ratio="landscape"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-surface-alt p-6">
                  <span className="font-sans text-meta uppercase text-text-muted">
                    {item.name} Structure
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Top Floating Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-xs bg-surface-deep/85 backdrop-blur-xs border border-line/40 shadow-lg">
            <span className="font-sans text-meta text-accent-text uppercase font-semibold">
              {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <span className="text-text-muted opacity-40">&middot;</span>
            <span className="font-display text-small text-text">
              {activeItem.name}
            </span>
          </div>
        </div>

        {/* Bottom Details Summary Box */}
        <div className="mt-3 shrink-0 rounded-sm border border-line/70 bg-surface-alt/40 p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-sans text-meta uppercase text-accent-text">
              Structure Specifications
            </span>
            <span className="font-sans text-small font-medium text-text">
              {activeItem.name} Yurt
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3 font-sans text-[0.8125rem]">
            {activeItem.diameter ? (
              <div>
                <span className="block text-meta uppercase text-text-muted">Diameter</span>
                <span className="mt-0.5 block font-medium text-text">{activeItem.diameter}</span>
              </div>
            ) : null}
            {activeItem.capacity ? (
              <div>
                <span className="block text-meta uppercase text-text-muted">Capacity</span>
                <span className="mt-0.5 block font-medium text-text">{activeItem.capacity}</span>
              </div>
            ) : null}
            {activeItem.idealFor ? (
              <div>
                <span className="block text-meta uppercase text-text-muted">Ideal For</span>
                <span className="mt-0.5 block font-medium text-text truncate" title={activeItem.idealFor}>
                  {activeItem.idealFor}
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-3 border-t border-line/80 pt-2.5 flex items-center justify-between">
            <Link
              href="/enquire"
              className="u-link-underline font-sans text-meta uppercase text-accent-text flex items-center gap-1.5"
            >
              <span>Enquire about {activeItem.name}</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/applications"
              className="u-link-underline font-sans text-meta uppercase text-text-muted hover:text-text transition-colors duration-300"
            >
              See applications
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Numbered List (01, 02, 03...) with scroll-driven accordion */}
      <div className="lg:col-span-6 space-y-4">
        {items.map((item, i) => {
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
              onClick={() => handleSelect(i)}
            >
              {/* Item Header */}
              <div
                role={isSplitLayout ? undefined : "button"}
                tabIndex={isSplitLayout ? undefined : 0}
                aria-expanded={isSplitLayout ? undefined : isActive}
                onKeyDown={(e) => {
                  if (isSplitLayout) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(i);
                  }
                }}
                className="flex items-baseline justify-between gap-4"
              >
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
                    <h2
                      className={cn(
                        "font-display text-display-md transition-colors duration-300",
                        isActive ? "text-text" : "text-text-muted hover:text-text",
                      )}
                    >
                      {item.name}
                    </h2>
                    {item.tagline ? (
                      <span className="font-sans text-meta uppercase text-accent-text/80 block mt-0.5">
                        {item.tagline}
                      </span>
                    ) : null}
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
                  {/* Compact layout only: the model's own photo sits on top of its text */}
                  <div className="lg:hidden relative mb-4 overflow-hidden rounded-sm border border-line/60 bg-surface-alt aspect-[4/3] sm:aspect-[16/10]">
                    {item.heroImage ? (
                      <CmsImage
                        image={item.heroImage}
                        ratio="landscape"
                        sizes="(min-width: 640px) 90vw, 100vw"
                        pendingLabel={`${item.name}-hero.jpg`}
                        className="h-full w-full object-cover"
                      />
                    ) : item.media ? (
                      <Media
                        id={item.media}
                        ratio="landscape"
                        sizes="(min-width: 640px) 90vw, 100vw"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-end bg-surface-alt p-4">
                        <span className="font-sans text-meta uppercase text-text-muted">
                          {item.name} Structure
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xs border border-line/40 bg-surface-deep/85 px-2.5 py-1 shadow-lg backdrop-blur-xs">
                      <span className="font-sans text-meta font-semibold uppercase text-accent-text">
                        {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </span>
                      <span className="text-text-muted opacity-40">&middot;</span>
                      <span className="font-display text-small text-text">{item.name}</span>
                    </div>
                  </div>

                  <p className="text-body text-text-muted leading-relaxed">
                    {item.use}
                  </p>

                  {item.diameter && item.capacity ? (
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
                  ) : null}

                  <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                    <Link
                      href="/enquire"
                      className="u-link-underline font-sans text-meta uppercase text-accent-text flex items-center gap-1.5"
                    >
                      <span>Request quote for this model</span>
                      <span>&rarr;</span>
                    </Link>
                    <span className="font-sans text-meta uppercase text-text-muted">
                      0{i + 1} Starting Point
                    </span>
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
  );
}
