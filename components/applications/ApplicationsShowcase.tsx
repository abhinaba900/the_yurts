"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Media } from "@/components/primitives/Media";
import { CmsImage } from "@/components/page/CmsImage";
import { cn } from "@/lib/cn";
import type { MediaId } from "@/data/media";
import type { SanityImage } from "@/sanity/lib/types";

export type ApplicationItem = {
  name: string;
  slug: string;
  line?: string | null;
  body?: string | null;
  heroImage?: SanityImage | null;
  media?: MediaId;
  considerations?: string[];
};

/**
 * Split Sticky Applications Showcase:
 *
 * Left Column: Sticky pinned image stage with dynamic photo cross-fade,
 * index badge, and core application considerations below the image.
 *
 * Right Column: Numbered scroll sequence (01, 02, 03... 11) where
 * the active item expands upon scroll and previous items collapse.
 */
export function ApplicationsShowcase({
  entries,
}: {
  entries: ApplicationItem[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const activeItem = entries[activeIdx] ?? entries[0];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start relative">
      {/* Left Column: Sticky Stage dynamically filling viewport height */}
      <div className="lg:col-span-6 lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] lg:flex lg:flex-col lg:justify-between self-start">
        {/* Dynamic Image Container that consumes all remaining screen height */}
        <div className="relative overflow-hidden rounded-sm bg-surface-alt shadow-2xl flex-1 min-h-[240px] w-full border border-line/60">
          {entries.map((item, i) => (
            <div
              key={item.slug}
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
                  pendingLabel={`${item.slug}.jpg`}
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
                    {item.name} Photography
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Top Floating Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-xs bg-surface-deep/85 backdrop-blur-xs border border-line/40 shadow-lg">
            <span className="font-sans text-meta text-accent-text uppercase font-semibold">
              {String(activeIdx + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}
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
              Application Summary
            </span>
            <span className="font-sans text-small font-medium text-text">
              {activeItem.name}
            </span>
          </div>

          <p className="mt-2 font-sans text-small text-text-muted leading-relaxed line-clamp-2">
            {activeItem.line}
          </p>

          {activeItem.considerations && activeItem.considerations.length > 0 ? (
            <div className="mt-2.5 border-t border-line/80 pt-2">
              <span className="font-sans text-meta uppercase text-text-muted block mb-1">
                Key Site Considerations:
              </span>
              <ul className="space-y-1 font-sans text-[0.8125rem] text-text-muted">
                {activeItem.considerations.slice(0, 2).map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                    <span className="text-accent-text">&bull;</span>
                    <span className="truncate">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-3 border-t border-line/80 pt-2.5 flex items-center justify-between">
            <Link
              href={`/applications/${activeItem.slug}`}
              className="u-link-underline font-sans text-meta uppercase text-accent-text flex items-center gap-1.5"
            >
              <span>Read case study</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/enquire"
              className="u-link-underline font-sans text-meta uppercase text-text-muted hover:text-text transition-colors duration-300"
            >
              Enquire
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Numbered List (01, 02, 03...) with scroll-driven accordion */}
      <div className="lg:col-span-6 space-y-4">
        {entries.map((item, i) => {
          const isActive = activeIdx === i;
          return (
            <div
              key={item.slug}
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
                    <h2
                      className={cn(
                        "font-display text-display-md transition-colors duration-300",
                        isActive ? "text-text" : "text-text-muted hover:text-text",
                      )}
                    >
                      {item.name}
                    </h2>
                    {item.line ? (
                      <span className="font-sans text-meta uppercase text-accent-text/80 block mt-0.5">
                        {item.line}
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
                  <p className="text-body text-text-muted leading-relaxed">
                    {item.body}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                    <Link
                      href={`/applications/${item.slug}`}
                      className="u-link-underline font-sans text-meta uppercase text-text hover:text-accent-text transition-colors duration-300 flex items-center gap-1.5"
                    >
                      <span>Read the full case</span>
                      <span>&rarr;</span>
                    </Link>
                    <Link
                      href="/enquire"
                      className="u-link-underline font-sans text-meta uppercase text-accent-text"
                    >
                      Plan this structure
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-2 font-sans text-small text-text-muted/70 line-clamp-1">
                  {item.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
