/**
 * MEDIA MANIFEST
 *
 * Every image on the site is declared here once, and referenced by id.
 *
 * While `src` is undefined the <Media> component renders a designed placeholder
 * showing the expected filename and crop. To go live with a real photograph:
 *
 *     1. Drop the file into /public/media/
 *     2. Set `src: "/media/<file>"` on its entry below
 *
 * Nothing else changes. No page edits, no layout shift — the crop is already
 * reserved. `npm run content:todo` regenerates docs/CONTENT-NEEDED.md from this.
 *
 * RULE: never point an entry at stock photography or another company's work.
 * An honest placeholder is better than a borrowed photograph.
 */

export type MediaRatio =
  "portrait" | "editorial" | "landscape" | "cinema" | "panorama" | "square";

export type MediaAsset = {
  /** Expected filename from the client. Shown on the placeholder. */
  file: string;
  ratio: MediaRatio;
  /** Alt text. Written now so it is never an afterthought at launch. */
  alt: string;
  /** Direction for the photographer / retoucher. Shown in CONTENT-NEEDED.md. */
  note?: string;
  /** Set this when the real asset lands. */
  src?: string;
  /** Priority load — hero images only. */
  priority?: boolean;
};

export const media = {
  "home.hero": {
    file: "hero-yurt.webp",
    ratio: "cinema",
    alt: "A yurt at the edge of open land, early morning.",
    note: "Full-bleed hero. Landscape dominant, structure off-centre. Needs room at the top for the header and at the bottom for the headline.",
    src: "/media/hero-yurt.webp",
    priority: true,
  },
  "home.range-classic": {
    file: "Classic.webp",
    ratio: "portrait",
    alt: "A classic yurt seen from outside, door facing the camera.",
    note: "Straight-on elevation. Whole structure in frame, plenty of sky.",
    src: "/media/Classic.webp",
  },
  "home.range-resort": {
    file: "Resort.webp",
    ratio: "portrait",
    alt: "A resort yurt raised on a timber deck.",
    note: "Three-quarter view showing the deck and entrance steps.",
    src: "/media/Resort.webp",
  },
  "home.range-wellness": {
    file: "Wellness.webp",
    ratio: "portrait",
    alt: "The interior of a wellness yurt, looking up towards the crown.",
    note: "Wide interior. Light falling through the crown onto the floor.",
    src: "/media/Wellness.webp",
  },
  "home.range-event": {
    file: "Event.webp",
    ratio: "portrait",
    alt: "A large event yurt lit from within at dusk.",
    note: "Blue hour. Canvas glowing, landscape still readable.",
    src: "/media/Event.webp",
  },
  "home.application-resorts": {
    file: "Resorts - Applications.webp",
    ratio: "editorial",
    alt: "Yurt accommodation at a resort.",
    note: "Several structures in a landscape, spaced apart.",
    src: "/media/Aplication/Resorts - Applications.webp",
  },
  "home.application-glamping": {
    file: "Glamping - Applications.webp",
    ratio: "editorial",
    alt: "A glamping yurt at the edge of a treeline.",
    note: "Single structure, strong landscape context.",
    src: "/media/Aplication/Glamping - Applications.webp",
  },
  "home.application-farmstay": {
    file: "Farm Stays - Applications.webp",
    ratio: "editorial",
    alt: "A yurt on farmland.",
    note: "Working land visible — crops, trees, a track.",
    src: "/media/Aplication/Farm Stays - Applications.webp",
  },
  "home.application-wellness": {
    file: "wellness - Applications.webp",
    ratio: "editorial",
    alt: "A yurt used as a wellness retreat space.",
    note: "Empty interior, floor and light doing the work.",
    src: "/media/Aplication/wellness - Applications.webp",
  },
  "home.application-events": {
    file: "Event Spaces - Applications.webp",
    ratio: "editorial",
    alt: "A yurt set up as an event space.",
    note: "Interior dressed for an event. People optional.",
    src: "/media/Aplication/Event Spaces - Applications.webp",
  },
  "home.builder": {
    file: "builder-configurator.jpg",
    ratio: "landscape",
    alt: "A yurt rendered for the 3D configurator.",
    note: "Neutral studio render of the yurt model. Replaced by the live 3D canvas in Phase 6.",
    src: "/media/builder-configurator.jpg",
  },
  "home.vr": {
    file: "Step inside section.webp",
    ratio: "panorama",
    alt: "A wide interior view of a finished yurt.",
    note: "Very wide crop from a 360 capture. Must survive a 2.6:1 letterbox.",
    src: "/media/Step inside section.webp",
  },
  "home.process": {
    file: "workshop-frame-assembly.jpg",
    ratio: "landscape",
    alt: "A timber lattice frame being assembled in the workshop.",
    note: "Hands, tools, timber. Workshop as it actually looks.",
    src: "/media/workshop-frame-assembly.jpg",
  },
  "home.material-timber": {
    file: "material-timber-detail.jpg",
    ratio: "portrait",
    alt: "Close detail of the timber lattice and its joints.",
    note: "Macro. Grain, joint and fixing all legible.",
    src: "/media/material-timber-detail.jpg",
  },
  "home.material-canvas": {
    file: "material-canvas-weave.jpg",
    ratio: "square",
    alt: "Close detail of the canvas weave.",
    note: "Macro, raking light so the weave reads.",
    src: "/media/material-canvas-weave.jpg",
  },
  "home.material-crown": {
    file: "material-crown-wheel.jpg",
    ratio: "editorial",
    alt: "The crown wheel seen from below.",
    note: "Looking straight up. Roof poles radiating into the wheel.",
    src: "/media/material-crown-wheel.jpg",
  },
  "home.gallery-1": {
    file: "939x580 - Gallery.webp",
    ratio: "landscape",
    alt: "Mountain retreat yurt in open landscape.",
    note: "Wide. Structure small in frame.",
    src: "/media/939x580 - Gallery.webp",
  },
  "home.gallery-2": {
    file: "454x276 - Crown Wheel.webp",
    ratio: "landscape",
    alt: "Crown wheel skylight structure.",
    note: "Warm interior light, crown wheel radiating.",
    src: "/media/454x276 - Crown Wheel.webp",
  },
  "home.gallery-3": {
    file: "454x276 - Custom Entrance.webp",
    ratio: "landscape",
    alt: "Timber deck custom entrance door.",
    note: "Timber door and frame. Detail, not the whole structure.",
    src: "/media/454x276 - Custom Entrance.webp",
  },
  "home.gallery-evening": {
    file: "696x420 - Evening atmosphere.webp",
    ratio: "landscape",
    alt: "Evening atmosphere yurt with illuminated canopy and dining.",
    note: "Wide atmospheric dining setup inside a yurt.",
    src: "/media/696x420 - Evening atmosphere.webp",
  },
  "home.closing": {
    file: "closing-yurt-dusk.jpg",
    ratio: "cinema",
    alt: "A yurt at dusk, lit from inside.",
    note: "Full-bleed closing image. Must hold a headline across the lower third.",
    src: "/media/closing-yurt-dusk.jpg",
  },
  "home.range-luxury": {
    file: "Luxury.webp",
    ratio: "portrait",
    alt: "The interior of a luxury yurt, dressed for a paying guest.",
    note: "Interior at dusk with lamps on. Bed, textiles and timber all reading warm.",
    src: "/media/Luxury.webp",
  },
  "home.range-yoga": {
    file: "Yoga.webp",
    ratio: "portrait",
    alt: "An empty yurt interior laid out as a yoga space.",
    note: "Bare floor, mats rolled at the edge, light falling from the crown.",
    src: "/media/Yoga.webp",
  },
  "home.range-glamping": {
    file: "Glamping.webp",
    ratio: "portrait",
    alt: "A glamping yurt on a prepared platform.",
    note: "Single structure on a deck, path leading to it, landscape behind.",
    src: "/media/Glamping.webp",
  },
  "home.range-cafe": {
    file: "Cafe.webp",
    ratio: "portrait",
    alt: "A yurt fitted out as a cafe, with a counter and seating.",
    note: "Counter in frame, a few tables, daylight through an open door.",
    src: "/media/Cafe.webp",
  },
  "home.range-residential": {
    file: "Residential.webp",
    ratio: "portrait",
    alt: "A yurt used as a home, with a planted approach.",
    note: "Lived-in: furniture visible through the door, planting around the deck.",
    src: "/media/Residential.webp",
  },
  "home.range-custom": {
    file: "Custom.webp",
    ratio: "portrait",
    alt: "A detail of a customised yurt door and frame.",
    note: "Close on a bespoke timber detail. Craft, not the whole structure.",
    src: "/media/Custom.webp",
  },
  "home.application-yoga": {
    file: "Yoga & Medidation - Applications.webp",
    ratio: "editorial",
    alt: "A yurt in use as a yoga and meditation space.",
    note: "Wide interior, floor dominant, no people or one figure seated.",
    src: "/media/Aplication/Yoga & Medidation - Applications.webp",
  },
  "home.application-eco": {
    file: "Eco tourism - Applications.webp",
    ratio: "editorial",
    alt: "A yurt on an ecologically sensitive site.",
    note: "Structure small in a large landscape. Untouched ground around it.",
    src: "/media/Aplication/Eco tourism - Applications.webp",
  },
  "home.application-cafe": {
    file: "Cafe - Applications.webp",
    ratio: "editorial",
    alt: "A yurt operating as a cafe.",
    note: "Exterior with the door open and seating spilling outside.",
    src: "/media/Aplication/Cafe - Applications.webp",
  },
  "home.application-homes": {
    file: "Private homes - Applications.webp",
    ratio: "editorial",
    alt: "A yurt used as a private home or annexe.",
    note: "Domestic setting — a garden or plot beside an existing house.",
    src: "/media/Aplication/Private homes - Applications.webp",
  },
  "home.application-studios": {
    file: "Studios and workspaces - Applications.webp",
    ratio: "editorial",
    alt: "A yurt used as a studio or workspace.",
    note: "Desk, work in progress, daylight. Quiet and occupied.",
    src: "/media/Aplication/Studios and workspaces - Applications.webp",
  },
  "home.application-community": {
    file: "Educational and community - Applications.webp",
    ratio: "editorial",
    alt: "A yurt used as a classroom or community space.",
    note: "A group seated in a circle. Faces need not be identifiable.",
    src: "/media/Aplication/Educational and community - Applications.webp",
  },
  "styleguide.ratio-cinema": {
    file: "yurt-landscape.jpg",
    ratio: "cinema",
    alt: "A yurt sited in open landscape at dusk.",
    note: "Wide establishing shot. Structure small in frame, landscape dominant.",
    src: "/media/yurt-landscape.jpg",
  },
  "styleguide.ratio-editorial": {
    file: "luxury-yurt-interior.jpg",
    ratio: "editorial",
    alt: "Interior of a luxury yurt looking towards the crown wheel.",
    note: "Shot from bed height looking up. Natural light through the crown.",
    src: "/media/luxury-yurt-interior.jpg",
  },
  "styleguide.ratio-portrait": {
    file: "material-canvas-detail.jpg",
    ratio: "portrait",
    alt: "Close detail of yurt canvas and timber lattice.",
    note: "Macro. Weave texture and timber grain both legible.",
    src: "/media/material-canvas-detail.jpg",
  },
  "styleguide.ratio-landscape": {
    file: "manufacturing-process.jpg",
    ratio: "landscape",
    alt: "Timber lattice being assembled in the workshop.",
    note: "Hands and tools in frame. Workshop, not staged.",
    src: "/media/manufacturing-process.jpg",
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

/**
 * Whether a real photograph has been supplied for this slot.
 *
 * Sections that lay a scrim over full-bleed imagery use this to skip the scrim
 * while the slot is still a placeholder — a gradient over a placeholder only
 * makes the filename harder to read, and reading the filename is the entire
 * point of it being there.
 */
export const hasMedia = (id: MediaId) => Boolean((media[id] as MediaAsset).src);
