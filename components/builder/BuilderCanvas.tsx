"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { OrbitControls, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SizedCanvas } from "@/components/three/SizedCanvas";
import * as THREE from "three";
import { MODEL_FLOOR_Y, modelFit, modelRadius, YurtModel } from "./YurtModel";
import { Metadata } from "@/components/primitives/Metadata";
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
 * The one download is the client's model itself: under 150KB for a shell, about
 * a megabyte for a fitted-out layout.
 * There is no HDR environment: lighting is four lights and a painted shadow,
 * and ACES tone mapping does the work an environment map would otherwise be
 * needed for, rolling the highlights off instead of clipping them to flat
 * white, which is most of what made the model read as plastic.
 *
 * ZOOM IS HELD BEHIND Ctrl (Cmd on a Mac). A canvas that eats the wheel traps
 * the page: the reader scrolls expecting to reach the options and the model
 * silently zooms instead. With the modifier, plain wheel scrolls the page as it
 * should and zoom is deliberate. The stage's own + and - buttons zoom without
 * it, and are what most people will use.
 *
 * VIEWS. The camera is moved by `CameraRig`, which eases it towards a goal and
 * renders only while it is moving: to a preset view (3D, plan, front), in or
 * out, or back out to frame a different size.
 */

/** A request to move the camera. `n` makes a repeated request a new one. */
export type ViewCommand = {
  kind: "reset" | "plan" | "front" | "zoomIn" | "zoomOut";
  n: number;
};

/** Camera distance from the target for the default view, in `modelFit`s. */
const FRAME = 3.3;
/** Default 3D view direction: front-right, a little above. */
const HOME = new THREE.Vector3(5.6, 3.0, 7.2).normalize();
const TARGET = new THREE.Vector3(0, 0.15, 0);

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
  interactive,
}: {
  spec: Spec;
  cutaway: boolean;
  parts: Parts;
  offsets: Record<PartId, number>;
  onDragPart: (id: PartId, delta: number) => void;
  interactive: boolean;
}) {
  const shadow = useShadowTexture();
  const radius = modelRadius(spec.size.size);

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
          position={[0, MODEL_FLOOR_Y - 0.02, 0]}
        >
          <planeGeometry args={[radius * 3.4, radius * 3.4]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} />
        </mesh>
      ) : null}

      <Suspense fallback={null}>
        <YurtModel
          spec={spec}
          cutaway={cutaway}
          parts={parts}
          offsets={offsets}
          onDragPart={onDragPart}
          interactive={interactive}
        />
      </Suspense>
    </>
  );
}

/**
 * Eases the camera to wherever it has been asked to go.
 *
 * Renders only while something is moving — on `frameloop="demand"` each frame
 * asks for the next until the camera arrives — and jumps straight there for
 * anyone who has asked for reduced motion. The turntable is the one thing that
 * keeps frames coming, and only while it is switched on.
 */
function CameraRig({
  fit,
  command,
  autoRotate,
  reducedMotion,
}: {
  fit: number;
  command: ViewCommand;
  autoRotate: boolean;
  reducedMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const invalidate = useThree((state) => state.invalidate);
  const goal = useRef<THREE.Vector3 | null>(null);
  const framed = useRef(fit);
  const handled = useRef(0);

  useEffect(() => {
    if (!controls) return;

    const direction = () =>
      camera.position.clone().sub(controls.target).normalize();

    const go = (position: THREE.Vector3) => {
      if (reducedMotion) {
        camera.position.copy(position);
        controls.update();
      } else {
        goal.current = position;
      }
      invalidate();
    };

    // A new size: same angle, framed to fit.
    if (framed.current !== fit) {
      framed.current = fit;
      go(TARGET.clone().add(direction().multiplyScalar(fit * FRAME)));
      return;
    }

    // Effects re-run for reasons of their own; a command is acted on once.
    if (command.n === handled.current) return;
    handled.current = command.n;
    const distance = camera.position.distanceTo(controls.target);

    switch (command.kind) {
      case "reset":
        go(TARGET.clone().add(HOME.clone().multiplyScalar(fit * FRAME)));
        break;
      case "plan":
        // Straight down, nudged off the pole so the controls keep their bearings.
        go(
          TARGET.clone().add(
            new THREE.Vector3(0, 1, 0.02).normalize().multiplyScalar(fit * 3.6),
          ),
        );
        break;
      case "front":
        go(
          TARGET.clone().add(
            new THREE.Vector3(0, 0.22, 1).normalize().multiplyScalar(fit * FRAME),
          ),
        );
        break;
      case "zoomIn":
      case "zoomOut": {
        const factor = command.kind === "zoomIn" ? 0.8 : 1.25;
        const next = THREE.MathUtils.clamp(
          distance * factor,
          controls.minDistance,
          controls.maxDistance,
        );
        go(controls.target.clone().add(direction().multiplyScalar(next)));
        break;
      }
    }
  }, [command, fit, controls, camera, invalidate, reducedMotion]);

  useEffect(() => {
    if (!controls) return;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    invalidate();
  }, [autoRotate, controls, invalidate]);

  useFrame((_, delta) => {
    if (!controls) return;
    if (goal.current) {
      camera.position.lerp(goal.current, 1 - Math.exp(-delta * 7));
      if (camera.position.distanceTo(goal.current) < 0.002) {
        camera.position.copy(goal.current);
        goal.current = null;
      }
      controls.update();
      invalidate();
    } else if (autoRotate) {
      controls.update();
      invalidate();
    }
  });

  return null;
}

/** Shown over the stage while a model downloads. */
function LoadingNote() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div className="flex flex-col items-center gap-3 rounded-full bg-surface/80 px-6 py-3 backdrop-blur-sm">
        <Metadata className="text-text">
          Loading the model · {Math.round(progress)}%
        </Metadata>
        <span className="block h-0.5 w-40 overflow-hidden rounded-full bg-line">
          <span
            className="block h-full bg-accent-text transition-[width] duration-(--duration-quick)"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </span>
      </div>
    </div>
  );
}

export function BuilderCanvas({
  spec,
  cutaway,
  parts,
  offsets,
  onDragPart,
  interactive,
  reducedMotion,
  command,
  autoRotate,
  onInteract,
}: {
  spec: Spec;
  cutaway: boolean;
  parts: Parts;
  offsets: Record<PartId, number>;
  onDragPart: (id: PartId, delta: number) => void;
  interactive: boolean;
  reducedMotion: boolean;
  command: ViewCommand;
  autoRotate: boolean;
  /** Called when the visitor starts moving the model themselves. */
  onInteract?: () => void;
}) {
  const fit = modelFit(spec.size.size);
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
    <div ref={wrapper} className="relative size-full">
    <LoadingNote />
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
      camera={{
        position: HOME.clone().multiplyScalar(fit * FRAME).add(TARGET).toArray(),
        fov: 38,
      }}
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
        interactive={interactive}
      />

      <CameraRig
        fit={fit}
        command={command}
        autoRotate={autoRotate}
        reducedMotion={reducedMotion}
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
        minDistance={fit * 1.2}
        maxDistance={fit * 5}
        // Down to straight overhead, for the plan view, and stops short of the
        // horizon so the model is never viewed from beneath.
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.08}
        target={TARGET.toArray()}
        onStart={onInteract}
      />
    </SizedCanvas>
    </div>
  );
}
