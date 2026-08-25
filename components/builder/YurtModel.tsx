"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";
import type { PartId, Parts } from "./parts";

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
 * PERFORMANCE. The frame is the expensive part of a yurt: 44 lattice struts and
 * 16 roof poles would be 60 separate draw calls, on a page that also runs Lenis
 * and a video-weight hero. They are drawn as two `InstancedMesh` instead, so the
 * whole frame costs two. Textures are generated once into a 128px canvas rather
 * than downloaded, nothing here uses transmission or post-processing, and the
 * canvas renders on demand — the scene is completely idle while someone reads
 * the options.
 *
 * CUTAWAY uses `thetaLength` on the cover geometries to open a wedge, revealing
 * the frame that is always modelled underneath. It is not a trick — the lattice
 * and roof poles are really there.
 *
 * PARTS. Each part can be hidden, and each carries its own offset along the axis
 * it would actually come off: covers and frames lift, the door swings out from
 * the wall, windows push out along their own normals. The slider in the panel
 * writes every offset at once; dragging a part writes just that one. They are
 * the same number, so a part dragged by hand and a part pulled by the slider
 * cannot disagree about where it is.
 */

const CROWN_RATIO = 0.19; // crown radius as a fraction of wall radius
const ROOF_RISE = 0.52; // roof height as a fraction of wall radius
const CUTAWAY_GAP = Math.PI * 0.42;

const POLE_COUNT = 16;
const LATTICE_COUNT = 22;

type Spec = Record<OptionGroupId, RenderSpec>;

/* -------------------------------------------------------------------------- */
/* Generated textures                                                         */
/* -------------------------------------------------------------------------- */

function makeCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

/**
 * Woven canvas, as a normal map rather than a bump map.
 *
 * A normal map is the same cost to sample and gives the weave a direction to
 * catch the light from, which is most of the difference between "fabric" and
 * "beige plastic" at this distance.
 */
function useWeaveNormal() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = makeCanvas(size);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Flat normal: pointing straight out.
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, size, size);

    // Warp and weft, tilted off-normal in opposite directions so the threads
    // read as raised rather than merely lighter.
    for (let i = 0; i < size; i += 4) {
      ctx.fillStyle = "rgba(150,128,255,0.85)";
      ctx.fillRect(i, 0, 1, size);
      ctx.fillStyle = "rgba(110,128,255,0.85)";
      ctx.fillRect(i + 2, 0, 1, size);
      ctx.fillStyle = "rgba(128,150,255,0.55)";
      ctx.fillRect(0, i, size, 1);
      ctx.fillStyle = "rgba(128,110,255,0.55)";
      ctx.fillRect(0, i + 2, size, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 7);
    texture.anisotropy = 4;
    return texture;
  }, []);
}

/** Timber grain, used to break up the flat brown of the frame. */
function useGrainNormal() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = makeCanvas(size);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, size, size);

    // Long irregular fibres running the length of the strut.
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * size;
      const w = 0.6 + Math.random() * 1.6;
      const shade = 108 + Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgba(${shade},128,255,0.5)`;
      ctx.fillRect(x, 0, w, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 6);
    return texture;
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Instanced frame members                                                    */
/* -------------------------------------------------------------------------- */

type Placement = {
  position: [number, number, number];
  rotation: [number, number, number];
};

/**
 * One draw call for a whole set of identical timber members.
 *
 * The matrices are written imperatively, so the render has to be asked for —
 * `frameloop="demand"` will not notice a mutated instance buffer on its own.
 */
function InstancedTimber({
  placements,
  size,
  color,
  normalMap,
}: {
  placements: Placement[];
  size: [number, number, number];
  color: string;
  normalMap: THREE.Texture | null;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    placements.forEach((placement, i) => {
      dummy.position.set(...placement.position);
      dummy.rotation.set(...placement.rotation);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
  }, [placements, invalidate]);

  return (
    <instancedMesh
      ref={ref}
      // `key` forces a fresh buffer when the count changes; an InstancedMesh
      // cannot grow.
      key={placements.length}
      args={[undefined, undefined, placements.length]}
      castShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.68}
        metalness={0}
        normalMap={normalMap ?? undefined}
        normalScale={normalMap ? new THREE.Vector2(0.5, 0.5) : undefined}
      />
    </instancedMesh>
  );
}


/* -------------------------------------------------------------------------- */
/* Dragging a part off the structure                                          */
/* -------------------------------------------------------------------------- */

type DragAxis = "lift" | "push";

/** Screen pixels per unit of offset. Tuned so a part clears the body in a
 *  comfortable drag rather than flying off at a flick. */
const DRAG_SCALE = 240;

/**
 * Pointer handlers that let one part be pulled off by hand.
 *
 * Orbit is disabled for the duration — otherwise the same drag both moves the
 * part and swings the camera, and the part appears to fight back. `controls` is
 * read at event time rather than captured, because OrbitControls registers
 * itself as the default some frames after this component first renders.
 */
function useDragPart(
  id: PartId,
  axis: DragAxis,
  onDrag: (id: PartId, delta: number) => void,
) {
  const get = useThree((state) => state.get);

  return useMemo(() => {
    let lastX = 0;
    let lastY = 0;

    const setControls = (enabled: boolean) => {
      const controls = get().controls as { enabled?: boolean } | null;
      if (controls) controls.enabled = enabled;
    };

    const onPointerMove = (event: PointerEvent) => {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      onDrag(id, (axis === "lift" ? -dy : dx) / DRAG_SCALE);
    };

    const end = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      document.body.style.cursor = "";
      setControls(true);
    };

    return {
      onPointerDown: (event: { stopPropagation: () => void; nativeEvent: PointerEvent }) => {
        event.stopPropagation();
        lastX = event.nativeEvent.clientX;
        lastY = event.nativeEvent.clientY;
        setControls(false);
        document.body.style.cursor = "grabbing";
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
      },
      onPointerOver: (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
        document.body.style.cursor = "grab";
      },
      onPointerOut: () => {
        if (document.body.style.cursor === "grab") document.body.style.cursor = "";
      },
    };
  }, [id, axis, onDrag, get]);
}

/* -------------------------------------------------------------------------- */

export function YurtModel({
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
  const dragRoofCover = useDragPart("roofCover", "lift", onDragPart);
  const dragWallCover = useDragPart("wallCover", "lift", onDragPart);
  const dragRoofFrame = useDragPart("roofFrame", "lift", onDragPart);
  const dragWallFrame = useDragPart("wallFrame", "lift", onDragPart);
  const dragDeck = useDragPart("deck", "lift", onDragPart);
  const dragInterior = useDragPart("interior", "lift", onDragPart);
  const dragDoor = useDragPart("door", "push", onDragPart);
  const dragWindows = useDragPart("windows", "push", onDragPart);
  const weave = useWeaveNormal();
  const grain = useGrainNormal();

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

  const doorWidth = spec.doors.double ? radius * 0.42 : radius * 0.26;
  const doorHeight = wallHeight * 1.02;
  const windowCount = spec.windows.count ?? 0;

  // How far each part travels at offset = 1, in world units. Scaled off the
  // structure so a Grand yurt comes apart as far as a Compact one, relatively.
  const lift = radius * 0.55;
  const push = radius * 0.4;

  /** Roof poles, from the wall head up to the crown. */
  const poleGeometry = useMemo(() => {
    const start = new THREE.Vector2(radius, wallHeight);
    const end = new THREE.Vector2(crownRadius, roofTop);
    const delta = end.clone().sub(start);
    return {
      length: delta.length(),
      tilt: Math.atan2(delta.y, delta.x),
      mid: start.clone().add(end).multiplyScalar(0.5),
    };
  }, [radius, wallHeight, crownRadius, roofTop]);

  const polePlacements = useMemo<Placement[]>(() => {
    const { mid, tilt } = poleGeometry;
    return Array.from({ length: POLE_COUNT }, (_, i) => {
      const angle = (i / POLE_COUNT) * Math.PI * 2;
      // The pole is modelled lying along +X and tilted about Z, so its position
      // has to be the same +X point carried round by the same Y rotation:
      // three's rotateY sends (x,0,0) to (x·cos, 0, −x·sin). Placing it at
      // (sin, cos) instead — the convention the lattice uses, because those
      // struts are modelled along +Z — leaves every pole sitting a quarter turn
      // away from the direction it is pointing, which is why the roof read as a
      // tangle rather than a cone.
      return {
        position: [
          Math.cos(angle) * mid.x,
          mid.y,
          -Math.sin(angle) * mid.x,
        ] as [number, number, number],
        rotation: [0, angle, tilt] as [number, number, number],
      };
    });
  }, [poleGeometry]);

  /** Lattice struts — two opposing diagonals around the wall. */
  const latticePlacements = useMemo<Placement[]>(() => {
    const out: Placement[] = [];
    for (let i = 0; i < LATTICE_COUNT; i++) {
      const angle = (i / LATTICE_COUNT) * Math.PI * 2;
      const r = radius - 0.03;
      for (const direction of [1, -1]) {
        out.push({
          position: [Math.sin(angle) * r, wallHeight / 2, Math.cos(angle) * r],
          rotation: [0, angle, direction * 0.62],
        });
      }
    }
    return out;
  }, [radius, wallHeight]);

  const windows = useMemo(() => {
    if (windowCount === 0) return [];
    // Distributed around the back and sides, leaving the door face clear.
    return Array.from({ length: windowCount }, (_, i) => ({
      angle: Math.PI * 0.32 + ((i + 0.5) / windowCount) * Math.PI * 1.36,
    }));
  }, [windowCount]);

  const windowRadius = wallHeight * 0.2;

  return (
    <group position={[0, -wallHeight * 0.45, 0]}>
      {/* ---- Deck ---- */}
      {parts.deck ? (
        <group position={[0, -offsets.deck * lift * 0.5, 0]} {...dragDeck}>
          <mesh position={[0, -0.06, 0]} receiveShadow>
            <cylinderGeometry args={[radius + 0.34, radius + 0.34, 0.12, 64]} />
            <meshStandardMaterial
              color={floorColor}
              roughness={spec.flooring.roughness ?? 0.8}
              normalMap={grain ?? undefined}
              normalScale={grain ? new THREE.Vector2(0.35, 0.35) : undefined}
            />
          </mesh>
          <mesh position={[0, 0.005, 0]} receiveShadow>
            <cylinderGeometry args={[radius + 0.33, radius + 0.33, 0.01, 64]} />
            <meshStandardMaterial color={floorColor} roughness={0.95} />
          </mesh>
        </group>
      ) : null}

      {/* ---- Wall frame ---- */}
      {parts.wallFrame ? (
        <group position={[0, offsets.wallFrame * lift * 0.4, 0]} {...dragWallFrame}>
          <InstancedTimber
            placements={latticePlacements}
            size={[0.022, wallHeight * 1.5, 0.022]}
            color="#9a7550"
            normalMap={grain}
          />
          <mesh position={[0, wallHeight - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.022, 8, 64]} />
            <meshStandardMaterial color="#7d5c3d" roughness={0.7} />
          </mesh>
        </group>
      ) : null}

      {/* ---- Roof frame ---- */}
      {parts.roofFrame ? (
        <group position={[0, offsets.roofFrame * lift * 1.1, 0]} {...dragRoofFrame}>
          <InstancedTimber
            placements={polePlacements}
            size={[poleGeometry.length, 0.045, 0.028]}
            color="#9a7550"
            normalMap={grain}
          />
          <mesh position={[0, roofTop, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[crownRadius, 0.05, 10, 40]} />
            <meshStandardMaterial color="#7d5c3d" roughness={0.65} />
          </mesh>
          {/* Spokes across the crown — the detail the eye looks for first. */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI;
            return (
              <mesh
                key={i}
                position={[0, roofTop, 0]}
                rotation={[0, angle, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.012, 0.012, crownRadius * 2, 6]} />
                <meshStandardMaterial color="#7d5c3d" roughness={0.65} />
              </mesh>
            );
          })}
        </group>
      ) : null}

      {/* ---- Wall cover ---- */}
      {parts.wallCover ? (
        <mesh
          position={[0, wallHeight / 2 + offsets.wallCover * lift * 0.7, 0]}
          {...dragWallCover}
          castShadow
        >
          <cylinderGeometry
            args={[radius, radius, wallHeight, 64, 1, true, coverStart, coverTheta]}
          />
          <meshStandardMaterial
            color={exteriorColor}
            roughness={spec.exterior.roughness ?? 0.92}
            side={THREE.DoubleSide}
            normalMap={weave ?? undefined}
            normalScale={weave ? new THREE.Vector2(0.6, 0.6) : undefined}
          />
        </mesh>
      ) : null}

      {/* ---- Roof cover ---- */}
      {parts.roofCover ? (
        <mesh
          position={[0, wallHeight + roofHeight / 2 + offsets.roofCover * lift * 1.6, 0]}
          {...dragRoofCover}
          castShadow
        >
          <cylinderGeometry
            args={[crownRadius, radius, roofHeight, 64, 1, true, coverStart, coverTheta]}
          />
          <meshStandardMaterial
            color={roofColor}
            roughness={spec.roof.roughness ?? 0.9}
            side={THREE.DoubleSide}
            normalMap={weave ?? undefined}
            normalScale={weave ? new THREE.Vector2(0.6, 0.6) : undefined}
          />
        </mesh>
      ) : null}

      {/* ---- Door, on the front face ---- */}
      {parts.door ? (
        <group position={[0, 0, radius - 0.02 + offsets.door * push]} {...dragDoor}>
          <mesh position={[0, doorHeight / 2, 0.02]} castShadow>
            <boxGeometry args={[doorWidth + 0.1, doorHeight + 0.08, 0.06]} />
            <meshStandardMaterial
              color="#6b5138"
              roughness={0.62}
              normalMap={grain ?? undefined}
              normalScale={grain ? new THREE.Vector2(0.3, 0.3) : undefined}
            />
          </mesh>
          {(spec.doors.double ? [-1, 1] : [0]).map((side) => (
            <mesh
              key={side}
              castShadow
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
              {spec.doors.glazed ? (
                <Glass />
              ) : (
                <meshStandardMaterial
                  color="#8a6a4b"
                  roughness={0.68}
                  normalMap={grain ?? undefined}
                  normalScale={grain ? new THREE.Vector2(0.3, 0.3) : undefined}
                />
              )}
            </mesh>
          ))}
        </group>
      ) : null}

      {/* ---- Windows ---- */}
      {parts.windows
        ? windows.map((window, i) => (
            <group key={`window-${i}`} rotation={[0, window.angle, 0]}>
              <group
                position={[0, wallHeight * 0.58, radius - 0.01 + offsets.windows * push]}
                {...dragWindows}
              >
                {/* The opening behind the glass. Without something darker set
                    back from the wall the pane reads as a sticker; with it, the
                    eye reads depth and the window looks like a hole. */}
                <mesh position={[0, 0, -0.06]}>
                  <circleGeometry args={[windowRadius * 0.98, 24]} />
                  <meshBasicMaterial color="#241a13" side={THREE.DoubleSide} />
                </mesh>

                {/* Reveal: the thickness of the wall around the opening. */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}>
                  <cylinderGeometry
                    args={[windowRadius, windowRadius, 0.06, 24, 1, true]}
                  />
                  <meshStandardMaterial
                    color="#5f4a35"
                    roughness={0.8}
                    side={THREE.BackSide}
                  />
                </mesh>

                <mesh>
                  <torusGeometry args={[windowRadius, 0.028, 8, 28]} />
                  <meshStandardMaterial color="#6b5138" roughness={0.62} />
                </mesh>

                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[windowRadius, 28]} />
                  <Glass />
                </mesh>
              </group>
            </group>
          ))
        : null}

      {/* ---- Interior ---- */}
      {parts.interior &&
      spec.interior.furniture &&
      spec.interior.furniture !== "none" ? (
        <group position={[0, -offsets.interior * lift * 0.3, 0]} {...dragInterior}>
          <Furniture radius={radius} full={spec.interior.furniture === "full"} />
        </group>
      ) : null}
    </group>
  );
}

/**
 * Glazing.
 *
 * Deliberately not `transmission`: a physical transmissive material makes three
 * render the scene again into a buffer every frame, which is exactly the cost a
 * mid-range laptop cannot absorb for a decorative panel. A low-opacity pane with
 * a hard specular and almost no roughness reads as glass from any distance
 * anyone will view this from, and costs one blended draw.
 */
function Glass() {
  return (
    <meshStandardMaterial
      color="#b7c8c6"
      roughness={0.06}
      metalness={0.2}
      transparent
      opacity={0.34}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
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
      <mesh
        position={[-radius * 0.42, 0.16 * scale, -radius * 0.3]}
        rotation={[0, 0.4, 0]}
        castShadow
      >
        <boxGeometry args={[1.25 * scale, 0.3 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
      </mesh>

      {/* Low table */}
      <mesh position={[radius * 0.3, 0.13 * scale, radius * 0.12]} castShadow>
        <cylinderGeometry args={[0.24 * scale, 0.24 * scale, 0.24 * scale, 24]} />
        <meshStandardMaterial color="#8a6a4b" roughness={0.7} />
      </mesh>

      {full ? (
        <>
          {/* Seating */}
          <mesh
            position={[radius * 0.42, 0.17 * scale, -radius * 0.34]}
            rotation={[0, -0.7, 0]}
            castShadow
          >
            <boxGeometry args={[0.85 * scale, 0.33 * scale, 0.55 * scale]} />
            <meshStandardMaterial color="#b9ae99" roughness={0.9} />
          </mesh>
          {/* Storage */}
          <mesh position={[-radius * 0.12, 0.22 * scale, radius * 0.5]} castShadow>
            <boxGeometry args={[0.75 * scale, 0.45 * scale, 0.35 * scale]} />
            <meshStandardMaterial color="#6b5138" roughness={0.68} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}
