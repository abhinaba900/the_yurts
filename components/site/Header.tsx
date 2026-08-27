"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { primaryNav, site } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";
import { AudioToggle } from "./BackgroundAudio";

/**
 * Fixed header.
 *
 * Transparent while it sits over the top of a page, then settles onto a surface
 * with a hairline once scrolled.
 *
 * TONE: a page section can carry `data-header-tone="light"` (a cinematic hero,
 * say) and the header will switch to its light-on-dark set while that section is
 * beneath it. This is done by sampling the element under the header band rather
 * than by React context, so the page stays a server component and only needs an
 * attribute.
 */
export type HeaderContact = {
  email: string | null;
  phone: string | null;
};

export function Header({ contact }: { contact?: HeaderContact }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overLight, setOverLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bandRef = useRef<HTMLElement | null>(null);

  const sample = useCallback(() => {
    setScrolled(window.scrollY > 24);

    // Read what sits *behind* the middle of the header band.
    //
    // elementsFromPoint (plural) is required here: the header is fixed over
    // this point, so the singular elementFromPoint only ever returns the
    // header's own subtree. Skip everything inside the band to reach the page
    // section underneath.
    const band = bandRef.current;
    const y = band ? band.getBoundingClientRect().height / 2 : 36;
    const behind = document
      .elementsFromPoint(24, y)
      .find(
        (el) => !band?.contains(el) && el.closest('[data-header-tone="light"]'),
      );

    setOverLight(Boolean(behind));
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sample();
      });
    };

    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sample, pathname]);

  // Close the menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  const light = overLight && !scrolled;

  return (
    <>
      <header
        ref={bandRef}
        {...(light ? { "data-tone": "light" } : {})}
        // Read by CSS so a dark hero is honoured on the very first paint,
        // before this component has hydrated. See tokens.css.
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color] duration-(--duration-base)",
          "ease-(--ease-out-soft)",
          scrolled
            ? "border-b border-line bg-surface"
            : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Top-down gradient scrim: ensures navbar items stay clearly legible over any hero background */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 sm:h-36 md:h-44",
            "bg-gradient-to-b from-walnut-deep/90 via-walnut-deep/55 to-transparent",
            "transition-opacity duration-(--duration-base) ease-(--ease-out-soft)",
            scrolled ? "opacity-0" : "opacity-100",
          )}
        />

        <TopBar contact={contact} scrolled={scrolled} />

        <div className="u-container">
          <div
            className={cn(
              "flex items-center justify-between gap-8",
              "transition-[height] duration-(--duration-base) ease-(--ease-out-soft)",
              scrolled ? "h-16" : "h-20 md:h-24",
            )}
          >
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="shrink-0 text-text"
            >
              <Wordmark />
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-9 lg:flex"
            >
              {primaryNav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative py-1.5 font-sans text-meta uppercase text-text"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-px origin-left bg-accent",
                        "transition-transform duration-(--duration-base) ease-(--ease-reveal)",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 sm:gap-6">
              <AudioToggle className="hidden sm:inline-flex" />

              <Link
                href="/enquire"
                className={cn(
                  "group hidden items-center gap-2 rounded-xs bg-cream px-4 py-2",
                  "font-sans text-meta uppercase tracking-wider text-walnut-deep font-semibold",
                  "transition-all duration-200 hover:bg-accent-text hover:text-walnut-deep lg:inline-flex",
                )}
              >
                Enquire
                <span
                  aria-hidden
                  className="transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </Link>

              <AudioToggle className="sm:hidden" showLabel={false} />

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                className="flex items-center gap-3 py-2 font-sans text-meta uppercase text-text lg:hidden"
              >
                Menu
                <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        contact={contact}
      />
    </>
  );
}
