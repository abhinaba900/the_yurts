/**
 * EXPERIENCE CENTRE, BENGALURU
 *
 * Every business fact on /experience-centre lives here and nowhere else.
 *
 * The same rule as lib/site.ts: a field set to `null` (or an empty list) is
 * genuinely unknown. The page hides whatever depends on it rather than
 * inventing a value. Do not fill these with plausible-looking placeholders —
 * a visitor who drives to a guessed address does not come back.
 *
 * GOING LIVE
 *
 *   1. Fill in `location` and `visiting` below with confirmed details.
 *   2. Supply the photographs — see the `experience-centre.*` entries in
 *      data/media.ts. Each must be taken at the Bengaluru centre itself.
 *   3. Set `status` to "open". That puts the page in the navigation and the
 *      sitemap, lets search engines index it, and drops the "being prepared"
 *      wording. Until then the page works at its URL but is not advertised.
 */

import type { MediaId } from "@/data/media";

export type CentreStatus = "preparing" | "open";

export const experienceCentre = {
  status: "preparing" as CentreStatus,

  location: {
    /** City is confirmed by the client. Nothing below it is yet. */
    city: "Bengaluru",
    /** PENDING CLIENT — street address, building, landmark. */
    address: null as string | null,
    /** PENDING CLIENT — locality / area, e.g. the neighbourhood name. */
    locality: null as string | null,
    /** PENDING CLIENT */
    postalCode: null as string | null,
    /**
     * PENDING CLIENT — the share link from Google Maps for the exact pin. Opens
     * in the visitor's maps app. "Get directions" is hidden until it exists.
     */
    mapsUrl: null as string | null,
    /**
     * PENDING CLIENT — Google Maps → Share → Embed a map → the `src` of the
     * iframe it gives you (starts https://www.google.com/maps/embed?pb=…).
     * Without it the location section shows no map at all.
     */
    mapEmbedUrl: null as string | null,
    /** PENDING CLIENT — parking, gate, road access, step-free access. */
    access: [] as string[],
  },

  visiting: {
    /** PENDING CLIENT — true if every visit must be arranged in advance. */
    appointmentOnly: null as boolean | null,
    /** PENDING CLIENT — e.g. { days: "Tuesday to Saturday", hours: "10am – 5pm" }. */
    hours: [] as { days: string; hours: string }[],
    /**
     * PENDING CLIENT — fixed visiting slots, if visits run to a timetable.
     * Empty means the form asks only for a rough time of day; it never offers
     * a slot the centre has not confirmed.
     */
    slots: [] as string[],
    /** PENDING CLIENT — named person who receives visitors, if any. */
    contactName: null as string | null,
    /**
     * PENDING CLIENT — a centre-specific number. Empty falls back to the
     * site-wide phone number already published in lib/site.ts.
     */
    contactPhone: null as string | null,
    /**
     * How a request becomes a visit. Written to match the form, which records
     * a request — it does not book anything. Update if the process changes.
     */
    confirmation:
      "We'll call or message you to agree a date and time. Nothing is booked until we've confirmed it with you.",
  },
};

export const isCentreOpen = experienceCentre.status === "open";

/* -------------------------------------------------------------------------- */
/* Gallery                                                                    */
/* -------------------------------------------------------------------------- */

export type GalleryCategory =
  | "Exterior"
  | "Interior"
  | "Detail"
  | "Surroundings"
  | "Arrangement"
  | "Visitors";

export type GalleryImage = {
  media: MediaId;
  category: GalleryCategory;
  caption: string;
};

/**
 * The gallery, in display order. Reorder, add or remove entries freely — the
 * layout adapts. The first two are shown wide, so lead with the strongest
 * exteriors.
 *
 * RULES
 *   - Only photographs taken at the Bengaluru Experience Centre. Never a
 *     project elsewhere, a render, a stock image or a generated image.
 *   - "Arrangement" only for interior set-ups that have genuinely been
 *     photographed there. Delete the entry if there is only one arrangement.
 *   - "Visitors" only with an approved photograph and the subjects' consent.
 *     There is deliberately no such entry yet.
 *   - When a photograph lands, re-read its caption and the alt text in
 *     data/media.ts against what the picture actually shows.
 */
export const gallery: GalleryImage[] = [
  {
    media: "experience-centre.exterior-approach",
    category: "Exterior",
    caption: "The yurt as you arrive.",
  },
  {
    media: "experience-centre.surroundings",
    category: "Surroundings",
    caption: "The structure in its setting.",
  },
  {
    media: "experience-centre.entrance",
    category: "Exterior",
    caption: "The entrance.",
  },
  {
    media: "experience-centre.interior-wide",
    category: "Interior",
    caption: "The circular interior, from the doorway.",
  },
  {
    media: "experience-centre.interior-crown",
    category: "Interior",
    caption: "Looking up to the crown.",
  },
  {
    media: "experience-centre.detail-lattice",
    category: "Detail",
    caption: "The lattice wall and its joints.",
  },
  {
    media: "experience-centre.detail-roof",
    category: "Detail",
    caption: "Rafters meeting the crown ring.",
  },
  {
    media: "experience-centre.detail-cover",
    category: "Detail",
    caption: "The cover, door frame and finishes.",
  },
  {
    media: "experience-centre.arrangement",
    category: "Arrangement",
    caption: "The interior arranged for use.",
  },
];

/* -------------------------------------------------------------------------- */
/* What to experience                                                         */
/* -------------------------------------------------------------------------- */

/**
 * `verified: false` marks a point that depends on how the centre is actually
 * set up. Development builds flag it on the page; confirm it, or delete it,
 * before the centre opens. Never add a display, facility or demonstration the
 * centre does not have.
 */
export const visitPoints: { title: string; body: string; verified: boolean }[] = [
  {
    title: "Stand inside the circle.",
    body: "A round room behaves differently from a square one. The height at the centre, the light from the crown and the way sound settles are easier to feel than to describe.",
    verified: true,
  },
  {
    title: "See the structure up close.",
    body: "The timber frame, the lattice wall, the rafters and the crown are all in view, along with the materials and finishes they are made from.",
    verified: true,
  },
  {
    title: "Walk through the interior arrangement.",
    body: "See how furniture, circulation and the doorway sit within the floor, and what that means for the use you have in mind.",
    verified: false,
  },
  {
    title: "Talk through sizes and configurations.",
    body: "Compare the yurt in front of you with the other sizes in the range, and how each could be arranged for sleeping, treatment rooms, gatherings or living.",
    verified: true,
  },
  {
    title: "Understand what installation involves.",
    body: "How a yurt arrives, what the base needs to be, and what happens on site between delivery and the first night inside.",
    verified: false,
  },
  {
    title: "Bring your project with you.",
    body: "Your land, its access, the number of structures and how they will be used. Plans, photographs and rough ideas are all useful.",
    verified: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Who should visit                                                           */
/* -------------------------------------------------------------------------- */

export const audiences: { title: string; body: string }[] = [
  {
    title: "Resort and hospitality owners",
    body: "Adding distinctive rooms, or testing a new kind of stay before committing to a phase.",
  },
  {
    title: "Glamping operators",
    body: "Comparing structures for guest comfort, durability and how a site of several will feel.",
  },
  {
    title: "Landowners",
    body: "Looking for a light-footprint use for land that is not ready for a permanent building.",
  },
  {
    title: "Wellness and retreat businesses",
    body: "Considering a yurt for practice halls, treatment rooms or quiet accommodation.",
  },
  {
    title: "Architects, designers and planners",
    body: "Checking proportions, details and finishes before specifying a yurt for a client.",
  },
  {
    title: "Private and residential",
    body: "Exploring a yurt as a studio, a guest room or a home on your own land.",
  },
];

/** The "What brings you" options on the visit form. Labels are what is stored. */
export const visitPurposes = [
  "Resort or hospitality project",
  "Glamping business",
  "Wellness or retreat",
  "Private land or residential use",
  "Architecture or design enquiry",
  "Other",
] as const;

/**
 * Time-of-day preferences offered when no confirmed slots exist. A preference,
 * not a promise of availability — the form says so.
 */
export const timePreferences = ["Morning", "Afternoon", "Any time"] as const;
