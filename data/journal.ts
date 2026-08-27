import type { PortableTextBlock } from "sanity";
import type { Post, PostCategory, PostSummary } from "@/sanity/lib/types";

/**
 * JOURNAL ARTICLES & ARCHITECTURAL INTELLIGENCE
 *
 * Authored as structured Portable Text so that a post served from here and
 * a post served from Sanity render through the exact same `<Prose>` pipeline.
 *
 * Every article is paired with high-resolution photography and detailed,
 * practical knowledge tailored for Indian landowners, architects, and hospitality founders.
 */

/* -- Portable Text helpers -------------------------------------------------- */

let keySeed = 0;
const key = () => `local-${(keySeed += 1)}`;

const span = (text: string, marks: string[] = []) => ({
  _type: "span" as const,
  _key: key(),
  text,
  marks,
});

const block = (
  style: "normal" | "h2" | "h3" | "blockquote",
  text: string,
): PortableTextBlock =>
  ({
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [span(text)],
  }) as unknown as PortableTextBlock;

const p = (text: string) => block("normal", text);
const h2 = (text: string) => block("h2", text);
const h3 = (text: string) => block("h3", text);
const quote = (text: string) => block("blockquote", text);

const pCite = (
  text: string,
  label: string,
  href: string,
): PortableTextBlock => {
  const linkKey = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href }],
    children: [span(`${text} (`), span(label, [linkKey]), span(")")],
  } as unknown as PortableTextBlock;
};

const bullets = (items: string[]): PortableTextBlock[] =>
  items.map(
    (item) =>
      ({
        _type: "block",
        _key: key(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [span(item)],
      }) as unknown as PortableTextBlock,
  );

/* -- Categories ------------------------------------------------------------- */

const CATEGORIES = {
  yurts: { title: "Yurts", slug: "yurts" },
  glamping: { title: "Glamping", slug: "glamping" },
  architecture: { title: "Architecture", slug: "architecture" },
  hospitality: { title: "Hospitality", slug: "hospitality" },
  business: { title: "Business", slug: "business" },
  wellness: { title: "Wellness", slug: "wellness" },
  farmstays: { title: "Farm Stays", slug: "farm-stays" },
  sustainability: { title: "Sustainability", slug: "sustainability" },
} as const;

const PUBLISHED_AT = "2026-08-25";

type LocalPost = Omit<Post, "related">;

/* -- Articles --------------------------------------------------------------- */

const articles: LocalPost[] = [
  {
    _id: "local-post-unit-economics-glamping",
    title:
      "The Unit Economics of a 6-Yurt Glamping Resort: Capex, ARR & Payback Horizons",
    slug: "unit-economics-of-a-glamping-resort",
    excerpt:
      "A line-by-line financial model comparing traditional brick-and-mortar masonry suites against modular circular timber yurts across Himachal, Goa, and Maharashtra. How non-permanent installations reach full operational breakeven in 14–18 months.",
    publishedAt: PUBLISHED_AT,
    readingTime: 8,
    heroImage: {
      assetId: "/media/application-resorts.jpg",
      url: "/media/application-resorts.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Multi-unit luxury yurt resort development on an open hillside",
      caption: "Turnkey 6-Unit Yurt Glamping Resort Layout in India",
    },
    author: {
      name: "Theyurts Research & Advisory",
      slug: "theyurts-research",
      role: "Architectural & Financial Practice",
      bio: "The engineering, design, and commercial advisory practice at Theyurts.",
      image: null,
    },
    categories: [
      CATEGORIES.business,
      CATEGORIES.hospitality,
      CATEGORIES.glamping,
    ],
    seo: null,
    body: [
      h2("Executive Summary: The Capex Trap of Traditional Resorts"),
      p(
        "For hospitality entrepreneurs in India, developing a boutique 6-to-10 key mountain or coastal retreat usually involves massive upfront capital expenditure (₹60L to ₹1Cr+ per key for RCC masonry), 18-to-24 months of construction delays, and arduous Change of Land Use (CLU) permitting processes.",
      ),
      p(
        "By contrast, engineered circular timber yurts offer a turnkey, modular, and non-permanent alternative that slashes construction timelines from 18 months to under 4 weeks—drastically accelerating revenue generation and capital payback.",
      ),
      h2("Comparative Capex Breakdown: 6 Keys"),
      p(
        "When analyzing all line items required to open a 6-suite boutique destination:",
      ),
      ...bullets([
        "Civil Groundworks: ₹12L (Yurt platform ground screws) vs ₹54L (Excavation, retaining walls & concrete footings)",
        "Structure & Envelope: ₹96L (6 fully insulated 7.0m Luxury Yurts) vs ₹2.4Cr (RCC structure, brickwork & plastering)",
        "Ensuite & MEP Integration: ₹18L (Modular dry bathrooms) vs ₹36L (Wet plumbing & septic excavation)",
        "Interior Furnishing: ₹24L (Bespoke timber joinery & luxury beds) vs ₹30L (Conventional interior fit-outs)",
        "Total Turnkey Capex: ~₹1.50 Cr for 6 Yurts vs ~₹3.60 Cr for 6 Masonry Cottages",
      ]),
      h2("Revenue Models & Operational Performance"),
      p(
        "In nature-centric tourism hubs such as Himachal Pradesh, Coorg, Wayanad, and Goa, experiential luxury yurts consistently command premium Average Daily Rates (ADR) due to their unique aesthetic and circular column-free spatial drama.",
      ),
      ...bullets([
        "Conservative ADR: ₹11,000 – ₹16,000 / night (including breakfast & guided experience)",
        "Projected High-Season Occupancy: 68% – 76%",
        "Annual Gross Revenue (6 Units at 60% Annual Blended Occupancy): ₹1.44 Cr – ₹1.92 Cr",
        "Operating Margins (EBITDA): 48% – 55% after staffing, F&B, energy and maintenance",
        "Net Operational Payback Period: 14 to 18 months from launch",
      ]),
      h2("Phased Expansion Strategy: Growth Out of Operating Cashflow"),
      p(
        "One of the greatest financial advantages of modular yurt architecture is scalable phasing. A landowner can commission Phase 1 (3 yurts + central dining pavilion), begin accepting guests within 45 days, and fund Phase 2 (an additional 3 to 6 units) entirely out of operational cashflow without incurring high-interest bank debt.",
      ),
    ],
  },

  {
    _id: "local-post-what-is-a-yurt",
    title:
      "What Is a Yurt? A Complete Architectural Guide to Modern Yurts in India",
    slug: "what-is-a-yurt",
    excerpt:
      "A yurt is a circular structure traditionally associated with nomadic Central Asia. Today's modern yurt is a precision-engineered architectural system combining steam-bent ash frameworks, tension rings, and breathable climate membranes.",
    publishedAt: PUBLISHED_AT,
    readingTime: 7,
    heroImage: {
      assetId: "/media/hero-yurt.webp",
      url: "/media/hero-yurt.webp",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Handcrafted modern timber yurt architecture in the Indian landscape",
      caption: "Circular Nomadic Architecture Engineered for India",
    },
    author: {
      name: "Theyurts Engineering Team",
      slug: "theyurts-engineering",
      role: "Workshop Design Lead",
      bio: "Master craftsmen and timber structural engineers at Theyurts.",
      image: null,
    },
    categories: [CATEGORIES.yurts, CATEGORIES.architecture],
    seo: null,
    body: [
      h2("Introduction: An Ancient Geometry Meets Modern Engineering"),
      p(
        "A yurt is a circular structure with a gently sloping conical roof, a central compression crown wheel, and an expanding lattice framework. While its architectural origins trace back over two millennia, the contemporary yurt has evolved into a high-performance, permanent-grade modular building.",
      ),
      p(
        "Modern yurts combine the column-free spatial serenity of circular geometry with modern insulated membranes, insulated double-glazed windows, solid hardwood doors, and integrated luxury ensuite bathrooms.",
      ),
      h2("The Five Structural Components"),
      ...bullets([
        "01. The Compression Crown Wheel: The solid timber ring at the roof apex that locks all radial rafters together, eliminating any need for internal load-bearing columns.",
        "02. Radial Roof Rafters: Precision-planed timber poles that transfer outward roof thrust down into the perimeter tension cable.",
        "03. Expandable Lattice Walls: High-tensile steam-bent ash trellis that unfolds on site to form a curved vertical wall of exceptional strength.",
        "04. Perimeter Tension Band: A heavy-duty steel cable that encircles the wall head, counteracting outward roof forces in pure equilibrium.",
        "05. Multi-Layer Outer Envelope: A tailored combination of breathable organic outer canvas, reflective thermal barrier, and dense insulation felt.",
      ]),
      h2("Why Circular Spaces Feel Fundamentally Different"),
      p(
        "In a conventional rectangular room, visual energy is trapped in 90-degree corners. A circular space diffuses sound waves gently along its perimeter and draws the eye upward toward the central oculus skylight, evoking a deep psychological sense of grounding and calm.",
      ),
    ],
  },

  {
    _id: "local-post-yurts-for-glamping",
    title:
      "Why Yurts Are Transforming Luxury Glamping & Boutique Hospitality in India",
    slug: "why-yurts-could-be-the-future-of-glamping-in-india",
    excerpt:
      "Glamping has redefined experiential luxury travel. Modern guests demand deep immersion in nature—forests, tea plantations, and riversides—without sacrificing 5-star climate control, acoustic quiet, and bespoke comfort.",
    publishedAt: PUBLISHED_AT,
    readingTime: 8,
    heroImage: {
      assetId: "/media/yurt-glamping-site.jpg",
      url: "/media/yurt-glamping-site.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Turnkey luxury glamping resort yurt in scenic Indian landscape",
      caption: "Elevated Glamping Yurt on Forest Timber Deck",
    },
    author: {
      name: "Theyurts Editorial",
      slug: "theyurts-editorial",
      role: "Hospitality Strategy",
      bio: "Editorial and strategic insights from the hospitality team at Theyurts.",
      image: null,
    },
    categories: [CATEGORIES.glamping, CATEGORIES.hospitality],
    seo: null,
    body: [
      h2("The Shift from Camping to Curated Outdoor Luxury"),
      p(
        "Traditional tented camps often suffer from wind flap noise, monsoonal dampness, and flimsy canvas walls that degrade in Indian climates. Modern glamping travellers expect king-size beds, rainfall showers, whisper-quiet air conditioning, and panoramic views.",
      ),
      p(
        "Yurts solve this exact dilemma: they provide the solidity and acoustic insulation of a solid timber lodge, while preserving the romantic, light-footprint feeling of sleeping under the stars.",
      ),
      h2("Key Hospitality Advantages"),
      ...bullets([
        "High Social Shareability: The architectural uniqueness of a circular yurt drives organic guest photography and word-of-mouth booking velocity.",
        "Rapid Commissioning: A 6-unit retreat can be manufactured, delivered, and erected in weeks rather than years.",
        "Zero Permanent Site Disruption: Can be sited on delicate apple orchards, coffee estates, or coastal dunes without disturbing tree root systems.",
      ]),
    ],
  },

  {
    _id: "local-post-yurt-vs-conventional",
    title: "Yurt vs. Traditional Construction: Capex, Speed and Site Impact",
    slug: "yurt-vs-traditional-construction",
    excerpt:
      "When planning a retreat or farm stay, the default solution is often concrete masonry. We analyze civil costs, installation timelines, terrain adaptability, and environmental preservation between both methods.",
    publishedAt: PUBLISHED_AT,
    readingTime: 8,
    heroImage: {
      assetId: "/media/yurt-resort-deck.jpg",
      url: "/media/yurt-resort-deck.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Elevated timber deck yurt construction versus permanent concrete buildings",
      caption: "Light-Footprint Modular Construction on Sloped Land",
    },
    author: {
      name: "Theyurts Engineering Team",
      slug: "theyurts-engineering",
      role: "Workshop Design Lead",
      bio: "Master craftsmen and timber structural engineers at Theyurts.",
      image: null,
    },
    categories: [CATEGORIES.architecture, CATEGORIES.sustainability],
    seo: null,
    body: [
      h2("Comparing the Two Building Approaches"),
      p(
        "Conventional brick-and-mortar civil construction involves heavy earthmoving machinery, deep foundation trenching, scaffolding, cement curing times, and tons of on-site waste.",
      ),
      p(
        "By contrast, a yurt is 100% pre-fabricated under roof in a climate-controlled workshop. When the components arrive on your property, the structure assembles like a precision kit of parts on lightweight helical ground screws or minimal stone piers.",
      ),
      h2("Key Comparative Metrics"),
      ...bullets([
        "Construction Period: 3–4 days per unit vs 12–18 months for masonry.",
        "Soil Excavation: < 2% localized ground displacement vs 100% terrain stripping.",
        "Demountability: 100% retrievable and relocatable vs permanent demolition waste.",
        "Capex per Square Metre: ~₹24,000 – ₹32,000/sqm vs ~₹65,000 – ₹90,000/sqm for luxury concrete builds.",
      ]),
    ],
  },

  {
    _id: "local-post-yurts-indian-climate",
    title:
      "Can Yurts Handle Indian Weather? Designing for Monsoon, Heat and Snow",
    slug: "can-yurts-handle-indian-weather",
    excerpt:
      "Can a yurt withstand a heavy Western Ghats monsoon, sub-zero Himalayan snow accumulation, or 45°C Rajasthan summer heat? We explore the thermodynamic membrane engineering behind climate-specific yurts in India.",
    publishedAt: PUBLISHED_AT,
    readingTime: 9,
    heroImage: {
      assetId: "/media/gallery-landscape-wide.jpg",
      url: "/media/gallery-landscape-wide.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "High-altitude weather-resistant yurt engineered for extreme Indian climates",
      caption: "High-Altitude Weather Resilience in Northern India",
    },
    author: {
      name: "Theyurts Climate Lab",
      slug: "theyurts-climate-lab",
      role: "Materials & Thermal Engineering",
      bio: "Thermodynamic research and membrane engineering specialists.",
      image: null,
    },
    categories: [CATEGORIES.architecture, CATEGORIES.yurts],
    seo: null,
    body: [
      h2("Engineering for Sub-Continental Climate Extremes"),
      p(
        "India encompasses some of the most varied meteorological zones on Earth. A yurt installed at 2,400m altitude in Manali faces sub-zero temperatures and heavy snow loads, while a coastal installation in Goa experiences torrential monsoon rainfall and relentless tropical humidity.",
      ),
      p(
        "There is no single generic yurt specification—every Theyurts unit is configured with tailored membrane layers, moisture barriers, and ventilation mechanics appropriate to its micro-climate.",
      ),
      h2("Three Key Weather Scenarios"),
      h3("1. Western Ghats & Coastal Monsoons (Waterproofing & Breathability)"),
      p(
        "Monsoonal failure in ordinary tents occurs because non-breathable plastic tarps trap interior moisture, causing mildew and condensation. Our multi-layer breathable organic canvas features a 10,000mm hydrostatic head rating that repels driving horizontal rain while allowing interior air humidity to escape naturally.",
      ),
      h3("2. Himalayan High Altitude (Snow Loads & Sub-Zero Insulation)"),
      p(
        "The steep conical roof distributes downward snow weight evenly into radial ash rafters, tested to support up to 180 kg/m² snow accumulation. High-density natural wool insulation felt paired with reflective radiant barriers keeps interiors comfortably heated with modest energy input.",
      ),
      h3("3. Arid Plains & Summer Heat (Stack-Effect Convection)"),
      p(
        "During hot seasons, opening the central operable crown skylight triggers a powerful natural stack effect: warm rising air vents through the ceiling oculus, creating a continuous vacuum that draws cool ambient air in through low wall windows.",
      ),
    ],
  },

  {
    _id: "local-post-start-a-glamping-business",
    title:
      "How to Start a Glamping Business in India: From Land to First Guest",
    slug: "how-to-start-a-glamping-business-in-india",
    excerpt:
      "India boasts extraordinary natural landscapes. A step-by-step roadmap for landowners covering site feasibility, utility routing, non-permanent permitting, revenue optimization, and guest experience curation.",
    publishedAt: PUBLISHED_AT,
    readingTime: 10,
    heroImage: {
      assetId: "/media/luxury-yurt-interior.jpg",
      url: "/media/luxury-yurt-interior.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Boutique glamping suite interior design and luxury guest experience",
      caption: "Boutique Guest Suite Interior & Amenities",
    },
    author: {
      name: "Theyurts Hospitality Advisory",
      slug: "theyurts-hospitality",
      role: "Commercial Planning",
      bio: "Hospitality economics and eco-resort masterplanning advisors.",
      image: null,
    },
    categories: [
      CATEGORIES.business,
      CATEGORIES.glamping,
      CATEGORIES.hospitality,
    ],
    seo: null,
    body: [
      h2("Step 1: Topographical Siting & Orientation"),
      p(
        "Rather than flattening land, map natural sun angles, morning view corridors, and natural windbreaks. Place yurts on elevated timber decks following natural slope contours.",
      ),
      h2("Step 2: Off-Grid & Semi-Off-Grid Utility Planning"),
      p(
        "Budget for discreet underground water lines, greywater filtration reed beds, and solar-hybrid electrical backup. Modular dry-plumbed ensuite pods connect directly to yurt perimeter portals without extensive masonry trenching.",
      ),
      h2("Step 3: Navigating Non-Permanent Approvals"),
      p(
        "In many state eco-tourism guidelines, demountable timber yurts qualify as non-permanent structures, significantly expediting local clearances compared to commercial concrete hotels.",
      ),
    ],
  },

  {
    _id: "local-post-land-zoning-permits",
    title:
      "Navigating Agricultural Land, Forest Clearings & Non-Permanent Permits in India",
    slug: "navigating-agricultural-land-and-permits-in-india",
    excerpt:
      "Why yurts qualify as non-permanent modular installations, sidestepping prolonged commercial land conversion cycles under state eco-tourism guidelines in Uttarakhand, Himachal Pradesh, Maharashtra, and CRZ zones.",
    publishedAt: PUBLISHED_AT,
    readingTime: 7,
    heroImage: {
      assetId: "/media/application-farm-stay.jpg",
      url: "/media/application-farm-stay.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Non-permanent modular yurt installation on agricultural land",
      caption: "Zero-Excavation Farm Stay Accommodation",
    },
    author: {
      name: "Theyurts Regulatory Practice",
      slug: "theyurts-regulatory",
      role: "Land & Environmental Compliance",
      bio: "Advisors on zoning, non-permanent classification, and state eco-tourism guidelines.",
      image: null,
    },
    categories: [
      CATEGORIES.farmstays,
      CATEGORIES.business,
      CATEGORIES.sustainability,
    ],
    seo: null,
    body: [
      h2("The Legal Distinction: Permanent vs Demountable Architecture"),
      p(
        "Across India, pouring permanent concrete foundations and erecting multi-storey masonry on agricultural (Agri) or ecologically sensitive land triggers strict Change of Land Use (CLU) requirements and lengthy municipal approval queues.",
      ),
      p(
        "Because Theyurts utilize fully removable ground screws and bolt-together timber joinery, the entire installation is 100% reversible. When disassembled, the land returns to its virgin state within 48 hours.",
      ),
    ],
  },

  {
    _id: "local-post-acoustics-and-circular-architecture",
    title:
      "The Architecture of Quiet: Why Guests Pay a Premium for Circular Space & Acoustics",
    slug: "acoustics-and-the-circular-space",
    excerpt:
      "How the column-free dome and tensioned fabric ceiling create a tranquil acoustic envelope, dampening external wind while diffusing soft natural daylight from the central crown wheel.",
    publishedAt: PUBLISHED_AT,
    readingTime: 6,
    heroImage: {
      assetId: "/media/yurt-wellness-interior.jpg",
      url: "/media/yurt-wellness-interior.jpg",
      lqip: null,
      aspectRatio: 16 / 9,
      alt: "Tranquil circular yurt interior with radial daylight dome",
      caption: "Column-Free Circular Sanctuary for Wellness & Rest",
    },
    author: {
      name: "Theyurts Design Lab",
      slug: "theyurts-design-lab",
      role: "Spatial Psychology & Architecture",
      bio: "Spatial researchers investigating circular architecture, biophilia and acoustics.",
      image: null,
    },
    categories: [CATEGORIES.wellness, CATEGORIES.architecture],
    seo: null,
    body: [
      h2("Acoustic Physics in Circular Soft-Walled Envelopes"),
      p(
        "Traditional drywall rooms reflect and amplify high-frequency sound waves between parallel walls, creating subtle flutter echoes and mental fatigue. In a circular yurt, tensioned fabric ceiling planes absorb reverberation while curved timber lattice walls scatter sound evenly.",
      ),
      p(
        "The result is a deeply restorative acoustic hush that guests intuitively notice the moment they step through the door.",
      ),
    ],
  },
];

/* -- Public API ------------------------------------------------------------- */

const toSummary = (post: LocalPost): PostSummary => ({
  _id: post._id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
  heroImage: post.heroImage,
  author: post.author,
  categories: post.categories,
});

export const localPostSummaries: PostSummary[] = articles.map(toSummary);

export const localPostSlugs: string[] = articles.map((post) => post.slug);

export const localPost = (slug: string): Post | null => {
  const found = articles.find((post) => post.slug === slug);
  if (!found) return null;

  return {
    ...found,
    related: articles
      .filter((post) => post.slug !== slug)
      .slice(0, 3)
      .map(toSummary),
  };
};

export const localPostCategories: PostCategory[] = Object.values(
  CATEGORIES,
).map((category) => ({
  _id: `local-category-${category.slug}`,
  title: category.title,
  slug: category.slug,
  description: null,
  count: articles.filter((post) =>
    post.categories?.some((c) => c.slug === category.slug),
  ).length,
}));

export const localPostsByCategory = (slug: string): PostSummary[] =>
  articles
    .filter((post) => post.categories?.some((c) => c.slug === slug))
    .map(toSummary);

export const localPostCategory = (slug: string): PostCategory | null =>
  localPostCategories.find((category) => category.slug === slug) ?? null;
