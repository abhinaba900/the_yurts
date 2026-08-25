import type { MediaId } from "./media";

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

export const range: {
  name: string;
  tagline: string;
  use: string;
  media: MediaId;
}[] = [
  {
    name: "Classic",
    tagline: "The starting point.",
    use: "A simple, timeless yurt for private retreats, gardens and intimate spaces.",
    media: "home.range-classic",
  },
  {
    name: "Resort",
    tagline: "Designed for guests.",
    use: "A complete accommodation structure created for resorts and hospitality destinations.",
    media: "home.range-resort",
  },
  {
    name: "Luxury",
    tagline: "Built around the experience.",
    use: "A more refined specification for destinations where the room itself is part of the attraction.",
    media: "home.range-luxury",
  },
  {
    name: "Wellness",
    tagline: "A space to slow down.",
    use: "Designed for wellness, therapy, spa and retreat environments.",
    media: "home.range-wellness",
  },
  {
    name: "Yoga",
    tagline: "Room to breathe.",
    use: "A naturally open, column-free space for yoga, movement and group sessions.",
    media: "home.range-yoga",
  },
  {
    name: "Glamping",
    tagline: "Stay close to nature.",
    use: "Premium outdoor accommodation designed for the growing glamping market.",
    media: "home.range-glamping",
  },
  {
    name: "Event",
    tagline: "Gather differently.",
    use: "A large-format space for dining, celebrations, events and experiences.",
    media: "home.range-event",
  },
  {
    name: "Café",
    tagline: "A destination within a destination.",
    use: "A distinctive space for cafés, food concepts and hospitality outposts.",
    media: "home.range-cafe",
  },
  {
    name: "Residential",
    tagline: "A different way to live.",
    use: "Private spaces, studios, guest houses and alternative residences.",
    media: "home.range-residential",
  },
  {
    name: "Custom",
    tagline: "Built around your idea.",
    use: "A yurt designed specifically around your site, requirements and vision.",
    media: "home.range-custom",
  },
];

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

export const featuredArticles = [
  {
    title: "What exactly is a yurt?",
    slug: "what-is-a-yurt",
    readTime: "5 min read",
    tag: "Architecture",
  },
  {
    title: "How much does it cost to build a yurt in India?",
    slug: "yurt-cost-india",
    readTime: "8 min read",
    tag: "Business",
  },
  {
    title: "Yurts vs. conventional construction",
    slug: "yurts-vs-conventional-construction",
    readTime: "6 min read",
    tag: "Engineering",
  },
  {
    title: "How to start a glamping business in India",
    slug: "how-to-start-a-glamping-business-in-india",
    readTime: "10 min read",
    tag: "Hospitality",
  },
];

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
