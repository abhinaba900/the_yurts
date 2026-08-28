import { pageMetadata } from "@/lib/seo";
import { processStages } from "@/data/pages";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "How a Yurt Is Made: Eight Stages",
  description:
    "From the first conversation about a site to handover — design, materials, manufacturing, customisation, quality checks, transport and installation.",
  path: "/process",
});

/**
 * Build process. Eight stages as a vertical narrative.
 *
 * Numerals run down the left at display size and the copy is held right — the
 * page reads as a sequence rather than a grid, and the alternating image
 * positions keep the scroll from settling into a pattern.
 *
 * No timescales anywhere. How long each stage takes depends on the structure and
 * the site, and nobody has given us real figures.
 */
export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How one gets made"
        title="Eight stages."
        lead="From a first conversation about a site to the day it is handed over to whoever will look after it."
        trail={[{ label: "Build process", href: "/process" }]}
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Photography from the workshop will be published against each stage
              as the first structures are built. We would rather show the real
              process late than illustrate it early.
            </p>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section)">
        <ol>
          {processStages.map((stage, i) => (
            <Reveal
              key={stage.index}
              kind="up"
              as="li"
              className="border-t border-line py-(--spacing-block)"
            >
              <div className="u-grid items-start gap-y-8">
                <span className="col-span-1 font-display text-numeral text-accent-text lg:col-span-2">
                  {stage.index}
                </span>

                <div className="col-span-3 md:col-span-5 lg:col-span-4">
                  <h2 className="font-display text-display-md">{stage.title}</h2>
                </div>

                <div className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-8">
                  <p className="u-measure font-sans text-body text-text-muted">
                    {stage.body}
                  </p>
                </div>

                {/* One image in the sequence, at the stage it means most. */}
                {i === 2 ? (
                  <div className="col-span-4 mt-4 md:col-span-6 lg:col-span-8 lg:col-start-4">
                    <Media
                      id="home.process"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                    />
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-4">
              <Metadata className="text-accent-text">Before stage 01</Metadata>
              <h2 className="mt-4 font-display text-display-md">
                What we need from you.
              </h2>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <ul>
                {[
                  "Where the site is, and how a vehicle reaches it",
                  "What has to happen inside the structure",
                  "Whether it is one or several, now or over time",
                  "Any permission or planning position you already know",
                  "Roughly when you want it standing",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-5 border-t border-line py-4 last:border-b"
                  >
                    <span className="font-sans text-meta uppercase text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-lead">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 u-measure font-sans text-small text-text-muted">
                None of it has to be settled. Partial answers are still enough to
                start.
              </p>
              <div className="mt-8">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
