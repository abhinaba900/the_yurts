import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

import { Hero } from "@/components/home/Hero";
import { ImageBand } from "@/components/home/ImageBand";
import { Introduction } from "@/components/home/Introduction";
import { Anatomy } from "@/components/home/Anatomy";
import { WhyYurts } from "@/components/home/WhyYurts";
import { BuiltForIndia } from "@/components/home/BuiltForIndia";
import { RangeRail } from "@/components/home/RangeRail";
import { BuilderIntro } from "@/components/home/BuilderIntro";
import { VrBand } from "@/components/home/VrBand";
import { ProcessIndex } from "@/components/home/ProcessIndex";
import { Materials } from "@/components/home/Materials";
import { Sustainability } from "@/components/home/Sustainability";
import { Gallery } from "@/components/home/Gallery";

export const metadata = {
  ...pageMetadata({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    path: "/",
  }),
  // `absolute` opts out of the layout's "%s — Theyurts" template, which would
  // otherwise render "Theyurts — <tagline> — Theyurts" on the home page.
  title: { absolute: `${site.name} — ${site.tagline}` },
};

/**
 * THEYURTS.IN — HOMEPAGE
 *
 * 12 Curated Editorial Sections:
 * 01. Hero — A different way to build.
 * --- Image band — the hinge between the hero and the argument.
 * 02. Introduction — Architecture that changes the way you experience a place.
 * 03. What is a Yurt? — Simple in form. Sophisticated in structure.
 * 04. Why Yurts — Build less. Experience more.
 * 05. Built for India — Made for the Indian landscape.
 * 06. The Range — One structure. Many possibilities.
 * 07. 3D Builder — Build your yurt before we build it.
 * 08. VR Experience — Don't just look at a yurt. Step inside one.
 * 09. Build Process — From an idea on paper to a space on your land.
 * 10. Materials & Craft — Made of what it looks like.
 * 11. Sustainability — A lighter footprint on the land.
 * 12. Inspiration & Gallery — The beginning of something different.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ImageBand />
      <Introduction />
      <Anatomy />
      <WhyYurts />
      <BuiltForIndia />
      <RangeRail />
      <BuilderIntro />
      <VrBand />
      <ProcessIndex />
      <Materials />
      <Sustainability />
      <Gallery />
    </>
  );
}
