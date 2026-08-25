"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { applications } from "@/data/home";

/**
 * Applications section.
 *
 * Left column: scrollable interactive application index.
 * Right column: sticky answering image that stays pinned in the viewport
 * while scrolling through the left content, fitting the screen perfectly,
 * and releasing once the section finishes.
 */
export function Applications() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Update active item as the user scrolls down the page
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.45;
      for (let i = itemRefs.current.length - 1; i >= 0; i--) {
        const el = itemRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            setActive(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-surface py-(--spacing-section-lg) lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-16">
      <div className="u-container">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-5">
            <Metadata className="text-accent-text">Applications</Metadata>
            <h2 className="mt-5 font-display text-display-lg u-optical-left">
              What people build with them.
            </h2>
          </header>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="u-grid items-start relative">
            {/* Left Column: Index list */}
            <ul className="col-span-4 md:col-span-6 lg:col-span-6">
              {applications.map((item, i) => (
                <li
                  key={item.name}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="border-t border-line last:border-b"
                >
                  <Link
                    href="/applications"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-baseline gap-5 py-6 lg:py-8"
                  >
                    <span
                      className={cn(
                        "font-sans text-meta uppercase transition-colors duration-300",
                        i === active ? "text-accent-text font-semibold" : "text-text-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display text-display-md leading-none transition-colors duration-300",
                          i === active ? "text-text" : "text-text-muted group-hover:text-text",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="mt-2 block font-sans text-small text-text-muted">
                        {item.line}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "translate-y-px transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        i === active
                          ? "translate-x-1.5 text-accent-text"
                          : "text-text-muted group-hover:translate-x-1 group-hover:text-text",
                      )}
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Column: Sticky Image that stays in view and fits screen height */}
            <div
              aria-hidden
              className="hidden lg:col-span-5 lg:col-start-8 lg:block sticky top-28 self-start"
            >
              <div className="relative overflow-hidden shadow-2xl rounded-sm max-h-[calc(100vh-11rem)] aspect-[4/5] bg-surface-alt">
                {applications.map((item, i) => (
                  <div
                    key={item.name}
                    className={cn(
                      "absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === active
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 pointer-events-none z-0",
                    )}
                  >
                    <Media
                      id={item.media}
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-sans text-meta uppercase tracking-wider text-accent-text">
                  {applications[active].name}
                </p>
                <span className="font-sans text-meta uppercase text-text-muted">
                  {String(active + 1).padStart(2, "0")} / {String(applications.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <ArrowLink href="/applications">Every application</ArrowLink>
        </div>
      </div>
    </section>
  );
}
