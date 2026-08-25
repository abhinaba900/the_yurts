import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * Cinematic hero. Full bleed, running under the fixed header.
 *
 * while it is over this section — matched in CSS so it is right on the first
 * painted frame, not corrected after hydration.
 */
export function Hero() {
  return (
    <section
      className="relative -mt-20 bg-surface md:-mt-24"
    >
      <div className="relative h-[88svh] lg:h-[calc(100vh-6rem)] w-full overflow-hidden tall:min-h-[32rem]">
        <Media
          id="home.hero"
          parallax
          ratio="cinema"
          sizes="100vw"
          className="absolute inset-0 h-full"
        />

        {/* Bottom-weighted scrim. Enough to hold the headline, not enough to
            flatten the photograph — no full-frame veil. Skipped while the slot
            is a placeholder, so its filename stays readable. */}
        {hasMedia("home.hero") ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-walnut-deep/80 via-walnut-deep/15 to-walnut-deep/35"
          />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <div className="u-container">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <Reveal kind="up">
                <Metadata className="text-accent-text">
                  Yurts &middot; Designed and made in India
                </Metadata>
                <h1 className="mt-5 max-w-[16ch] font-display text-display-xl u-optical-left">
                  A room without walls.
                </h1>
              </Reveal>

              <Reveal kind="up" delay={0.15} className="hidden lg:block">
                <p className="u-measure-tight pb-3 font-sans text-lead text-text-muted">
                  Circular timber structures for resorts, glamping sites,
                  retreats and private land.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
