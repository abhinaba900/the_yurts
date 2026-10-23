/**
 * 3D BUILDER — option definitions.
 *
 * THE MODELS ARE THE CLIENT'S. The builder shows the 6m, 7m and 10m yurts from
 * the client's own SketchUp drawings, and the Symmetry plan fitted out at each
 * size. See
 * `data/yurtModel.ts` for the files and how their meshes are mapped onto the
 * groups below.
 *
 * The groups here are what the 3D scene shows: the size, the plan (Symmetry is
 * drawn fitted out; every other plan as a shell), the roof and wall
 * cover colours and the deck, plus the two accessories. Doors, windows and
 * every price live in `data/pricing.ts` and `lib/quote.ts`, because they drive
 * the quote rather than the model.
 *
 * The cover colours are a typical architectural-PVC range rather than a
 * confirmed one, and the interface says the colours are indicative.
 *
 * When the workshop confirms the real range, `configuratorOption` documents in
 * the CMS take over: they are matched to the entries below by `id` (the schema's
 * `assetKey`), which is how a CMS option knows what it looks like in 3D.
 *
 * `render` is the contract with the 3D scene. Nothing else in the app reads it,
 * except the panel, which uses `color` for the swatch.
 */

import { EXTERIOR, yurtSizes, type YurtSizeId } from "./yurtModel";
import { CUSTOM_PLAN, plans } from "./pricing";

export type OptionGroupId =
  | "size"
  | "layout"
  | "roof"
  | "exterior"
  | "flooring"
  | "opener"
  | "blinds";

/** Scene units per metre. One unit is 1.8m, which the camera is framed for. */
export const SCENE_SCALE = 1 / 1.8;

export type RenderSpec = {
  /** Which size to show, from `data/yurtModel.ts`. */
  size?: YurtSizeId;
  /** Which layout to show, from `data/yurtModel.ts`. */
  layout?: string;
  /** Repaint colour. Absent means "keep the model's own finish". */
  color?: string;
  roughness?: number;
};

export type OptionDef = {
  /** Stable key. Matches `assetKey` on a CMS configuratorOption. */
  id: string;
  label: string;
  description?: string;
  /** Only offered for these sizes. Absent means every size. */
  sizes?: YurtSizeId[];
  render: RenderSpec;
};

export type GroupDef = {
  id: OptionGroupId;
  label: string;
  note?: string;
  /** Selected when nothing else is. Falls back to the first option. */
  defaultOption?: string;
  options: OptionDef[];
};

/**
 * Cover colours, in the order they are laid out in the swatch grid: warm
 * neutrals, reds, yellows, greens, blues, greys.
 */
const COVER_COLOURS: [id: string, label: string, hex: string][] = [
  ["champagne", "Champagne", "#f0e0c6"],
  ["peach", "Peach", "#dcb98f"],
  ["antelope", "Antelope", "#a78256"],
  ["hemp", "Hemp", "#aca18d"],
  ["pepper", "Pepper", "#7c755d"],
  ["rust", "Rust", "#874637"],
  ["burgundy", "Burgundy", "#502a2f"],
  ["raspberry", "Raspberry", "#8e3139"],
  ["poppy", "Poppy", "#7c1d19"],
  ["orange", "Orange", "#ce6f2b"],
  ["buttercup", "Buttercup", "#f5c74d"],
  ["lemon", "Lemon", "#e1cd6e"],
  ["tin-green", "Tin green", "#a3a99b"],
  ["spring-green", "Spring green", "#6c8367"],
  ["garden-green", "Garden green", "#416e45"],
  ["tennis-green", "Tennis green", "#274b47"],
  ["porcelain-green", "Porcelain green", "#366464"],
  ["peacock-blue", "Peacock blue", "#274b57"],
  ["alpine-blue", "Alpine blue", "#7288af"],
  ["lagoon", "Lagoon", "#41688f"],
  ["victoria-blue", "Victoria blue", "#28427f"],
  ["midnight-blue", "Midnight blue", "#1f3157"],
  ["revival-blue", "Revival blue", "#48576c"],
  ["marine", "Marine", "#252a47"],
  ["white", "White", "#ffffff"],
  ["boulder", "Boulder", "#989d9f"],
  ["concrete", "Concrete", "#595f66"],
  ["black", "Black", "#1b1b1a"],
];

const coverOptions = (roughness: number): OptionDef[] =>
  COVER_COLOURS.map(([id, label, hex]) => ({
    id,
    label,
    render: { color: hex, roughness },
  }));

const addOn = (description: string): OptionDef[] => [
  { id: "none", label: "Not needed", render: {} },
  { id: "added", label: "Included", description, render: {} },
];

export const groups: GroupDef[] = [
  {
    id: "size",
    label: "Size",
    defaultOption: "10m",
    options: yurtSizes.map((size) => ({
      id: size.id,
      label: size.label,
      description: size.description,
      render: { size: size.id },
    })),
  },
  {
    id: "layout",
    label: "Plan",
    note: "The Symmetry plan is shown fitted out, from above with the roof off. Interiors are indicative — the fit-out is specified per project.",
    // No default: the first plan offered for the chosen size.
    options: [
      // One option per plan, offered at every size it is drawn for: Symmetry
      // is one plan at three sizes, so it stays chosen when the size changes.
      ...[...new Set(plans.map((plan) => plan.id))].map((id) => {
        const sized = plans.filter((plan) => plan.id === id);
        return {
          id,
          label: sized[0].label,
          description: sized[0].description,
          sizes: sized.map((plan) => plan.size),
          render: { layout: sized[0].layout ?? EXTERIOR },
        };
      }),
      {
        id: CUSTOM_PLAN,
        label: "Make your own plan",
        description: "The yurt kit — place the windows yourself and plan the inside with us.",
        render: { layout: EXTERIOR },
      },
    ],
  },
  {
    id: "roof",
    label: "Roof & valance",
    defaultOption: "antelope",
    options: coverOptions(0.78),
  },
  {
    id: "exterior",
    label: "Wall",
    defaultOption: "champagne",
    options: coverOptions(0.82),
  },
  {
    id: "flooring",
    label: "Deck",
    note: "The deck the yurt stands on, and the main floor inside. Bathroom tiles stay as drawn.",
    defaultOption: "timber",
    options: [
      { id: "timber", label: "Timber", render: { color: "#8a6a4b", roughness: 0.8 } },
      { id: "pale", label: "Pale timber", render: { color: "#b39875", roughness: 0.78 } },
      { id: "dark", label: "Dark timber", render: { color: "#5a4430", roughness: 0.78 } },
      { id: "stone-floor", label: "Stone", render: { color: "#8e8b83", roughness: 0.95 } },
    ],
  },
  {
    id: "opener",
    label: "Dome opener",
    defaultOption: "none",
    options: addOn("A remote-operated opener for the crown dome, for ventilation."),
  },
  {
    id: "blinds",
    label: "Dome blackout blind",
    defaultOption: "none",
    options: addOn("A blind under the crown dome, for sleeping in after sunrise."),
  },
];

/** The default option in each group. */
export const defaultSelection: Record<OptionGroupId, string> = Object.fromEntries(
  groups.map((group) => [group.id, group.defaultOption ?? group.options[0].id]),
) as Record<OptionGroupId, string>;
