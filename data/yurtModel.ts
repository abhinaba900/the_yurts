/**
 * The client's yurts, as the 3D builder sees them.
 *
 * Two sizes, from the client's own SketchUp exports:
 *  - `public/models/yurt-6m/exterior.glb` and `yurt-10m/exterior.glb` are the
 *    6m and 10m shells, generated from "6M Yurt.glb" and "10M Yurt.glb" by
 *    `scripts/optimize-yurt-shells.mjs`.
 *  - `public/models/yurt-10m/layout-*.glb` are the 10m with its three fitted-out
 *    interiors, generated from "10m YURT WITH 3 INTERNAL OPTIONS" by
 *    `scripts/optimize-yurt-model.mjs`.
 *
 * Re-run those scripts, never edit the files by hand. The sources have no
 * meaningful object names, so meshes carry their SketchUp *material* names (or
 * the part name the script gave them), and the lists below say which is which.
 *
 * Names are as three.js reports them, which is the name with spaces and
 * brackets replaced (`[Wood Floor Parquet]` → `Wood_Floor_Parquet`). Anything
 * not listed is interior.
 */

export type YurtSizeId = "6m" | "10m";

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
  yurtSizes.find((size) => size.id === id) ?? yurtSizes[1];

/** Floor area in square metres, from the diameter. */
export const floorArea = (size: YurtSize) =>
  Math.round(Math.PI * (size.diameterM / 2) ** 2);

export type YurtLayout = {
  id: string;
  label: string;
  description: string;
  /** Model file per size. A layout without a file for a size is not offered. */
  files: Partial<Record<YurtSizeId, string>>;
};

export const EXTERIOR = "exterior";

export const yurtLayouts: YurtLayout[] = [
  {
    id: EXTERIOR,
    label: "Exterior only",
    description: "The shell, doors and windows — fit it out your way.",
    files: {
      "6m": "/models/yurt-6m/exterior.glb",
      "10m": "/models/yurt-10m/exterior.glb",
    },
  },
  {
    id: "layout-a",
    label: "Layout A",
    description: "A bedroom with its own bathroom, and a lounge.",
    files: { "10m": "/models/yurt-10m/layout-a.glb" },
  },
  {
    id: "layout-b",
    label: "Layout B",
    description: "Two bedrooms either side of a sitting room, with a shower room.",
    files: { "10m": "/models/yurt-10m/layout-b.glb" },
  },
  {
    id: "layout-c",
    label: "Layout C",
    description: "Open plan: kitchen, dining, lounge and sleeping.",
    files: { "10m": "/models/yurt-10m/layout-c.glb" },
  },
];

export const layoutById = (id: string | undefined): YurtLayout =>
  yurtLayouts.find((layout) => layout.id === id) ?? yurtLayouts[0];

/** The file to show for a size and layout, falling back to the exterior. */
export const modelFileFor = (size: string | undefined, layout: string | undefined) => {
  const sizeId = sizeById(size).id;
  return layoutById(layout).files[sizeId] ?? yurtLayouts[0].files[sizeId]!;
};

/** Every file the builder can show, for preloading. */
export const allModelFiles = [
  ...new Set(yurtLayouts.flatMap((layout) => Object.values(layout.files))),
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
