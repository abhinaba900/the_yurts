import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { YurtDiagram } from "./YurtDiagram";
import { anatomy } from "@/data/home";

/**
 * What is a yurt. A drawing and a parts list — the section behaves like a page
 * from a technical document rather than a marketing block.
 *
 * Set on the light tone: a technical drawing belongs on paper, and against a
 * site that is otherwise deep walnut it makes this the page's first breath.
 */
export function Anatomy() {
  return (
    <Section tone="light" space="lg" className="lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-16">
      <div className="u-container">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-4">
            <Reveal kind="up">
              <Metadata>The structure</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                What a yurt is.
              </h2>
              <p className="mt-7 u-measure font-sans text-lead text-text-muted">
                Five parts, working against each other. The roof pushes outward,
                a band around the wall head holds it in, and nothing needs to
                stand in the middle of the room.
              </p>
            </Reveal>
          </header>

          <div className="col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <Reveal kind="media">
              <YurtDiagram className="text-text" />
            </Reveal>
          </div>
        </div>

        {/* Parts list. On mobile this carries the labels the diagram drops. */}
        <div className="mt-16 lg:mt-24">
          <dl className="u-grid gap-y-8">
            {anatomy.map((part, i) => (
              <Reveal
                key={part.label}
                kind="up"
                delay={i * 0.04}
                className="col-span-4 border-t border-line pt-4 md:col-span-3 lg:col-span-2"
              >
                <dt className="flex items-baseline gap-3">
                  <span className="font-sans text-meta uppercase text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-display-sm">
                    {part.label}
                  </span>
                </dt>
                <dd className="mt-3 font-sans text-small text-text-muted">
                  {part.body}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
