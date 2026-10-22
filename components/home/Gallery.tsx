import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 12. INSPIRATION & GALLERY
 *
 * Heading: Explore yurt designs & installation ideas.
 * The images are design and reference visuals, not completed installations,
 * and the copy says so.
 * CTA: Explore the design gallery →
 */
export function Gallery() {
  return (
    <section className="py-12 lg:py-14 overflow-hidden">
      {/* Section Header */}
      <div className="u-container">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6 lg:pb-8">
          <div>
            <Reveal kind="up">
              <Metadata className="text-accent-text">Inspiration & Gallery</Metadata>
              <h2 className="mt-2 font-display text-display-lg u-optical-left">
                Explore Yurt Designs &amp; Installation Ideas.
              </h2>
            </Reveal>
          </div>
          {/*
            The heading is wide enough to take the whole row on its own, so this
            paragraph always wraps beneath it, and runs the container's full
            width rather than sitting as a stranded narrow column. Set as one
            column: splitting it in two broke the sentence across a wide gutter
            and made the eye jump the width of the page mid-clause.
          */}
          <Reveal kind="up" delay={0.08} className="w-full">
            <p className="font-sans text-body text-text-muted leading-relaxed">
              Looking for inspiration for your resort, farm stay or private
              property? Explore yurt design concepts, interior ideas, roof details
              and possible installation settings to understand what you could
              create.
            </p>
            <p className="mt-3 font-sans text-small text-text-muted/80 leading-relaxed">
              The images shown are design and reference visuals, not completed
              Theyurts installations. Photographs of our completed projects will
              be added as they become available.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Viewport-Fitted Gallery Mosaic */}
      <div className="u-container mt-8 lg:mt-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Main Primary Visual */}
          <Reveal
            kind="media"
            className="sm:col-span-2 lg:col-span-7 xl:col-span-8 flex flex-col"
          >
            <div className="group relative w-full overflow-hidden rounded-sm bg-surface-alt shadow-xl h-[260px] sm:h-[320px] lg:h-[390px]">
              <Media
                id="home.gallery-1"
                ratio="landscape"
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                quality={100}
                unoptimized
              />
            </div>
            <p className="mt-2.5 font-sans text-meta uppercase text-text-muted text-xs">
              01 &middot; Hillside Retreat &mdash; Outdoor Accommodation Concept
            </p>
          </Reveal>

          {/* Right Stacked Pair */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5 xl:col-span-4 flex flex-col justify-between h-auto lg:h-[390px] gap-4">
            <Reveal kind="media" delay={0.06} className="flex flex-col">
              <div className="group relative w-full overflow-hidden rounded-sm bg-surface-alt shadow-lg h-[120px] sm:h-[145px] lg:h-[168px]">
                <Media
                  id="home.gallery-2"
                  ratio="editorial"
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  quality={100}
                  unoptimized
                />
              </div>
              <p className="mt-1.5 font-sans text-meta uppercase text-text-muted text-xs">
                02 &middot; Central Roof Dome &mdash; Skylight &amp; Ventilation Detail
              </p>
            </Reveal>

            <Reveal kind="media" delay={0.1} className="flex flex-col">
              <div className="group relative w-full overflow-hidden rounded-sm bg-surface-alt shadow-lg h-[120px] sm:h-[145px] lg:h-[168px]">
                <Media
                  id="home.gallery-3"
                  ratio="landscape"
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  quality={100}
                  unoptimized
                />
              </div>
              <p className="mt-1.5 font-sans text-meta uppercase text-text-muted text-xs">
                03 &middot; Raised Timber Deck &mdash; Entrance &amp; Platform Concept
              </p>
            </Reveal>
          </div>
        </div>

        {/* Gallery Action Footer */}
        <div className="mt-8 border-t border-line pt-5 flex items-center justify-between">
          <ArrowLink href="/projects">Explore the Design Gallery</ArrowLink>
          <span className="font-sans text-meta uppercase text-text-muted text-xs">
            03 Design References
          </span>
        </div>
      </div>
    </section>
  );
}
