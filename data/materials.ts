/**
 * FINISH PALETTE — read out of the workshop's own SketchUp model.
 *
 * WHERE THESE NUMBERS COME FROM. `UPVC - white.skp` carries 117 named materials.
 * Most of them dress the interior of the demo scene — books, coffee cups, rugs,
 * a lake wallpaper — and are nothing to do with what is sold. The handful below
 * are the ones that describe the product: the three joinery finishes the
 * specification sheet actually offers, and the glazing that goes in them.
 *
 * Each value is the material's own diffuse colour as authored in SketchUp,
 * converted from its `colorRed/Green/Blue` attributes. Nothing here is eyeballed
 * or invented — that is the whole point of taking them from the file rather than
 * matching them by eye against a screenshot.
 *
 *   SketchUp material   → what it is                 → here
 *   ------------------------------------------------------------------
 *   BLACK               → black joinery              → joinery.black
 *   W-walnut            → walnut joinery             → joinery.walnut
 *   teak wood           → teak joinery               → joinery.teak
 *   GlassClear          → clear glazing, 74% trans   → glazing.clear
 *   Glass Black         → dark glazing, 14% trans    → glazing.tinted
 *
 * WHY ONLY THESE. The shells in the demo scene are teal, white and pink, which
 * are how someone dressed three copies to tell them apart in a drawing — not a
 * published cover range. Promoting them to options on the site would be
 * inventing a product, so they stay out. See `data/configurator.ts`.
 *
 * The two wood finishes carry seamless grain textures in the model as well. They
 * are not loaded here: the 3D builder generates its grain procedurally and
 * downloads no image assets at all, which is a deliberate performance decision
 * (see `YurtModel`). The colours are what carry across.
 */

export type JoineryFinishId = "black" | "walnut" | "teak";

export type JoineryFinish = {
  id: JoineryFinishId;
  /** Matches the name on the specification sheet. */
  label: string;
  /** The SketchUp material this was taken from, for traceability. */
  source: string;
  /** Frame and surround. The material's authored diffuse colour. */
  frame: string;
  /**
   * The door leaf, one step down from the frame so the two read apart in 3D.
   * SketchUp models the leaf and frame with one material; a single flat colour
   * across both loses the shadow line that makes a door look like a door.
   */
  panel: string;
  /** The reveal inside the wall thickness — darker again, as it is in shadow. */
  reveal: string;
  roughness: number;
};

/** Shifts a hex colour by a factor: <1 darkens, >1 lightens. */
function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * factor);
  const g = clamp(((n >> 8) & 255) * factor);
  const b = clamp((n & 255) * factor);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Black is the exception to `shade`.
 *
 * The SketchUp material is pure #000000, and multiplying pure black by anything
 * is still pure black — a door rendered that way is a silhouette with no edges.
 * So black is lifted to a near-black that still reads as black under the scene's
 * lighting, and its panel and reveal are lifted further rather than dropped.
 */
const BLACK_FRAME = "#141414";

export const joineryFinishes: JoineryFinish[] = [
  {
    id: "black",
    label: "Black",
    source: "BLACK (#000000)",
    frame: BLACK_FRAME,
    panel: "#1f1f1f",
    reveal: "#0c0c0c",
    roughness: 0.5,
  },
  {
    id: "walnut",
    label: "Walnut",
    source: "W-walnut (#A07755)",
    frame: "#a07755",
    panel: shade("#a07755", 0.84),
    reveal: shade("#a07755", 0.62),
    roughness: 0.62,
  },
  {
    id: "teak",
    label: "Teak",
    source: "teak wood (#C9BB9F)",
    frame: "#c9bb9f",
    panel: shade("#c9bb9f", 0.86),
    reveal: shade("#c9bb9f", 0.64),
    roughness: 0.6,
  },
];

export const joineryById = (id: string): JoineryFinish =>
  joineryFinishes.find((finish) => finish.id === id) ?? joineryFinishes[0];

/**
 * Glazing, from `GlassClear` and `Glass Black`.
 *
 * SketchUp's `trans` is how transparent the material is, so its opacity is
 * `1 - trans`. Clear glass at trans 0.74 is therefore 0.26 opaque — close to the
 * 0.34 the scene used before this file existed, which is a reassuring sign the
 * original guess was in the right country.
 */
export const glazing = {
  clear: { color: "#8e8e8e", opacity: 1 - 0.74, roughness: 0.06, metalness: 0.2 },
  tinted: { color: "#1a1a1a", opacity: 1 - 0.14, roughness: 0.08, metalness: 0.25 },
} as const;
