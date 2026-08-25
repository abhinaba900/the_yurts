import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * VR experience. A short, very wide, centred band.
 *
 * Everything around it is tall, left-aligned and asymmetric — this is the one
 * centred moment on the page, and it works precisely because it is the only one.
 */
export function VrBand() {
  return (
    <section className="relative bg-surface lg:min-h-[60vh] lg:flex lg:flex-col lg:justify-center">
      <div className="relative min-h-[18rem] lg:min-h-[28rem] overflow-hidden tall:min-h-[24rem]">
        <Media
          id="home.vr"
          parallax
          ratio="panorama"
          sizes="100vw"
          className="absolute inset-0 h-full"
        />
        {hasMedia("home.vr") ? (
          <div aria-hidden className="absolute inset-0 bg-walnut-deep/55" />
        ) : null}

        <div className="relative flex min-h-[18rem] items-center py-14 tall:min-h-[24rem] tall:py-20">
          <div className="u-container text-center">
            <Reveal kind="up">
              <Metadata className="text-accent-text">
                360&deg; &middot; Desktop, mobile and headset
              </Metadata>
              <p className="mx-auto mt-6 max-w-[20ch] font-display text-display-lg">
                Stand inside one first.
              </p>
              <p className="mx-auto mt-6 u-measure-tight font-sans text-body text-text-muted">
                A walkthrough of a finished interior, built around 360&deg;
                capture of a real structure.
              </p>
              <div className="mt-9 flex justify-center">
                <ArrowLink href="/experiences">The VR experience</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
