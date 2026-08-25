import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { YurtDiagram } from "./YurtDiagram";
import { anatomy } from "@/data/home";


/**
 * One line-drawn mark per part, in the same idiom as the icons in WhyYurts and
 * BuiltForIndia: 24px box, 1.5 stroke, currentColor so each inherits the
 * section's accent.
 *
 * Each mark is the part as the diagram above draws it — the crown as a ring of
 * spokes, the roof as radial poles, the lattice as its diamond grid — so the
 * list reads as five details pulled out of that drawing rather than five
 * generic symbols.
 */
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {children}
    </svg>
  );
}

/** Indexed to `anatomy`: crown, roof, lattice, tension, envelope. */
const partIcons = [
  // Crown — the compression ring, seen from above with its spokes.
  <IconFrame key="crown">
    <circle cx="12" cy="12" r="7.5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3M6.7 6.7l2.1 2.1M15.2 15.2l2.1 2.1M17.3 6.7l-2.1 2.1M8.8 15.2l-2.1 2.1" />
  </IconFrame>,
  // Roof — radial poles running down from the crown to the wall head.
  <IconFrame key="roof">
    <path d="M2.5 17.5 12 5l9.5 12.5" />
    <path d="M12 5v12.5M12 5 6.4 17.5M12 5l5.6 12.5" />
    <path d="M2.5 17.5h19" />
  </IconFrame>,
  // Lattice — the expanding diamond grid of the wall.
  <IconFrame key="lattice">
    <path d="M3.5 5 12 13.5 20.5 5" />
    <path d="M3.5 10.5 12 19l8.5-8.5" />
    <path d="M3.5 5v5.5M20.5 5v5.5M12 13.5V19" />
  </IconFrame>,
  // Tension — the band drawn around the wall head.
  <IconFrame key="tension">
    <ellipse cx="12" cy="12" rx="9" ry="5" />
    <path d="M3 12v2.5a9 5 0 0 0 18 0V12" />
  </IconFrame>,
  // Envelope — layers wrapping the structure.
  <IconFrame key="envelope">
    <path d="M3 15.5a9 9 0 0 1 18 0" />
    <path d="M6 15.5a6 6 0 0 1 12 0" />
    <path d="M9 15.5a3 3 0 0 1 6 0" />
    <path d="M2.5 19h19" />
  </IconFrame>,
];

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
                <dt>
                  <span className="flex size-9 items-center justify-center rounded-full border border-line/60 bg-surface-alt/40 text-accent-text">
                    {partIcons[i]}
                  </span>
                  <span className="mt-3.5 block font-display text-display-sm">
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
