"use client";

import { useMemo } from "react";

import { OrbitControls } from "@react-three/drei";
import { SizedCanvas } from "@/components/three/SizedCanvas";
import * as THREE from "three";
import { YurtModel } from "./YurtModel";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";

/**
 * The 3D stage.
 *
 * `frameloop="demand"` is the important line: the scene renders when something
 * changes and is otherwise completely idle. A configurator that runs a render
 * loop at 60fps while the visitor reads the options is a battery drain with no
 * benefit — and this page sits on a marketing site, not in a game.
 *
 * There is no HDR environment and no external asset of any kind. Lighting is
 * three lights and a painted shadow, so the experience has nothing to download
 * beyond the code itself.
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

function Stage({ spec, cutaway }: { spec: Spec; cutaway: boolean }) {
  const shadow = useShadowTexture();
  const radius = spec.size.radius ?? 2;
  const wallHeight = spec.size.wallHeight ?? 1.2;

  return (
    <>
      {/* Warm daylight: sky off the canvas, bounce off the ground. */}
      <hemisphereLight args={["#efe9dc", "#6b5a45", 1.15]} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={1.75} color="#fff6e8" />
      <directionalLight position={[-5, 2.5, -3]} intensity={0.4} color="#cfd6e0" />

      {shadow ? (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -wallHeight * 0.45 - 0.07, 0]}
        >
          <planeGeometry args={[radius * 3.4, radius * 3.4]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} />
        </mesh>
      ) : null}

      <YurtModel spec={spec} cutaway={cutaway} />
    </>
  );
}

export function BuilderCanvas({
  spec,
  cutaway,
  reducedMotion,
}: {
  spec: Spec;
  cutaway: boolean;
  reducedMotion: boolean;
}) {
  const radius = spec.size.radius ?? 2;

  return (
    <SizedCanvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [4.2, 2.4, 5.4], fov: 38 }}
      style={{ background: "transparent" }}
      // The canvas is decorative; every option is reachable through the panel.
      aria-hidden
    >
      <Stage spec={spec} cutaway={cutaway} />

      <OrbitControls
        makeDefault
        enablePan={false}
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
  );
}
