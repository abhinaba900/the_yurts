import type { MediaId } from "./media";

export type RangeEntry = {
  name: string;
  tagline: string;
  use: string;
  diameter: string;
  capacity: string;
  idealFor: string;
  media?: MediaId;
};

export const rangeFallback: RangeEntry[] = [
  {
    name: "Classic",
    tagline: "The timeless heritage baseline",
    use: "The base structure, closest to the traditional form. The starting point for everything else in the range.",
    diameter: "5.0m – 6.0m (20 – 28 sqm)",
    capacity: "2 Guests / Studio",
    idealFor: "Private estates & serene garden retreats",
    media: "home.range-classic",
  },
  {
    name: "Resort",
    tagline: "Turnkey luxury guest hospitality suite",
    use: "Built for paying guests — raised off the ground, fully serviced, and finished to be lived in nightly.",
    diameter: "6.0m – 8.0m (28 – 50 sqm)",
    capacity: "2–4 Guests / Ensuite Suite",
    idealFor: "Eco-resorts, boutique lodges & glamping hotels",
    media: "home.range-resort",
  },
  {
    name: "Luxury",
    tagline: "Elevated bespoke architectural suite",
    use: "The resort structure with the interior specification taken further, for destination sites competing on the room itself.",
    diameter: "7.0m – 9.0m (38 – 64 sqm)",
    capacity: "2–4 Guests / Master Villa",
    idealFor: "High-end luxury experiential resorts & villas",
    media: "home.range-luxury",
  },
  {
    name: "Wellness",
    tagline: "A circular sanctuary dedicated to quietude",
    use: "An uninterrupted circular floor with soft natural light from above. Ideal for treatment rooms, spas and therapy spaces.",
    diameter: "6.0m – 8.0m (28 – 50 sqm)",
    capacity: "Treatment rooms / 1–4 Persons",
    idealFor: "Ayurvedic retreats, spa hubs & meditation zones",
    media: "home.range-wellness",
  },
  {
    name: "Yoga",
    tagline: "Expansive acoustic practice pavilion",
    use: "An open column-free timber floor sized for class sessions, blessed with the gentle acoustics of a tensioned soft-walled dome.",
    diameter: "8.0m – 10.0m (50 – 78 sqm)",
    capacity: "12–20 Practitioners",
    idealFor: "Yoga studios, ashrams & group workshops",
    media: "home.range-yoga",
  },
  {
    name: "Glamping",
    tagline: "Phased turnkey adventure accommodation",
    use: "For sites that need to open in stages — premium accommodation that can be erected on a plot before permanent works finish.",
    diameter: "5.0m – 7.0m (20 – 38 sqm)",
    capacity: "2–3 Guests",
    idealFor: "Wilderness camps, hillsides & national park borders",
    media: "home.range-glamping",
  },
  {
    name: "Event",
    tagline: "Grand gathering & dining pavilion",
    use: "Larger spans for communal gatherings, dining and hospitality on sites where a permanent hall makes no ecological sense.",
    diameter: "10.0m – 12.0m (78 – 113 sqm)",
    capacity: "40–70 Guests",
    idealFor: "Destination weddings, banquet dining & pop-up events",
    media: "home.range-event",
  },
  {
    name: "Café",
    tagline: "Social hospitality & food outpost",
    use: "A serving and seating circular space with fixed service counter integration, for sites where food is part of the draw.",
    diameter: "7.0m – 9.0m (38 – 64 sqm)",
    capacity: "16–30 Seats",
    idealFor: "Farm-to-table farmstays, roadside cafés & vineyards",
    media: "home.range-cafe",
  },
  {
    name: "Residential",
    tagline: "Year-round permanent off-grid dwelling",
    use: "Specified to be lived in rather than stayed in — multi-room studios, guest annexes and self-sufficient homes on delicate terrain.",
    diameter: "8.0m – 10.0m (50 – 78 sqm)",
    capacity: "Permanent Residence / Family Suite",
    idealFor: "Off-grid farm homes, artists' studios & caretaker pods",
    media: "home.range-residential",
  },
  {
    name: "Custom",
    tagline: "Bespoke commission engineered to your site",
    use: "Anything the standard range does not cover, worked out from your topographical survey, climate parameters, and bespoke requirements.",
    diameter: "Custom Spans & Conjoined Multi-Domes",
    capacity: "Bespoke Capacity",
    idealFor: "Architectural commissions & unique topography",
    media: "home.range-custom",
  },
];
