/**
 * 3D BUILDER — plans, fittings and prices.
 *
 * Indian prices, in rupees, ex works (Bangalore), from the client's published
 * 3D Yurt Customizer price list. One file, so a price change is one edit here
 * and nothing else.
 *
 * HOW A QUOTE IS PRICED (see `lib/quote.ts`):
 *
 *   plan price            the plan as drawn: its doors, windows and covers
 *   + window extras       each window beyond the plan's own, frame + canopy
 *   + door extras         upgrading a door from the 3' flush door it comes with
 *   + accessories         dome opener, dome blackout blind
 *   + installation        on site, by our team
 *   shipping              quoted separately — it depends on the site
 *
 * All of it is indicative and non-binding; the interface says so wherever a
 * total is shown.
 */

import type { YurtSizeId } from "./yurtModel";

export const CURRENCY = "INR";
export const LOCALE = "en-IN";

/** ₹9,73,513 — Indian digit grouping. */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);

/* -------------------------------------------------------------------------- */
/* Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export type SizePricing = {
  /** Shown as the model name: "TOF 20' / 6m". */
  name: string;
  areaSqft: number;
  areaM2: number;
  /** The bare kit, for a plan of your own. */
  kitPrice: number;
  /** Windows the bare kit includes. Further windows are extras. */
  kitWindows: number;
  installation: number;
  manufacturing: string;
};

export const sizePricing: Record<YurtSizeId, SizePricing> = {
  "6m": {
    name: "20' / 6m",
    areaSqft: 314,
    areaM2: 29,
    kitPrice: 1000087,
    kitWindows: 2,
    installation: 84000,
    manufacturing: "2–12 weeks",
  },
  // Installation is interpolated by floor area between the 6m and 10m; the
  // client hasn't given a 7m figure.
  "7m": {
    name: "23' / 7m",
    areaSqft: 414,
    areaM2: 38,
    kitPrice: 1198998,
    kitWindows: 2,
    installation: 93690,
    manufacturing: "2–12 weeks",
  },
  "10m": {
    name: "32' / 10m",
    areaSqft: 804,
    areaM2: 75,
    kitPrice: 1820362,
    kitWindows: 4,
    installation: 130909,
    manufacturing: "4–12 weeks",
  },
};

export const SHIPPING_TIME = "1–2 weeks";
export const SHIPPING_REGION = "Across India";

/* -------------------------------------------------------------------------- */
/* Plans                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Wall positions are read like a clock, seen from above with the main door at
 * six o'clock: D6 is the front door, W2 a window at two o'clock.
 */
export type Plan = {
  id: string;
  label: string;
  size: YurtSizeId;
  price: number;
  description: string;
  /** Door positions, in clock hours. The first is the main door. */
  doors: number[];
  /** Window positions, in clock hours. */
  windows: number[];
  toiletWindows: number;
  /** Fitted-out model to show, from `data/yurtModel.ts`, if one is drawn. */
  layout?: string;
};

export const CUSTOM_PLAN = "custom";

/**
 * Symmetry is the one plan drawn at every size, fitted out to the same
 * standard. The 6m and 7m prices are placeholders, the bare kit's price, until
 * the client prices them.
 */
export const plans: Plan[] = [
  {
    id: "symmetry",
    label: "Symmetry",
    size: "6m",
    price: 1000087, // TODO(client): 6m Symmetry price; this is the 6m kit.
    description: "The Symmetry fit-out at 6m: a bedroom with its bathroom, and a sitting area by the door.",
    doors: [6],
    windows: [3, 9],
    toiletWindows: 1,
    layout: "symmetry",
  },
  {
    id: "padma",
    label: "Padma",
    size: "6m",
    price: 973513,
    description: "A bedroom with an en-suite, windows facing each other across the room.",
    doors: [6],
    windows: [2, 8],
    toiletWindows: 1,
  },
  {
    id: "voyager",
    label: "The Voyager",
    size: "6m",
    price: 973513,
    description: "A bedroom with an en-suite, the windows turned to the view.",
    doors: [6],
    windows: [4, 8],
    toiletWindows: 1,
  },
  {
    id: "safari",
    label: "Safari",
    size: "6m",
    price: 1061961,
    description: "A brighter bedroom with an en-suite and a third window.",
    doors: [6],
    windows: [4, 8, 10],
    toiletWindows: 1,
  },
  {
    id: "symmetry",
    label: "Symmetry",
    size: "10m",
    price: 1837672,
    description: "Two bedrooms either side of a sitting room, each with a bathroom.",
    doors: [6],
    windows: [2, 4, 8, 9],
    toiletWindows: 2,
    layout: "symmetry",
  },
  {
    id: "symmetry",
    label: "Symmetry",
    size: "7m",
    price: 1198998, // TODO(client): 7m Symmetry price; this is the 7m kit.
    description: "The Symmetry fit-out at 7m: a bedroom with its bathroom, and a sitting area by the door.",
    doors: [6],
    windows: [3, 9],
    toiletWindows: 1,
    layout: "symmetry",
  },
  {
    id: "trinity",
    label: "Trinity",
    size: "10m",
    price: 1915264,
    description: "A bedroom with its own bathroom, and a lounge.",
    doors: [6],
    windows: [1, 3, 5, 9, 11],
    toiletWindows: 1,
  },
  {
    id: "bistro",
    label: "Bistro",
    size: "10m",
    price: 1997578,
    description: "Open plan: kitchen, dining, lounge and sleeping, with a second door.",
    doors: [6, 9],
    windows: [7, 8, 10, 11, 12, 1],
    toiletWindows: 2,
  },
];

/** The bare kit as a plan, for a size: one door, the kit's windows. */
export function customPlan(size: YurtSizeId): Plan {
  const pricing = sizePricing[size];
  return {
    id: CUSTOM_PLAN,
    label: "Make your own plan",
    size,
    price: pricing.kitPrice,
    description:
      "The yurt kit with one door — place the windows yourself and plan the inside with us.",
    doors: [6],
    windows: size === "10m" ? [2, 4, 8, 10] : [3, 9],
    toiletWindows: 0,
  };
}

export const plansFor = (size: YurtSizeId): Plan[] => [
  ...plans.filter((plan) => plan.size === size),
  customPlan(size),
];

export const planById = (id: string | undefined, size: YurtSizeId): Plan =>
  plansFor(size).find((plan) => plan.id === id) ?? plansFor(size)[0];

/* -------------------------------------------------------------------------- */
/* Doors and windows                                                          */
/* -------------------------------------------------------------------------- */

/** One door, with its locks and fittings, plus the leaf pergola over it. */
const PERGOLA_LEAF = 53684;
const FLUSH_3 = 32098 + PERGOLA_LEAF;
const DOUBLE_5 = 71604 + PERGOLA_LEAF;

export type DoorStyle = {
  id: string;
  label: string;
  /** Glass doors come in their frame colour only. */
  colourable: boolean;
  /** Cost over the 3' flush door a plan comes with. */
  upgrade: number;
};

export const doorStyles: DoorStyle[] = [
  { id: "flush", label: "3' flush door", colourable: true, upgrade: 0 },
  { id: "glass", label: "3' glass door", colourable: false, upgrade: FLUSH_3 },
  { id: "flush-double", label: "5' flush double door", colourable: true, upgrade: DOUBLE_5 },
  { id: "glass-double", label: "5' glass double door", colourable: false, upgrade: DOUBLE_5 },
];

export const lockStyles = [{ id: "lever", label: "Lever handle" }];

export const woodFinishes = [
  { id: "ash", label: "American ash", hex: "#d6c6a8" },
  { id: "teak", label: "Teak", hex: "#a67b5b" },
  { id: "walnut", label: "Walnut", hex: "#5d432c" },
  { id: "cherry", label: "Cherry", hex: "#a24f2f" },
];

export const windowTypes = [
  { id: "upvc", label: "uPVC sliding window" },
  { id: "casement", label: "Casement window" },
];

/** A window beyond the plan's own: frame, uPVC window and its leaf canopy. */
export const EXTRA_WINDOW = 82257;

/* -------------------------------------------------------------------------- */
/* Covers and accessories                                                     */
/* -------------------------------------------------------------------------- */

/** What every yurt is made of. All included in the plan price. */
export const fabricSpec = [
  { label: "Outer fabric", value: "Serge Ferrari" },
  { label: "Inner fabric", value: "Technical fibre" },
  { label: "Insulation", value: "Reflective insulation" },
];

export const accessoryPrices = {
  opener: 19809,
  blinds: 41058,
} as const;

/* -------------------------------------------------------------------------- */
/* The quote form                                                             */
/* -------------------------------------------------------------------------- */

export const buyerCategories = [
  "Airbnb",
  "Homestay / farmstay",
  "Resort / glamping site",
  "Architect",
  "ADU / private residence",
  "Other",
];
