import { sizePricing } from "./pricing";
import { floorPlanDrawings, type YurtSizeId } from "./yurtModel";

/**
 * FLOOR PLANS — the /floor-plans catalogue.
 *
 * The same drawings as the 3D builder's floor-plan viewer (`floorPlanDrawings`
 * in `data/yurtModel.ts`), grouped by size. Add a drawing there and it shows
 * on both.
 *
 * They are numbered, not named: the client has not said which drawing is
 * which plan in `data/pricing.ts`.
 */

export type FloorPlan = {
  slug: string;
  /** "Plan 01" — its number within its size. */
  name: string;
  size: YurtSizeId;
  /** Path under /public. */
  image: string;
};

export type FloorPlanGroup = {
  size: YurtSizeId;
  plans: FloorPlan[];
};

const sizeOrder: YurtSizeId[] = ["6m", "7m", "10m"];

export const floorPlanGroups: FloorPlanGroup[] = sizeOrder.map((size) => ({
  size,
  plans: floorPlanDrawings[size].map((image, i) => {
    const number = String(i + 1).padStart(2, "0");
    return { slug: `${size}-${number}`, name: `Plan ${number}`, size, image };
  }),
}));

export const floorPlans: FloorPlan[] = floorPlanGroups.flatMap((group) => group.plans);

/** "20' / 6m · 314 sq ft" — the size as the builder names it, with its area. */
export const floorPlanSizeLabel = (size: YurtSizeId) => {
  const { name, areaSqft } = sizePricing[size];
  return `${name} · ${areaSqft} sq ft`;
};
