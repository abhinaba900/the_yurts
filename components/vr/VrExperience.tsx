"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { XR, createXRStore } from "@react-three/xr";
import { cn } from "@/lib/cn";
import { SizedCanvas } from "@/components/three/SizedCanvas";
import { Metadata } from "@/components/primitives/Metadata";
import { vrScenes, type VrScene } from "@/data/vr";
import { PanoramaViewer } from "./PanoramaViewer";

/**
 * The 360° experience.
 *
 * ACCESSIBILITY. The canvas itself is `aria-hidden` and the hotspots in it are
 * mouse targets, so every viewpoint is also a real button in the chrome below.
 * Nothing in this experience is reachable only by aiming at a ring in a
 * photograph.
 */

const store = createXRStore();

/** Converts a device orientation reading into our yaw/pitch convention. */
function useDeviceOrientation({
  active,
  onReading,
}: {
  active: boolean;
  onReading: (yaw: number, pitch: number) => void;
}) {
  useEffect(() => {
    if (!active) return;

    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const target = new THREE.Quaternion();
    const out = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    // −90° about X: device frame (screen up) into three.js frame (−Z forward).
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

    const handle = (event: DeviceOrientationEvent) => {
      if (event.alpha == null || event.beta == null || event.gamma == null) return;

      const alpha = THREE.MathUtils.degToRad(event.alpha);
      const beta = THREE.MathUtils.degToRad(event.beta);
      const gamma = THREE.MathUtils.degToRad(event.gamma);
      const orient = THREE.MathUtils.degToRad(
        typeof window.screen?.orientation?.angle === "number"
          ? window.screen.orientation.angle
          : 0,
      );

      euler.set(beta, alpha, -gamma, "YXZ");
      target.setFromEuler(euler);
      target.multiply(q1);
      target.multiply(q0.setFromAxisAngle(zee, -orient));

      out.setFromQuaternion(target, "YXZ");
      onReading(
        -THREE.MathUtils.radToDeg(out.y),
        THREE.MathUtils.radToDeg(out.x),
      );
    };

    window.addEventListener("deviceorientation", handle, true);
    return () => window.removeEventListener("deviceorientation", handle, true);
  }, [active, onReading]);
}

export function VrExperience() {
  const [sceneId, setSceneId] = useState(vrScenes[0].id);
  const [fullscreen, setFullscreen] = useState(false);
  const [motionActive, setMotionActive] = useState(false);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [xrSupported, setXrSupported] = useState(false);
  const [hasLooked, setHasLooked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);

  const scene = useMemo(
    () => vrScenes.find((item) => item.id === sceneId) ?? vrScenes[0],
    [sceneId],
  );

  const anyRealCapture = vrScenes.some((item) => Boolean(item.src));

  /* -- Capability detection ----------------------------------------------- */

  useEffect(() => {
    setMotionAvailable(
      typeof window !== "undefined" && "DeviceOrientationEvent" in window,
    );

    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    if (!xr?.isSessionSupported) return;
    xr.isSessionSupported("immersive-vr")
      .then(setXrSupported)
      .catch(() => setXrSupported(false));
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* -- Controls ------------------------------------------------------------ */

  const onReading = useCallback((yaw: number, pitch: number) => {
    yawRef.current = yaw;
    pitchRef.current = pitch;
  }, []);

  useDeviceOrientation({ active: motionActive, onReading });

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await element.requestFullscreen();
    } catch {
      // Refused (iOS Safari on iPhone has no element fullscreen). The button
      // simply does nothing rather than throwing.
    }
  };

  const toggleMotion = async () => {
    if (motionActive) {
      setMotionActive(false);
      return;
    }

    // iOS requires an explicit permission request, from a user gesture.
    const orientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<PermissionState>;
    };

    if (typeof orientationEvent?.requestPermission === "function") {
      try {
        const result = await orientationEvent.requestPermission();
        if (result !== "granted") return;
      } catch {
        return;
      }
    }

    setMotionActive(true);
  };

  const goToScene = (id: string) => {
    setSceneId(id);
    // Each viewpoint opens facing forward, so its composition reads as intended.
    yawRef.current = 0;
    pitchRef.current = 0;
  };

  const resetView = () => {
    yawRef.current = 0;
    pitchRef.current = 0;
  };

  const onInteract = useCallback(() => setHasLooked(true), []);

  return (
    <div>
      {/* ---- Stage ---- */}
      <div
        ref={containerRef}
        className="relative h-[64svh] w-full bg-walnut-deep landscape-split:h-[calc(100svh-4rem)] lg:h-[calc(100svh-6rem)]"
      >
        <SizedCanvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 0], fov: 72, near: 0.1, far: 1100 }}
          aria-hidden
        >
          <XR store={store}>
            <PanoramaViewer
              scene={scene}
              yawRef={yawRef}
              pitchRef={pitchRef}
              controlsEnabled={!motionActive}
              onSelectScene={goToScene}
              onInteract={onInteract}
            />
          </XR>
        </SizedCanvas>

        {/* Scene name */}
        <div className="pointer-events-none absolute inset-x-0 top-0 p-5">
          <div>
            <Metadata className="text-accent-text">{scene.label}</Metadata>
          </div>
        </div>

        {/* Drag prompt, until the visitor has worked it out for themselves */}
        {!hasLooked && !motionActive ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
            <span className="bg-walnut-deep/70 px-4 py-2 font-sans text-meta uppercase text-cream">
              Drag to look around
            </span>
          </div>
        ) : null}

        {/* Stage controls */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StageButton onClick={resetView}>Reset view</StageButton>
              {motionAvailable ? (
                <StageButton onClick={toggleMotion} pressed={motionActive}>
                  {motionActive ? "Motion on" : "Use device motion"}
                </StageButton>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {xrSupported ? (
                <StageButton onClick={() => store.enterVR()}>Enter VR</StageButton>
              ) : null}
              <StageButton onClick={toggleFullscreen} pressed={fullscreen}>
                {fullscreen ? "Exit fullscreen" : "Fullscreen"}
              </StageButton>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Viewpoints. The accessible route to everything above. ---- */}
      <div className="u-container py-(--spacing-block)">
        <div className="u-grid gap-y-10">
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <Metadata className="text-accent-text">Viewpoints</Metadata>
            <h2 className="mt-4 font-display text-display-md">
              Stand inside one.
            </h2>
            <p className="mt-5 u-measure font-sans text-body text-text-muted">
              Move between positions here or through the markers in the view.
              Drag to look around, scroll to zoom.
            </p>
            {!anyRealCapture ? (
              <p className="mt-5 u-measure font-sans text-small text-text-muted">
                The 360&deg; capture has not been shot yet, so each viewpoint
                shows a reference grid naming the image it is waiting for. The
                navigation, hotspots and controls are the real ones — only the
                photography is pending.
              </p>
            ) : null}
          </div>

          <nav
            aria-label="Viewpoints"
            className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6"
          >
            <ul>
              {vrScenes.map((item, i) => (
                <li key={item.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    onClick={() => goToScene(item.id)}
                    aria-current={item.id === scene.id ? "true" : undefined}
                    className="group flex w-full items-baseline gap-5 py-4 text-left"
                  >
                    <span
                      className={cn(
                        "font-sans text-meta uppercase transition-colors duration-(--duration-quick)",
                        item.id === scene.id ? "text-accent-text" : "text-text-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display text-display-sm transition-colors duration-(--duration-quick)",
                          item.id === scene.id ? "text-text" : "text-text-muted group-hover:text-text",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.note ? (
                        <span className="mt-1 block font-sans text-small text-text-muted">
                          {item.note}
                        </span>
                      ) : null}
                    </span>
                    {item.id === scene.id ? (
                      <span className="font-sans text-meta uppercase text-accent-text">
                        Viewing
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

function StageButton({
  children,
  onClick,
  pressed,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
