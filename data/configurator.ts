/**
 * 3D BUILDER — option definitions.
 *
 * A NOTE ON SIZES.
 *
 * Sizes used to be relative — Compact, Standard, Large, Grand — carrying no
 * dimensions, because publishing a figure the workshop had not confirmed is the
 * one thing this project must not do.
 *
 * The workshop has now confirmed them. The three sizes below are the real ones
 * from `data/specifications.ts`, and the scene draws them to scale: one scene
 * unit is 1.8m, so a 9600mm yurt really is 1.6× the radius of a 6000mm one, and
 * the 2700mm wall is the same height on all three exactly as the sheet says.
 *
 * Door and window *counts* are still offered freely here rather than being
 * locked to the Symmetry / Trinity / Bistro layouts. That is deliberate: this is
 * the toy that lets someone see what four windows looks like before they read
 * the layouts on /yurts. The finishes below are likewise plausible covers rather
 * than a published cover range, and the interface says so.
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
  | "joinery"
  | "windows"
  | "flooring"
  | "interior";

import { joineryFinishes } from "./materials";

/** Scene units per metre. One unit is 1.8m — see the note on sizes above. */
export const SCENE_SCALE = 1 / 1.8;

/** Millimetres to scene units. */
const mm = (value: number) => (value / 1000) * SCENE_SCALE;

export type RenderSpec = {
  /** Wall radius in scene units, drawn to scale. */
  radius?: number;
  wallHeight?: number;
  /**
   * Wall head to crown, in scene units.
   *
   * Carried per size rather than derived from the radius, because the sheet's
   * rise is not a constant fraction of it — 1150mm on a 6000mm shell is a
   * shallower roof than 2350mm on a 9600mm one. The model falls back to its own
   * ratio when this is absent, so nothing else has to set it.
   */
  roofRise?: number;
  color?: string;
  roughness?: number;
  /** Window or door count around the wall. */
  count?: number;
  glazed?: boolean;
  double?: boolean;
  furniture?: "none" | "minimal" | "full";
  /**
   * Door and window finish, from `data/materials.ts`.
   *
   * Three colours rather than one because a door drawn in a single flat tone
   * loses the shadow line between leaf and frame, and stops reading as a door.
   */
  frameColor?: string;
  panelColor?: string;
  revealColor?: string;
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
    note: "The three standard shells, drawn to scale. Other diameters are quoted per project.",
    options: [
      {
        id: "d6000",
        label: "6000mm Dia",
        description: "314 sq ft. A single room.",
        render: { radius: mm(3000), wallHeight: mm(2700), roofRise: mm(1150) },
      },
      {
        id: "d7200",
        label: "7200mm Dia",
        description: "452 sq ft. The common choice for guest accommodation.",
        render: { radius: mm(3600), wallHeight: mm(2700), roofRise: mm(1750) },
      },
      {
        id: "d9600",
        label: "9600mm Dia",
        description: "804 sq ft. Gatherings, dining and event use.",
        render: { radius: mm(4800), wallHeight: mm(2700), roofRise: mm(2350) },
      },
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
    id: "joinery",
    label: "Door & window finish",
    note: "The three finishes on the specification sheet, in their real colours.",
    options: joineryFinishes.map((finish) => ({
      id: finish.id,
      label: finish.label,
      render: {
        frameColor: finish.frame,
        panelColor: finish.panel,
        revealColor: finish.reveal,
        roughness: finish.roughness,
      },
    })),
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
