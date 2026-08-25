/**
 * 3D BUILDER — option definitions.
 *
 * A NOTE ON SIZES.
 *
 * Sizes here are relative — Compact, Standard, Large, Grand — and carry no
 * dimensions. Publishing "5m diameter · 19.6 sq m · sleeps 4" would be inventing
 * a specification, which is the one thing this project must not do. The
 * configurator therefore lets someone explore proportions and finishes without
 * asserting a single figure Theyurts has not confirmed.
 *
 * The same applies to finishes: these are plausible options for a yurt, shown so
 * a visitor can say "that one" — not a published product range. The interface
 * states this plainly rather than burying it.
 *
 * When the workshop confirms the real range, `configuratorOption` documents in
 * the CMS take over: they are matched to the entries below by `id` (the schema's
 * `assetKey`), which is how a CMS option knows what it looks like in 3D.
 *
 * `render` is the contract with the 3D scene. Nothing else in the app reads it.
 */

export type OptionGroupId =
  | "size"
  | "exterior"
  | "roof"
  | "doors"
  | "windows"
  | "flooring"
  | "interior";

export type RenderSpec = {
  /** Wall radius in scene units. Relative proportion only — not a dimension. */
  radius?: number;
  wallHeight?: number;
  color?: string;
  roughness?: number;
  /** Window or door count around the wall. */
  count?: number;
  glazed?: boolean;
  double?: boolean;
  furniture?: "none" | "minimal" | "full";
};

export type OptionDef = {
  /** Stable key. Matches `assetKey` on a CMS configuratorOption. */
  id: string;
  label: string;
  description?: string;
  render: RenderSpec;
};

export type GroupDef = {
  id: OptionGroupId;
  label: string;
  note?: string;
  options: OptionDef[];
};

export const groups: GroupDef[] = [
  {
    id: "size",
    label: "Size",
    note: "Relative proportions. Exact diameters are confirmed with the workshop.",
    options: [
      { id: "compact", label: "Compact", description: "A single room.", render: { radius: 1.55, wallHeight: 1.05 } },
      { id: "standard", label: "Standard", description: "The common choice for guest accommodation.", render: { radius: 2, wallHeight: 1.2 } },
      { id: "large", label: "Large", description: "Room for a seating area as well as a bed.", render: { radius: 2.5, wallHeight: 1.32 } },
      { id: "grand", label: "Grand", description: "Gatherings, dining and event use.", render: { radius: 3.1, wallHeight: 1.45 } },
    ],
  },
  {
    id: "exterior",
    label: "Exterior",
    note: "The wall cover.",
    options: [
      { id: "natural", label: "Natural canvas", render: { color: "#d9d0bd", roughness: 0.92 } },
      { id: "sand", label: "Sand", render: { color: "#c4b49a", roughness: 0.92 } },
      { id: "stone", label: "Stone", render: { color: "#9a958a", roughness: 0.9 } },
      { id: "charcoal", label: "Charcoal", render: { color: "#4a4741", roughness: 0.88 } },
    ],
  },
  {
    id: "roof",
    label: "Roof",
    options: [
      { id: "matching", label: "Matching", description: "The same cover over roof and wall.", render: {} },
      { id: "natural-roof", label: "Natural canvas", render: { color: "#ded5c2", roughness: 0.92 } },
      { id: "contrast", label: "Contrast", description: "A darker roof over a lighter wall.", render: { color: "#403c36", roughness: 0.88 } },
    ],
  },
  {
    id: "doors",
    label: "Door",
    options: [
      { id: "single", label: "Single timber", render: { double: false, glazed: false } },
      { id: "double", label: "Double timber", render: { double: true, glazed: false } },
      { id: "glazed", label: "Glazed", description: "Glass in the upper panel.", render: { double: true, glazed: true } },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    note: "Positioned evenly around the wall.",
    options: [
      { id: "none", label: "None", render: { count: 0 } },
      { id: "two", label: "Two", render: { count: 2 } },
      { id: "four", label: "Four", render: { count: 4 } },
      { id: "six", label: "Six", render: { count: 6 } },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    options: [
      { id: "timber", label: "Timber deck", render: { color: "#8a6a4b", roughness: 0.8 } },
      { id: "pale", label: "Pale timber", render: { color: "#b39875", roughness: 0.78 } },
      { id: "dark", label: "Dark timber", render: { color: "#5a4430", roughness: 0.78 } },
      { id: "stone-floor", label: "Stone", render: { color: "#8e8b83", roughness: 0.95 } },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    note: "Shown indicatively — the fit-out is specified per project.",
    options: [
      { id: "empty", label: "Empty", description: "The structure alone.", render: { furniture: "none" } },
      { id: "minimal", label: "Minimal", description: "Bed and a low table.", render: { furniture: "minimal" } },
      { id: "furnished", label: "Furnished", description: "Bed, seating and storage.", render: { furniture: "full" } },
    ],
  },
];

/** First option in each group is the default. */
export const defaultSelection: Record<OptionGroupId, string> = Object.fromEntries(
  groups.map((group) => [group.id, group.options[0].id]),
) as Record<OptionGroupId, string>;
