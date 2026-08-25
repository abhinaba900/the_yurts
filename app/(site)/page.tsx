import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { Anatomy } from "@/components/home/Anatomy";
import { WhyYurts } from "@/components/home/WhyYurts";
import { RangeRail } from "@/components/home/RangeRail";
import { Applications } from "@/components/home/Applications";
import { BuilderIntro } from "@/components/home/BuilderIntro";
import { VrBand } from "@/components/home/VrBand";
import { ProcessIndex } from "@/components/home/ProcessIndex";
import { Materials } from "@/components/home/Materials";
import { Sustainability } from "@/components/home/Sustainability";
import { Gallery } from "@/components/home/Gallery";
import { JournalBand } from "@/components/home/JournalBand";
import { Questions } from "@/components/home/Questions";
import { Closing } from "@/components/home/Closing";

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
 * Home.
 *
 * The order is an argument: what it is → what it is made of → why you would →
 * what you would get → what you would use it for → how to see one → how it is
 * made → what it is made of → what it costs the land → what it looks like →
 * what we think → what you are wondering → get in touch.
 *
 * No two consecutive sections share a layout, a surface or an alignment. That
 * rhythm is the point of the page, so keep it in mind before inserting anything
 * new between two of these.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Anatomy />
      <WhyYurts />
      <RangeRail />
      <Applications />
      <BuilderIntro />
      <VrBand />
      <ProcessIndex />
      <Materials />
      <Sustainability />
      <Gallery />
      <JournalBand />
      <Questions />
      <Closing />
    </>
  );
}
