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
    file: "yurt-classic-exterior.jpg",
    ratio: "portrait",
    alt: "A classic yurt seen from outside, door facing the camera.",
    note: "Straight-on elevation. Whole structure in frame, plenty of sky.",
    src: "/media/yurt-classic-exterior.jpg",
  },
  "home.range-resort": {
    file: "yurt-resort-deck.jpg",
    ratio: "portrait",
    alt: "A resort yurt raised on a timber deck.",
    note: "Three-quarter view showing the deck and entrance steps.",
    src: "/media/yurt-resort-deck.jpg",
  },
  "home.range-wellness": {
    file: "yurt-wellness-interior.jpg",
    ratio: "portrait",
    alt: "The interior of a wellness yurt, looking up towards the crown.",
    note: "Wide interior. Light falling through the crown onto the floor.",
    src: "/media/yurt-wellness-interior.jpg",
  },
  "home.range-event": {
    file: "yurt-event-evening.jpg",
    ratio: "portrait",
    alt: "A large event yurt lit from within at dusk.",
    note: "Blue hour. Canvas glowing, landscape still readable.",
    src: "/media/yurt-event-evening.jpg",
  },
  "home.application-resorts": {
    file: "application-resorts.jpg",
    ratio: "editorial",
    alt: "Yurt accommodation at a resort.",
    note: "Several structures in a landscape, spaced apart.",
    src: "/media/application-resorts.jpg",
  },
  "home.application-glamping": {
    file: "application-glamping.jpg",
    ratio: "editorial",
    alt: "A glamping yurt at the edge of a treeline.",
    note: "Single structure, strong landscape context.",
    src: "/media/application-glamping.jpg",
  },
  "home.application-farmstay": {
    file: "application-farm-stay.jpg",
    ratio: "editorial",
    alt: "A yurt on farmland.",
    note: "Working land visible — crops, trees, a track.",
    src: "/media/application-farm-stay.jpg",
  },
  "home.application-wellness": {
    file: "application-wellness.jpg",
    ratio: "editorial",
    alt: "A yurt used as a yoga and meditation space.",
    note: "Empty interior, floor and light doing the work.",
    src: "/media/application-wellness.jpg",
  },
  "home.application-events": {
    file: "application-events.jpg",
    ratio: "editorial",
    alt: "A yurt set up as an event space.",
    note: "Interior dressed for an event. People optional.",
    src: "/media/application-events.jpg",
  },
  "home.builder": {
    file: "builder-configurator.jpg",
    ratio: "landscape",
    alt: "A yurt rendered for the 3D configurator.",
    note: "Neutral studio render of the yurt model. Replaced by the live 3D canvas in Phase 6.",
    src: "/media/builder-configurator.jpg",
  },
  "home.vr": {
    file: "vr-interior-panorama.jpg",
    ratio: "panorama",
    alt: "A wide interior view of a finished yurt.",
    note: "Very wide crop from a 360 capture. Must survive a 2.6:1 letterbox.",
    src: "/media/vr-interior-panorama.jpg",
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
    file: "gallery-landscape-wide.jpg",
    ratio: "landscape",
    alt: "A yurt in open landscape.",
    note: "Wide. Structure small in frame.",
    src: "/media/gallery-landscape-wide.jpg",
  },
  "home.gallery-2": {
    file: "gallery-interior-evening.jpg",
    ratio: "portrait",
    alt: "A yurt interior in the evening.",
    note: "Warm interior light, door or window open to the dark outside.",
    src: "/media/gallery-interior-evening.jpg",
  },
  "home.gallery-3": {
    file: "gallery-detail-door.jpg",
    ratio: "square",
    alt: "The door of a yurt, seen close.",
    note: "Timber door and frame. Detail, not the whole structure.",
    src: "/media/gallery-detail-door.jpg",
  },
  "home.closing": {
    file: "closing-yurt-dusk.jpg",
    ratio: "cinema",
    alt: "A yurt at dusk, lit from inside.",
    note: "Full-bleed closing image. Must hold a headline across the lower third.",
    src: "/media/closing-yurt-dusk.jpg",
  },
  "home.range-luxury": {
    file: "yurt-luxury-interior.jpg",
    ratio: "portrait",
    alt: "The interior of a luxury yurt, dressed for a paying guest.",
    note: "Interior at dusk with lamps on. Bed, textiles and timber all reading warm.",
    src: "/media/yurt-luxury-interior.jpg",
  },
  "home.range-yoga": {
    file: "yurt-yoga-interior.jpg",
    ratio: "portrait",
    alt: "An empty yurt interior laid out as a yoga space.",
    note: "Bare floor, mats rolled at the edge, light falling from the crown.",
    src: "/media/yurt-yoga-interior.jpg",
  },
  "home.range-glamping": {
    file: "yurt-glamping-site.jpg",
    ratio: "portrait",
    alt: "A glamping yurt on a prepared platform.",
    note: "Single structure on a deck, path leading to it, landscape behind.",
    src: "/media/yurt-glamping-site.jpg",
  },
  "home.range-cafe": {
    file: "yurt-cafe-interior.jpg",
    ratio: "portrait",
    alt: "A yurt fitted out as a cafe, with a counter and seating.",
    note: "Counter in frame, a few tables, daylight through an open door.",
    src: "/media/yurt-cafe-interior.jpg",
  },
  "home.range-residential": {
    file: "yurt-residential-exterior.jpg",
    ratio: "portrait",
    alt: "A yurt used as a home, with a planted approach.",
    note: "Lived-in: furniture visible through the door, planting around the deck.",
    src: "/media/yurt-residential-exterior.jpg",
  },
  "home.range-custom": {
    file: "yurt-custom-detail.jpg",
    ratio: "portrait",
    alt: "A detail of a customised yurt door and frame.",
    note: "Close on a bespoke timber detail. Craft, not the whole structure.",
    src: "/media/yurt-custom-detail.jpg",
  },
  "home.application-yoga": {
    file: "application-yoga.jpg",
    ratio: "editorial",
    alt: "A yurt in use as a yoga and meditation space.",
    note: "Wide interior, floor dominant, no people or one figure seated.",
    src: "/media/application-yoga.jpg",
  },
  "home.application-eco": {
    file: "application-eco-tourism.jpg",
    ratio: "editorial",
    alt: "A yurt on an ecologically sensitive site.",
    note: "Structure small in a large landscape. Untouched ground around it.",
    src: "/media/application-eco-tourism.jpg",
  },
  "home.application-cafe": {
    file: "application-cafe.jpg",
    ratio: "editorial",
    alt: "A yurt operating as a cafe.",
    note: "Exterior with the door open and seating spilling outside.",
    src: "/media/application-cafe.jpg",
  },
  "home.application-homes": {
    file: "application-private-home.jpg",
    ratio: "editorial",
    alt: "A yurt used as a private home or annexe.",
    note: "Domestic setting — a garden or plot beside an existing house.",
    src: "/media/application-private-home.jpg",
  },
  "home.application-studios": {
    file: "application-studio.jpg",
    ratio: "editorial",
    alt: "A yurt used as a studio or workspace.",
    note: "Desk, work in progress, daylight. Quiet and occupied.",
    src: "/media/application-studio.jpg",
  },
  "home.application-community": {
    file: "application-community.jpg",
    ratio: "editorial",
    alt: "A yurt used as a classroom or community space.",
    note: "A group seated in a circle. Faces need not be identifiable.",
    src: "/media/application-community.jpg",
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
