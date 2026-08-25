import type { MediaId } from "./media";
import { localPostSummaries } from "./journal";

/**
 * HOME PAGE CONTENT
 *
 * Updated according to the official Theyurts Homepage Specification.
 */

export const anatomy: { label: string; body: string }[] = [
  {
    label: "Crown",
    body: "The structural heart of the roof.",
  },
  {
    label: "Roof",
    body: "A radial timber structure that distributes the load.",
  },
  {
    label: "Lattice",
    body: "The flexible circular wall system.",
  },
  {
    label: "Tension",
    body: "The element that holds the structure together.",
  },
  {
    label: "Envelope",
    body: "Insulation and outer layers adapted to the environment.",
  },
];

export const whyYurts: { title: string; body: string }[] = [
  {
    title: "Faster to the landscape",
    body: "A modular structure that can be manufactured before it reaches the site and assembled where it belongs.",
  },
  {
    title: "Designed for different ground",
    body: "A solution for resorts, farms, retreats and destinations where conventional construction may not always be ideal.",
  },
  {
    title: "Made to evolve",
    body: "Configure, expand or adapt your space as your needs change.",
  },
  {
    title: "A space people remember",
    body: "The circular form creates an experience that feels fundamentally different from a conventional room.",
  },
];

/**
 * The ten range models (section 06) live in `data/range.ts`, which is the single
 * source used by both the homepage rail and the /yurts showcase.
 */

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

export const process: { index: string; title: string; body: string }[] = [
  {
    index: "01",
    title: "Discover",
    body: "Understand your site, purpose and requirements.",
  },
  {
    index: "02",
    title: "Design",
    body: "Develop the right structure for your needs.",
  },
  {
    index: "03",
    title: "Select",
    body: "Choose materials, finishes and configurations.",
  },
  {
    index: "04",
    title: "Build",
    body: "Craft the structure with precision.",
  },
  {
    index: "05",
    title: "Prepare",
    body: "Get every component ready for its journey.",
  },
  {
    index: "06",
    title: "Deliver",
    body: "Transport the structure to your site.",
  },
  {
    index: "07",
    title: "Install",
    body: "Assemble and finish it on location.",
  },
  {
    index: "08",
    title: "Hand over",
    body: "Your space is ready to experience.",
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
