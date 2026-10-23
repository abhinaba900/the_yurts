/**
 * The client's yurts, as the 3D builder sees them.
 *
 * Three sizes, from the client's own SketchUp exports:
 *  - `public/models/yurt-{6m,7m,10m}/exterior.glb` are the shells, generated
 *    from "6M Yurt.glb", "7M Yurt.glb" and "10M Yurt.glb" by
 *    `scripts/optimize-yurt-shells.mjs`.
 *  - `public/models/yurt-{6m,7m,10m}/symmetry.glb` are the Symmetry plan
 *    fitted out, the same standard at every size, without a shell of their
 *    own. Generated from "Symmetry interiors.glb" by
 *    `scripts/optimize-yurt-interiors.mjs`. The builder stands each inside its
 *    size's shell, so it has the same outside as every other yurt that size.
 *  - `public/models/yurt-10m/layout-*.glb` are the 10m's older fitted-out
 *    layouts, from `scripts/optimize-yurt-model.mjs`. None is listed below:
 *    the client asked for A and B to come out, and Symmetry replaced C.
 *
 * Re-run those scripts, never edit the files by hand. The sources have no
 * meaningful object names, so meshes carry their SketchUp *material* names (or
 * the part name the script gave them), and the lists below say which is which.
 *
 * Names are as three.js reports them, which is the name with spaces and
 * brackets replaced (`[Wood Floor Parquet]` → `Wood_Floor_Parquet`). Anything
 * not listed is interior.
 */

export type YurtSizeId = "6m" | "7m" | "10m";

export type YurtSize = {
  id: YurtSizeId;
  label: string;
  /** Diameter in feet, for the size cards. */
  feet: number;
  diameterM: number;
  /** Height to the top of the crown, in metres, from the model. */
  heightM: number;
  /** Wall radius in metres, for framing the camera and sizing the deck. */
  radiusM: number;
  description: string;
};

export const yurtSizes: YurtSize[] = [
  {
    id: "6m",
    label: "6m yurt",
    feet: 20,
    diameterM: 6,
    heightM: 5.1,
    radiusM: 3.0,
    description: "A bedroom-sized retreat, a studio or a treatment room.",
  },
  {
    id: "7m",
    label: "7m yurt",
    feet: 23,
    diameterM: 7,
    heightM: 5.1,
    radiusM: 3.5,
    description: "A roomier bedroom with an en-suite, or a small studio.",
  },
  {
    id: "10m",
    label: "10m yurt",
    feet: 32,
    diameterM: 10,
    heightM: 5.6,
    radiusM: 5.0,
    description: "A suite with a bathroom, a family stay or a gathering space.",
  },
];

export const sizeById = (id: string | undefined): YurtSize =>
  yurtSizes.find((size) => size.id === id) ??
  yurtSizes.find((size) => size.id === "10m")!;

/** Floor area in square metres, from the diameter. */
export const floorArea = (size: YurtSize) =>
  Math.round(Math.PI * (size.diameterM / 2) ** 2);

/**
 * The client's floor-plan drawings per size, for the builder's floor-plan
 * viewer. Made from the SketchUp exports by `scripts/prepare-plan-drawings.py`,
 * which puts every drawing in the same frame — wall centred, same scale, door
 * at the bottom — so flicking between them nothing jumps.
 *
 * They are numbered, not named: the client has not said which drawing is
 * which plan in `data/pricing.ts`.
 */
export const floorPlanDrawings: Record<YurtSizeId, string[]> = {
  "6m": [1, 2, 3, 4].map((n) => `/media/builder/plans/6m-${n}.webp`),
  "7m": [1, 2, 3, 4].map((n) => `/media/builder/plans/7m-${n}.webp`),
  "10m": [1, 2, 3, 4].map((n) => `/media/builder/plans/10m-${n}.webp`),
};

/** The shell every option of a size stands in. */
export const shellFiles: Record<YurtSizeId, string> = {
  "6m": "/models/yurt-6m/exterior.glb",
  "7m": "/models/yurt-7m/exterior.glb",
  "10m": "/models/yurt-10m/exterior.glb",
};

export type YurtLayout = {
  id: string;
  label: string;
  description: string;
  /** Interior per size, fitted inside that size's shell. Without one for a
   *  size, the layout shows the bare shell. */
  interiors: Partial<Record<YurtSizeId, string>>;
};

export const EXTERIOR = "exterior";

export const yurtLayouts: YurtLayout[] = [
  {
    id: EXTERIOR,
    label: "Exterior only",
    description: "The shell, doors and windows — fit it out your way.",
    interiors: {},
  },
  {
    id: "symmetry",
    label: "Symmetry",
    description: "Two bedrooms either side of a sitting room, each with a bathroom.",
    interiors: {
      "6m": "/models/yurt-6m/symmetry.glb",
      "7m": "/models/yurt-7m/symmetry.glb",
      "10m": "/models/yurt-10m/symmetry.glb",
    },
  },
];

export const layoutById = (id: string | undefined): YurtLayout =>
  yurtLayouts.find((layout) => layout.id === id) ?? yurtLayouts[0];

/** The files to show for a size and layout: its shell, and the interior if any. */
export const modelFilesFor = (size: string | undefined, layout: string | undefined) => {
  const sizeId = sizeById(size).id;
  const interior = layoutById(layout).interiors[sizeId];
  return interior ? [shellFiles[sizeId], interior] : [shellFiles[sizeId]];
};

/** Every file the builder can show, for preloading. */
export const allModelFiles = [
  ...Object.values(shellFiles),
  ...yurtLayouts.flatMap((layout) => Object.values(layout.interiors)),
] as string[];

/** Meshes the configurator recolours. */
export const paintable = {
  /** Outer roof cover and valance — the white liner under it stays white. */
  roof: ["Roof_cover", "fabric_1"],
  wall: ["Wall_cover", "fabric_2", "0042_Sienna"],
  floor: [
    "Floor",
    "Wood_Floor_Parquet",
    "Ornate_Tile_01",
    "Basic_Tile1",
    "Encaustic_Tile_Circular_02",
  ],
};

/** Drawn as glass rather than with the model's flat colour. */
export const glassMeshes = ["Glass"];

/** Mesh → part, for showing, hiding and pulling apart. */
export const partMeshes = {
  roofCover: [
    "Roof_cover",
    "fabric_1",
    "fabric_03",
    "Translucent_Glass_Sky_Reflection2",
  ],
  roofFrame: ["Roof_frame"],
  wallCover: paintable.wall,
  doorsWindows: ["Charcoal_Blue", "Charcoal_Blue1", "Glass", "Joinery"],
  floor: paintable.floor,
} as const;
