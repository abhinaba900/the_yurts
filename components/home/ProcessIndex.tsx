import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { process } from "@/data/home";

/**
 * How one gets made. A dense, technical index — small indices in two tight
 * columns, deliberately unlike the large-numeral argument further up the page.
 * The image holds its position while the list scrolls past it.
 */
export function ProcessIndex() {
  return (
    <Section tone="light" space="lg" className="lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-16">
      <div className="u-container">
        <div className="u-grid gap-y-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal kind="up">
                <Metadata>How one gets made</Metadata>
                <h2 className="mt-5 font-display text-display-lg u-optical-left">
                  Eight stages.
                </h2>
                <p className="mt-7 u-measure font-sans text-lead text-text-muted">
                  From a first conversation about a site to the day it is handed
                  over.
                </p>
              </Reveal>
              <Reveal kind="media" delay={0.1} className="mt-10">
                <Media
                  id="home.process"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
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
                  className="flex items-baseline gap-4 border-t border-line py-5"
                >
                  <span className="font-sans text-meta uppercase text-accent-text">
                    {stage.index}
                  </span>
                  <span className="font-display text-display-sm">
                    {stage.title}
                  </span>
                </Reveal>
              ))}
            </ol>

            <p className="mt-10 u-measure font-sans text-body text-text-muted">
              Photography from the workshop will be published against each stage
              as the first structures are built. We would rather show the real
              process late than illustrate it early.
            </p>

            <div className="mt-8">
              <ArrowLink href="/process">The build process</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
