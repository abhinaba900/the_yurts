import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "See a Yurt in 3D and 360°",
  description:
    "Configure a yurt in 3D, or step inside one in 360°. Two ways to work out the size, layout and finishes you want before anyone quotes for it.",
  path: "/experiences",
});

/**
 * Experiences Hub.
 *
 * Clean, flat architectural aesthetic with crisp hairline borders,
 * zero box shadows, generous natural spacing, and uncropped visual framing.
 */
export default function ExperiencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experiences"
        title="See it before it exists."
        lead="Two ways to work out what you actually want — one where you build it from the ground up, and one where you stand inside it."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Every configuration is saved directly to your site enquiry, giving our workshop the exact dimensions, materials, and openings needed to quote.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Discuss a custom commission</ArrowLink>
            </div>
          </div>
        }
      />

      {/* ---- Experience 01: 3D Builder ---- */}
      <section className="py-12 lg:py-16 border-t border-line">
        <div className="u-container">
          <div className="u-grid items-center gap-y-12 lg:gap-x-12">
            {/* Left Media: Clean Uncropped 3D Visualization */}
            <Reveal
              kind="media"
              className="col-span-4 md:col-span-6 lg:col-span-7"
            >
              <div className="relative overflow-hidden rounded-sm bg-surface-alt/70 border border-line/70 p-6 sm:p-10 flex flex-col items-center justify-center min-h-[380px] lg:min-h-[460px] group">
                {/* Floating Tool Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-xs bg-surface-deep/90 backdrop-blur-xs border border-line/50">
                  <span className="font-sans text-meta text-accent-text uppercase font-semibold">
                    01 &middot; 3D Configurator
                  </span>
                </div>

                {/* Uncropped Model Image with Full Visibility */}
                <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] flex items-center justify-center">
                  <Media
                    id="home.builder"
                    ratio="landscape"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>

                {/* Mock Configurator Controls Bar */}
                <div className="mt-4 w-full border-t border-line/60 pt-4 flex flex-wrap items-center justify-between gap-3 text-text-muted font-sans text-meta uppercase">
                  <div className="flex items-center gap-4">
                    <span className="text-text font-medium">Diameter: 6m</span>
                    <span className="text-line">&bull;</span>
                    <span>Frame: Ash Lattice</span>
                    <span className="text-line">&bull;</span>
                    <span>Canvas: Natural</span>
                  </div>
                  <span className="text-accent-text font-medium">
                    Cutaway Mode Active
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Right Content */}
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up" delay={0.08}>
                <span className="font-sans text-meta uppercase text-accent-text font-medium">
                  Experience 01
                </span>
                <h2 className="mt-2 font-display text-display-lg u-optical-left">
                  Build one on screen.
                </h2>
                <p className="mt-5 font-sans text-lead text-text-muted leading-relaxed">
                  Change the diameter, wall lattice height, insulation package, roof crown oculus, timber door placement, and internal partitions in real time.
                </p>
                <p className="mt-4 font-sans text-body text-text-muted leading-relaxed">
                  Toggle between the weatherproof canvas exterior and the exposed timber frame cutaway to inspect the steam-bent rafters and compression ring joinery.
                </p>

                {/* Feature Checklist */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-4 font-sans text-[0.8125rem]">
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Real-time structural 3D</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Frame cutaway toggle</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Material & colour options</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Export CAD specification</span>
                  </div>
                </div>

                <div className="mt-8 border-t border-line/80 pt-6">
                  <ArrowLink href="/experiences/builder">
                    Open the 3D builder
                  </ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Experience 02: 360° VR Tour ---- */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid items-center gap-y-12 lg:gap-x-12">
            {/* Left Content */}
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <span className="font-sans text-meta uppercase text-accent-text font-medium">
                  Experience 02
                </span>
                <h2 className="mt-2 font-display text-display-lg u-optical-left">
                  Stand inside one.
                </h2>
                <p className="mt-5 font-sans text-lead text-text-muted leading-relaxed">
                  A 360&deg; spatial walkthrough of a completed luxury yurt interior — directly on your desktop, smartphone gyroscope, or immersive VR headset.
                </p>
                <p className="mt-4 font-sans text-body text-text-muted leading-relaxed">
                  Experience the column-free circular room, the soft acoustics of tensioned organic canvas, and the natural daylight illuminating the floor from the central crown wheel.
                </p>

                {/* Feature Checklist */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-4 font-sans text-[0.8125rem]">
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>360&deg; spherical orbit</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Mobile device gyroscope</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>Spatial audio & acoustics</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <span className="text-accent-text font-bold">&bull;</span>
                    <span>VR headset compatibility</span>
                  </div>
                </div>

                <div className="mt-8 border-t border-line/80 pt-6">
                  <ArrowLink href="/experiences/vr">
                    Enter the VR experience
                  </ArrowLink>
                </div>
              </Reveal>
            </div>

            {/* Right Media: 360 Panorama Stage */}
            <Reveal
              kind="media"
              className="col-span-4 md:col-span-6 lg:col-span-7"
            >
              <div className="relative overflow-hidden rounded-sm bg-surface border border-line/70 min-h-[380px] lg:min-h-[460px] flex flex-col justify-between group p-6 sm:p-8">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xs bg-surface-deep/90 backdrop-blur-xs font-sans text-meta text-accent-text uppercase border border-line/50">
                    02 &middot; 360&deg; Spatial Immersion
                  </span>
                  <span className="font-sans text-meta uppercase text-text-muted text-[0.75rem]">
                    Drag to look around
                  </span>
                </div>

                {/* Panorama Media */}
                <div className="relative my-4 overflow-hidden rounded-xs aspect-[16/10] w-full">
                  <Media
                    id="home.vr"
                    ratio="landscape"
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-radial from-transparent to-surface-deep/40 pointer-events-none" />
                </div>

                {/* Bottom Status Info */}
                <div className="border-t border-line/60 pt-3 flex items-center justify-between font-sans text-[0.8125rem] text-text-muted">
                  <span>Interior: 8.0m Resort Master Suite</span>
                  <span className="text-accent-text">High-Resolution Photogrammetry</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---- Closing CTA ---- */}
      <section className="py-16 lg:py-20 border-t border-line">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Ready to build</Metadata>
              <h2 className="mt-4 font-display text-display-lg u-optical-left">
                Start from your land.
              </h2>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-2">
              <p className="u-measure font-sans text-lead text-text-muted">
                Tell us where the site is located and your intended use. We will advise on suitable diameters, thermal ratings, and foundation options.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/yurts">Explore the range</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
