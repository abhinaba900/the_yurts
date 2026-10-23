import type { MediaId } from "./media";
import { localPostSummaries } from "./journal";

/**
 * HOME PAGE CONTENT
 *
 * Updated according to the official Theyurts Homepage Specification.
 */

export const anatomy: { label: string; title: string; body: string }[] = [
  {
    label: "Dome",
    title: "Natural Light & Ventilation",
    body: "Lets daylight into the centre and warm air out when opened.",
  },
  {
    label: "Crown",
    title: "The Centre of the Roof",
    body: "The ring every rafter meets, holding the roof together.",
  },
  {
    label: "Roof",
    title: "A Strong Sloping Roof",
    body: "Timber rafters run from wall to crown and shed the rain.",
  },
  {
    label: "Lattice",
    title: "The Circular Wall Frame",
    body: "A timber lattice that carries the roof and makes the circle.",
  },
  {
    label: "Tension",
    title: "Keeps the Structure Secure",
    body: "A cable round the wall head that resists the roof's outward push.",
  },
  {
    label: "Envelope",
    title: "Weather Protection & Insulation",
    body: "Covers and insulation, specified for the site, against rain, sun and heat.",
  },
];

export const whyYurts: { title: string; body: string }[] = [
  {
    title: "Faster On-Site Assembly",
    body: "Yurt components are manufactured before reaching your property and assembled on a prepared platform. This can significantly reduce the amount of construction work carried out on-site compared with a conventional building.",
  },
  {
    title: "Suitable for Different Locations",
    body: "Yurts can be designed for farms, resorts, plantations, hillside properties and other outdoor settings. The foundation, access requirements and structural specifications are planned around the site.",
  },
  {
    title: "Flexible to Expand or Relocate",
    body: "Start with one yurt and add more as your business grows. Their modular construction also allows structures to be dismantled and relocated where practical, subject to the design and condition of the components.",
  },
  {
    title: "A Unique Experience for Guests",
    body: "The circular layout, exposed timber structure and central roof feature create an accommodation experience that stands apart from an ordinary hotel room or cottage. For resorts and glamping businesses, the structure itself becomes part of the attraction.",
  },
];

/**
 * The ten range models (section 06) live in `data/range.ts`, which is the single
 * source used by both the homepage rail and the /yurts showcase.
 *
 * The homepage words each model by what it is used for rather than by its
 * /yurts tagline, so that copy is kept here, keyed by slug: `band` is the line
 * under each tile in the scrolling band, `heading` and `body` the rail's text.
 */
export const rangeHomeCopy: Record<
  string,
  { band: string; heading: string; body: string }
> = {
  classic: {
    band: "Private stays, garden rooms & studios",
    heading: "For Personal Spaces & Private Stays",
    body: "A versatile yurt for private properties, gardens, studios and peaceful retreats. Choose the size and interior layout that suits your available space.",
  },
  resort: {
    band: "Guest accommodation for resorts",
    heading: "For Resorts & Hospitality Businesses",
    body: "Add distinctive guest accommodation to your resort or hospitality property. Plan layouts with sleeping areas, bathroom facilities and guest amenities according to your requirements.",
  },
  luxury: {
    band: "Premium suites & exclusive stays",
    heading: "For Premium Guest Accommodation",
    body: "Create an exclusive resort suite or high-end private retreat with customised interiors, premium finishes, larger openings and carefully planned guest comforts.",
  },
  wellness: {
    band: "Spa, therapy & relaxation spaces",
    heading: "For Spas & Wellness Retreats",
    body: "A dedicated space for massage therapy, wellness treatments, relaxation sessions and holistic retreats, with interiors planned around the services you provide.",
  },
  yoga: {
    band: "Yoga studios & meditation spaces",
    heading: "For Yoga & Meditation Studios",
    body: "Create an open, pillar-free studio for yoga classes, meditation, breathwork and small group sessions. The circular floor plan allows flexible arrangements.",
  },
  glamping: {
    band: "Comfortable outdoor accommodation",
    heading: "For Outdoor Stays & Nature Resorts",
    body: "Offer guests a comfortable outdoor stay with the option of proper beds, lighting, insulation and other amenities, while keeping them connected to the surrounding landscape.",
  },
  event: {
    band: "Dining, events & private gatherings",
    heading: "For Events & Group Gatherings",
    body: "Create a distinctive venue for private events, intimate celebrations, dining experiences and group activities. The layout and size can be planned around the expected occupancy.",
  },
  cafe: {
    band: "Unique cafés & dining spaces",
    heading: "For Cafés & Dining Experiences",
    body: "Build a unique café, coffee lounge or dining space for your resort or commercial property. Plan seating, entrances and service areas around your business requirements.",
  },
  residential: {
    band: "Holiday homes & guest houses",
    heading: "For Holiday Homes & Guest Houses",
    body: "Create a personal retreat, guest house or alternative living space on your property, with layouts designed around sleeping, lounging and other everyday needs.",
  },
  custom: {
    band: "Yurts designed for your requirements",
    heading: "Designed Specifically for Your Project",
    body: "Have something different in mind? Discuss custom dimensions, openings, interior layouts, finishes and other requirements to create a yurt for your intended use.",
  },
};

/**
 * The rail's specification panel for the featured model (Classic, the one open
 * first). The other models keep the figures from `data/range.ts`.
 */
export const featuredSpec: Record<
  string,
  { diameter: string; capacity: string; idealFor: string }
> = {
  classic: {
    diameter: "Available standard sizes: 6m, 7.2m or 9.6m, subject to configuration",
    capacity: "Based on your chosen interior layout",
    idealFor: "Private retreats, studios, garden rooms and guest accommodation",
  },
};

export const applications: {
  name: string;
  line: string;
  media: MediaId;
}[] = [
  {
    name: "Resorts",
    line: "Create rooms people travel for.",
    media: "home.application-resorts",
  },
  {
    name: "Glamping",
    line: "Turn a piece of land into an experience.",
    media: "home.application-glamping",
  },
  {
    name: "Farm stays",
    line: "Create a new reason to stay.",
    media: "home.application-farmstay",
  },
  {
    name: "Wellness",
    line: "Spaces designed around stillness.",
    media: "home.application-wellness",
  },
  {
    name: "Events",
    line: "Gather under something unexpected.",
    media: "home.application-events",
  },
  {
    name: "Private spaces",
    line: "A room that feels closer to nature.",
    media: "home.application-homes",
  },
];

export const journalTopics: string[] = [
  "Yurts",
  "Glamping",
  "Hospitality",
  "Wellness",
  "Farm stays",
  "Architecture",
  "Sustainability",
  "Business",
];

/**
 * The four articles surfaced on the home page, taken straight from the journal
 * so a card can never point at a post that does not exist. Order and count are
 * the only editorial decisions made here.
 */
export const featuredArticles = localPostSummaries.slice(0, 4).map((post) => ({
  title: post.title,
  slug: post.slug,
  readTime: post.readingTime ? `${post.readingTime} min read` : null,
  tag: post.categories?.[0]?.title ?? null,
}));

export const questions: string[] = [
  "Cost & Capex Planning",
  "Installation Timeline & Process",
  "Site Preparation & Foundations",
  "Indian Climate & Weather Resistance",
  "Monsoon & Heavy Rain Protection",
  "Customisation & Interior Options",
  "Maintenance & Upkeep Requirements",
  "Structure Lifespan & Durability",
  "Transportation & Logistics",
  "Delivery to Remote Locations",
  "Permissions & Non-Permanent Permits",
  "Installation Locations Across India",
];
