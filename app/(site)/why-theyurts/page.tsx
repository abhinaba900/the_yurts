import { pageMetadata } from "@/lib/seo";
import { whyPoints } from "@/data/pages";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Why Build With a Yurt",
  description:
    "Modular construction, difficult sites, staged expansion and relocatability — the case for building with a yurt, and everything one structure can become.",
  path: "/why-theyurts",
});

/**
 * Why a yurt.
 *
 * Two halves: the case for building this way, then what that case actually
 * rests on. The closing section is set on the light tone so the detail argument
 * reads as the conclusion rather than a footnote in small print.
 *
 * The closing section names the details performance actually rests on without
 * quoting figures for them. Those numbers are exactly the claims this page would
 * want, and exactly the ones that have to come from the workshop first.
 */
export default function WhyPage() {
  return (
    <>
      <PageHeader
        eyebrow="The case"
        title="Why build this way."
        lead="A yurt is not a cheaper building or a nicer tent. It is a different set of trade-offs, and it is worth being clear about both sides of them."
        trail={[{ label: "Why a yurt", href: "/why-theyurts" }]}
      />

      <div className="u-container pb-(--spacing-section)">
        <ol>
          {whyPoints.map((point, i) => (
            <Reveal
              key={point.title}
              kind="up"
              as="li"
              className="border-t border-line py-9 last:border-b lg:py-11"
            >
              <div className="u-grid items-baseline gap-y-4">
                <span className="col-span-1 font-display text-numeral text-accent-text lg:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="col-span-3 font-display text-display-md md:col-span-5 lg:col-span-4">
                  {point.title}
                </h2>
                <p className="col-span-4 u-measure font-sans text-body text-text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="u-container pb-(--spacing-section)">
        <Reveal kind="media">
          <div className="group relative overflow-hidden rounded-sm bg-surface-alt shadow-2xl h-[340px] sm:h-[420px] lg:h-[500px] xl:h-[560px] w-full">
            <Media
              id="home.gallery-1"
              ratio="landscape"
              sizes="100vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          </div>
          <p className="mt-3 font-sans text-meta uppercase text-text-muted">
            Mountain Siting &middot; Modular Living Architecture
          </p>
        </Reveal>
      </div>

      {/* The detail argument, set on the light tone so it closes the page. */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <header className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Technical claims</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                Built around the details.
              </h2>
            </header>

            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <Reveal kind="up">
                <p className="u-measure font-sans text-body text-text-muted">
                  A yurt&rsquo;s performance comes down to the details — its
                  structure, materials, insulation, weather protection,
                  ventilation, foundation and installation.
                </p>
              </Reveal>
              <Reveal kind="up" delay={0.08}>
                <p className="mt-5 u-measure font-sans text-body text-text-muted">
                  Every site in India brings its own requirements. That&rsquo;s
                  why we approach each project around its location, intended use
                  and local conditions rather than treating every yurt as the
                  same.
                </p>
              </Reveal>
              <Reveal kind="up" delay={0.12}>
                <p className="mt-5 u-measure font-sans text-body text-text-muted">
                  As our structures are tested and developed, we&rsquo;ll publish
                  the specifications behind them — clearly and transparently.
                </p>
              </Reveal>
              <Reveal kind="up" delay={0.16}>
                <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
                  <ArrowLink href="/enquire">Ask a technical question</ArrowLink>
                  <ArrowLink href="/process">How one gets made</ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

    </>
  );
}
