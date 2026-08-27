"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The Sketchfab stage: the viewer iframe, the chrome crop, and the controls
 * that replace the Sketchfab ones the crop removes.
 *
 * The viewer is initialised through Sketchfab's Viewer API rather than a plain
 * `src`, because the camera has to be drivable from here. `scrollwheel: 0`
 * stops a scroll over the stage being swallowed as zoom — the page scrolls
 * instead — and zoom is reached deliberately, by the buttons or by holding a
 * modifier and scrolling.
 */

const API_SRC = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";

/**
 * Pixels clipped off the top and bottom of the viewer, by pulling the iframe
 * out past its `overflow-hidden` box and making it correspondingly taller.
 * Clipped rather than covered, so nothing of theirs is left underneath to
 * click.
 *
 * TOP takes the title/author bar and its share button. BOTTOM takes the whole
 * lower strip in one cut — the Sketchfab logo at its left end, the annotation
 * pager in the middle, and the control row at its right end (help, settings,
 * model inspector, headset, fullscreen). Most of the `ui_*` options below ask
 * for the same thing, but Sketchfab only honours those for models owned by a
 * Pro account and this model is not ours, so the crop is what actually works.
 *
 * See the note in SketchfabEmbed about the credit this removes.
 */
const CHROME_CROP_TOP = 80;
const CHROME_CROP_BOTTOM = 76;

/** Multiplier applied to the eye-to-target distance by one zoom step. */
const ZOOM_STEP = 0.82;
/** How far in and out of the model's opening distance zoom may travel. */
const ZOOM_MIN = 0.08;
const ZOOM_MAX = 4;

type Camera = { position: number[]; target: number[] };

type ViewerApi = {
  start: () => void;
  addEventListener: (name: string, callback: () => void) => void;
  getCameraLookAt: (callback: (err: unknown, camera: Camera) => void) => void;
  setCameraLookAt: (
    eye: number[],
    target: number[],
    duration: number,
    callback?: (err: unknown) => void,
  ) => void;
};

type SketchfabClient = new (iframe: HTMLIFrameElement) => {
  init: (uid: string, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Sketchfab?: SketchfabClient;
  }
}

/** Loads the viewer API once per page, however many stages ask for it. */
let apiScript: Promise<void> | null = null;

function loadViewerApi(): Promise<void> {
  if (apiScript) return apiScript;
  apiScript = new Promise((resolve, reject) => {
    if (window.Sketchfab) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${API_SRC}"]`,
    );
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("viewer api")));
    if (!existing) {
      script.src = API_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return apiScript;
}

const distance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export function SketchfabStage({
  modelId,
  title,
}: {
  modelId: string;
  title: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ViewerApi | null>(null);
  /** The eye-to-target distance the model opened at, as the zoom clamp. */
  const baseDistance = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  /** True while a modifier is held: the wheel then zooms instead of scrolling. */
  const [zoomArmed, setZoomArmed] = useState(false);

  /* -- Viewer ------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    loadViewerApi()
      .then(() => {
        if (cancelled || !iframeRef.current || !window.Sketchfab) return;
        const client = new window.Sketchfab(iframeRef.current);
        client.init(modelId, {
          autostart: 1,
          preload: 1,
          ui_theme: "dark",
          navigation: "orbit",
          // The wheel belongs to the page, not the viewer.
          scrollwheel: 0,
          ui_annotations: 0,
          ui_vr: 0,
          ui_ar: 0,
          ui_help: 0,
          ui_inspector: 0,
          ui_infos: 0,
          ui_stop: 0,
          ui_watermark: 0,
          dnt: 1,
          success: (api: ViewerApi) => {
            if (cancelled) return;
            apiRef.current = api;
            api.start();
            api.addEventListener("viewerready", () => {
              if (cancelled) return;
              api.getCameraLookAt((err, camera) => {
                if (err || !camera) return;
                baseDistance.current = distance(camera.position, camera.target);
              });
              setReady(true);
            });
          },
          error: () => {
            // The stage keeps its own controls; they simply do nothing until
            // the viewer answers.
          },
        });
      })
      .catch(() => {
        // Script blocked or offline. Nothing to do but leave the stage empty.
      });

    return () => {
      cancelled = true;
    };
  }, [modelId]);

  /**
   * Moves the camera along its own sight line. A factor below 1 closes the
   * distance to the target, above 1 backs away from it.
   */
  const zoomBy = useCallback((factor: number) => {
    const api = apiRef.current;
    if (!api) return;

    api.getCameraLookAt((err, camera) => {
      if (err || !camera) return;

      const { position, target } = camera;
      const current = distance(position, target);
      if (current === 0) return;

      const base = baseDistance.current ?? current;
      const next = Math.min(
        Math.max(current * factor, base * ZOOM_MIN),
        base * ZOOM_MAX,
      );
      const scale = next / current;

      api.setCameraLookAt(
        [
          target[0] + (position[0] - target[0]) * scale,
          target[1] + (position[1] - target[1]) * scale,
          target[2] + (position[2] - target[2]) * scale,
        ],
        target,
        0,
      );
    });
  }, []);

  /* -- Modifier + wheel ---------------------------------------------------- */

  /**
   * A wheel event over a cross-origin iframe is delivered inside it and never
   * reaches this page, so the only way to read one is to be on top of the
   * iframe when it happens. The overlay therefore appears exactly while a
   * modifier is held and is gone the rest of the time, leaving plain scrolling
   * and dragging to fall through to the page and the viewer as usual.
   */
  useEffect(() => {
    const isModifier = (event: KeyboardEvent) =>
      event.key === "Control" || event.key === "Meta" || event.key === "Shift";

    const down = (event: KeyboardEvent) => {
      if (isModifier(event)) setZoomArmed(true);
    };
    const up = (event: KeyboardEvent) => {
      if (isModifier(event)) setZoomArmed(false);
    };
    // Leaving the window mid-hold would otherwise strand the overlay on.
    const clear = () => setZoomArmed(false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Registered by hand rather than through onWheel: React's wheel listener
    // is passive, and a passive listener may not preventDefault — which is
    // what stops the browser turning ctrl+wheel into a page zoom.
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) return;
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
    };

    overlay.addEventListener("wheel", onWheel, { passive: false });
    return () => overlay.removeEventListener("wheel", onWheel);
  }, [zoomArmed, zoomBy]);

  /* -- Fullscreen ---------------------------------------------------------- */

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    const element = frameRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await element.requestFullscreen();
    } catch {
      // Refused (iOS Safari on iPhone has no element fullscreen). The button
      // simply does nothing rather than throwing.
    }
  };

  return (
    <div
      ref={frameRef}
      className="relative h-[64svh] w-full overflow-hidden bg-walnut-deep landscape-split:h-[calc(100svh-4rem)] lg:h-[calc(100svh-6rem)]"
    >
      <iframe
        ref={iframeRef}
        title={title}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        className="absolute inset-x-0 w-full border-0"
        style={{
          top: `-${CHROME_CROP_TOP}px`,
          height: `calc(100% + ${CHROME_CROP_TOP + CHROME_CROP_BOTTOM}px)`,
        }}
      />

      {zoomArmed ? (
        <div
          ref={overlayRef}
          aria-hidden
          className="absolute inset-0 cursor-zoom-in"
        />
      ) : null}

      {/* Controls, in place of the Sketchfab row the crop removes. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans text-meta uppercase text-cream/60">
            {ready ? "Ctrl + scroll to zoom" : "Loading the model"}
          </span>

          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <StageButton onClick={() => zoomBy(ZOOM_STEP)} label="Zoom in">
              +
            </StageButton>
            <StageButton onClick={() => zoomBy(1 / ZOOM_STEP)} label="Zoom out">
              &minus;
            </StageButton>
            <StageButton onClick={toggleFullscreen} pressed={fullscreen}>
              {fullscreen ? "Exit fullscreen" : "Fullscreen"}
            </StageButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageButton({
  children,
  onClick,
  pressed,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...(pressed === undefined ? {} : { "aria-pressed": pressed })}
      className={cn(
        "border px-4 py-2 font-sans text-meta uppercase transition-colors duration-(--duration-quick)",
        pressed
          ? "border-gold bg-gold text-walnut-deep"
          : "border-cream/35 bg-walnut-deep/60 text-cream hover:border-cream/70",
      )}
    >
      {children}
    </button>
  );
}
