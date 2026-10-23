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
      {/* Full screen less the 2.25rem top bar above it, so the buttons and the
          line under them sit on the first screen. */}
      <div className="relative min-h-[92svh] lg:min-h-[calc(100svh-2.25rem)] w-full overflow-hidden flex flex-col justify-end">
        <Media
          id="home.hero"
          ratio="cinema"
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover object-center"
        />

        {/* Scrim: bottom-weighted and left-weighted for balanced text contrast */}
        {hasMedia("home.hero") ? (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-walnut-deep/90 via-walnut-deep/20 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-walnut-deep/40 via-walnut-deep/20 to-transparent"
            />
          </>
        ) : null}

        <div className="relative z-10 pb-12 pt-32 md:pb-16 lg:pb-20">
          <div className="u-container">
            <div className="max-w-4xl">
              <Reveal kind="up">
                <Metadata className="text-[#f6e3a1] font-medium tracking-[0.18em] [text-shadow:_0_1px_6px_rgba(0,0,0,0.7)]">
                  Yurt Manufacturer in India
                </Metadata>

                <h1 className="mt-5 font-display text-display-lg u-optical-left leading-[1.05]">
                  Custom-Built Yurts for Resorts, Farm Stays &amp; Private
                  Properties.
                </h1>

                <p className="mt-6 max-w-2xl font-sans text-lead text-text-muted leading-relaxed">
                  We design and manufacture modern yurts &mdash; circular
                  structures with a strong timber frame, weather-protective
                  coverings and customisable interiors.
                </p>
                <p className="mt-4 max-w-2xl font-sans text-body text-text-muted leading-relaxed">
                  Whether you&apos;re developing a luxury resort, adding guest
                  rooms to a farm stay or creating a private retreat, we help
                  you choose, customise and install a yurt suited to your
                  property.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-8">
                  <Link
                    href="/enquire"
                    className="inline-flex items-center gap-2 rounded-xs bg-cream px-6 py-3.5 font-sans text-small uppercase tracking-wider text-walnut-deep font-semibold transition-all duration-200 hover:bg-accent-text hover:text-walnut-deep"
                  >
                    Get a Yurt Quote &rarr;
                  </Link>

                  <Link
                    href="/yurts"
                    className="inline-flex items-center gap-2 rounded-xs border border-line-strong bg-surface/60 backdrop-blur-xs px-6 py-3.5 font-sans text-small uppercase tracking-wider text-text transition-all duration-200 hover:border-accent hover:text-accent-text"
                  >
                    Explore Our Yurts &rarr;
                  </Link>
                </div>

                <Metadata className="mt-8 text-cream/80 [text-shadow:_0_1px_6px_rgba(0,0,0,0.7)]">
                  Available in 6m, 7.2m and 9.6m diameters &middot; Custom
                  layouts and finishes &middot; India-wide project enquiries
                </Metadata>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
