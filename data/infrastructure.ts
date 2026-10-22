/**
 * INFRASTRUCTURE — the content behind /infrastructure ("Behind the build").
 *
 * The page exists to give a buyer confidence in the people and process behind
 * the product, which only works if every statement on it is true. So the rule
 * from lib/site.ts applies here with extra force:
 *
 *     A field set to `null` (or an empty list) is genuinely unknown. The page
 *     hides it. Never fill one with a plausible-looking estimate.
 *
 * WHAT IS CONFIRMED AND WHERE IT CAME FROM
 *
 *   - Sizes, layouts, door and window finishes  → data/specifications.ts
 *     (the workshop's "Yurt Details" sheet)
 *   - Manufacturing lead time, shipping time and region, ex works Bangalore,
 *     installation by our own team              → data/pricing.ts
 *     (the client's published 3D Yurt Customizer price list)
 *   - The component drawings                    → public/media/structure/
 *     (the client's own elevation drawings, already used on the home page)
 *
 * Everything else — facility details, who does which stage in-house, the team,
 * inspection steps, capacity — is PENDING CLIENT. See docs/CONTENT-NEEDED.md.
 *
 * WHY THE WORKSHOP PHOTOGRAPHS ARE PLACEHOLDERS. `workshop-frame-assembly.jpg`
 * and `manufacturing-process.jpg` are generated images of a generic workshop,
 * not this one. A page whose whole argument is "this is how it is really made"
 * cannot illustrate itself with a picture of somewhere else, so it reserves its
 * own slots in data/media.ts and shows the designed placeholder until the real
 * photographs are shot.
 *
 * `verified: false` items are still published where the wording is neutral
 * enough to be true regardless; in development they carry a "To verify" tag so
 * they can be reviewed in place. The tag never renders in production.
 */
import type { MediaId } from "./media";
import { SHIPPING_REGION, SHIPPING_TIME, sizePricing } from "./pricing";
import { doorDepthsMm, doorTypes, finishColours, layouts, windowSpec } from "./specifications";

const list = (items: readonly (string | number)[]) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/* -------------------------------------------------------------------------- */
/* 02. The production environment                                             */
/* -------------------------------------------------------------------------- */

export type FacilityFact = {
  label: string;
  /** `null` hides the row. */
  value: string | null;
  note?: string;
};

/**
 * Facts about the facility itself. Only the dispatch point is confirmed — the
 * price list quotes ex works, Bangalore. Do NOT add a floor area, machine list
 * or headcount until the workshop supplies it in writing.
 */
export const facilityFacts: FacilityFact[] = [
  {
    label: "Dispatch point",
    value: "Bangalore",
    note: "Prices are quoted ex works, Bangalore.",
  },
  { label: "Workshop floor area", value: null },
  { label: "Main equipment", value: null },
  { label: "Visits to the workshop", value: null },
];

/** Documentary photographs of the workshop. Order is layout order. */
export const environmentMedia = {
  lead: "infrastructure.workshop-wide",
  pair: ["infrastructure.workbench", "infrastructure.material-store"],
} as const satisfies { lead: MediaId; pair: readonly MediaId[] };

/* -------------------------------------------------------------------------- */
/* 03. Production capabilities                                                */
/* -------------------------------------------------------------------------- */

/**
 * Who carries out a stage.
 *
 *   "in-house"  — confirmed as done by Theyurts' own workshop or team
 *   "partner"   — confirmed as done with a specialist partner
 *   null        — not yet confirmed. No attribution is shown, and the copy is
 *                 written so it claims neither.
 */
export type Attribution = "in-house" | "partner" | null;

export type Capability = {
  id: string;
  title: string;
  body: string;
  /** Confirmed specifics. Rendered as a short list under the body. */
  details?: string[];
  by: Attribution;
  media: MediaId;
};

export const capabilities: Capability[] = [
  {
    id: "timber",
    title: "Timber and structural components",
    body: "The lattice rods, rafters and centre ring are the parts every other part depends on. They are cut and prepared to a drawing, because a frame that opens into a true circle on site has to be made true first.",
    by: null,
    media: "infrastructure.capability-timber",
  },
  {
    id: "frame",
    title: "Frame preparation and assembly",
    body: "Components are brought together as a frame, so that the way they meet — rod to rod, rafter to ring, wall to tension cable — is resolved before anything is packed.",
    by: null,
    media: "infrastructure.capability-frame",
  },
  {
    id: "cover",
    title: "Exterior cover",
    body: "The cover is prepared to the diameter, roof rise and openings of the frame it will sit on, with its cut-outs aligned to the doors, windows and dome.",
    by: null,
    media: "infrastructure.capability-cover",
  },
  {
    id: "openings",
    title: "Doors, windows and finishing",
    body: "Doors and windows are specified from a fixed range so that what is quoted is what arrives.",
    details: [
      `${list(doorTypes.map((d) => d.toLowerCase()))}, ${list(doorDepthsMm)}mm deep`,
      `${windowSpec.material} ${windowSpec.type.toLowerCase()}s`,
      `Finished in ${list(finishColours)}`,
    ],
    by: null,
    media: "infrastructure.capability-openings",
  },
  {
    id: "interior",
    title: "Interior components",
    body: "Flooring, insulation and the interior fit-out are where two yurts of the same size stop resembling each other. What is included is agreed per project.",
    by: null,
    media: "infrastructure.capability-interior",
  },
  {
    id: "dispatch",
    title: "Packing and dispatch",
    body: "The frame folds down and the cover packs. What leaves for site is a load rather than a building, which is what makes remote and difficult sites possible.",
    by: null,
    media: "infrastructure.capability-dispatch",
  },
];

/* -------------------------------------------------------------------------- */
/* 04. The people behind production                                           */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  name: string;
  role: string;
  /** What they do in production. One or two sentences, supplied by them. */
  focus: string;
  /**
   * Experience from before Theyurts — fabrication, construction, joinery.
   * Shown under "Before Theyurts" so it is never read as the brand's own
   * history. `null` hides it.
   */
  priorExperience: string | null;
  /** Add a manifest entry in data/media.ts for each portrait. */
  photo: MediaId | null;
};

/**
 * PENDING CLIENT. Empty until real names, roles, photographs and experience
 * are supplied by the people themselves. While empty, the page shows a plain
 * "to follow" state rather than invented profiles.
 */
export const team: TeamMember[] = [];

/* -------------------------------------------------------------------------- */
/* 05. From workshop to site                                                  */
/* -------------------------------------------------------------------------- */

export type JourneyStep = {
  index: string;
  title: string;
  body: string;
  /** false = the wording is safe but the operational detail needs sign-off. */
  verified: boolean;
};

export const journey: JourneyStep[] = [
  {
    index: "01",
    title: "Understand the brief and the site",
    body: "Where the land is, how a vehicle reaches it, what has to happen inside the structure, and how many are planned — now or over time.",
    verified: true,
  },
  {
    index: "02",
    title: "Finalise the design and specification",
    body: `A size, a layout — ${list(layouts.map((l) => l.name))} as standard — and the door, window and finish options. Anything outside the standard specification is drawn and quoted for the project.`,
    verified: true,
  },
  {
    index: "03",
    title: "Prepare and manufacture the components",
    body: "The frame, cover and openings are made and prepared to the agreed specification.",
    verified: true,
  },
  {
    index: "04",
    title: "Inspect and prepare for dispatch",
    body: "Components are checked against the specification and packed for the journey.",
    // PENDING CLIENT: what is inspected, by whom, and whether the frame is
    // trial-assembled before packing.
    verified: false,
  },
  {
    index: "05",
    title: "Transport to the site",
    body: `Shipped ${SHIPPING_REGION.toLowerCase()}. Shipping is quoted separately for each site, because it depends on where the site is and how it is reached.`,
    verified: true,
  },
  {
    index: "06",
    title: "Assemble and complete the installation",
    body: "Our team assembles the structure on site onto a prepared base and finishes it to the project's specification.",
    // PENDING CLIENT: who prepares the base, and what it must be.
    verified: false,
  },
];

/* -------------------------------------------------------------------------- */
/* 06. Quality and materials                                                  */
/* -------------------------------------------------------------------------- */

export type QualityPoint = { title: string; body: string };

export const qualityPoints: QualityPoint[] = [
  {
    title: "Material selection",
    body: "Timber, cover and fixings are chosen for the structure, its use and the climate it will stand in. A coastal site and a dry inland one are not the same problem.",
  },
  {
    title: "Component fit",
    body: "A yurt is held together by geometry. If the lattice, rafters and ring are not made to fit, the error does not stay in one part — it travels around the whole circle.",
  },
  {
    title: "Connections",
    body: "Each joint carries load in a particular direction. How rods meet, how rafters seat into the ring, and how the tension cable closes the wall decide how the frame behaves.",
  },
  {
    title: "Finishes and preparation",
    body: "Surfaces are finished before dispatch, when they can be reached properly, rather than patched on site after assembly.",
  },
];

/**
 * The client's own elevation drawings, one component highlighted in each.
 * Captions follow the drawings' own labels (as on the home page).
 */
export const componentDrawings = [
  {
    file: "/media/structure/structure-lattice-rods.png",
    name: "Lattice rods",
    caption: "Put the yurt wall into a perfect circle.",
  },
  {
    file: "/media/structure/structure-rafter.png",
    name: "Rafter",
    caption: "The frame holding the structure in place.",
  },
  {
    file: "/media/structure/structure-centre-ring.png",
    name: "Centre ring",
    caption: "Acts as a keystone, holding the rafters up.",
  },
  {
    file: "/media/structure/structure-tension-cable.png",
    name: "Tension cable",
    caption: "Holds the structure in while the roof pushes it out.",
  },
] as const;

export type SupportingDocument = {
  title: string;
  /** Issuing body or laboratory. */
  issuer: string;
  /** ISO date. */
  date: string;
  href: string;
};

/**
 * Verified specifications, test reports and certificates. PENDING CLIENT.
 * The block renders only once this has an entry with a real document behind
 * it — never a claim without the file.
 */
export const supportingDocuments: SupportingDocument[] = [];

/* -------------------------------------------------------------------------- */
/* 07. Production capacity                                                    */
/* -------------------------------------------------------------------------- */

export type CapacityField = {
  label: string;
  /**
   * `null` = not approved for publication; the row is omitted. A list renders
   * one line per entry.
   */
  value: string | string[] | null;
  note?: string;
};

const leadTimes = Object.values(sizePricing).map(
  (size) => `${size.name}: ${size.manufacturing}`,
);

export const capacity: CapacityField[] = [
  { label: "Current production capacity", value: null },
  { label: "Projects in production at once", value: null },
  {
    label: "Manufacturing lead time",
    value: leadTimes,
    note: "By size, from our current price list. Confirmed for each project when it is specified.",
  },
  {
    label: "Standard sizes and layouts",
    value: [
      list(Object.values(sizePricing).map((size) => size.name)),
      `${list(layouts.map((l) => l.name))} layouts`,
    ],
    note: "Other diameters and configurations are drawn and quoted per project.",
  },
  {
    label: "Delivery and installation",
    value: SHIPPING_REGION,
    note: `Shipping typically takes ${SHIPPING_TIME}; installation is carried out by our own team.`,
  },
];
