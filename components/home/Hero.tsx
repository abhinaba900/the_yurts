import Link from "next/link";
import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 01. HERO
 *
 * Cinematic hero, full bleed, running under fixed header.
 */
export function Hero() {
  return (
    <section className="relative -mt-20 bg-surface md:-mt-24">
      <div className="relative min-h-[92svh] lg:min-h-[100svh] w-full overflow-hidden flex flex-col justify-end">
        <Media
          id="home.hero"
          parallax
          ratio="cinema"
          sizes="100vw"
          // Mirrored so the yurt sits on the right and the headline gets clear
          // sky and hillside to land on. Flipped here rather than in the file:
          // the asset stays the photograph that was taken, and the manifest
          // keeps serving it unaltered to anything else that asks for it.
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />

        {/* Bottom-weighted scrim */}
        {hasMedia("home.hero") ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-walnut-deep/95 via-walnut-deep/40 to-walnut-deep/30"
          />
        ) : null}

        <div className="relative z-10 pb-12 pt-32 md:pb-16 lg:pb-20">
          <div className="u-container">
            <div className="max-w-4xl">
              <Reveal kind="up">
                <Metadata className="text-accent-text">
                  Designed in India &middot; Made in India &middot; Installed
                  across India
                </Metadata>

                <h1 className="mt-5 font-display text-display-xl u-optical-left leading-[1.05]">
                  Build outside the ordinary.
                </h1>

                <p className="mt-6 max-w-2xl font-sans text-lead text-text-muted leading-relaxed">
                  Premium yurts designed and made in India for resorts,
                  retreats, glamping destinations, farm stays and private
                  spaces.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-8">
                  <Link
                    href="/yurts"
                    className="inline-flex items-center gap-2 rounded-xs bg-cream px-6 py-3.5 font-sans text-small uppercase tracking-wider text-walnut-deep font-semibold transition-all duration-200 hover:bg-accent-text hover:text-walnut-deep"
                  >
                    Explore Yurts &rarr;
                  </Link>

                  <Link
                    href="/experiences/builder"
                    className="inline-flex items-center gap-2 rounded-xs border border-line-strong bg-surface/60 backdrop-blur-xs px-6 py-3.5 font-sans text-small uppercase tracking-wider text-text transition-all duration-200 hover:border-accent hover:text-accent-text"
                  >
                    Build Your Yurt &rarr;
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
