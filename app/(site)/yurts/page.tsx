import { pageMetadata } from "@/lib/seo";
import { getProducts } from "@/sanity/lib/content";
import { PageHeader } from "@/components/page/PageHeader";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Section } from "@/components/primitives/Section";
import { RangeShowcase } from "@/components/range/RangeShowcase";

export const metadata = pageMetadata({
  title: "Yurt Range: 10 Models and Sizes",
  description:
    "Ten yurt models, from 5m studios to 12m event pavilions — footprint, occupancy and what each one suits. Made in India for resorts, retreats and homes.",
  path: "/yurts",
});

/**
 * The Range catalogue page.
 *
 * Integrated with the split sticky showcase:
 * - Left sticky photo stage + live structural specifications.
 * - Right numbered scroll-driven collapsible sequence across all 10 models.
 */
export default async function YurtsPage() {
  const products = await getProducts();

  const formattedProducts =
    products.length > 0
      ? products.map((p) => ({
          id: p._id,
          name: p.title,
          slug: p.slug,
          tagline: p.tagline,
          use: p.summary,
          heroImage: p.heroImage,
          specs: p.specs,
        }))
      : undefined;

  return (
    <>
      <PageHeader
        eyebrow="The range"
        title="Ten starting points."
        lead="Each structure is a customizable foundation engineered for durability, rapid site assembly, and low-impact installation across India."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Every diameter, door placement, insulation layer, and timber finish
              can be tailored to match your site topography and hospitality goals.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Ask about a specific yurt</ArrowLink>
            </div>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section-lg)">
        <RangeShowcase products={formattedProducts} />
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Not sure which</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                Start from the site, not the catalogue.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Tell us where the land is and what has to happen on it. That
                narrows the range faster than any specification sheet.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/applications">What they are used for</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
