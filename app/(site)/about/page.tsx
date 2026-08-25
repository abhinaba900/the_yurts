import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

import { AboutArchitectureStage } from "@/components/about/AboutArchitectureStage";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Theyurts designs, manufactures, and turnkey-installs precision-engineered circular timber yurts across India — for resorts, glamping sites, farm stays, and private landowners.",
  path: "/about",
});

const corePillars = [
  {
    index: "01",
    title: "Structural Honesty & Readable Geometry",
    what: "What it is: A column-free circular timber space where every steam-bent ash rafter radiates into a central crown wheel.",
    why: "Why we use it: Concealing structural engineering with false ceilings or drywall removes the emotional magic of natural space. In a yurt, the compression ring and tension band do the structural work in plain view.",
    good: "Why it is good: Creates a calming, expansive acoustic envelope with natural daylight streaming through the 360° oculus skylight, proven to elevate guest satisfaction and wellbeing.",
  },
  {
    index: "02",
    title: "Land-First, Zero-Concrete Engineering",
    what: "What it is: Elevated timber platform structures mounted on removable helical ground screws or minimal stone pier stilts.",
    why: "Why we use it: Traditional brick-and-mortar masonry requires invasive excavation, deep concrete sumps, and permanent land destruction—often impossible on steep hillsides, forest fringes, or agricultural land.",
    good: "Why it is good: Leaves 98% of the natural soil profile completely untouched. The structure sits gently on the land rather than fighting it, easily complying with eco-tourism and non-permanent guidelines.",
  },
  {
    index: "03",
    title: "Pre-Engineered Workshop Tolerance",
    what: "What it is: 100% of the lattice walls, rafters, door joinery, and compression rings are precision-machined and test-assembled under roof before shipment.",
    why: "Why we use it: On-site building in remote Indian terrains leads to weather delays, uneven material quality, and uncontrolled site compounds.",
    good: "Why it is good: What leaves our workshop is a flat-packed architectural system that assembles on your site in just 3 to 4 days, with zero wet trades, scaffolding, or extended noise disruption.",
  },
  {
    index: "04",
    title: "Multi-Layer Climate Membranes",
    what: "What it is: A tailored multi-layer skin combining heavy-duty organic canvas, moisture-breathing vapour barriers, and dense thermal insulation.",
    why: "Why we use it: India's weather ranges from -15°C sub-zero Himalayan blizzards to 45°C arid summers and torrential Western Ghats monsoons.",
    good: "Why it is good: Prevents condensation, rejects mold, sheds heavy snow loads naturally, and maintains stable interior room temperatures year-round.",
  },
];

const materialBreakdown = [
  {
    id: "home.material-timber" as const,
    name: "Steam-Bent Ash Lattice",
    what: "Expanding high-tensile timber framework with hand-hammered copper rivets.",
    why: "Offers unmatched flexibility to fold down for transport, opening into a high-strength curved wall.",
    benefit: "Natural timber warmth, high load-bearing strength, and lifetime structural repairability.",
  },
  {
    id: "home.material-crown" as const,
    name: "Solid Crown Wheel Oculus",
    what: "Heavy timber compression ring that anchors every roof rafter at the apex.",
    why: "Eliminates all internal columns, providing 100% usable open floor space inside the room.",
    benefit: "360° celestial sky view and natural stack-effect convection ventilation.",
  },
  {
    id: "home.material-canvas" as const,
    name: "Weatherproof Organic Canvas",
    what: "Heavyweight, UV-treated, fire-retardant, and water-repellent breathable skin.",
    why: "Breathes during heavy humidity while preventing external wind and rain penetration.",
    benefit: "Soft fabric acoustics that muffle heavy wind and rain, unlike noisy metal or glass pods.",
  },
  {
    id: "home.gallery-3" as const,
    name: "Custom Joinery & Hardware",
    what: "Solid hardwood entrance doors, insulated glazed windows, and forged tension cables.",
    why: "Ensures thermal perimeter seals, guest security, and seamless integration with timber decks.",
    benefit: "High-traffic durability with luxury residential-grade locks and weather-stripped sills.",
  },
];

const terrainCards = [
  {
    region: "Himalayan Slopes & Snow Zones",
    states: "Himachal Pradesh · Uttarakhand · Ladakh · Kashmir",
    desc: "Engineered for 30° steep mountain gradients and 180 kg/m² snow loads. Radial conical roofs shed snow accumulation naturally while multi-layer thermal wool retains wood-stove heat in sub-zero winters.",
  },
  {
    region: "Coastal & High-Humidity Zones",
    states: "Goa · Kerala · Maharashtra Konkan · Andaman",
    desc: "100% non-permanent modularity complying with Coastal Regulation Zone (CRZ) bylaws. Mildew-resistant breathable outer membranes ensure zero interior condensation and rapid air circulation.",
  },
  {
    region: "Agricultural & Farm Stays",
    states: "Punjab · Haryana · Karnataka · Tamil Nadu",
    desc: "Allows agricultural landowners to unlock hospitality revenue without prolonged CLU (Change of Land Use) conversion cycles. Zero-concrete footings keep farming soil fertile and retrievable.",
  },
  {
    region: "Arid & Desert Landscapes",
    states: "Rajasthan · Gujarat · Kutch",
    desc: "Reflective canvas finishes with dual ventilation flaps to resist intense daytime solar radiation while retaining evening warmth in cold desert nights.",
  },
];

/**
 * About Page.
 *
 * Full Yarts-driven editorial architecture with alternating Dark/Light section rhythm.
 * Every section clearly articulates:
 * 1. What it is for
 * 2. Why we are using it
 * 3. Why it is good
 */
export default async function AboutPage() {
  return (
    <>
      {/* =========================================================================
          SECTION 1: HERO & ORIGIN (Dark Surface)
          ========================================================================= */}
      <PageHeader
        eyebrow="About Theyurts"
        title="A new company, building an ancient structure with precision."
        lead="Theyurts designs, manufactures, and turnkey-installs circular timber yurts across India. We are built on the conviction that the most remarkable accommodation should leave the lightest footprint on the ground."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Engineered in our workshop and erected on your land without wet
              trades, concrete foundations, or prolonged construction disruption.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Discuss an installation</ArrowLink>
            </div>
          </div>
        }
      />

      {/* Interactive Architectural Specification Stage */}
      <div className="u-container pb-(--spacing-section)">
        <Reveal kind="media">
          <AboutArchitectureStage />
        </Reveal>
      </div>

      {/* =========================================================================
          SECTION 2: THE PROBLEM WE SOLVE (Light Paper Surface)
          ========================================================================= */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">The Gap in the Market</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                There is a gap between a tent and a building.
              </h2>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                India has vast landscapes where conventional brick-and-mortar
                construction is slow, expensive, and environmentally destructive.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted">
                Luxury canvas tents degrade within three monsoons, while container
                and metal pods feel artificial and thermally unlivable. Theyurts
                was founded to manufacture the properly engineered, permanent-grade
                timber yurt in India—combining authentic architectural craftsmanship
                with complete climate resilience.
              </p>
            </div>
          </div>

          {/* 3-Way Comparative Grid */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="rounded-sm border border-line bg-surface p-7 flex flex-col justify-between">
              <div>
                <span className="font-sans text-meta uppercase text-text-muted text-xs">
                  Option 01
                </span>
                <h3 className="mt-2 font-display text-display-sm text-text">
                  Conventional Concrete Masonry
                </h3>
                <ul className="mt-4 space-y-2.5 font-sans text-small text-text-muted border-t border-line/60 pt-4">
                  <li>&times; 12–18 month construction timeline</li>
                  <li>&times; Invasive excavation & concrete sumps</li>
                  <li>&times; Heavy environmental footprint</li>
                  <li>&times; High upfront capital expenditure</li>
                </ul>
              </div>
              <span className="mt-6 block font-sans text-meta uppercase text-text-muted text-[0.6875rem]">
                Verdict: Too slow & rigid
              </span>
            </div>

            <div className="rounded-sm border border-line bg-surface p-7 flex flex-col justify-between">
              <div>
                <span className="font-sans text-meta uppercase text-text-muted text-xs">
                  Option 02
                </span>
                <h3 className="mt-2 font-display text-display-sm text-text">
                  Temporary Canvas Safari Tents
                </h3>
                <ul className="mt-4 space-y-2.5 font-sans text-small text-text-muted border-t border-line/60 pt-4">
                  <li>&times; Fabric flapping & poor wind stability</li>
                  <li>&times; Mildew and mold during monsoons</li>
                  <li>&times; Poor sub-zero winter insulation</li>
                  <li>&times; 2 to 3-year replacement cycle</li>
                </ul>
              </div>
              <span className="mt-6 block font-sans text-meta uppercase text-text-muted text-[0.6875rem]">
                Verdict: High maintenance & fragile
              </span>
            </div>

            <div className="rounded-sm border-2 border-accent bg-surface-alt p-7 shadow-lg flex flex-col justify-between">
              <div>
                <span className="font-sans text-meta uppercase text-accent-text font-semibold text-xs">
                  Option 03 &middot; The Yarts Standard
                </span>
                <h3 className="mt-2 font-display text-display-sm text-text">
                  Engineered Circular Timber Yurts
                </h3>
                <ul className="mt-4 space-y-2.5 font-sans text-small text-text border-t border-line/60 pt-4">
                  <li>&check; 3 to 4-day turnkey on-site assembly</li>
                  <li>&check; Zero concrete footprint & 100% relocatable</li>
                  <li>&check; Multi-layer thermal & monsoon breathability</li>
                  <li>&check; High guest RevPAR & 14-month ROI payback</li>
                </ul>
              </div>
              <span className="mt-6 block font-sans text-meta uppercase text-accent-text font-semibold text-[0.6875rem]">
                Verdict: Optimal luxury & speed
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* =========================================================================
          SECTION 3: FOUR GUIDING PRINCIPLES (Dark Walnut Surface)
          ========================================================================= */}
      <section className="py-(--spacing-section-lg) border-t border-line">
        <div className="u-container">
          <div className="u-grid items-start">
            <header className="col-span-4 md:col-span-6 lg:col-span-4 lg:sticky lg:top-28 xl:top-32 self-start">
              <Metadata className="text-accent-text">What We Hold To</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                Four architectural commitments.
              </h2>
              <p className="mt-5 u-measure font-sans text-body text-text-muted">
                Every structure we build adheres to four rigorous principles
                governing why we use circular geometry, how we source materials,
                and how the building serves your land.
              </p>
            </header>

            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0 space-y-8">
              {corePillars.map((pillar) => (
                <Reveal
                  key={pillar.index}
                  kind="up"
                  className="rounded-sm border border-line bg-surface-alt p-7 lg:p-8 transition-all duration-300 hover:border-accent"
                >
                  <div className="flex items-baseline justify-between border-b border-line pb-4">
                    <h3 className="font-display text-display-sm text-text">
                      {pillar.title}
                    </h3>
                    <span className="font-sans text-meta text-accent-text font-semibold">
                      {pillar.index}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 font-sans text-[0.9375rem] leading-relaxed">
                    <p className="text-text font-medium">{pillar.what}</p>
                    <p className="text-text-muted">{pillar.why}</p>
                    <div className="mt-4 rounded-xs bg-surface-deep/80 border border-line/60 p-4 text-accent-text text-small font-medium">
                      {pillar.good}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: MATERIALS & WORKSHOP CRAFTSMANSHIP (Light Paper Surface)
          ========================================================================= */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6">
            <div>
              <Metadata className="text-accent-text">Materials & Craft</Metadata>
              <h2 className="mt-2 font-display text-display-lg u-optical-left">
                Made of what it looks like.
              </h2>
            </div>
            <p className="max-w-xl font-sans text-body text-text-muted">
              Nothing is clad to resemble something else. Every component is
              selected for structural honesty, thermal efficiency, and lifelong
              repairability.
            </p>
          </div>

          {/* 4 Materials Detailed Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {materialBreakdown.map((item, i) => (
              <Reveal
                key={item.name}
                kind="media"
                delay={i * 0.06}
                className="group flex flex-col justify-between rounded-sm border border-line bg-surface p-6 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-lg"
              >
                <div>
                  <div className="relative overflow-hidden rounded-xs h-[180px] w-full bg-surface-alt">
                    <Media
                      id={item.id}
                      ratio="square"
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="font-display text-display-xs text-text font-semibold">
                      {item.name}
                    </h3>
                    <span className="font-sans text-meta text-accent-text uppercase">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 font-sans text-xs text-text-muted leading-relaxed">
                    <p><strong className="text-text">What:</strong> {item.what}</p>
                    <p><strong className="text-text">Why:</strong> {item.why}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-line/70 pt-3 text-[0.6875rem] font-sans text-accent-text font-semibold uppercase tracking-wider">
                  &check; {item.benefit}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
            <ArrowLink href="/process">Explore the full 8-stage manufacturing process</ArrowLink>
            <span className="font-sans text-meta uppercase text-text-muted text-xs">
              Manufactured in India
            </span>
          </div>
        </div>
      </Section>

      {/* =========================================================================
          SECTION 5: ENGINEERED FOR INDIA'S TERRAINS (Dark Walnut Surface)
          ========================================================================= */}
      <section className="py-(--spacing-section-lg) border-t border-line">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Topography & Terrain</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                Engineered for India's diverse ground.
              </h2>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                From high-altitude Himalayan ridgelines to coastal backwaters and
                arid deserts, our structures adapt to the micro-climate they stand in.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {terrainCards.map((card, i) => (
              <Reveal
                key={card.region}
                kind="up"
                delay={i * 0.06}
                className="rounded-sm border border-line bg-surface-alt p-7 transition-all duration-300 hover:border-accent"
              >
                <span className="font-sans text-meta uppercase text-accent-text font-semibold text-xs">
                  {card.states}
                </span>
                <h3 className="mt-2 font-display text-display-sm text-text">
                  {card.region}
                </h3>
                <p className="mt-3.5 font-sans text-body text-text-muted text-[0.9375rem] leading-relaxed">
                  {card.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: DIRECT CTA (Light Paper Surface)
          ========================================================================= */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Commission a Structure</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                Tell us about your land.
              </h2>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-2">
              <p className="u-measure font-sans text-lead text-text-muted">
                Whether you have a single hillside plot, a working farm, or are
                master-planning a 10-unit luxury glamping retreat, our workshop
                will advise on suitable diameters, thermal ratings, and ground
                screws.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:gap-8">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/experiences/builder">Try the 3D builder</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
