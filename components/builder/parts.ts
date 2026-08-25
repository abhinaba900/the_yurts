/**
 * The parts of the structure that can be shown, hidden and pulled apart.
 *
 * Ordered outside-in, which is the order someone dismantling one would take
 * them off — so hiding them from the top of the list down reads as undressing
 * the building rather than deleting bits of a picture.
 */
export const PART_IDS = [
  "roofCover",
  "wallCover",
  "roofFrame",
  "wallFrame",
  "door",
  "windows",
  "interior",
  "deck",
] as const;

export type PartId = (typeof PART_IDS)[number];

export type Parts = Record<PartId, boolean>;

export const partLabels: Record<PartId, string> = {
  roofCover: "Roof cover",
  wallCover: "Wall cover",
  roofFrame: "Roof poles & crown",
  wallFrame: "Lattice & tension band",
  door: "Door",
  windows: "Windows",
  interior: "Interior",
  deck: "Deck",
};

export const allParts: Parts = {
  roofCover: true,
  wallCover: true,
  roofFrame: true,
  wallFrame: true,
  door: true,
  windows: true,
  interior: true,
  deck: true,
};

/** Everything seated in place. */
export const noOffsets: Record<PartId, number> = Object.fromEntries(
  PART_IDS.map((id) => [id, 0]),
) as Record<PartId, number>;
