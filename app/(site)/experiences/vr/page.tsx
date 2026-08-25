import { pageMetadata } from "@/lib/seo";
import { VrLoader } from "@/components/vr/VrLoader";
import { Metadata } from "@/components/primitives/Metadata";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "VR experience",
  description:
    "Step inside a yurt in 360° — move between viewpoints on desktop, on a phone, or in a VR headset.",
  path: "/experiences/vr",
});

/**
 * The 360° experience. The page is a server component; everything WebGL is
 * loaded on demand by VrLoader.
 */
export default function VrPage() {
  return (
    <>
      {/*
        Same reason as the builder: the visible headings are inside a component
        that is never server-rendered, so the page would otherwise have no h1
        for crawlers or screen readers.
      */}
      <h1 className="sr-only">
        VR experience — step inside a yurt in 360&deg;
      </h1>
      <VrLoader />

      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Next</Metadata>
              <p className="mt-5 font-display text-display-md">
                Then build one to your own spec.
              </p>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <p className="u-measure font-sans text-body text-text-muted">
                The configurator lets you change size, cover, doors, windows and
                interior, and send the result with your enquiry.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4">
                <ArrowLink href="/experiences/builder">Open the 3D builder</ArrowLink>
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
