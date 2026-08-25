/**
 * Comprehensive FAQ with questions, answers, and category groupings.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export const faqData: FaqCategory[] = [
  {
    title: "Construction",
    items: [
      {
        question: "How is a yurt actually built?",
        answer:
          "A yurt is built by assembling expanding timber trellis walls (khana) into a self-supporting circle, connecting a door frame, tensioning a perimeter tension band around the wall head, raising the central timber crown ring (tono), slotting roof rafters (uni) between the wall head and crown, and layering insulating wool felt and a weatherproof canvas membrane over the entire frame.",
      },
      {
        question: "What holds it up without a central column?",
        answer:
          "The structure relies on an equilibrium of opposing forces. The outward thrust of the sloping roof rafters is held in check by a high-tensile perimeter tension band around the top of the wall lattice, while the rafters compress into the central wooden crown ring, forming a rigid self-supporting dome without requiring any central pillars.",
      },
      {
        question: "What is the frame made of?",
        answer:
          "Our frames are crafted from premium kiln-dried hardwoods such as seasoned ash and teak, steam-bent for precision curved lattice work and joined using copper rivets, solid brass pins, and marine-grade steel fasteners for maximum durability.",
      },
      {
        question: "Does it need a foundation?",
        answer:
          "No deep concrete foundation or excavation is required. A yurt sits on the ground via an elevated wooden platform deck resting on discrete ground-screws or stone footings, preserving the natural soil without permanent scarring.",
      },
      {
        question: "What kind of base or deck does it sit on?",
        answer:
          "It is installed on a circular or extended polygonal wooden deck crafted from treated structural timber or composite decking with moisture barriers and thermal insulation underneath.",
      },
    ],
  },
  {
    title: "Installation",
    items: [
      {
        question: "What does the site need to be ready before you arrive?",
        answer:
          "The site only needs clear access and a leveled footprint. If you opt for our turnkey deck system, our team handles footing installation, leveling, and complete structure assembly.",
      },
      {
        question: "How long does installation take?",
        answer:
          "A standard structure (5m–8m diameter) is assembled and enclosed in 2 to 4 days once the platform deck is in place.",
      },
      {
        question: "How much access does a delivery vehicle need?",
        answer:
          "Since every component is modular and flat-packed into bundles under 3 meters long, parts can easily be carried onto remote sites, hillsides, and forested plots that heavy machinery cannot reach.",
      },
      {
        question: "Do you install anywhere in India?",
        answer:
          "Yes, our certified installation team travels to resort sites, hills, coastlines, and private properties across all Indian states.",
      },
      {
        question: "Can it be installed on a slope?",
        answer:
          "Yes, by utilizing an elevated timber or steel post platform on adjustable ground screws, yurts can be erected on steep hillside topography with breathtaking panoramic views.",
      },
    ],
  },
  {
    title: "Customisation",
    items: [
      {
        question: "What can be changed from the standard structure?",
        answer:
          "You can configure yurt diameters (5m, 6m, 7m, 8m, 10m), door styles (single, French double glass), window count and placement, insulation density, canvas colorways, and bespoke timber finishes.",
      },
      {
        question: "Can I specify my own interior?",
        answer:
          "Absolutely. The open circular interior allows for custom partition walls, luxury ensuite bathrooms, kitchenettes, king-size bedroom suites, and bespoke loft mezzanines.",
      },
      {
        question: "Can windows and doors be positioned where I want them?",
        answer:
          "Yes, door and window frames integrate seamlessly into the lattice wall intervals wherever you desire optimal views or cross-ventilation.",
      },
      {
        question: "Can you match an existing property's materials?",
        answer:
          "Yes, exterior canvas tones, wooden door stains, and hardware finishes can be coordinated with your resort or estate's architectural palette.",
      },
    ],
  },
  {
    title: "Materials",
    items: [
      {
        question: "What timber is the frame made from?",
        answer:
          "Kiln-dried seasoned hardwood (ash, sal, or teak) selected for structural flexibility, load-bearing strength, and natural resistance to pests.",
      },
      {
        question: "What is the cover made of, and how is it treated?",
        answer:
          "The outer shell is an ultra-durable, breathable 450+ GSM organic cotton-poly canvas treated for UV resistance, mildew proofing, and water column hydrostatic head exceeding 10,000mm.",
      },
      {
        question: "Is it insulated, and with what?",
        answer:
          "Multi-layer thermal insulation combining natural needle-punched wool felt and reflective thermal radiation barriers to maintain comfort across both winter chills and summer sun.",
      },
      {
        question: "What are the fixings and hardware?",
        answer:
          "Solid copper lattice rivets, marine-grade 316 stainless steel tension cables, and forged brass latches and hardware.",
      },
    ],
  },
  {
    title: "Weather",
    items: [
      {
        question: "How does it handle monsoon rain?",
        answer:
          "Its steep conical roof profile naturally sheds heavy rainfall instantly, while overlap eaves, taped seams, and a breathable waterproof outer membrane keep the interior completely dry during heavy Indian monsoons.",
      },
      {
        question: "What happens in high wind?",
        answer:
          "The aerodynamic circular profile allows high winds to flow smoothly around the structure rather than pushing flat against walls, tested to withstand gusts up to 120 km/h.",
      },
      {
        question: "How does it perform in summer heat?",
        answer:
          "The operable central crown skylight creates a natural chimney effect (stack ventilation), constantly drawing cool air from low wall windows and venting hot air out the roof.",
      },
      {
        question: "Is it usable year-round?",
        answer:
          "Yes, with proper multi-layer thermal insulation and climate control (AC or wood-burning stove), yurts provide luxurious 4-season comfort in sub-zero Himalayan winters as well as tropical summers.",
      },
    ],
  },
  {
    title: "Maintenance and lifespan",
    items: [
      {
        question: "What maintenance does it need, and how often?",
        answer:
          "An annual wash of the canvas cover and seasonal tension inspections. Timber lattices benefit from an occasional natural oil conditioning every 2–3 years.",
      },
      {
        question: "How long does the cover last before replacement?",
        answer:
          "10 to 15+ years depending on local UV and weather exposure. Replacement covers can be ordered modularly and swapped in a single day.",
      },
      {
        question: "How long does the frame last?",
        answer:
          "The solid hardwood timber frame is built to last 30 to 50+ years with basic care.",
      },
      {
        question: "Who does the maintenance — us or you?",
        answer:
          "We provide complete annual maintenance packages, replacement canvas skins, and also train on-site resort staff for basic seasonal upkeep.",
      },
    ],
  },
  {
    title: "Transport and delivery",
    items: [
      {
        question: "How is it transported?",
        answer:
          "Flat-packed in custom weather-sealed crates transported via standard commercial freight or pick-up truck.",
      },
      {
        question: "What happens if my site cannot be reached by truck?",
        answer:
          "The modular bundles can be portered by hand, pack animal, or small utility vehicle over trails and footpaths.",
      },
      {
        question: "Can it be moved after it is installed?",
        answer:
          "Yes, 100% of the structure is demountable. It can be completely unbolted, packed up, and re-erected elsewhere without material loss.",
      },
      {
        question: "What is involved in relocating one?",
        answer:
          "Disassembly takes 1 to 2 days with a small crew, packing directly into crates for transport to the new location.",
      },
    ],
  },
  {
    title: "Pricing and support",
    items: [
      {
        question: "What does a yurt cost?",
        answer:
          "Structures range from standard glamping suites to bespoke luxury master dwellings. Pricing depends on diameter, insulation grade, and door/window configurations. Contact us for our detailed pricing catalogue.",
      },
      {
        question: "What is included in a quote, and what is not?",
        answer:
          "Quotes include the complete structural frame, crown, tension bands, insulation pack, canvas membrane, door/window assemblies, and hardware. Platform decking, interior fit-outs, and MEP connections can be included as turnkey packages.",
      },
      {
        question: "What warranty comes with it?",
        answer:
          "A 5-year structural warranty on timber frames and a 3-year warranty on canvas weatherproof membranes.",
      },
      {
        question: "What support is there after handover?",
        answer:
          "Dedicated client support, spare parts availability, scheduled inspection visits, and priority seasonal maintenance services.",
      },
    ],
  },
];

// For backward compatibility
export const faqFallback = faqData.map((group) => ({
  title: group.title,
  questions: group.items.map((item) => item.question),
}));
