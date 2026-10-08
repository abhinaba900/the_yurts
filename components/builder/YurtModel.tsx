"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SCENE_SCALE } from "@/data/configurator";
import { glazing } from "@/data/materials";
import {
  glassMeshes,
  layoutById,
  paintable,
  partMeshes,
  yurtLayouts,
} from "@/data/yurtModel";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";
import { PART_IDS, type PartId, type Parts } from "./parts";

/**
 * The client's 10m yurt.
 *
 * Loaded from the optimised files in `public/models/yurt-10m/` (see
 * `scripts/optimize-yurt-model.mjs`), one per layout, ~0.6–1.3MB each with
 * meshopt compression. drei's `useGLTF` decodes meshopt out of the box.
 *
 * PREPARING A LAYOUT happens once per file, on first load, and the result is
 * kept on the cached scene. It is deliberately cheap — anything heavy (normals,
 * simplification) is done by the optimiser, not on the visitor's main thread.
 *  - Every mesh gets its own material. Several pieces (wall cover, floor, roof
 *    frame) were cut out of one vertex-coloured SketchUp mesh and still share
 *    its material, and repainting the wall must not repaint the kitchen.
 *  - Meshes are regrouped by part, so each part can be hidden and moved as one.
 *
 * Only one layout is ever on screen, so the configurator mutates the cached
 * materials directly and remembers each one's original finish for "As
 * designed".
 *
 * PARTS. Each part carries its own offset along the axis it would actually come
 * off: covers and frames lift, the wall cover and the joinery push outwards
 * from the centre. The slider writes every offset at once; dragging a part
 * writes just that one.
 */

type Spec = Record<OptionGroupId, RenderSpec>;

/** The model's floor, in scene units, so the yurt sits centred in frame. */
export const MODEL_FLOOR_Y = -1.45;

/** Wall radius in scene units, for framing the camera and the shadow. */
export const MODEL_RADIUS = 5.05 * SCENE_SCALE;

type Original = {
  color: THREE.Color;
  vertexColors: boolean;
  roughness: number;
};

type Prepared = {
  parts: Record<PartId, THREE.Group>;
  /** Mesh name → meshes, for painting. */
  byName: Map<string, THREE.Mesh[]>;
};

const prepared = new WeakMap<THREE.Object3D, Prepared>();

const partOf = (name: string): PartId => {
  for (const id of PART_IDS) {
    const names = (partMeshes as Record<string, readonly string[]>)[id];
    if (names?.includes(name)) return id;
  }
  return "interior";
};

function prepare(scene: THREE.Object3D): Prepared {
  const cached = prepared.get(scene);
  if (cached) return cached;

  const parts = Object.fromEntries(
    PART_IDS.map((id) => [id, new THREE.Group()]),
  ) as Record<PartId, THREE.Group>;
  const byName = new Map<string, THREE.Mesh[]>();

  scene.updateMatrixWorld(true);
  const meshes: THREE.Mesh[] = [];
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) meshes.push(object as THREE.Mesh);
  });

  for (const mesh of meshes) {
    // Bake the node transform (it carries the quantisation scale) into the
    // mesh before it leaves its parent.
    mesh.matrixWorld.decompose(mesh.position, mesh.quaternion, mesh.scale);

    const source = mesh.material as THREE.MeshStandardMaterial;
    const material = glassMeshes.includes(mesh.name)
      ? new THREE.MeshStandardMaterial({
          color: glazing.clear.color,
          roughness: glazing.clear.roughness,
          metalness: glazing.clear.metalness,
          transparent: true,
          opacity: glazing.clear.opacity,
          depthWrite: false,
        })
      : source.clone();

    // SketchUp is careless about face winding; draw both sides.
    material.side = THREE.DoubleSide;
    material.userData.original = {
      color: material.color.clone(),
      vertexColors: material.vertexColors,
      roughness: material.roughness,
    } satisfies Original;
    mesh.material = material;

    parts[partOf(mesh.name)].add(mesh);
    byName.set(mesh.name, [...(byName.get(mesh.name) ?? []), mesh]);
  }

  const result = { parts, byName };
  prepared.set(scene, result);
  return result;
}

/** The colour a mesh shows as drawn — its material, or its first vertex. */
function drawnColour(mesh: THREE.Mesh): THREE.Color {
  const original = (mesh.material as THREE.Material).userData.original as Original;
  const colour = original.color.clone();
  const attribute = mesh.geometry.getAttribute("color");
  if (original.vertexColors && attribute) {
    colour.multiply(
      new THREE.Color(attribute.getX(0), attribute.getY(0), attribute.getZ(0)),
    );
  }
  return colour;
}

function paint(
  meshes: THREE.Mesh[],
  colour: THREE.Color | string | undefined,
  roughness: number | undefined,
) {
  for (const mesh of meshes) {
    const material = mesh.material as THREE.MeshStandardMaterial;
    const original = material.userData.original as Original;
    const vertexColors = colour ? false : original.vertexColors;

    if (material.vertexColors !== vertexColors) {
      material.vertexColors = vertexColors;
      material.needsUpdate = true;
    }
    material.color.set(colour ?? original.color);
    material.roughness = roughness ?? original.roughness;
  }
}

/* -------------------------------------------------------------------------- */
/* Dragging a part off by hand                                                */
/* -------------------------------------------------------------------------- */

type DragAxis = "lift" | "push";

/** Pixels of pointer travel per unit of offset. */
const DRAG_SCALE = 240;

const PART_AXIS: Record<PartId, DragAxis> = {
  roofCover: "lift",
  roofFrame: "lift",
  wallCover: "push",
  doorsWindows: "push",
  interior: "lift",
  floor: "lift",
};

/**
 * Pointer handlers that let one part be pulled off by hand.
 *
 * Orbit is disabled for the duration — otherwise the same drag both moves the
 * part and swings the camera, and the part appears to fight back. `controls` is
 * read at event time rather than captured, because OrbitControls registers
 * itself as the default some frames after this component first renders.
 */
function useDragHandlers(onDrag: (id: PartId, delta: number) => void) {
  const get = useThree((state) => state.get);

  return useMemo(() => {
    const handlers = (id: PartId) => {
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
        onDrag(id, (PART_AXIS[id] === "lift" ? -dy : dx) / DRAG_SCALE);
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
    };

    return Object.fromEntries(PART_IDS.map((id) => [id, handlers(id)])) as Record<
      PartId,
      ReturnType<typeof handlers>
    >;
  }, [onDrag, get]);
}

/** Where a part sits at a given offset, in model metres. */
function partTransform(id: PartId, offset: number) {
  switch (id) {
    case "roofCover":
      return { y: offset * 3.5, spread: 1 };
    case "roofFrame":
      return { y: offset * 2.2, spread: 1 };
    case "wallCover":
      return { y: 0, spread: 1 + offset * 0.35 };
    case "doorsWindows":
      return { y: 0, spread: 1 + offset * 0.6 };
    case "interior":
      return { y: offset * 1.2, spread: 1 };
    case "floor":
      return { y: -offset * 0.8, spread: 1 };
  }
}

/* -------------------------------------------------------------------------- */

export function YurtModel({
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
  /** Pointer handling is off unless the parts panel is open: raycasting a
   *  furnished interior on every mouse move is not free. */
  interactive: boolean;
}) {
  const layout = layoutById(spec.layout.layout);
  const { scene } = useGLTF(layout.file);
  const model = useMemo(() => prepare(scene), [scene]);
  const invalidate = useThree((state) => state.invalidate);
  const drag = useDragHandlers(onDragPart);

  // The other layouts are small; fetch them once this one is up, so switching
  // is instant rather than a blank stage.
  useEffect(() => {
    for (const other of yurtLayouts) useGLTF.preload(other.file);
  }, []);

  useLayoutEffect(() => {
    const meshesFor = (names: string[]) =>
      names.flatMap((name) => model.byName.get(name) ?? []);

    const wall = meshesFor(paintable.wall);
    paint(wall, spec.exterior.color, spec.exterior.roughness);

    const roofColour = spec.roof.matchWall
      ? (spec.exterior.color ?? (wall[0] ? drawnColour(wall[0]) : undefined))
      : spec.roof.color;
    paint(
      meshesFor(paintable.roof),
      roofColour,
      spec.roof.matchWall ? spec.exterior.roughness : spec.roof.roughness,
    );

    paint(meshesFor(paintable.floor), spec.flooring.color, spec.flooring.roughness);
    invalidate();
  }, [model, spec, invalidate]);

  return (
    <group scale={SCENE_SCALE} position={[0, MODEL_FLOOR_Y, 0]}>
      {PART_IDS.map((id) => {
        const { y, spread } = partTransform(id, offsets[id]);
        const visible = parts[id] && !(cutaway && id === "roofCover");

        return (
          <group
            key={id}
            visible={visible}
            position={[0, y, 0]}
            scale={[spread, 1, spread]}
            {...(interactive && visible ? drag[id] : {})}
          >
            <primitive object={model.parts[id]} />
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload(yurtLayouts[0].file);
