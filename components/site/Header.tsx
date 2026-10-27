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
 * TONE: a page section can carry `data-header-tone="dark"` (a photographic
 * hero, say) and the header will switch to its ink tone — linen type — while
 * that section is beneath it and the page has not been scrolled. This is done by sampling the element under the header band rather
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
  const [overDark, setOverDark] = useState(false);
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
        (el) => !band?.contains(el) && el.closest('[data-header-tone="dark"]'),
      );

    setOverDark(Boolean(behind));
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

  const dark = overDark && !scrolled;

  return (
    <>
      <header
        ref={bandRef}
        {...(dark ? { "data-tone": "dark" } : {})}
        // Read by CSS so a dark hero is honoured on the very first paint,
        // before this component has hydrated. See tokens.css.
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color] duration-(--duration-base)",
          "ease-(--ease-out-soft)",
          scrolled
            ? "border-b border-line bg-surface-alt shadow-(--shadow-card)"
            : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Top-down scrim, over dark photography only: keeps the linen
            navigation legible whatever the image does at its top edge. */}
        <div
          aria-hidden
          className={cn(
            "u-header-scrim pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 sm:h-36 md:h-44",
            "bg-gradient-to-b from-espresso-deep/70 via-espresso-deep/30 to-transparent",
            "transition-opacity duration-(--duration-base) ease-(--ease-out-soft)",
            dark ? "opacity-100" : "opacity-0",
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
              className="hidden items-center gap-[clamp(1.25rem,2.2vw,2.25rem)] lg:flex"
            >
              {primaryNav.map((item) => {
                const isCurrent = (href: string) =>
                  pathname === href || pathname.startsWith(`${href}/`);
                const active =
                  isCurrent(item.href) ||
                  (item.children?.some((child) => isCurrent(child.href)) ??
                    false);

                const trigger = (
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="group relative flex items-center gap-1.5 py-2 font-sans text-small font-medium text-text transition-colors duration-(--duration-quick) hover:text-accent-text"
                  >
                    {item.label}
                    {item.children ? (
                      <span
                        aria-hidden
                        className="text-[0.7em] leading-none opacity-70 transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-y-0.5"
                      >
                        &#9662;
                      </span>
                    ) : null}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0.5 h-0.5 origin-left rounded-full bg-accent",
                        "transition-transform duration-(--duration-base) ease-(--ease-reveal)",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                );

                if (!item.children) {
                  return <div key={item.href}>{trigger}</div>;
                }

                /**
                 * Hover and focus both open the panel. It is kept in the layout
                 * with `invisible` rather than unmounted so the children are
                 * unfocusable while closed, and focusable the moment the parent
                 * link takes focus.
                 */
                return (
                  <div key={item.href} className="group/nav relative">
                    {trigger}
                    <div
                      className={cn(
                        "absolute left-0 top-full z-50 pt-3",
                        "invisible translate-y-1 opacity-0",
                        "transition-[opacity,transform,visibility] duration-(--duration-base) ease-(--ease-out-soft)",
                        "group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100",
                        "group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100",
                        "motion-reduce:transition-none",
                      )}
                    >
                      <ul className="min-w-60 rounded-(--radius-card) border border-line bg-surface-elevated p-2 shadow-(--shadow-lift)">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={
                                isCurrent(child.href) ? "page" : undefined
                              }
                              className={cn(
                                "block rounded-(--radius-control) px-3.5 py-2.5 font-sans text-small",
                                "transition-colors duration-(--duration-quick) ease-(--ease-out-soft)",
                                isCurrent(child.href)
                                  ? "bg-surface-selected font-medium text-accent-text"
                                  : "text-text-muted hover:bg-surface-selected hover:text-text",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 sm:gap-5">
              <AudioToggle className="hidden sm:inline-flex" />

              <Link
                href="/enquire"
                className={cn(
                  "group hidden min-h-11 items-center gap-2 rounded-(--radius-control) bg-accent px-5 py-2.5",
                  "font-sans text-small font-medium text-on-accent shadow-(--shadow-card)",
                  "transition-[background-color,box-shadow] duration-(--duration-quick) hover:bg-accent-hover hover:shadow-(--shadow-lift) lg:inline-flex",
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
                className="flex min-h-11 items-center gap-3 rounded-(--radius-control) px-1 font-sans text-small font-medium text-text lg:hidden"
              >
                Menu
                <span aria-hidden className="flex w-5 flex-col gap-[0.3125rem]">
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
