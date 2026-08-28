import type { MediaId } from "./media";

/**
 * APPLICATIONS — static fallback.
 *
 * The eleven uses Theyurts has said it serves, each written as the case for that
 * use rather than as a feature list.
 *
 * These describe how yurts are used and what a buyer in each category has to
 * think about. They contain no claims about Theyurts' capacity, timescales,
 * pricing or completed work. CMS `application` documents replace this once they
 * exist.
 */

export type ApplicationEntry = {
  name: string;
  slug: string;
  /** One line, shown beside the name in the index. */
  line: string;
  /** Two or three sentences making the case. */
  body: string;
  /** What someone building for this use has to work out. Questions, not answers. */
  considerations: string[];
  media?: MediaId;
  /**
   * Meta description for /applications/<slug>. Written rather than derived:
   * truncating `body` to 155 characters cuts it mid-sentence.
   */
  metaDescription?: string;
};

export const applicationsFallback: ApplicationEntry[] = [
  {
    name: "Resorts",
    slug: "resorts",
    line: "Rooms that are the reason people book",
    metaDescription:
      "Yurts as resort accommodation — rooms guests photograph and book first, added without closing the property or building a new wing.",
    body: "A resort room is a commodity until it stops looking like one. A yurt is the room guests photograph, and the one that fills first at a higher rate than the block behind it. It also lets a property add keys without closing, without a construction site in the middle of the grounds, and without the approvals a new wing would need.",
    considerations: [
      "How the structure sits relative to existing rooms and rates",
      "Servicing — water, power, drainage and housekeeping routes",
      "Whether the site can take vehicles for delivery and installation",
      "Seasonality, and whether the structure works year-round on that site",
    ],
    media: "home.application-resorts",
  },
  {
    name: "Glamping",
    slug: "glamping",
    line: "A site that can open before it is finished",
    metaDescription:
      "Yurts for glamping sites in India — accommodation that arrives before the infrastructure, so a site can open and expand out of its own revenue.",
    body: "Glamping works because the accommodation arrives before the infrastructure does. A site can open with a handful of structures, take bookings, and expand from revenue rather than from a loan. The structure has to be good enough to justify the rate on the first night, and durable enough to still justify it three seasons later.",
    considerations: [
      "Access, parking and how far guests walk from the car",
      "Where power and water come from, and what that costs to bring in",
      "Local permissions for temporary and semi-permanent accommodation",
      "How many structures the land can hold before it stops feeling remote",
    ],
    media: "home.application-glamping",
  },
  {
    name: "Farm stays",
    slug: "farm-stays",
    line: "Income from land that is already working",
    metaDescription:
      "Yurts for farm stays — income from land that is already working, with a room that does not take the field permanently out of use.",
    body: "Farmland has the two things accommodation needs — space and a reason to be there — and usually neither the buildings nor the capital to use them. A yurt puts a room on a field without taking the field out of use permanently, and can be moved or removed if the farm's needs change.",
    considerations: [
      "Which part of the land is genuinely pleasant to sleep on",
      "Separating guest movement from working areas and machinery",
      "What guests actually do during the day",
      "Whether this stays a side income or becomes the main one",
    ],
    media: "home.application-farmstay",
  },
  {
    name: "Wellness retreats",
    slug: "wellness-retreats",
    line: "A room built around quiet",
    metaDescription:
      "Yurts for wellness retreats — a quiet, circular treatment or therapy room, and what to work out about acoustics, servicing and siting before you build one.",
    body: "A circular room with no corners, soft walls and light entering from directly above is a genuinely different space to be in — and it is difficult to build that in masonry at any sensible cost. For retreats, the building is not the container for the experience; it is a substantial part of it.",
    considerations: [
      "Separation between treatment, sleeping and communal spaces",
      "Acoustic distance from roads, kitchens and other guests",
      "Heating and cooling for people who are still for long periods",
      "Floor finish, and what it has to take",
    ],
    media: "home.application-wellness",
  },
  {
    name: "Yoga and meditation",
    slug: "yoga-and-meditation",
    line: "An uninterrupted floor and light from above",
    metaDescription:
      "Yurts for yoga and meditation — an uninterrupted column-free floor with light from above, plus what to plan for on capacity, flooring and access.",
    body: "No columns, no corners to be stuck in, and a crown that lights the centre of the room. The shape does most of the work: a circle has no back row. Sized for a class rather than a bedroom, it is a practice space that does not need to pretend to be one.",
    considerations: [
      "Floor area against the class size you actually want to run",
      "Ventilation, which matters more here than in a bedroom",
      "Storage for props, and whether it lives inside or out",
      "Ground preparation and how level the floor has to be",
    ],
    media: "home.application-yoga",
  },
  {
    name: "Eco tourism",
    slug: "eco-tourism",
    line: "A light footprint that is legible to guests",
    metaDescription:
      "Yurts for eco tourism — a light, legible footprint guests can read for themselves, and the questions to settle on land, services and seasonality first.",
    body: "Eco tourism has to be visibly true, not just claimed in the listing. A structure that sits on the ground rather than in it, arrives as parts, and can be removed without demolition is an argument a guest can see. It also lets you build on land where the point is that the land stays as it is.",
    considerations: [
      "Ecological sensitivity of the site and what may be disturbed",
      "Foundations, and how little you can get away with",
      "Waste and water strategy on a remote site",
      "Restoration — what the land looks like if the structure leaves",
    ],
    media: "home.application-eco",
  },
  {
    name: "Event spaces",
    slug: "event-spaces",
    line: "A space that arrives and leaves",
    metaDescription:
      "Yurts as event spaces — a large-format room that arrives and leaves, for dining, weddings and celebrations, plus what access and servicing it needs.",
    body: "Weddings, dinners and gatherings need a room for a weekend, not a hall for a decade. A larger yurt gives a space with acoustics and warmth that a marquee does not, and permanence a marquee cannot suggest — while still being something that can come down.",
    considerations: [
      "Standing and seated capacity for the events you intend to run",
      "Catering access, power load and where the kitchen sits",
      "Weather contingency, and what happens if it turns",
      "Whether the structure stays up between events or is struck",
    ],
    media: "home.application-events",
  },
  {
    name: "Cafés and restaurants",
    slug: "cafes-and-restaurants",
    line: "A dining room that is part of the reason to come",
    metaDescription:
      "Yurts for cafés and restaurants — a dining room that is part of the reason to visit, with the servicing, seating and access questions worth settling early.",
    body: "Somewhere to eat on a site people are already visiting — a farm, a vineyard, a trailhead. A round room seats well, and the structure itself is a draw rather than a shed with tables in it.",
    considerations: [
      "Covers, and the kitchen needed behind them",
      "Extraction, grease, fire separation and local food premises rules",
      "Service flow between kitchen, counter and tables",
      "Whether it trades year-round or seasonally",
    ],
    media: "home.application-cafe",
  },
  {
    name: "Private homes",
    slug: "private-homes",
    line: "A room on land that will not take a building",
    metaDescription:
      "Yurts as private homes and guest rooms — a room on land that will not take a conventional building, and what to settle on services and permissions.",
    body: "A studio, a guest annexe, or a home on a plot where conventional construction is an argument with the ground. It goes up without a site compound, and on land where permanent building is restricted it may be the option that is actually available.",
    considerations: [
      "Permitted development and local planning position",
      "Insulation and services for year-round occupation",
      "Its relationship to any existing house on the plot",
      "Long-term maintenance, and who does it",
    ],
    media: "home.application-homes",
  },
  {
    name: "Studios and workspaces",
    slug: "studios-and-workspaces",
    line: "Somewhere to work that is not the house",
    metaDescription:
      "Yurts as studios and workspaces — somewhere to work that is not the house, and what to settle on power, insulation, light and where it sits on the plot.",
    body: "A separate room at the end of the garden or the edge of the plot. Enough distance to change mode, enough quiet to hold attention, and daylight from above that does not sit on a screen.",
    considerations: [
      "Daylight and glare against the work being done",
      "Power, network and heating for a full working day",
      "Acoustic isolation, in both directions",
      "Security for equipment left overnight",
    ],
    media: "home.application-studios",
  },
  {
    name: "Educational and community spaces",
    slug: "educational-and-community-spaces",
    line: "A room a group can gather in",
    metaDescription:
      "Yurts as educational and community spaces — a room a group can gather in, and the questions to answer on capacity, access, servicing and year-round use.",
    body: "Classrooms, forest schools, workshops and village spaces. A circle is a good shape for a group that has to see each other, and a structure that can be relocated suits an organisation whose site or funding may change.",
    considerations: [
      "Group size, and how the room is used across a day",
      "Accessibility — approach, threshold and floor",
      "Safeguarding, fire routes and the standards that apply",
      "Who maintains it, and out of which budget",
    ],
    media: "home.application-community",
  },
];
