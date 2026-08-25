import Link from "next/link";
import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Reveal } from "@/components/primitives/Reveal";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * 16. FINAL CTA
 *
 * Heading: Tell us about the land.
 * Lead: Where is it? What do you want to create? And when would you like to begin? That's enough to start a conversation.
 * CTAs: Start an enquiry → | Book a consultation →
 */
export function Closing() {
  return (
    <section className="relative bg-surface">
      <div className="relative min-h-[75svh] lg:min-h-[85svh] overflow-hidden flex flex-col justify-end">
        <Media
          id="home.closing"
          parallax
          ratio="cinema"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {hasMedia("home.closing") ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-walnut-deep/95 via-walnut-deep/40 to-walnut-deep/30"
          />
        ) : null}

        <div className="relative z-10 pb-16 pt-24 md:pb-20 lg:pb-24">
          <div className="u-container">
            <div className="max-w-3xl">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Commission a Structure</Metadata>
                <h2 className="mt-4 font-display text-display-xl u-optical-left leading-[1.05]">
                  Tell us about the land.
                </h2>
                <div className="mt-6 space-y-1 font-sans text-lead text-text-muted leading-relaxed">
                  <p>Where is it?</p>
                  <p>What do you want to create?</p>
                  <p>And when would you like to begin?</p>
                  <p className="pt-2 text-text font-medium">That&apos;s enough to start a conversation.</p>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-8">
                  <Link
                    href="/enquire"
                    className="inline-flex items-center gap-2 rounded-xs bg-cream px-6 py-3.5 font-sans text-small uppercase tracking-wider text-walnut-deep font-semibold transition-all duration-200 hover:bg-accent-text hover:text-walnut-deep"
                  >
                    Start an enquiry &rarr;
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xs border border-line-strong bg-surface/60 backdrop-blur-xs px-6 py-3.5 font-sans text-small uppercase tracking-wider text-text transition-all duration-200 hover:border-accent hover:text-accent-text"
                  >
                    Book a consultation &rarr;
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
