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
import { Materials } from "@/components/home/Materials";
import { Gallery } from "@/components/home/Gallery";

/**
 * The one page that has to carry the primary commercial term rather than a
 * section label: someone searching for a yurt maker in India should recognise
 * this result without having to read past the brand.
 */
const HOME_TITLE = "Luxury Yurt Manufacturers in India";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: site.description,
  path: "/",
});

/**
 * THEYURTS.IN — HOMEPAGE
 *
 * 10 Sections:
 * 01. Hero — Custom-built yurts for resorts, farm stays & private properties.
 * --- Image band — the ten models, each named by what it is used for.
 * 02. The Yurt — What exactly is a yurt?
 * 03. The Structure — How is a modern yurt built?
 * 04. Why a Yurt — Why choose a yurt instead of conventional construction?
 * 05. Built for India — Yurts designed for Indian weather & site conditions.
 * 06. The Range — Find the right yurt for your property.
 * 07. Design Yours — Customise your yurt in 3D before ordering.
 * 08. Step Inside — Take a virtual tour of a yurt.
 * 09. Materials & Craft — What goes into building a quality yurt?
 * 10. Inspiration & Gallery — Explore yurt designs & installation ideas.
 *
 * The closing enquiry ("Planning to install a yurt?") is the site footer.
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
      <Materials />
      <Gallery />
    </>
  );
}
