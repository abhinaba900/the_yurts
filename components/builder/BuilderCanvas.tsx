"use client";

import { useEffect, useMemo, useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SizedCanvas } from "@/components/three/SizedCanvas";
import * as THREE from "three";
import { YurtModel } from "./YurtModel";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";
import type { PartId, Parts } from "./parts";

/**
 * The 3D stage.
 *
 * `frameloop="demand"` is the important line: the scene renders when something
 * changes and is otherwise completely idle. A configurator that runs a render
 * loop at 60fps while the visitor reads the options is a battery drain with no
 * benefit — and this page sits on a marketing site, not in a game.
 *
 * There is no HDR environment and no external asset of any kind. Lighting is
 * four lights and a painted shadow, so the experience has nothing to download
 * beyond the code itself — and ACES tone mapping does the work an environment
 * map would otherwise be needed for, rolling the highlights off instead of
 * clipping them to flat white, which is most of what made the model read as
 * plastic.
 *
 * ZOOM IS HELD BEHIND Ctrl (Cmd on a Mac). A canvas that eats the wheel traps
 * the page: the reader scrolls expecting to reach the options and the model
 * silently zooms instead. With the modifier, plain wheel scrolls the page as it
 * should and zoom is deliberate.
 */

type Spec = Record<OptionGroupId, RenderSpec>;

/** Soft painted shadow under the structure. Cheaper than a shadow map. */
function useShadowTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.30)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.13)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }, []);
}

function Stage({
  spec,
  cutaway,
  parts,
  offsets,
  onDragPart,
}: {
  spec: Spec;
  cutaway: boolean;
  parts: Parts;
  offsets: Record<PartId, number>;
  onDragPart: (id: PartId, delta: number) => void;
}) {
  const shadow = useShadowTexture();
  const radius = spec.size.radius ?? 2;
  const wallHeight = spec.size.wallHeight ?? 1.2;

  return (
    <>
      {/* Warm daylight: sky off the canvas, bounce off the ground. */}
      <hemisphereLight args={["#efe9dc", "#6b5a45", 1.0]} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={1.9} color="#fff6e8" />
      <directionalLight position={[-5, 2.5, -3]} intensity={0.45} color="#cfd6e0" />
      {/* Rim from behind: separates the silhouette from the background and is
          the cheapest thing that stops a render looking like a diagram. */}
      <directionalLight position={[-2, 3.5, -6]} intensity={0.8} color="#ffe9c8" />

      {shadow ? (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -wallHeight * 0.45 - 0.07, 0]}
        >
          <planeGeometry args={[radius * 3.4, radius * 3.4]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} />
        </mesh>
      ) : null}

      <YurtModel
        spec={spec}
        cutaway={cutaway}
        parts={parts}
        offsets={offsets}
        onDragPart={onDragPart}
      />
    </>
  );
}

export function BuilderCanvas({
  spec,
  cutaway,
  parts,
  offsets,
  onDragPart,
  reducedMotion,
}: {
  spec: Spec;
  cutaway: boolean;
  parts: Parts;
  offsets: Record<PartId, number>;
  onDragPart: (id: PartId, delta: number) => void;
  reducedMotion: boolean;
}) {
  const radius = spec.size.radius ?? 2;
  const controls = useRef<OrbitControlsImpl>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  // Zoom only while Ctrl/Cmd is down.
  //
  // Set imperatively rather than through React state: the flag has to already
  // be correct when OrbitControls' own wheel handler runs, and a state update
  // would land a frame too late — the first notch of every gesture would be
  // lost. The listener is capture-phase on the wrapper so it runs first, and
  // non-passive so it can cancel the browser's own Ctrl+wheel page zoom.
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;

    const setZoom = (on: boolean) => {
      if (controls.current) controls.current.enableZoom = on;
    };

    const onWheel = (event: WheelEvent) => {
      const wants = event.ctrlKey || event.metaKey;
      setZoom(wants);
      if (wants) event.preventDefault();
    };

    // Releasing the key mid-gesture must not leave zoom armed.
    const onKey = (event: KeyboardEvent) => setZoom(event.ctrlKey || event.metaKey);

    setZoom(false);
    element.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", () => setZoom(false));

    return () => {
      element.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <div ref={wrapper} className="size-full">
    <SizedCanvas
      frameloop="demand"
      dpr={[1, 1.75]}
      // dpr is capped below 2: on a high-density laptop the difference between
      // 1.75x and 2x is invisible at this size and costs ~30% of the frame.
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      camera={{ position: [4.2, 2.4, 5.4], fov: 38 }}
      style={{ background: "transparent" }}
      // The canvas is decorative; every option is reachable through the panel.
      aria-hidden
    >
      <Stage
        spec={spec}
        cutaway={cutaway}
        parts={parts}
        offsets={offsets}
        onDragPart={onDragPart}
      />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        // Off from birth, not merely off once the effect below has run.
        // SizedCanvas defers mounting the Canvas until it has measured itself,
        // so the ref is still null on that first pass — leaving this to the
        // effect alone would let the very first wheel gesture zoom.
        enableZoom={false}
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
        minDistance={radius * 1.9}
        maxDistance={radius * 4.4}
        // Stops short of the horizon so the model is never viewed from beneath.
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI / 2 - 0.08}
        target={[0, 0.15, 0]}
      />
    </SizedCanvas>
    </div>
  );
}
