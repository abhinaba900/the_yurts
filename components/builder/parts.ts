/**
 * The parts of the structure that can be shown, hidden and pulled apart.
 *
 * Ordered outside-in, which is the order someone dismantling one would take
 * them off — so hiding them from the top of the list down reads as undressing
 * the building rather than deleting bits of a picture.
 *
 * Which meshes of the client's model belong to which part is in
 * `data/yurtModel.ts`; anything not claimed there is interior.
 */
export const PART_IDS = [
  "roofCover",
  "roofFrame",
  "wallCover",
  "doorsWindows",
  "interior",
  "floor",
] as const;

export type PartId = (typeof PART_IDS)[number];

export type Parts = Record<PartId, boolean>;

export const partLabels: Record<PartId, string> = {
  roofCover: "Roof cover & crown",
  roofFrame: "Roof poles",
  wallCover: "Wall cover",
  doorsWindows: "Doors & windows",
  interior: "Interior",
  floor: "Floor & deck",
};

export const allParts: Parts = {
  roofCover: true,
  roofFrame: true,
  wallCover: true,
  doorsWindows: true,
  interior: true,
  floor: true,
};

/** Everything seated in place. */
export const noOffsets: Record<PartId, number> = Object.fromEntries(
  PART_IDS.map((id) => [id, 0]),
) as Record<PartId, number>;
