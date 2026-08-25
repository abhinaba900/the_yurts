import { Media } from "@/components/primitives/Media";
import { hasMedia } from "@/data/media";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Closing image. Full bleed, dark, one line.
 *
 * The enquiry invitation itself lives in the footer immediately below, so this
 * does not repeat it — it hands over to it. Two enquiry blocks stacked on top of
 * each other would read as a page that does not trust you to have understood the
 * first one.
 */
export function Closing() {
  return (
    <section className="relative bg-surface">
      <div className="relative h-[70svh] lg:h-[calc(100vh-6rem)] overflow-hidden tall:min-h-[26rem]">
        <Media
          id="home.closing"
          parallax
          ratio="cinema"
          sizes="100vw"
          className="absolute inset-0 h-full"
        />
        {hasMedia("home.closing") ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-walnut-deep/85 via-walnut-deep/25 to-walnut-deep/25"
          />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-20">
          <div className="u-container">
            <Reveal kind="up">
              <p className="max-w-[18ch] font-display text-display-lg u-optical-left">
                Built for the landscape.
              </p>
              <div className="mt-8">
                <ArrowLink href="/enquire">Tell us about your site</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
