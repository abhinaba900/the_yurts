"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";

/**
 * A parametric yurt.
 *
 * Built from geometry rather than loaded from a model file, for two reasons:
 * there are no client 3D assets yet, and a yurt is genuinely parametric — the
 * lattice, poles and crown are all functions of radius and wall height, so
 * changing size rebuilds a correct structure rather than scaling a mesh.
 *
 * REPLACING THIS WITH CLIENT ASSETS: swap this component for a GLTF loader and
 * map `spec` onto the model's materials and morph targets. Everything outside
 * this file talks to the configurator through `RenderSpec`, so nothing else has
 * to change.
 *
 * CUTAWAY uses `thetaLength` on the cover geometries to open a wedge, revealing
 * the frame that is always modelled underneath. It is not a trick — the lattice
 * and roof poles are really there.
 */

const CROWN_RATIO = 0.19; // crown radius as a fraction of wall radius
const ROOF_RISE = 0.52; // roof height as a fraction of wall radius
const CUTAWAY_GAP = Math.PI * 0.42;

type Spec = Record<OptionGroupId, RenderSpec>;

/** Subtle woven bump for the cover. Generated once, in the browser. */
function useWeaveTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);

    // A plain weave: alternating light and dark threads in both directions.
    for (let i = 0; i < size; i += 4) {
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(i, 0, 2, size);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, i, size, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(18, 6);
    return texture;
  }, []);
}

export function YurtModel({ spec, cutaway }: { spec: Spec; cutaway: boolean }) {
  const weave = useWeaveTexture();

  const radius = spec.size.radius ?? 2;
  const wallHeight = spec.size.wallHeight ?? 1.2;
  const crownRadius = radius * CROWN_RATIO;
  const roofHeight = radius * ROOF_RISE;
  const roofTop = wallHeight + roofHeight;

  const exteriorColor = spec.exterior.color ?? "#d9d0bd";
  // "Matching" has no colour of its own and takes the wall's.
  const roofColor = spec.roof.color ?? exteriorColor;
  const floorColor = spec.flooring.color ?? "#8a6a4b";

  const coverTheta = cutaway ? Math.PI * 2 - CUTAWAY_GAP : Math.PI * 2;
  // Opens the wedge to the front-left, away from the door.
  const coverStart = cutaway ? CUTAWAY_GAP * 0.5 + Math.PI * 0.15 : 0;

  const poleCount = 16;
  const latticeCount = 22;
  const doorWidth = spec.doors.double ? radius * 0.42 : radius * 0.26;
  const doorHeight = wallHeight * 1.02;
  const windowCount = spec.windows.count ?? 0;

  /** Roof poles, from the wall head up to the crown. */
  const poles = useMemo(() => {
    const start = new THREE.Vector2(radius, wallHeight);
    const end = new THREE.Vector2(crownRadius, roofTop);
    const delta = end.clone().sub(start);
    const length = delta.length();
    const tilt = Math.atan2(delta.y, delta.x);
    const mid = start.clone().add(end).multiplyScalar(0.5);

    return Array.from({ length: poleCount }, (_, i) => ({
      angle: (i / poleCount) * Math.PI * 2,
      length,
      tilt,
      mid,
    }));
  }, [radius, wallHeight, crownRadius, roofTop]);

  /** Lattice struts — two opposing diagonals around the wall. */
  const lattice = useMemo(() => {
    const strutLength = wallHeight * 1.5;
    return Array.from({ length: latticeCount }, (_, i) => ({
      angle: (i / latticeCount) * Math.PI * 2,
      length: strutLength,
    }));
  }, [wallHeight]);

  const windows = useMemo(() => {
    if (windowCount === 0) return [];
    // Distributed around the back and sides, leaving the door face clear.
    return Array.from({ length: windowCount }, (_, i) => ({
      angle: Math.PI * 0.32 + ((i + 0.5) / windowCount) * Math.PI * 1.36,
    }));
  }, [windowCount]);

  return (
    <group position={[0, -wallHeight * 0.45, 0]}>
      {/* ---- Deck ---- */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[radius + 0.34, radius + 0.34, 0.12, 64]} />
        <meshStandardMaterial color={floorColor} roughness={spec.flooring.roughness ?? 0.8} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[radius + 0.33, radius + 0.33, 0.01, 64]} />
        <meshStandardMaterial color={floorColor} roughness={0.95} />
      </mesh>

      {/* ---- Frame (always modelled; revealed by the cutaway) ---- */}
      <group>
        {lattice.map((strut, i) => (
          <group key={`lattice-${i}`} rotation={[0, strut.angle, 0]}>
            {[1, -1].map((direction) => (
              <mesh
                key={direction}
                position={[0, wallHeight / 2, radius - 0.03]}
                rotation={[0, 0, direction * 0.62]}
              >
                <boxGeometry args={[0.022, strut.length, 0.022]} />
                <meshStandardMaterial color="#9a7550" roughness={0.72} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Tension band at the wall head */}
        <mesh position={[0, wallHeight - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.022, 8, 64]} />
          <meshStandardMaterial color="#7d5c3d" roughness={0.7} />
        </mesh>

        {poles.map((pole, i) => (
          <group key={`pole-${i}`} rotation={[0, pole.angle, 0]}>
            <mesh position={[pole.mid.x, pole.mid.y, 0]} rotation={[0, 0, pole.tilt]}>
              <boxGeometry args={[pole.length, 0.035, 0.035]} />
              <meshStandardMaterial color="#9a7550" roughness={0.72} />
            </mesh>
          </group>
        ))}

        {/* Crown wheel */}
        <mesh position={[0, roofTop, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[crownRadius, 0.05, 10, 40]} />
          <meshStandardMaterial color="#7d5c3d" roughness={0.65} />
        </mesh>
      </group>

      {/* ---- Cover ---- */}
      <mesh position={[0, wallHeight / 2, 0]} castShadow>
        <cylinderGeometry
          args={[radius, radius, wallHeight, 64, 1, true, coverStart, coverTheta]}
        />
        <meshStandardMaterial
          color={exteriorColor}
          roughness={spec.exterior.roughness ?? 0.92}
          side={THREE.DoubleSide}
          bumpMap={weave ?? undefined}
          bumpScale={0.012}
        />
      </mesh>

      <mesh position={[0, wallHeight + roofHeight / 2, 0]} castShadow>
        <cylinderGeometry
          args={[crownRadius, radius, roofHeight, 64, 1, true, coverStart, coverTheta]}
        />
        <meshStandardMaterial
          color={roofColor}
          roughness={spec.roof.roughness ?? 0.9}
          side={THREE.DoubleSide}
          bumpMap={weave ?? undefined}
          bumpScale={0.012}
        />
      </mesh>

      {/* ---- Door, on the front face ---- */}
      <group position={[0, 0, radius - 0.02]}>
        <mesh position={[0, doorHeight / 2, 0.02]}>
          <boxGeometry args={[doorWidth + 0.1, doorHeight + 0.08, 0.06]} />
          <meshStandardMaterial color="#6b5138" roughness={0.62} />
        </mesh>
        {(spec.doors.double ? [-1, 1] : [0]).map((side) => (
          <mesh
            key={side}
            position={[
              spec.doors.double ? (side * doorWidth) / 4 : 0,
              doorHeight / 2,
              0.06,
            ]}
          >
            <boxGeometry
              args={[
                spec.doors.double ? doorWidth / 2 - 0.02 : doorWidth,
                doorHeight - 0.06,
                0.03,
              ]}
            />
            <meshStandardMaterial
              color={spec.doors.glazed ? "#9fb0ae" : "#8a6a4b"}
              roughness={spec.doors.glazed ? 0.15 : 0.68}
              metalness={spec.doors.glazed ? 0.1 : 0}
              transparent={spec.doors.glazed}
              opacity={spec.doors.glazed ? 0.55 : 1}
            />
          </mesh>
        ))}
      </group>

      {/* ---- Windows ---- */}
      {windows.map((window, i) => (
        <group key={`window-${i}`} rotation={[0, window.angle, 0]}>
          <group position={[0, wallHeight * 0.58, radius - 0.01]}>
            <mesh>
              <torusGeometry args={[wallHeight * 0.2, 0.028, 8, 28]} />
              <meshStandardMaterial color="#6b5138" roughness={0.62} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <circleGeometry args={[wallHeight * 0.2, 28]} />
              <meshStandardMaterial
                color="#9fb0ae"
                roughness={0.12}
                metalness={0.15}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* ---- Interior ---- */}
      {spec.interior.furniture && spec.interior.furniture !== "none" ? (
        <Furniture
          radius={radius}
          full={spec.interior.furniture === "full"}
        />
      ) : null}
    </group>
  );
}

/**
 * Indicative interior. Blocked out rather than detailed — the fit-out is
 * specified per project, and modelling a specific bed would imply one is
 * included.
 */
function Furniture({ radius, full }: { radius: number; full: boolean }) {
  const scale = radius / 2;

  return (
    <group>
      {/* Bed */}
      <mesh position={[-radius * 0.42, 0.16 * scale, -radius * 0.3]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[1.25 * scale, 0.3 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
      </mesh>

      {/* Low table */}
      <mesh position={[radius * 0.3, 0.13 * scale, radius * 0.12]}>
        <cylinderGeometry args={[0.24 * scale, 0.24 * scale, 0.24 * scale, 24]} />
        <meshStandardMaterial color="#8a6a4b" roughness={0.7} />
      </mesh>

      {full ? (
        <>
          {/* Seating */}
          <mesh position={[radius * 0.42, 0.17 * scale, -radius * 0.34]} rotation={[0, -0.7, 0]}>
            <boxGeometry args={[0.85 * scale, 0.33 * scale, 0.55 * scale]} />
            <meshStandardMaterial color="#b9ae99" roughness={0.9} />
          </mesh>
          {/* Storage */}
          <mesh position={[-radius * 0.12, 0.22 * scale, radius * 0.5]}>
            <boxGeometry args={[0.75 * scale, 0.45 * scale, 0.35 * scale]} />
            <meshStandardMaterial color="#6b5138" roughness={0.68} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}
