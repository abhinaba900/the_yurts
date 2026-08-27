import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * 09. VR EXPERIENCE
 *
 * Label: STEP INSIDE
 * Heading: Don't just look at a yurt. Step inside one.
 * Lead: Explore a finished yurt through an immersive 360° experience and understand the space before you ever set foot inside it.
 * CTA: Enter the experience →
 */
export function VrBand() {
  return (
    <section className="relative bg-surface lg:min-h-[60vh] lg:flex lg:flex-col lg:justify-center">
      <div className="relative min-h-[22rem] lg:min-h-[30rem] overflow-hidden flex items-center">
        <Media
          id="home.vr"
          parallax
          ratio="panorama"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
          quality={100}
          unoptimized
        />
        {hasMedia("home.vr") ? (
          <div aria-hidden className="absolute inset-0 bg-walnut-deep/65 backdrop-blur-[1px]" />
        ) : null}

        <div className="relative z-10 w-full py-16 lg:py-24">
          <div className="u-container text-center">
            <Reveal kind="up">
              <Metadata className="text-accent-text">
                Step Inside
              </Metadata>
              <h2 className="mx-auto mt-4 max-w-[24ch] font-display text-display-lg leading-tight">
                Don&apos;t just look at a yurt. Step inside one.
              </h2>
              <p className="mx-auto mt-5 max-w-xl font-sans text-lead text-text-muted leading-relaxed">
                Explore a finished yurt through an immersive 360&deg; experience
                and understand the space before you ever set foot inside it.
              </p>
              <div className="mt-8 flex justify-center">
                <ArrowLink href="/experiences/vr">Enter the experience</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
