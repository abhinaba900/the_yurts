/**
 * The builder's quote: the door and window details a configuration carries on
 * top of its options, and what the whole thing costs.
 *
 * Kept apart from `lib/configurator.ts` because it is a different kind of
 * thing. A selection is one choice per group and drives the 3D scene; a quote
 * is a list of positions on the wall, each with its own style and finish, and
 * drives only the price and the summary.
 *
 * Prices come from `data/pricing.ts`; nothing here knows a number.
 */

import {
  accessoryPrices,
  doorStyles,
  EXTRA_WINDOW,
  formatPrice,
  lockStyles,
  planById,
  sizePricing,
  windowTypes,
  woodFinishes,
  type DoorStyle,
  type Plan,
} from "@/data/pricing";
import type { YurtSizeId } from "@/data/yurtModel";

export type Quote = {
  /** Window positions. `null` means "as the plan draws them". */
  windows: number[] | null;
  /** Window position → window type id. */
  windowType: Record<number, string>;
  /** Window position → wood finish id. */
  windowFinish: Record<number, string>;
  /** Door position → door style id. */
  doorStyle: Record<number, string>;
  /** Door position → wood finish id. */
  doorFinish: Record<number, string>;
};

export const emptyQuote: Quote = {
  windows: null,
  windowType: {},
  windowFinish: {},
  doorStyle: {},
  doorFinish: {},
};

export type DoorRow = {
  position: number;
  style: DoorStyle;
  lock: string;
  finish: (typeof woodFinishes)[number] | null;
  price: number;
};

export type WindowRow = {
  position: number;
  type: (typeof windowTypes)[number];
  finish: (typeof woodFinishes)[number] | null;
  included: boolean;
  price: number;
};

export type PriceLine = { label: string; amount: number | null; note?: string };

export type PricedQuote = {
  plan: Plan;
  doors: DoorRow[];
  windows: WindowRow[];
  accessories: { label: string; price: number }[];
  lines: PriceLine[];
  total: number;
};

/** The windows actually placed, in clock order. */
export const windowsOf = (quote: Quote, plan: Plan): number[] =>
  [...(quote.windows ?? plan.windows)]
    .filter((position) => !plan.doors.includes(position))
    .sort((a, b) => a - b);

export function priceQuote(
  size: YurtSizeId,
  planId: string | undefined,
  quote: Quote,
  addOns: { opener: boolean; blinds: boolean },
): PricedQuote {
  const plan = planById(planId, size);
  const pricing = sizePricing[size];

  const doors: DoorRow[] = plan.doors.map((position) => {
    const style =
      doorStyles.find((item) => item.id === quote.doorStyle[position]) ?? doorStyles[0];
    const finish = style.colourable
      ? (woodFinishes.find((item) => item.id === quote.doorFinish[position]) ?? null)
      : null;
    return { position, style, lock: lockStyles[0].label, finish, price: style.upgrade };
  });

  // The plan's own number of windows is included; any more are extras.
  const included = plan.windows.length;
  const windows: WindowRow[] = windowsOf(quote, plan).map((position, index) => ({
    position,
    type: windowTypes.find((item) => item.id === quote.windowType[position]) ?? windowTypes[0],
    finish: woodFinishes.find((item) => item.id === quote.windowFinish[position]) ?? null,
    included: index < included,
    price: index < included ? 0 : EXTRA_WINDOW,
  }));

  const accessories = [
    ...(addOns.opener ? [{ label: "Remote-operated dome opener", price: accessoryPrices.opener }] : []),
    ...(addOns.blinds ? [{ label: "Blackout blind for the dome", price: accessoryPrices.blinds }] : []),
  ];

  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

  const lines: PriceLine[] = [
    { label: `Plan · ${plan.label}`, amount: plan.price },
    { label: "Window configuration (extras)", amount: sum(windows.map((row) => row.price)) },
    { label: "Door configuration (extras)", amount: sum(doors.map((row) => row.price)) },
    { label: "Accessories", amount: sum(accessories.map((item) => item.price)) },
    { label: "Installation", amount: pricing.installation },
    { label: "Shipping", amount: null, note: "Quoted for your site" },
  ];

  return {
    plan,
    doors,
    windows,
    accessories,
    lines,
    total: sum(lines.map((line) => line.amount ?? 0)),
  };
}

/** Clock position as the summary writes it: D6, W2. */
export const positionLabel = (kind: "D" | "W", position: number) =>
  `${kind}${position}`;

/* -------------------------------------------------------------------------- */
/* URL encoding                                                               */
/*                                                                            */
/* Readable, like the selection: `w2.8~t2upvc~f2ash~d6glass~e6teak`.          */
/* Anything unrecognised is dropped on read.                                  */
/* -------------------------------------------------------------------------- */

export function encodeQuote(quote: Quote): string {
  const parts: string[] = [];
  if (quote.windows) parts.push(`w${quote.windows.join(".")}`);
  for (const [position, id] of Object.entries(quote.windowType)) parts.push(`t${position}${id}`);
  for (const [position, id] of Object.entries(quote.windowFinish)) parts.push(`f${position}${id}`);
  for (const [position, id] of Object.entries(quote.doorStyle)) parts.push(`d${position}${id}`);
  for (const [position, id] of Object.entries(quote.doorFinish)) parts.push(`e${position}${id}`);
  return parts.join("~");
}

export function decodeQuote(value: string | null | undefined): Quote {
  const quote: Quote = {
    ...emptyQuote,
    windowType: {},
    windowFinish: {},
    doorStyle: {},
    doorFinish: {},
  };
  if (!value) return quote;

  const valid = (list: { id: string }[], id: string) => list.some((item) => item.id === id);

  for (const part of value.split("~")) {
    const kind = part[0];
    const rest = part.slice(1);
    const match = /^(\d{1,2})(.+)$/.exec(rest);
    const position = match ? Number(match[1]) : NaN;
    const id = match?.[2] ?? "";
    const onClock = position >= 1 && position <= 12;

    if (kind === "w") {
      quote.windows = [
        ...new Set(
          rest
            .split(".")
            .map(Number)
            .filter((n) => Number.isInteger(n) && n >= 1 && n <= 12),
        ),
      ];
    } else if (kind === "t" && onClock && valid(windowTypes, id)) {
      quote.windowType[position] = id;
    } else if (kind === "f" && onClock && valid(woodFinishes, id)) {
      quote.windowFinish[position] = id;
    } else if (kind === "d" && onClock && valid(doorStyles, id)) {
      quote.doorStyle[position] = id;
    } else if (kind === "e" && onClock && valid(woodFinishes, id)) {
      quote.doorFinish[position] = id;
    }
  }
  return quote;
}

/** The whole quote as plain text, for the enquiry email and record. */
export function quoteText(
  priced: PricedQuote,
  extra: { label: string; value: string }[],
): string {
  const lines = [
    "ORDER SUMMARY",
    ...extra.map((row) => `${row.label}: ${row.value}`),
    "",
    "Doors:",
    ...priced.doors.map(
      (row) =>
        `  ${positionLabel("D", row.position)} · ${row.style.label} · ${row.lock} · ${row.finish?.label ?? "Standard finish"} · ${formatPrice(row.price)}`,
    ),
    "Windows:",
    ...priced.windows.map(
      (row) =>
        `  ${positionLabel("W", row.position)} · ${row.type.label} · ${row.finish?.label ?? "Standard finish"} · ${row.included ? "Included" : formatPrice(row.price)}`,
    ),
    `Accessories: ${priced.accessories.map((item) => item.label).join(", ") || "None"}`,
    "",
    "PRICE SUMMARY",
    ...priced.lines.map(
      (line) => `${line.label}: ${line.amount === null ? (line.note ?? "TBD") : formatPrice(line.amount)}`,
    ),
    `Estimated total: ${formatPrice(priced.total)} (ex works, shipping extra)`,
  ];
  return lines.join("\n");
}
