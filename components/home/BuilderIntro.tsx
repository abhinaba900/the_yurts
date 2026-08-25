import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/** The axes the configurator will expose. Structure only — no option values. */
const axes = [
  "Size",
  "Exterior",
  "Roof",
  "Doors",
  "Windows",
  "Flooring",
  "Interior package",
];

/**
 * 3D builder introduction. Image on the left running to the page edge, text
 * held to the right — the reverse of the sections above it, so the eye resets.
 */
export function BuilderIntro() {
  return (
    <section className="py-(--spacing-section-lg) lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center lg:py-16">
      {/* Held inside the container, so the image begins on the same left margin
          as every heading on the site rather than running to the viewport edge. */}
      <div className="u-container">
        <div className="u-grid items-center gap-y-12">
          <Reveal
            kind="media"
            className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-1"
          >
            <Media id="home.builder" sizes="(min-width: 1024px) 46vw, 92vw" />
          </Reveal>

          <div className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-8">
            <Reveal kind="up">
              <Metadata>In development</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                Build one on screen.
              </h2>
              <p className="mt-7 u-measure font-sans text-lead text-text-muted">
                A configurator for working out what you actually want before
                anyone quotes for it. Change the structure and the yurt changes
                with it.
              </p>
            </Reveal>

            <Reveal kind="up" delay={0.1}>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
                {axes.map((axis) => (
                  <li
                    key={axis}
                    className="font-sans text-meta uppercase text-text-muted"
                  >
                    {axis}
                  </li>
                ))}
              </ul>
              <p className="mt-6 u-measure font-sans text-small text-text-muted">
                Finish a configuration and it comes through with your enquiry, so
                the first conversation starts from something specific.
              </p>
              <div className="mt-8">
                <ArrowLink href="/experiences">The 3D builder</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
