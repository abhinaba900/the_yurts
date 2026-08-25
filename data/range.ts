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
    tagline: "The starting point.",
    use: "A simple, timeless yurt for private retreats, gardens and intimate spaces.",
    diameter: "5.0m – 6.0m (20 – 28 sqm)",
    capacity: "2 Guests / Studio",
    idealFor: "Private estates & serene garden retreats",
    media: "home.range-classic",
  },
  {
    name: "Resort",
    tagline: "Designed for guests.",
    use: "A complete accommodation structure created for resorts and hospitality destinations.",
    diameter: "6.0m – 8.0m (28 – 50 sqm)",
    capacity: "2–4 Guests / Ensuite Suite",
    idealFor: "Eco-resorts, boutique lodges & glamping hotels",
    media: "home.range-resort",
  },
  {
    name: "Luxury",
    tagline: "Built around the experience.",
    use: "A more refined specification for destinations where the room itself is part of the attraction.",
    diameter: "7.0m – 9.0m (38 – 64 sqm)",
    capacity: "2–4 Guests / Master Villa",
    idealFor: "High-end luxury experiential resorts & villas",
    media: "home.range-luxury",
  },
  {
    name: "Wellness",
    tagline: "A space to slow down.",
    use: "Designed for wellness, therapy, spa and retreat environments.",
    diameter: "6.0m – 8.0m (28 – 50 sqm)",
    capacity: "Treatment rooms / 1–4 Persons",
    idealFor: "Ayurvedic retreats, spa hubs & meditation zones",
    media: "home.range-wellness",
  },
  {
    name: "Yoga",
    tagline: "Room to breathe.",
    use: "A naturally open, column-free space for yoga, movement and group sessions.",
    diameter: "8.0m – 10.0m (50 – 78 sqm)",
    capacity: "12–20 Practitioners",
    idealFor: "Yoga studios, ashrams & group workshops",
    media: "home.range-yoga",
  },
  {
    name: "Glamping",
    tagline: "Stay close to nature.",
    use: "Premium outdoor accommodation designed for the growing glamping market.",
    diameter: "5.0m – 7.0m (20 – 38 sqm)",
    capacity: "2–3 Guests",
    idealFor: "Wilderness camps, hillsides & national park borders",
    media: "home.range-glamping",
  },
  {
    name: "Event",
    tagline: "Gather differently.",
    use: "A large-format space for dining, celebrations, events and experiences.",
    diameter: "10.0m – 12.0m (78 – 113 sqm)",
    capacity: "40–70 Guests",
    idealFor: "Destination weddings, banquet dining & pop-up events",
    media: "home.range-event",
  },
  {
    name: "Café",
    tagline: "A destination within a destination.",
    use: "A distinctive space for cafés, food concepts and hospitality outposts.",
    diameter: "7.0m – 9.0m (38 – 64 sqm)",
    capacity: "16–30 Seats",
    idealFor: "Farm-to-table farmstays, roadside cafés & vineyards",
    media: "home.range-cafe",
  },
  {
    name: "Residential",
    tagline: "A different way to live.",
    use: "Private spaces, studios, guest houses and alternative residences.",
    diameter: "8.0m – 10.0m (50 – 78 sqm)",
    capacity: "Permanent Residence / Family Suite",
    idealFor: "Off-grid farm homes, artists' studios & caretaker pods",
    media: "home.range-residential",
  },
  {
    name: "Custom",
    tagline: "Built around your idea.",
    use: "A yurt designed specifically around your site, requirements and vision.",
    diameter: "Custom Spans & Conjoined Multi-Domes",
    capacity: "Bespoke Capacity",
    idealFor: "Architectural commissions & unique topography",
    media: "home.range-custom",
  },
];
