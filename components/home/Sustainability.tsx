import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";

/**
 * Sustainability section.
 *
 * Rich two-column editorial layout:
 * Left: Evocative photograph of light-footprint structure in natural untouched landscape.
 * Right: Headline, philosophy narrative, and core environmental properties.
 */
export function Sustainability() {
  return (
    <Section
      tone="light"
      surface="alt"
      space="none"
      className="py-14 lg:py-8 xl:py-10 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden"
    >
      <div className="u-container">
        <div className="u-grid items-center gap-y-8 lg:gap-x-12">
          {/* Left Column: Dynamic viewport-fitted Image */}
          <div className="col-span-4 md:col-span-6 lg:col-span-5 flex flex-col items-center">
            <Reveal kind="media" className="w-full max-w-[420px] lg:max-w-none">
              <div className="group overflow-hidden rounded-sm bg-surface shadow-xl w-full">
                <Media
                  id="home.application-eco"
                  ratio="editorial"
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="h-[min(48vh,460px)] w-full max-h-[50vh] object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-sans text-meta uppercase text-text-muted">
                <span>Low Impact Architecture</span>
                <span>Zero Ground Scar</span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Narrative & Key Principles */}
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <Reveal kind="up">
              <Metadata className="text-accent">Sustainability</Metadata>
              <h2 className="mt-3 u-measure-wide font-display text-display-md u-optical-left leading-[1.05]">
                The most sustainable thing about a yurt is that it can be taken away.
              </h2>
              
              <div className="mt-5 space-y-3 font-sans text-body text-text-muted text-small sm:text-body">
                <p className="u-measure">
                  It sits on the ground rather than in it. There is very little concrete,
                  very little waste on site, and no demolition at the end — the frame comes
                  apart into the exact parts it was delivered as. Land that carried a yurt for
                  ten years can go back to being land.
                </p>
                <p className="u-measure text-small opacity-80">
                  Where we make specific commitments — about timber sourcing, organic coatings,
                  and end-of-life recycling — we publish them with complete transparency.
                </p>
              </div>

              {/* 3 Core Principles */}
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-3">
                <div>
                  <span className="font-display text-display-sm text-text">01</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text">
                    Reversible
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted text-[0.8125rem] leading-snug">
                    No concrete foundations or permanent site scarring.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-text">02</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text">
                    Renewable
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted text-[0.8125rem] leading-snug">
                    Sustainably harvested timber and organic canvas.
                  </p>
                </div>
                <div>
                  <span className="font-display text-display-sm text-text">03</span>
                  <h3 className="mt-1 font-sans text-meta uppercase tracking-wider text-text">
                    Demountable
                  </h3>
                  <p className="mt-1 font-sans text-small text-text-muted text-[0.8125rem] leading-snug">
                    Modular frame built to be disassembled and relocated.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
