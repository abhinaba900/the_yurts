import type { MediaId } from "./media";

/**
 * HOME PAGE CONTENT
 *
 * Copy lives here, separate from layout, so it can be edited without touching a
 * component — and moved into the CMS in Phase 3 without rewriting the page.
 *
 * WHAT IS ALLOWED HERE:
 *   Descriptions of what a yurt is and what Theyurts offers to do.
 *
 * WHAT IS NOT:
 *   Specifications, dimensions, prices, timescales, temperature or wind ratings,
 *   material grades, warranty terms, completed projects, or anything about the
 *   company's history or capacity. None of that has been supplied. Adding a
 *   plausible-sounding number here puts it on a live website as a claim.
 */

export const anatomy: { label: string; body: string }[] = [
  {
    label: "Crown wheel",
    body: "The compression ring at the centre of the roof. Every roof pole meets it, and it is what lets the structure stand without an internal column.",
  },
  {
    label: "Roof poles",
    body: "Straight timber members running from the crown out to the top of the wall, carrying the roof load outward.",
  },
  {
    label: "Lattice wall",
    body: "An expanding timber trellis that forms the circular wall. It folds down flat for transport and opens out on site.",
  },
  {
    label: "Tension band",
    body: "A band around the top of the lattice that resists the outward thrust of the roof. The frame works because this is in tension.",
  },
  {
    label: "Cover",
    body: "The outer skin over the frame, with insulation between. This is where a yurt is adapted for the climate it will stand in.",
  },
];

export const whyYurts: { title: string; body: string }[] = [
  {
    title: "It arrives as parts",
    body: "The frame is made in a workshop and assembled on site. No wet trades, no scaffolding, no concrete frame going up in a field.",
  },
  {
    title: "It suits difficult land",
    body: "Sloped, remote or ecologically sensitive sites where a conventional building would be an argument with the ground.",
  },
  {
    title: "It can be taken down",
    body: "The same properties that let it go up let it come down again, and go somewhere else, if the use of the land changes.",
  },
  {
    title: "It is one room",
    body: "A circular space with the light coming from above. That is the whole appeal, and it is not something a rectangular room can imitate.",
  },
];

export const range: {
  name: string;
  use: string;
  media: MediaId;
}[] = [
  {
    name: "Classic",
    use: "The base structure, closest to the traditional form.",
    media: "home.range-classic",
  },
  {
    name: "Resort",
    use: "Built for paying guests — raised, serviced, and finished to be lived in nightly.",
    media: "home.range-resort",
  },
  {
    name: "Wellness",
    use: "An open, quiet interior for yoga, treatment or meditation.",
    media: "home.range-wellness",
  },
  {
    name: "Event",
    use: "Larger spans for gatherings, dining and hospitality.",
    media: "home.range-event",
  },
];

export const applications: {
  name: string;
  line: string;
  media: MediaId;
}[] = [
  {
    name: "Resorts",
    line: "Rooms that are the reason people book",
    media: "home.application-resorts",
  },
  {
    name: "Glamping",
    line: "A site that can open before it is finished",
    media: "home.application-glamping",
  },
  {
    name: "Farm stays",
    line: "Income from land that is already working",
    media: "home.application-farmstay",
  },
  {
    name: "Wellness retreats",
    line: "A room built around quiet",
    media: "home.application-wellness",
  },
  {
    name: "Event spaces",
    line: "A space that arrives and leaves",
    media: "home.application-events",
  },
];

export const process: { index: string; title: string }[] = [
  { index: "01", title: "Design" },
  { index: "02", title: "Material selection" },
  { index: "03", title: "Manufacturing" },
  { index: "04", title: "Customisation" },
  { index: "05", title: "Quality check" },
  { index: "06", title: "Transportation" },
  { index: "07", title: "Installation" },
  { index: "08", title: "Handover" },
];

export const journalTopics: string[] = [
  "Yurts",
  "Glamping",
  "Hospitality",
  "Wellness",
  "Farm stays",
  "Eco tourism",
  "Architecture",
  "Sustainability",
  "Design",
  "Business",
];

/**
 * Questions, not answers. These are the things people ask before commissioning a
 * structure. Answers come from the workshop in Phase 5 — the FAQ page is where
 * they will be published, and nothing is guessed at here in the meantime.
 */
export const questions: string[] = [
  "How is a yurt built, and what is it made of?",
  "What does the site need to be ready for one?",
  "How long does installation take?",
  "How does it handle monsoon, heat and wind?",
  "What can be customised?",
  "How is it maintained, and how long does it last?",
  "Can it be moved once it is up?",
  "Where in India do you deliver and install?",
];
