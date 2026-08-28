"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { AudioToggle } from "./BackgroundAudio";

/**
 * Fullscreen navigation. A dark panel that wipes down, with the nav set at
 * display size — the same editorial treatment as a page, not a dropdown.
 *
 * The wipe and the stagger are CSS transitions with per-item delays. There is no
 * animation library involved: the panel mounts closed, opens on the next frame,
 * and unmounts after the transition has run.
 *
 * Handles scroll lock, Escape, focus into and back out of the panel, and a focus
 * trap so tabbing cannot reach the page behind it.
 */

const TRANSITION_MS = 900;

/** Keeps an element mounted long enough for its exit transition to finish. */
function useMountTransition(open: boolean, duration: number) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame, so the browser has a closed state to transition from.
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    setActive(false);
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration]);

  return { mounted, active };
}

export function MobileNav({
  open,
  onClose,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  /** Resolved from the CMS by the layout. Absent details are simply not shown. */
  contact?: { email: string | null; phone: string | null };
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { mounted, active } = useMountTransition(open, TRANSITION_MS);

  useEffect(() => {
    if (!open) return;

    // Where focus goes when the panel closes. Falls back to the control that
    // opens it — the active element is <body> when the panel is opened by
    // anything other than a real click, and focusing <body> is a no-op that
    // would strand focus inside the closing panel.
    const opener = document.activeElement as HTMLElement | null;
    returnFocusRef.current =
      opener && opener !== document.body
        ? opener
        : document.querySelector<HTMLElement>('[aria-controls="site-menu"]');

    // Lock scroll without the layout shifting as the scrollbar disappears.
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  /** Staggered entrance for each row. */
  const itemStyle = (index: number): React.CSSProperties => ({
    transitionDelay: active ? `${150 + index * 50}ms` : "0ms",
  });

  return (
    <div
      ref={panelRef}
      id="site-menu"
     
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={cn(
        "fixed inset-0 z-60 flex flex-col bg-surface text-text lg:hidden",
        "transition-[clip-path] duration-(--duration-slow) ease-(--ease-reveal)",
        "motion-reduce:transition-none",
        active ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
      )}
    >
      {/* Panel header — mirrors the site header exactly so nothing jumps. */}
      <div className="u-container shrink-0">
        <div className="flex h-20 items-center justify-between gap-8 md:h-24">
          <Wordmark />
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-3 py-2 font-sans text-meta uppercase text-text"
          >
            Close
            <span aria-hidden className="relative block size-4">
              <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="u-container flex flex-1 flex-col justify-center overflow-y-auto py-10"
      >
        <ul>
          {primaryNav.map((item, i) => (
            <li
              key={item.href}
              style={itemStyle(i)}
              className={cn(
                "border-t border-line transition-[opacity,transform]",
                "duration-(--duration-base) ease-(--ease-reveal)",
                "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
                active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              )}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-5 py-4"
              >
                <span className="font-sans text-meta uppercase text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-display-md leading-none">
                  {item.label}
                </span>
                {item.note ? (
                  <span className="ml-auto hidden font-sans text-meta uppercase text-text-muted sm:block">
                    {item.note}
                  </span>
                ) : null}
              </Link>

              {/* Secondary destinations, indented under their parent. */}
              {item.children ? (
                <ul className="mb-4 ml-10 flex flex-col gap-2.5 border-l border-line pl-5">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="flex items-baseline gap-3 font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-base) hover:text-text"
                      >
                        <span aria-hidden className="text-accent-text">
                          &rarr;
                        </span>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>

        <div
          style={itemStyle(primaryNav.length)}
          className={cn(
            "mt-10 border-t border-line pt-6 transition-[opacity,transform]",
            "duration-(--duration-base) ease-(--ease-reveal)",
            "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
            active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/enquire"
              onClick={onClose}
              className="group inline-flex items-baseline gap-3"
            >
              <span className="font-display text-display-md leading-none text-accent-text">
                Enquire
              </span>
              <span
                aria-hidden
                className="text-accent-text transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </Link>

            <AudioToggle />
          </div>

          {/* Contact details appear only once the client has supplied them. */}
          {contact?.email || contact?.phone ? (
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="font-sans text-small text-text-muted"
                >
                  {contact.email}
                </a>
              ) : null}
              {contact?.phone ? (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="font-sans text-small text-text-muted"
                >
                  {contact.phone}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
