"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SCENE_SCALE } from "@/data/configurator";
import { glazing } from "@/data/materials";
import {
  allModelFiles,
  EXTERIOR,
  baseMeshes,
  floorMeshes,
  glassMeshes,
  layoutById,
  modelFilesFor,
  paintable,
  partMeshes,
  sizeById,
} from "@/data/yurtModel";
import type { OptionGroupId, RenderSpec } from "@/lib/configurator";
import { PART_IDS, type PartId, type Parts } from "./parts";

/**
 * The client's 6m, 7m and 10m yurts.
 *
 * Loaded from the optimised files in `public/models/` (see `data/yurtModel.ts`):
 * a shell per size, under 150KB each, and the Symmetry plan's fitted-out
 * interior per size, 0.5–1.3MB with meshopt compression, drawn inside that
 * size's shell. drei's
 * `useGLTF` decodes meshopt out of the box.
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
 * THE FLOOR is never repainted. Each size is drawn on flooring of its own —
 * herringbone parquet in the 10m, boards in the 6m, block parquet in the 7m,
 * with tiled bathrooms — and `scripts/optimize-yurt-*.mjs` keep those textures,
 * so the builder shows what the client drew. The deck underneath is the scene's
 * own, and is the one thing the flooring swatches colour.
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
export const modelRadius = (size: string | undefined) =>
  sizeById(size).radiusM * SCENE_SCALE;

/**
 * The top of the deck in scene units, relative to the stage floor — where the
 * painted shadow goes, so it lies on the decking rather than in the air above
 * it.
 */
export const deckTop = () => MODEL_FLOOR_Y + deckTopM() * SCENE_SCALE;

/**
 * Half the size of the yurt on its deck, in scene units — the radius of a
 * sphere that holds it. The camera is framed on this, so a tall narrow 6m and a
 * broad 10m both fill the stage.
 */
export const modelFit = (size: string | undefined) => {
  const { radiusM, heightM } = sizeById(size);
  return Math.hypot(radiusM + DECK_MARGIN, heightM / 2) * SCENE_SCALE;
};

/** How far the deck runs out past the wall, in metres. */
const DECK_MARGIN = 0.9;
/** Deck thickness in metres. The yurt stands on it, so it sits below y = 0. */
const DECK_DEPTH = 0.18;

/**
 * THE PLATFORM. The yurt stands on a ring the client draws below the floor,
 * which the shells keep as their "Base" part. Its outside face, below the
 * wall, is the band around the foot of the yurt, and the visitor colours it
 * themselves: see the "base" group in `data/configurator.ts`. The deck is laid
 * at the bottom of that ring, so the yurt stands on the deck rather than
 * hovering over it, and the ring's full height shows.
 *
 * ITS HEIGHT IS SET HERE, not taken from the drawings. Measured off the
 * exports the three rings are 220mm on the 6m, 99mm on the 7m and 492mm on the
 * 10m — not only different but out of order, the 7m shallower than the smaller
 * 6m, because each size was drawn on its own day. A step up onto a deck is
 * built the same whatever it carries, so all three are shown at one height.
 *
 * The ring is a plain vertical band with nothing on it, so it is scaled to
 * height about floor level rather than redrawn: `baseDepthM` on each size says
 * how deep that size's ring came out of the export, and the scale is the
 * ratio. The deck then sits at the same depth for every size.
 */
const BASE_HEIGHT = 0.22;

/** How far the ring stands proud of the wall above it, in metres. */
const BASE_REVEAL = 0.025;

/**
 * How far the ring sinks into the deck, in metres, so that the two meet with
 * no gap and no shared plane to flicker along.
 */
const BASE_BURY = 0.01;

/** Where the deck's top sits, in model metres below the floor. */
const deckTopM = () => -(BASE_HEIGHT - BASE_BURY);

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
      : // The base band is drawn flat, not lit; see `paintBase`.
        baseMeshes.includes(mesh.name)
        ? new THREE.MeshBasicMaterial()
        : source.clone();

    // SketchUp is careless about face winding; draw both sides.
    material.side = THREE.DoubleSide;
    material.userData.original = {
      color: material.color.clone(),
      vertexColors: material.vertexColors,
      // The unlit base has no roughness; it is never restored anyway, since
      // the band is always given a colour.
      roughness: (material as THREE.MeshStandardMaterial).roughness ?? 1,
    } satisfies Original;
    mesh.material = material;

    parts[partOf(mesh.name)].add(mesh);
    byName.set(mesh.name, [...(byName.get(mesh.name) ?? []), mesh]);
  }

  const result = { parts, byName };
  prepared.set(scene, result);
  return result;
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

type BaseStart = {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  /** The ring's outer radius as it came out of the export, in model metres. */
  radius: number;
};

/** The base ring's transform and size as loaded, taken once per mesh. */
function measureBase(mesh: THREE.Mesh): BaseStart {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox!;
  // The ring is a circle about the centre, so half its width is its radius.
  const radius = ((box.max.x - box.min.x) / 2) * mesh.scale.x;
  return {
    x: mesh.position.x,
    y: mesh.position.y,
    z: mesh.position.z,
    scaleX: mesh.scale.x,
    scaleY: mesh.scale.y,
    scaleZ: mesh.scale.z,
    radius,
  };
}

/**
 * The base band, which is drawn UNLIT: the colour set here is the colour on
 * screen, the same the whole way round.
 *
 * The band is one mesh in one colour, but the client builds it as two
 * surfaces — a flat top at floor level and an outer face below it. Lit, the
 * top takes the full key light and the face takes it edge-on, so one paint
 * comes out as two tones; on a band a few inches tall that reads as two
 * colours rather than as light, and shading it less only made the split
 * smaller, not gone. So the band is not lit at all. It is the one piece of the
 * yurt whose whole job is to show a colour the visitor picked.
 */
function paintBase(meshes: THREE.Mesh[], colour: string | undefined) {
  for (const mesh of meshes) {
    (mesh.material as THREE.MeshBasicMaterial).color.set(colour ?? "#989d9f");
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
  const size = sizeById(spec.size.size);
  const gltfs = useGLTF(modelFilesFor(size.id, layout.id));
  const models = useMemo(() => gltfs.map((gltf) => prepare(gltf.scene)), [gltfs]);
  const invalidate = useThree((state) => state.invalidate);
  const drag = useDragHandlers(onDragPart);

  // The other models are small; fetch them once this one is up, so switching
  // is instant rather than a blank stage.
  useEffect(() => {
    for (const file of allModelFiles) useGLTF.preload(file);
  }, []);

  const deckMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#8a6a4b", roughness: 0.8 }),
    [],
  );
  useEffect(() => () => deckMaterial.dispose(), [deckMaterial]);

  useLayoutEffect(() => {
    const meshesFor = (names: string[]) =>
      names.flatMap((name) => models.flatMap((model) => model.byName.get(name) ?? []));

    const wall = meshesFor(paintable.wall);
    paint(wall, spec.exterior.color, spec.exterior.roughness);

    paint(meshesFor(paintable.roof), spec.roof.color, spec.roof.roughness);

    // The floors are left as the client drew them — boards and bathroom tiles,
    // their own textures, different at every size. The band around the foot of
    // the wall and the deck under it each take a colour of their own: they are
    // different things, and tying them together hid the band whenever the two
    // were set alike.
    const base = meshesFor(baseMeshes);
    paintBase(base, spec.base.color);

    // Stand every size's ring at the same height, and the same little way
    // proud of the wall, both scaled about the centre of the floor. Set from
    // each mesh's own starting transform rather than compounded: `prepare`
    // hands back the same meshes every time the size changes.
    const stretch = BASE_HEIGHT / size.baseDepthM;
    for (const mesh of base) {
      const start = (mesh.userData.baseTransform ??= measureBase(mesh)) as BaseStart;
      const widen = (size.wallFootRadiusM + BASE_REVEAL) / start.radius;
      mesh.position.y = start.y * stretch;
      mesh.scale.y = start.scaleY * stretch;
      mesh.position.x = start.x * widen;
      mesh.position.z = start.z * widen;
      mesh.scale.x = start.scaleX * widen;
      mesh.scale.z = start.scaleZ * widen;
      mesh.updateMatrix();
    }
    deckMaterial.color.set(spec.flooring.color ?? "#8a6a4b");
    deckMaterial.roughness = spec.flooring.roughness ?? 0.8;

    // The shell has a floor of its own, for the bare "Exterior only". Fitted
    // out, the interior lays its own boards and bathroom tiles over the same
    // ground, so the shell's are hidden rather than left to fight them for the
    // pixels. Only the boards: the base ring is in the same part and has to
    // stay, because no interior draws one.
    const fitted = models.length > 1;
    for (const name of floorMeshes) {
      for (const mesh of models[0]?.byName.get(name) ?? []) mesh.visible = !fitted;
    }


    invalidate();
  }, [models, spec, invalidate, deckMaterial]);

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
            {models.map((model, i) => (
              <primitive key={i} object={model.parts[id]} />
            ))}
            {/* The floors stop at the wall and the base ring stands on
                nothing, so every yurt gets the same deck under it, laid at the
                bottom of the ring. */}
            {id === "floor" ? (
              <mesh
                material={deckMaterial}
                position={[0, deckTopM() - DECK_DEPTH / 2, 0]}
              >
                <cylinderGeometry
                  args={[
                    size.radiusM + DECK_MARGIN,
                    size.radiusM + DECK_MARGIN,
                    DECK_DEPTH,
                    96,
                  ]}
                />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload(modelFilesFor(undefined, EXTERIOR));
