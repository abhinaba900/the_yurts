/**
 * The client's 10m yurt, as the 3D builder sees it.
 *
 * The files in `public/models/yurt-10m/` are generated from the client's
 * SketchUp export by `scripts/optimize-yurt-model.mjs` — re-run that, never
 * edit them by hand. The source has no meaningful object names, so the meshes
 * carry their SketchUp *material* names, and the lists below say which of those
 * materials is which part of the building.
 *
 * Names are as three.js reports them, which is the material name with spaces
 * and brackets replaced (`[Wood Floor Parquet]` → `Wood_Floor_Parquet`).
 * Anything not listed is interior.
 */

export const YURT_DIAMETER_MM = 10000;

export type YurtLayout = {
  id: string;
  label: string;
  description: string;
  file: string;
};

export const yurtLayouts: YurtLayout[] = [
  {
    id: "layout-a",
    label: "Layout A",
    description: "A bedroom with its own bathroom, and a lounge.",
    file: "/models/yurt-10m/layout-a.glb",
  },
  {
    id: "layout-b",
    label: "Layout B",
    description: "Two bedrooms either side of a sitting room, with a shower room.",
    file: "/models/yurt-10m/layout-b.glb",
  },
  {
    id: "layout-c",
    label: "Layout C",
    description: "Open plan: kitchen, dining, lounge and sleeping.",
    file: "/models/yurt-10m/layout-c.glb",
  },
  {
    id: "shell",
    label: "Shell only",
    description: "The structure, empty.",
    file: "/models/yurt-10m/shell.glb",
  },
];

export const layoutById = (id: string | undefined): YurtLayout =>
  yurtLayouts.find((layout) => layout.id === id) ?? yurtLayouts[0];

/** Meshes the configurator recolours. */
export const paintable = {
  /** Outer roof cover only — the white liner under it stays white. */
  roof: ["fabric_1"],
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
  roofCover: ["fabric_1", "fabric_03", "Translucent_Glass_Sky_Reflection2"],
  roofFrame: ["Roof_frame"],
  wallCover: paintable.wall,
  doorsWindows: ["Charcoal_Blue", "Charcoal_Blue1", "Glass"],
  floor: paintable.floor,
} as const;
