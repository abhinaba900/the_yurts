import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Who We Are and How We Build",
  description:
    "Theyurts designs, manufactures and installs modern yurts across India. What we hold to on structure, materials, craft and the sites we build on.",
  path: "/about",
});

/** WHAT WE HOLD TO — the four positions, in the order they are argued. */
const positions = [
  {
    title: "The structure should make sense.",
    body: "A yurt is beautiful because its structure is honest. We believe the engineering should be considered as carefully as the aesthetics, and the finished space should feel natural rather than over-designed.",
  },
  {
    title: "The site comes first.",
    body: "No two pieces of land are the same. Orientation, access, views, terrain, climate and the experience of arriving at the space are all part of the design.",
  },
  {
    title: "Specifications should be true.",
    body: "We would rather publish fewer numbers that we can stand behind than fill a page with impressive-sounding claims. As our products develop, we will document the materials, specifications and performance behind them.",
  },
  {
    title: "It should be worth maintaining.",
    body: "A good structure should continue to work beautifully long after the photographs are taken. Materials, construction and detailing all matter because they determine what ownership feels like over time.",
  },
];

/** The five stages, named as the copy names them. Detail lives on /process. */
const makingChain = ["Design", "Build", "Prepare", "Deliver", "Install"];

/**
 * ABOUT US
 *
 * Seven sections:
 * 01. Hero — A new way to build an old idea.
 * 02. The idea — There is a space between a tent and a building.
 * 03. What we hold to — Four positions.
 * 04. How we make them — In a workshop. Then on your land.
 * 05. Team — The people behind Theyurts.
 * 06. Certifications — Quality, testing & standards.
 * 07. Workshop — Where Theyurts are made.
 *
 * The page deliberately carries no performance figures. That is not an
 * omission: "Specifications should be true" is one of the four positions, and a
 * page that argued it beside a table of snow loads and wind ratings would be
 * arguing against itself. Numbers belong here once they can be substantiated.
 */
export default function AboutPage() {
  return (
    <>
      {/* 01. HERO */}
      <PageHeader
        eyebrow="About Theyurts"
        title="A new way to build an old idea."
        lead="Theyurts designs, manufactures and installs modern yurts across India — creating spaces for hospitality, wellness, living and experiences."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-body text-text-muted leading-relaxed">
              We are building yurts for a country with extraordinary landscapes,
              diverse climates and a growing appetite for experiences beyond
              conventional spaces.
            </p>
          </div>
        }
      />

      {/* 02. THE IDEA */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <Metadata className="text-accent-text">The idea</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left leading-tight">
                  There is a space between a tent and a building.
                </h2>
                <p className="mt-5 font-display text-display-sm text-text-muted">
                  And we think there is something interesting there.
                </p>
              </Reveal>
            </div>

            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-lead text-text-muted leading-relaxed">
                  Across India, there are hillsides, farms, forests, plantations
                  and open landscapes where conventional construction isn&apos;t
                  always the right answer.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  At the same time, people are looking for new ways to stay,
                  retreat, work, gather and experience the outdoors.
                </p>

                <p className="mt-8 font-display text-display-xs text-text">
                  A yurt sits somewhere in between.
                </p>
                <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                  It has the comfort and character of a room, while maintaining a
                  closer relationship with the landscape around it.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Theyurts exists to build that possibility properly &mdash; with
                  thoughtful design, considered materials and a process built
                  around the land where the structure will live.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* 03. WHAT WE HOLD TO */}
      <section className="py-(--spacing-section-lg) border-t border-line">
        <div className="u-container">
          <div className="u-grid items-start">
            <header className="col-span-4 md:col-span-6 lg:col-span-4 lg:sticky lg:top-28 xl:top-32 self-start">
              <Reveal kind="up">
                <Metadata className="text-accent-text">What we hold to</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left">
                  Four positions.
                </h2>
              </Reveal>
            </header>

            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <ol>
                {positions.map((position, i) => (
                  <Reveal
                    key={position.title}
                    kind="up"
                    as="li"
                    delay={i * 0.04}
                    className="border-t border-line py-7 lg:py-8"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-display-sm text-text leading-tight">
                          {position.title}
                        </h3>
                        <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                          {position.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 04. HOW WE MAKE THEM */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid items-start gap-y-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <Metadata className="text-accent-text">How we make them</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left leading-tight">
                  In a workshop. Then on your land.
                </h2>
                <p className="mt-6 u-measure font-sans text-lead text-text-muted leading-relaxed">
                  Every yurt begins with a carefully considered design and a
                  collection of components that need to work together precisely.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  We manufacture and prepare the structure before it reaches the
                  site, where it is assembled onto a prepared base and finished
                  according to the requirements of the project.
                </p>
              </Reveal>

              <Reveal kind="media" delay={0.1} className="mt-10">
                <div className="overflow-hidden rounded-sm border border-line bg-surface shadow-xl">
                  <Media
                    id="home.process"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
              <Reveal kind="up" delay={0.08}>
                <span className="font-sans text-meta uppercase text-text-muted">
                  The process is simple in principle:
                </span>

                <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">
                  {makingChain.map((stage, i) => (
                    <li key={stage} className="flex items-center gap-3">
                      <span className="rounded-xs border border-line bg-surface px-3 py-2 font-sans text-meta uppercase text-text">
                        {stage}
                      </span>
                      {i < makingChain.length - 1 ? (
                        <span aria-hidden className="text-accent-text">
                          &rarr;
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>

                <p className="mt-10 font-display text-display-xs text-text">
                  The details are where the work happens.
                </p>
                <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Materials, finishes, connections, insulation and construction
                  methods are selected according to the structure, its purpose and
                  the environment in which it will live.
                </p>

                <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:gap-10">
                  <ArrowLink href="/process">Explore the build process</ArrowLink>
                  <ArrowLink href="/why-theyurts">Why a yurt</ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>



      {/* 07. WORKSHOP */}
      <section className="py-(--spacing-section-lg) border-t border-line">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Workshop</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left">
                  Where Theyurts are made.
                </h2>
              </Reveal>
            </div>

            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-lead text-text-muted leading-relaxed">
                  A yurt begins long before it reaches the landscape.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Our workshop is where materials become components, components
                  become structures, and every detail gets checked before the
                  journey to site.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  As our manufacturing facility develops, we will open this space
                  to show you how Theyurts are actually made.
                </p>

                <div className="mt-8 border-t border-line pt-6">
                  <ArrowLink href="/process">Visit the workshop</ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
