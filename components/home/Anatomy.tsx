import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { YurtDiagram } from "./YurtDiagram";
import { anatomy } from "@/data/home";

/**
 * 03. WHAT IS A YURT?
 *
 * Simple in form. Sophisticated in structure.
 */
export function Anatomy() {
  return (
    <Section tone="light" space="lg" className="lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-20">
      <div className="u-container">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-4">
            <Reveal kind="up">
              <Metadata className="text-accent-text">The Structure</Metadata>
              <h2 className="mt-4 font-display text-display-lg u-optical-left">
                Simple in form. Sophisticated in structure.
              </h2>
              <p className="mt-6 u-measure font-sans text-lead text-text-muted leading-relaxed">
                A modern yurt is built around a simple principle: a strong circular
                frame, a central crown, a tensioned roof and a protective outer
                envelope.
              </p>
              <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                The result is a column-free interior that can be adapted for
                everything from a private retreat to a luxury resort suite.
              </p>
            </Reveal>
          </header>

          <div className="col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <Reveal kind="media">
              <YurtDiagram className="text-text" />
            </Reveal>
          </div>
        </div>

        {/* Five Components Grid */}
        <div className="mt-16 lg:mt-24">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {anatomy.map((part, i) => (
              <Reveal
                key={part.label}
                kind="up"
                delay={i * 0.04}
                className="border-t border-line pt-5"
              >
                <dt className="flex items-baseline gap-2.5">
                  <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                    0{i + 1}
                  </span>
                  <span className="font-display text-display-sm">
                    {part.label}
                  </span>
                </dt>
                <dd className="mt-3 font-sans text-small text-text-muted leading-relaxed">
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
