import type { MediaId } from "./media";
import { sizePricing } from "./pricing";
import type { YurtSizeId } from "./yurtModel";

/**
 * FLOOR PLANS — the /floor-plans catalogue.
 *
 * Interior arrangements, named for what the space is used for. Change a name,
 * a description or a drawing here and the page follows; nothing is typed into
 * the page itself.
 *
 * PROPOSED, NOT CONFIRMED. The names and concepts below came with the brief for
 * the page and are not the workshop's standard plans (those are Padma, Symmetry
 * and the rest, in `data/pricing.ts`). So:
 *
 *   - `sizes` is empty until the client confirms which diameters a layout is
 *     drawn for. The page shows no size rather than imply every layout fits
 *     every yurt.
 *   - The drawings are pending; `media` points at a manifest slot that renders
 *     a labelled placeholder until the file lands (see data/media.ts).
 *   - `available: false` hides a layout without deleting what was written.
 */

export type FloorPlan = {
  slug: string;
  name: string;
  /** What the layout is for, in a few words. */
  application: string;
  /** One or two practical sentences. */
  description: string;
  media: MediaId;
  /** Confirmed sizes only. Empty means unconfirmed, and nothing is shown. */
  sizes: YurtSizeId[];
  available: boolean;
};

export const floorPlans: FloorPlan[] = [
  {
    slug: "open-plan",
    name: "The Open Plan",
    application: "Adaptable use",
    description:
      "The circle left whole and unfurnished, so it can be set up for whatever it needs to hold, and set up differently later.",
    media: "floorplans.open-plan",
    sizes: [],
    available: true,
  },
  {
    slug: "retreat",
    name: "The Retreat",
    application: "Private stays",
    description:
      "A layout for sleeping and unwinding, with the bed placed to make the most of the windows and the light from the crown.",
    media: "floorplans.retreat",
    sizes: [],
    available: true,
  },
  {
    slug: "suite",
    name: "The Suite",
    application: "Hospitality",
    description:
      "An arrangement for guest accommodation, with sleeping, sitting and bathing given their own zones within the round.",
    media: "floorplans.suite",
    sizes: [],
    available: true,
  },
  {
    slug: "gathering",
    name: "The Gathering",
    application: "Shared spaces",
    description:
      "Seating arranged around the centre of the room, for conversation, dining or small events where everyone faces in.",
    media: "floorplans.gathering",
    sizes: [],
    available: true,
  },
  {
    slug: "wellness-studio",
    name: "The Wellness Studio",
    application: "Yoga, meditation and treatments",
    description:
      "The floor kept clear for practice or treatment beds, with storage held to the wall so the centre stays open.",
    media: "floorplans.wellness-studio",
    sizes: [],
    available: true,
  },
  {
    slug: "living-space",
    name: "The Living Space",
    application: "Residential",
    description:
      "A home in the round, with kitchen, living, sleeping and bathroom areas arranged for everyday use.",
    media: "floorplans.living-space",
    sizes: [],
    available: true,
  },
];

/** "20' / 6m · 314 sq ft" — the size as the builder names it, with its area. */
export const floorPlanSizeLabel = (size: YurtSizeId) => {
  const { name, areaSqft } = sizePricing[size];
  return `${name} · ${areaSqft} sq ft`;
};
