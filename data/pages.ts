/**
 * Copy for the editorial pages: process, why, glamping business, about.
 *
 * The rule that governs everything in this file: describe what a stage or a
 * consideration *is*, never what Theyurts has achieved, how long it takes, what
 * it costs, or what it will earn. There are no timescales, no capacities, no
 * ratings, no returns. Those are the client's to supply and will be published
 * when they are real.
 */

export const processStages: {
  index: string;
  title: string;
  body: string;
}[] = [
  {
    index: "01",
    title: "Design",
    body: "Starts with the site rather than the catalogue. Where it sits, what the ground is doing, how people arrive, and what has to happen inside. The structure is chosen and adapted from there.",
  },
  {
    index: "02",
    title: "Material selection",
    body: "Timber for the frame, fabric for the cover, and the fixings that hold the two together. Selection is driven by the climate the structure will stand in — a coastal site and a dry inland one are not the same problem.",
  },
  {
    index: "03",
    title: "Manufacturing",
    body: "The lattice, roof poles and crown wheel are made in the workshop, where tolerances can be held and every piece can be checked before it goes anywhere near a field.",
  },
  {
    index: "04",
    title: "Customisation",
    body: "Doors, windows, flooring, insulation and interior fit-out. This is where two structures of the same size stop resembling each other.",
  },
  {
    index: "05",
    title: "Quality check",
    body: "The frame is assembled and inspected before it is packed. A yurt that has never been stood up is not a yurt yet — it is a pile of parts with an assumption attached.",
  },
  {
    index: "06",
    title: "Transportation",
    body: "The frame folds down and the cover packs. What leaves the workshop is a load, not a building, which is what makes remote and difficult sites possible at all.",
  },
  {
    index: "07",
    title: "Installation",
    body: "Assembled on site onto a prepared base. The lattice opens out, the roof poles go up into the crown, the tension band closes the ring, and the cover goes over.",
  },
  {
    index: "08",
    title: "Handover",
    body: "Walked through with whoever will be looking after it, with what they need to know about maintenance, seasons and how the structure wants to be treated.",
  },
];

export const whyPoints: { title: string; body: string }[] = [
  {
    title: "It arrives as parts",
    body: "The frame is made in a workshop and assembled on site. No wet trades, no scaffolding, no concrete frame going up in a field, and no site compound sitting in the middle of a property that is still trading.",
  },
  {
    title: "It suits difficult land",
    body: "Sloped, remote or ecologically sensitive sites where conventional construction is an argument with the ground. A structure that sits on the ground rather than in it can go where a foundation cannot.",
  },
  {
    title: "It can be taken down",
    body: "The properties that let it go up let it come down again, and go somewhere else. If the use of the land changes, the building is not the thing standing in the way.",
  },
  {
    title: "It is one room",
    body: "A circular space with the light coming from directly above. That is the whole appeal, and it is not something a rectangular room can imitate at any budget.",
  },
  {
    title: "It can be added to in stages",
    body: "One structure or ten, and the tenth does not require the first to close. For a site funding growth out of revenue, that changes what is possible.",
  },
  {
    title: "It is legibly what it is",
    body: "Timber, canvas, rope and steel, joined so the structure can be read from inside it. Nothing is clad to look like something else, which is most of why people respond to the room.",
  },
];

/**
 * Where a yurt is the wrong answer.
 *
 * This section exists because a page that only argues one way is not
 * trustworthy, and because the enquiries it deters are the ones that would have
 * wasted everyone's time.
 */
export const whyNot: { title: string; body: string }[] = [
  {
    title: "You need a rectangle",
    body: "Fitted kitchens, standard furniture layouts and dense room planning all assume corners. A circle is generous to look at and unhelpful to fit out efficiently.",
  },
  {
    title: "You need it to be permanent on paper",
    body: "Where a lender, insurer or authority requires permanent construction, a demountable structure can be the wrong category regardless of how well it is built.",
  },
  {
    title: "Maintenance has to be zero",
    body: "A fabric structure is maintained, not ignored. If nobody on site will own that, the structure will not age the way it should.",
  },
  {
    title: "The site cannot be reached",
    body: "The parts still have to get there. Access that defeats a delivery vehicle defeats the project, whatever the structure is made of.",
  },
];

export const glampingTopics: { index: string; title: string; body: string }[] = [
  {
    index: "01",
    title: "The land",
    body: "Not all of a property is worth sleeping on. Aspect, shelter, drainage, noise and what the view actually does at six in the morning matter more than total acreage. The best plot is often not the flattest one.",
  },
  {
    index: "02",
    title: "Access and services",
    body: "How guests arrive, where they park, how far they walk with a bag, and where power and water come from. This is usually the largest cost nobody budgets for, and it is worth knowing before anything else is decided.",
  },
  {
    index: "03",
    title: "Permissions",
    body: "Rules for temporary and semi-permanent accommodation vary by state and by local authority. Establish your position early — it shapes what you can build, how long it can stay, and sometimes whether the plan works at all.",
  },
  {
    index: "04",
    title: "Site planning",
    body: "How many structures, how far apart, and what guests see from each one. Density is the decision that determines whether a site feels like a retreat or a car park with better tents.",
  },
  {
    index: "05",
    title: "Investment",
    body: "Structures are one line among several: groundworks, services, sanitation, furnishing, landscaping, booking systems and the cost of running the thing. Any plan that only counts the structures will be wrong.",
  },
  {
    index: "06",
    title: "Revenue",
    body: "Rate, occupancy and season length are specific to your location, your market and how good the site actually is. We will not put numbers on your project, and you should be wary of anyone who does before seeing the land.",
  },
  {
    index: "07",
    title: "Guest experience",
    body: "What happens between check-in and sleep. Light, warmth, a bed worth the rate, somewhere to put a bag, and a bathroom that does not undo the rest of it.",
  },
  {
    index: "08",
    title: "Expansion",
    body: "Starting small and growing from revenue is the most common route, and it works better when the first phase is planned as a first phase rather than as the whole thing.",
  },
];

export const beliefs: { title: string; body: string }[] = [
  {
    title: "The structure should be readable",
    body: "You should be able to stand inside and see how it stands up. Concealing structure is a decision, and usually the wrong one in a building this simple.",
  },
  {
    title: "The site comes first",
    body: "A yurt that ignores its ground is a tent with ambitions. Where it faces, what it looks at and how it is approached are design decisions, not logistics.",
  },
  {
    title: "Specifications should be true",
    body: "Every figure we publish will come from the workshop. Until it does, we would rather have an empty section on this website than a plausible number on it.",
  },
  {
    title: "It should be worth maintaining",
    body: "A structure that is good enough to look after gets looked after. That is a design problem before it is an ownership one.",
  },
];
