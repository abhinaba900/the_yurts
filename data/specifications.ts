/**
 * CONFIRMED SPECIFICATION — from the workshop's "Yurt Details" sheet.
 *
 * Everywhere else in this project the rule is: never publish a dimension the
 * workshop has not confirmed. `data/configurator.ts` says so at the top, and
 * `data/products.ts` leaves `sizes`, `materials`, `features` and `customisation`
 * null for exactly that reason.
 *
 * This file is the answer to those comments. Every figure below is transcribed
 * from the supplied sheet and nothing is interpolated:
 *
 *   - three shell sizes, by diameter, floor area, wall height and roof rise;
 *   - three standard layouts (Symmetry, Trinity, Bistro), which differ only in
 *     how many doors, windows and toilet windows are cut into that shell;
 *   - two door depths (300mm and 500mm), which is the only thing separating the
 *     two prices quoted against each layout;
 *   - the finish options — flush or glazed doors, UPVC casement windows, and
 *     Black / Walnut / Teak on both.
 *
 * WHAT IS DELIBERATELY NOT HERE. The sheet prices a layout, not a model. It
 * does not say which of the ten range models each layout belongs to, so nothing
 * in this file claims that a Classic costs 16,37,672 — see `productSizesFor`
 * below for the one mapping that is made, and why it is safe.
 */

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export type ShellSize = {
  /** Stable key, also used as the configurator `assetKey`. */
  id: "d6000" | "d7200" | "d9600";
  /** Nominal diameter in millimetres, as the sheet names it. */
  diameterMm: number;
  /** Diameter in metres, for prose. */
  diameterM: number;
  /** Floor area in square feet, as quoted. */
  areaSqFt: number;
  /** Wall height in millimetres. Constant across the range. */
  wallHeightMm: number;
  /** Roof rise from wall top to crown, in millimetres. */
  roofRiseMm: number;
};

export const shellSizes: ShellSize[] = [
  { id: "d6000", diameterMm: 6000, diameterM: 6.0, areaSqFt: 314, wallHeightMm: 2700, roofRiseMm: 1150 },
  { id: "d7200", diameterMm: 7200, diameterM: 7.2, areaSqFt: 452, wallHeightMm: 2700, roofRiseMm: 1750 },
  { id: "d9600", diameterMm: 9600, diameterM: 9.6, areaSqFt: 804, wallHeightMm: 2700, roofRiseMm: 2350 },
];

/** "6000mm Dia" — the sheet's own phrasing, reused so the site matches it. */
export const sizeLabel = (size: ShellSize) => `${size.diameterMm}mm Dia`;

export type ShellSizeId = ShellSize["id"];

const sizeIndex = new Map(shellSizes.map((size) => [size.id, size]));

/**
 * Resolve the ids a range model lists in `standardSizes`.
 *
 * Unknown ids are dropped rather than thrown on: a model that names a size the
 * workshop has not quoted should lose that row, not take the page down with it.
 */
export const shellSizesByIds = (ids: readonly ShellSizeId[] | undefined): ShellSize[] =>
  (ids ?? []).map((id) => sizeIndex.get(id)).filter((s): s is ShellSize => Boolean(s));

/* -------------------------------------------------------------------------- */
/* Layouts                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The sheet quotes each layout twice — once at a 300mm door and once at 500mm —
 * and the only figure that moves is the price. Modelling it as a variant list
 * rather than two layouts keeps that fact visible instead of duplicating the
 * door and window counts and hoping they stay in step.
 */
export type LayoutVariant = {
  /** Door depth in millimetres. The sheet's "300mm / 500mm Flush door". */
  doorDepthMm: 300 | 500;
  /** Price in rupees, as quoted. Unformatted so `formatRupees` owns the commas. */
  price: number;
};

export type Layout = {
  id: "symmetry" | "trinity" | "bistro";
  name: string;
  /** One line on what the opening count actually gives you. Ours, not the sheet's. */
  note: string;
  doors: number;
  windows: number;
  toiletWindows: number;
  variants: LayoutVariant[];
};

export const layouts: Layout[] = [
  {
    id: "symmetry",
    name: "Symmetry",
    note: "One entrance, four windows evenly set around the wall, and two toilet windows.",
    doors: 1,
    windows: 4,
    toiletWindows: 2,
    variants: [
      { doorDepthMm: 300, price: 1637672 },
      { doorDepthMm: 500, price: 1997582 },
    ],
  },
  {
    id: "trinity",
    name: "Trinity",
    note: "One entrance and a fifth window in place of the second toilet window.",
    doors: 1,
    windows: 5,
    toiletWindows: 1,
    variants: [
      { doorDepthMm: 300, price: 1746672 },
      { doorDepthMm: 500, price: 2135465 },
    ],
  },
  {
    id: "bistro",
    name: "Bistro",
    note: "Two entrances and six windows — the layout for a room people move through.",
    doors: 2,
    windows: 6,
    toiletWindows: 2,
    variants: [
      { doorDepthMm: 300, price: 2172635 },
      { doorDepthMm: 500, price: 2423211 },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Finishes                                                                   */
/* -------------------------------------------------------------------------- */

/** Offered on both doors and windows. */
export const finishColours = ["Black", "Walnut", "Teak"] as const;

export type FinishColour = (typeof finishColours)[number];

export const doorTypes = ["Flush door", "Glass door"] as const;

/** Door depths quoted, in millimetres. */
export const doorDepthsMm = [300, 500] as const;

export const windowSpec = {
  material: "UPVC",
  type: "Casement window",
  colours: finishColours,
} as const;

/** Toilet windows are quoted in Black only. */
export const toiletWindowColours: FinishColour[] = ["Black"];

/** The crown dome is remote operated across every layout and size. */
export const domeOperation = "Remote operated";

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Indian digit grouping — 16,37,672 rather than 1,637,672.
 *
 * The sheet is written for an Indian buyer and quotes lakhs, so the site groups
 * the same way. `en-IN` does this natively; the manual fallback exists because
 * `Intl` locale data is not guaranteed in every runtime this renders in.
 */
export function formatRupees(value: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    const s = String(Math.round(value));
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
  }
}

/** "₹16,37,672" */
export const priceLabel = (value: number) => `₹${formatRupees(value)}`;

/** The cheapest quote against a layout — what a "from" price means here. */
export const startingPrice = (layout: Layout) =>
  Math.min(...layout.variants.map((v) => v.price));

/** The lowest price on the sheet, for the range-wide "from" line. */
export const rangeStartingPrice = Math.min(...layouts.map(startingPrice));
