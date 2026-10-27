import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";

/**
 * 01. HERO
 *
 * Photographic hero, full bleed, running under the fixed header. Set on the
 * ink tone so its type is linen, and marked `data-header-tone="dark"` so the
 * header switches to linen while it sits over the image.
 */
export function Hero() {
  return (
    <section
      data-tone="dark"
      data-header-tone="dark"
      className="relative -mt-20 bg-surface md:-mt-24"
    >
      {/* Full screen less the 2.25rem top bar above it, so the buttons and the
          line under them sit on the first screen. Content-sized beyond that:
          min-height, never a fixed height. The copy's top padding clears the
          header band over it (the full band less that top bar), and its gaps
          tighten with the screen's height so a short laptop still fits it. */}
      <div className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden lg:min-h-[calc(100svh-2.25rem)]">
        <Media
          id="home.hero"
          ratio="cinema"
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover object-[50%_60%] md:object-center"
        />

        {/* Scrims: bottom-weighted for the copy, a little left-weighted for
            the column it sits in. Kept soft so the photograph stays the
            subject. */}
        {hasMedia("home.hero") ? (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-espresso-deep/85 via-espresso-deep/25 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-espresso-deep/50 via-espresso-deep/15 to-transparent"
            />
          </>
        ) : null}

        <div className="relative z-10 pt-28 pb-[clamp(1.5rem,5svh,5.5rem)] sm:pt-36 md:pt-[calc(var(--header-height-top)-2.25rem+clamp(0.75rem,2.5svh,3rem))]">
          <div className="u-container">
            <div className="max-w-[46rem]">
              <Reveal kind="up">
                <Metadata className="inline-flex items-center gap-3 font-medium text-linen/90">
                  <span aria-hidden className="h-px w-8 bg-sand" />
                  Yurt Manufacturer in India
                </Metadata>

                <h1 className="mt-5 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-linen u-optical-left sm:mt-[clamp(1rem,2.5svh,1.5rem)] sm:text-display-xl">
                  Custom-Built Yurts for Resorts, Farm Stays &amp; Private
                  Properties.
                </h1>

                <p className="mt-5 u-measure font-sans text-lead text-linen/95 sm:mt-[clamp(1rem,2.5svh,1.5rem)]">
                  We design and manufacture modern yurts &mdash; circular
                  structures with a strong timber frame, weather-protective
                  coverings and customisable interiors.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-linen/80">
                  Whether you&apos;re developing a luxury resort, adding guest
                  rooms to a farm stay or creating a private retreat, we help
                  you choose, customise and install a yurt suited to your
                  property.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:mt-[clamp(1.25rem,3.5svh,2rem)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <Button href="/enquire" variant="inverse">
                    Get a Yurt Quote <span aria-hidden>&rarr;</span>
                  </Button>
                  <Button href="/yurts" variant="hairline">
                    Explore Our Yurts
                  </Button>
                </div>

                <p className="mt-8 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-5 sm:mt-[clamp(1.25rem,3.5svh,2rem)] sm:pt-[clamp(0.75rem,2svh,1.25rem)] font-sans text-small text-linen/80">
                  <span>Available in 6m, 7.2m and 9.6m diameters</span>
                  <span aria-hidden className="text-sand">&middot;</span>
                  <span>Custom layouts and finishes</span>
                  <span aria-hidden className="text-sand">&middot;</span>
                  <span>India-wide project enquiries</span>
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
