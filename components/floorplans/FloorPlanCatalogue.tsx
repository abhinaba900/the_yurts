"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Media } from "@/components/primitives/Media";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import { floorPlanSizeLabel, type FloorPlan } from "@/data/floorPlans";

/**
 * The floor-plan catalogue: a grid of drawings, and a full-screen viewer for
 * one of them at a time.
 *
 * Drawings are shown whole (object-contain on a square) — a plan with its edge
 * cropped off is a wrong plan, not a tighter composition.
 *
 * The viewer is a native <dialog> opened with showModal(), so the browser
 * supplies the focus trap, Escape, the inert page behind it and the return of
 * focus to the card that opened it. On top of that: backdrop click to close,
 * arrow keys to step between plans, and Lenis paused so the page underneath
 * does not scroll.
 */
export function FloorPlanCatalogue({ plans }: { plans: FloorPlan[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const open = useCallback((i: number) => {
    setOpenIdx(i);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (by: number) =>
      setOpenIdx((i) => (i === null ? i : (i + by + plans.length) % plans.length)),
    [plans.length],
  );

  const isOpen = openIdx !== null;

  // Scroll lock while the viewer is open, without the layout shifting as the
  // scrollbar disappears.
  useEffect(() => {
    if (!isOpen) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    window.__lenis?.stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      window.__lenis?.start();
    };
  }, [isOpen, step]);

  const active = openIdx === null ? null : plans[openIdx];

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
        {plans.map((plan, i) => (
          <Reveal key={plan.slug} as="li" kind="up" delay={(i % 3) * 0.06}>
            <article className="group">
              <button
                type="button"
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={`View ${plan.name} floor plan larger`}
                className="relative block w-full cursor-zoom-in bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
              >
                <Media
                  id={plan.media}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  imgClassName="object-contain p-4 sm:p-6"
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-3 bottom-3 bg-surface/85 px-2.5 py-1.5 font-sans text-meta uppercase text-text",
                    "opacity-0 transition-opacity duration-(--duration-quick) ease-(--ease-out-soft)",
                    "group-hover:opacity-100 group-focus-within:opacity-100",
                  )}
                >
                  View plan +
                </span>
              </button>

              <div className="mt-5 border-t border-line pt-4">
                <p className="font-sans text-meta uppercase text-accent-text">
                  {plan.application}
                </p>
                <h3 className="mt-2 font-display text-display-sm leading-tight text-text">
                  {plan.name}
                </h3>
                {plan.sizes.length > 0 ? (
                  <p className="mt-2 font-sans text-meta uppercase text-text-muted">
                    {plan.sizes.map(floorPlanSizeLabel).join(" / ")}
                  </p>
                ) : null}
                <p className="mt-3 u-measure font-sans text-body leading-relaxed text-text-muted">
                  {plan.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenIdx(null)}
        // A click that lands on the dialog element itself is on the backdrop
        // area around the panel, not on anything inside it.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        aria-labelledby="floor-plan-viewer-title"
        data-lenis-prevent
        className={cn(
          "m-0 h-dvh max-h-none w-full max-w-none bg-surface text-text",
          "backdrop:bg-black/60",
          "transition-opacity duration-(--duration-base) ease-(--ease-reveal) starting:open:opacity-0",
          "motion-reduce:transition-none",
        )}
      >
        {active ? (
          <div className="flex min-h-full flex-col">
            {/* Header — same height and Close control as the mobile menu. */}
            <div className="u-container shrink-0">
              <div className="flex h-20 items-center justify-between gap-8 border-b border-line md:h-24">
                <span className="font-sans text-meta uppercase text-text-muted">
                  Floor plan {String(openIdx! + 1).padStart(2, "0")} /{" "}
                  {String(plans.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
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

            <div className="u-container flex-1 py-8 md:py-12">
              <div className="u-grid items-center gap-y-8">
                <div className="col-span-4 md:col-span-6 lg:col-span-7">
                  <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-14rem))] bg-surface-alt">
                    <Media
                      key={active.slug}
                      id={active.media}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      imgClassName="object-contain p-4 sm:p-8"
                    />
                  </div>
                </div>

                <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9">
                  <p className="font-sans text-meta uppercase text-accent-text">
                    {active.application}
                  </p>
                  <h2
                    id="floor-plan-viewer-title"
                    className="mt-3 font-display text-display-md leading-tight u-optical-left"
                  >
                    {active.name}
                  </h2>
                  <p className="mt-5 u-measure font-sans text-body leading-relaxed text-text-muted">
                    {active.description}
                  </p>

                  {active.sizes.length > 0 ? (
                    <dl className="mt-8 border-t border-line pt-4">
                      <dt className="font-sans text-meta uppercase text-text-muted">
                        Drawn for
                      </dt>
                      {active.sizes.map((size) => (
                        <dd key={size} className="mt-1.5 font-sans text-body text-text">
                          {floorPlanSizeLabel(size)}
                        </dd>
                      ))}
                    </dl>
                  ) : null}

                  {plans.length > 1 ? (
                    <div className="mt-10 flex items-center gap-8 border-t border-line pt-5">
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        className="group/step inline-flex items-center gap-2.5 py-1.5 font-sans text-meta uppercase text-text transition-colors duration-300 hover:text-accent-text"
                      >
                        <span aria-hidden className="transition-transform duration-300 ease-(--ease-reveal) group-hover/step:-translate-x-1.5">
                          &larr;
                        </span>
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        className="group/step inline-flex items-center gap-2.5 py-1.5 font-sans text-meta uppercase text-text transition-colors duration-300 hover:text-accent-text"
                      >
                        Next
                        <span aria-hidden className="transition-transform duration-300 ease-(--ease-reveal) group-hover/step:translate-x-1.5">
                          &rarr;
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
