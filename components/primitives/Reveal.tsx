"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal, in CSS.
 *
 * Two implementations, both free of JavaScript animation code:
 *
 *   - Modern browsers use native scroll-driven animation, so the reveal is tied
 *     to scroll position and runs off the main thread. No observer at all.
 *   - Everything else gets an IntersectionObserver that adds one class, with the
 *     transition defined in base.css.
 *
 * Between them they replaced an animation library that cost 44kb gzipped on
 * every page of the site to move things 16px.
 *
 * The hidden state is gated behind `.js` on <html>, so with JavaScript disabled
 * every reveal simply renders visible rather than staying invisible forever.
 * Reduced motion is handled in CSS too — see the media query in base.css.
 */

type Kind = "up" | "media" | "fade";

export function Reveal({
  kind = "up",
  delay = 0,
  as: Tag = "div",
  className,
  children,
}: {
  kind?: Kind;
  /** Seconds, to match the previous API. */
  delay?: number;
  as?: "div" | "span" | "li" | "figure" | "p" | "article" | "section";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Where the browser can drive the reveal from scroll position itself, the
    // observer is dead weight — the CSS in base.css handles it, and it stays in
    // step with the scroll rather than firing once and running on its own clock.
    if (
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline: view()")
    ) {
      return;
    }

    // No observer support: show it and move on.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          // Fires once. Reveals must not replay on scroll-back.
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);

    // Backstop. Hiding content until an observer says otherwise means that if
    // the observer never fires — a browser quirk, an embedded webview, a
    // non-compositing tab — the page is permanently blank. In normal conditions
    // the callback runs immediately for anything on screen and this timer is
    // cleared long before it matters; when it does fire, content appears
    // slightly late instead of never.
    const backstop = window.setTimeout(() => setVisible(true), 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(backstop);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={kind}
      className={cn(visible && "is-visible", className)}
      style={delay ? ({ "--reveal-delay": `${delay * 1000}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals children in sequence. The stagger is a transition delay per child, so
 * it costs nothing at runtime.
 */
export function RevealGroup({
  amount = 0.06,
  className,
  children,
}: {
  amount?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} data-reveal-group style={{ "--reveal-step": `${amount * 1000}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

/** Child of RevealGroup. Its delay comes from its position. */
export function RevealItem({
  index = 0,
  as = "div",
  className,
  children,
}: {
  index?: number;
  as?: "div" | "span" | "li" | "figure" | "p";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as={as} kind="up" delay={index * 0.06} className={className}>
      {children}
    </Reveal>
  );
}
