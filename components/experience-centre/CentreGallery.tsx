"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Media } from "@/components/primitives/Media";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import { media, type MediaRatio } from "@/data/media";
import type { GalleryImage } from "@/data/experienceCentre";

/** Width-over-height per crop, to size the viewer image to the screen height. */
const ratioValue: Record<MediaRatio, number> = {
  portrait: 3 / 4,
  editorial: 4 / 5,
  landscape: 16 / 9,
  cinema: 21 / 9,
  panorama: 2.6,
  square: 1,
};

/**
 * The Experience Centre gallery: an editorial grid, and a full-screen viewer
 * that steps through every photograph.
 *
 * Layout: the first two images run wide, side by side; the rest sit three
 * across at 4:5. That holds at every count, so reordering or adding images in
 * data/experienceCentre.ts never leaves a broken row mid-grid. The viewer shows
 * each photograph at its own ratio, uncropped.
 *
 * The viewer follows the floor-plan viewer: a native <dialog> via showModal()
 * gives focus trapping, Escape and focus return for free. On top of that —
 * arrow keys and swipe to step, Home/End to jump, backdrop click to close, and
 * the caption announced politely as it changes.
 */
export function CentreGallery({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

  const open = useCallback((i: number) => {
    setOpenIdx(i);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (by: number) =>
      setOpenIdx((i) => (i === null ? i : (i + by + images.length) % images.length)),
    [images.length],
  );

  const isOpen = openIdx !== null;

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
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Home") setOpenIdx(0);
      else if (event.key === "End") setOpenIdx(images.length - 1);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      window.__lenis?.start();
    };
  }, [isOpen, step, images.length]);

  if (images.length === 0) return null;

  const active = openIdx === null ? null : images[openIdx];
  const activeRatio = active ? ratioValue[media[active.media].ratio] : 1;
  const counter = (i: number) =>
    `${String(i + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

  return (
    <>
      <ul className="u-grid gap-y-12 lg:gap-y-16">
        {images.map((image, i) => {
          const lead = i < 2;
          return (
            <Reveal
              key={image.media}
              as="li"
              kind="up"
              delay={(lead ? i : (i - 2) % 3) * 0.06}
              className={cn("col-span-4 md:col-span-3", lead ? "lg:col-span-6" : "lg:col-span-4")}
            >
              <button
                type="button"
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={`Open photograph ${i + 1} of ${images.length}: ${image.caption}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
              >
                <Media
                  id={image.media}
                  ratio={lead ? "landscape" : "editorial"}
                  sizes={
                    lead
                      ? "(min-width: 1024px) 48vw, (min-width: 768px) 50vw, 100vw"
                      : "(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw"
                  }
                  unoptimized={false}
                  quality={80}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-3 bottom-3 bg-surface/85 px-2.5 py-1.5 font-sans text-meta uppercase text-text",
                    "opacity-0 transition-opacity duration-(--duration-quick) ease-(--ease-out-soft)",
                    "group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  View +
                </span>
              </button>
              <div className="mt-4 flex items-baseline gap-4 border-t border-line pt-3">
                <span className="font-sans text-meta uppercase text-accent-text">
                  {image.category}
                </span>
                <p className="font-sans text-small text-text-muted">{image.caption}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenIdx(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        aria-labelledby="centre-gallery-caption"
        aria-roledescription="photo viewer"
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
            <div className="u-container shrink-0">
              <div className="flex h-20 items-center justify-between gap-8 border-b border-line md:h-24">
                <span className="font-sans text-meta uppercase text-text-muted">
                  Experience Centre · {counter(openIdx!)}
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

            <div
              className="u-container flex flex-1 flex-col justify-center py-6 md:py-10"
              onTouchStart={(event) => {
                touchStart.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                const end = event.changedTouches[0]?.clientX;
                touchStart.current = null;
                if (start === null || end === undefined) return;
                if (Math.abs(end - start) > 48) step(end < start ? 1 : -1);
              }}
            >
              <div
                className="mx-auto w-full"
                // Fit the whole photograph on screen: as wide as the height
                // left after the header and caption bar allows, at its ratio.
                style={{ maxWidth: `min(100%, calc((100dvh - 15rem) * ${activeRatio}))` }}
              >
                <Media
                  key={active.media}
                  id={active.media}
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="rounded-sm"
                  unoptimized={false}
                  quality={90}
                />
              </div>

              <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col gap-5 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div aria-live="polite">
                  <span className="font-sans text-meta uppercase text-accent-text">
                    {active.category}
                  </span>
                  <h2
                    id="centre-gallery-caption"
                    className="mt-1.5 font-display text-display-xs leading-tight text-text"
                  >
                    {active.caption}
                  </h2>
                </div>

                {images.length > 1 ? (
                  <div className="flex shrink-0 items-center gap-8">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photograph"
                      className="group/step inline-flex min-h-11 items-center gap-2.5 font-sans text-meta uppercase text-text transition-colors duration-300 hover:text-accent-text"
                    >
                      <span aria-hidden className="transition-transform duration-300 ease-(--ease-reveal) group-hover/step:-translate-x-1.5">
                        &larr;
                      </span>
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photograph"
                      className="group/step inline-flex min-h-11 items-center gap-2.5 font-sans text-meta uppercase text-text transition-colors duration-300 hover:text-accent-text"
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
        ) : null}
      </dialog>
    </>
  );
}
