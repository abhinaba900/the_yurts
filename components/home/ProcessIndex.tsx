import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { process } from "@/data/home";

/**
 * 10. BUILD PROCESS
 *
 * Heading: How we design, manufacture & install your yurt.
 * 8 Stages: Discover, Design, Select, Build, Prepare, Deliver, Install, Hand Over.
 */
export function ProcessIndex() {
  return (
    <Section tone="light" space="lg" className="lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-20">
      <div className="u-container">
        <div className="u-grid gap-y-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Build Process</Metadata>
                <h2 className="mt-4 font-display text-display-lg u-optical-left leading-tight">
                  How We Design, Manufacture &amp; Install Your Yurt.
                </h2>
                <p className="mt-6 u-measure font-sans text-lead text-text-muted leading-relaxed">
                  From choosing the right structure to assembling it on your
                  property, our process covers eight stages.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  We discuss your site requirements, finalise specifications,
                  prepare the yurt components and coordinate delivery and
                  installation. The exact scope of work is agreed before the
                  project begins.
                </p>
              </Reveal>
              <Reveal kind="media" delay={0.1} className="mt-10">
                <div className="overflow-hidden rounded-sm bg-surface shadow-xl border border-line">
                  <Media
                    id="home.process"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {process.map((stage, i) => (
                <Reveal
                  key={stage.index}
                  kind="up"
                  delay={i * 0.03}
                  as="li"
                  className="border-t border-line py-5 flex flex-col justify-start"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                      {stage.index}
                    </span>
                    <span className="font-display text-display-sm text-text">
                      {stage.title}
                    </span>
                  </div>
                  <p className="mt-1.5 font-sans text-small font-medium text-text">
                    {stage.heading}
                  </p>
                  <p className="mt-1.5 font-sans text-small text-text-muted leading-relaxed">
                    {stage.body}
                  </p>
                </Reveal>
              ))}
            </ol>

            <div className="mt-12 border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
              <ArrowLink href="/process">Understand Our Complete Build Process</ArrowLink>
              <span className="font-sans text-meta uppercase text-text-muted text-xs">
                08 Stages &middot; From Enquiry to Handover
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
