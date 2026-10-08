/**
 * 3D BUILDER — option definitions.
 *
 * THE MODEL IS THE CLIENT'S. The builder shows the 10m yurt from the client's
 * own SketchUp drawing ("10m YURT WITH 3 INTERNAL OPTIONS"), split into its
 * three fitted-out layouts and the empty shell by
 * `scripts/optimize-yurt-model.mjs`. See `data/yurtModel.ts` for how the
 * model's meshes are mapped onto the groups below.
 *
 * So the panel offers only what that model can actually show: which layout,
 * and the colour of the wall cover, roof cover and floor. Size, door style and
 * window count are fixed in the drawing, and a control that changes nothing on
 * screen is worse than no control.
 *
 * Each colour group starts on "As designed", which leaves the client's own
 * finishes alone. The other colours are plausible covers rather than a
 * published cover range, and the interface says so.
 *
 * When the workshop confirms the real range, `configuratorOption` documents in
 * the CMS take over: they are matched to the entries below by `id` (the schema's
 * `assetKey`), which is how a CMS option knows what it looks like in 3D.
 *
 * `render` is the contract with the 3D scene. Nothing else in the app reads it.
 */

import { yurtLayouts } from "./yurtModel";

export type OptionGroupId = "layout" | "exterior" | "roof" | "flooring";

/** Scene units per metre. One unit is 1.8m, which the camera is framed for. */
export const SCENE_SCALE = 1 / 1.8;

export type RenderSpec = {
  /** Which layout file to show, from `data/yurtModel.ts`. */
  layout?: string;
  /** Repaint colour. Absent means "keep the model's own finish". */
  color?: string;
  roughness?: number;
  /** Roof only: take the wall cover's colour. */
  matchWall?: boolean;
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

const asDesigned: OptionDef = {
  id: "as-designed",
  label: "As designed",
  description: "The finish in the drawing.",
  render: {},
};

export const groups: GroupDef[] = [
  {
    id: "layout",
    label: "Interior layout",
    note: "One 10m yurt, three ways of fitting it out. Shown indicatively — the fit-out is specified per project.",
    options: yurtLayouts.map((layout) => ({
      id: layout.id,
      label: layout.label,
      description: layout.description,
      render: { layout: layout.id },
    })),
  },
  {
    id: "exterior",
    label: "Wall cover",
    options: [
      asDesigned,
      { id: "natural", label: "Natural canvas", render: { color: "#d9d0bd", roughness: 0.92 } },
      { id: "sand", label: "Sand", render: { color: "#c4b49a", roughness: 0.92 } },
      { id: "stone", label: "Stone", render: { color: "#9a958a", roughness: 0.9 } },
      { id: "charcoal", label: "Charcoal", render: { color: "#4a4741", roughness: 0.88 } },
    ],
  },
  {
    id: "roof",
    label: "Roof cover",
    options: [
      asDesigned,
      { id: "matching", label: "Matching", description: "The same cover over roof and wall.", render: { matchWall: true } },
      { id: "natural-roof", label: "Natural canvas", render: { color: "#ded5c2", roughness: 0.92 } },
      { id: "contrast", label: "Contrast", description: "A darker roof over a lighter wall.", render: { color: "#403c36", roughness: 0.88 } },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    note: "The main floor and deck. Bathroom tiles stay as drawn.",
    options: [
      asDesigned,
      { id: "timber", label: "Timber", render: { color: "#8a6a4b", roughness: 0.8 } },
      { id: "pale", label: "Pale timber", render: { color: "#b39875", roughness: 0.78 } },
      { id: "dark", label: "Dark timber", render: { color: "#5a4430", roughness: 0.78 } },
      { id: "stone-floor", label: "Stone", render: { color: "#8e8b83", roughness: 0.95 } },
    ],
  },
];

/** First option in each group is the default. */
export const defaultSelection: Record<OptionGroupId, string> = Object.fromEntries(
  groups.map((group) => [group.id, group.options[0].id]),
) as Record<OptionGroupId, string>;
