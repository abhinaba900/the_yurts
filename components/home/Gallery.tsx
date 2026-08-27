import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 13. NEW COMPANY / INSPIRATION
 *
 * Heading: The beginning of something different.
 * Description: Theyurts is a new company, and we're building our first collection of structures right now. This space will soon become a record of the places we've helped create — from the first build to the many landscapes that follow. Until then, explore our ideas, designs and references.
 * CTA: Explore the gallery →
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
                The beginning of something different.
              </h2>
            </Reveal>
          </div>
          <Reveal kind="up" delay={0.08} className="max-w-xl">
            <p className="font-sans text-body text-text-muted leading-relaxed">
              Theyurts is a new company, and we&apos;re building our first collection
              of structures right now. This space will soon become a record of the
              places we&apos;ve helped create &mdash; from the first build to the
              many landscapes that follow. Until then, explore our ideas, designs
              and references.
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
              Mountain Retreat &middot; High Altitude Setting
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
                Crown Wheel &middot; Skylight Structure
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
                Timber Deck &middot; Custom Entrance
              </p>
            </Reveal>
          </div>
        </div>

        {/* Gallery Action Footer */}
        <div className="mt-8 border-t border-line pt-5 flex items-center justify-between">
          <ArrowLink href="/projects">Explore the gallery</ArrowLink>
          <span className="font-sans text-meta uppercase text-text-muted text-xs">
            03 Perspectives
          </span>
        </div>
      </div>
    </section>
  );
}
