import { pageMetadata } from "@/lib/seo";
import { floorPlans } from "@/data/floorPlans";
import { PageHeader } from "@/components/page/PageHeader";
import { FloorPlanCatalogue } from "@/components/floorplans/FloorPlanCatalogue";
import { Button } from "@/components/primitives/Button";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";

export const metadata = pageMetadata({
  title: "Yurt Floor Plans and Interior Layouts",
  description:
    "Interior layouts for a circular room — open plan, retreat, suite, gathering, wellness studio and living space — and how to choose one for your yurt.",
  path: "/floor-plans",
});

/** What a plan depends on. Named, not explained — the conversation does that. */
const factors = ["Yurt size", "Intended use", "Entrances", "Windows", "Furniture"];

/**
 * FLOOR PLANS
 *
 * Four sections:
 * 01. Hero — A space for every way of living.
 * 02. Catalogue — the layouts, from `data/floorPlans.ts`.
 * 03. Guidance — Start with how you want to use the space.
 * 04. Closing — Have a layout in mind?
 *
 * A catalogue, not a configurator: the 3D builder is where a plan gets
 * specified, and this page hands over to it.
 */
export default function FloorPlansPage() {
  const plans = floorPlans.filter((plan) => plan.available);

  return (
    <>
      {/* 01. HERO */}
      <PageHeader
        eyebrow="Floor Plans"
        title="A space for every way of living."
        lead="A yurt's circular form creates possibilities beyond a conventional room. Explore different layouts designed around how the space will be used, from considered hospitality interiors to open, adaptable spaces."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Layouts are indicative. Each one is confirmed against the size,
              entrances and windows of your yurt.
            </p>
          </div>
        }
      />

      {/* 02. CATALOGUE */}
      <section
        aria-labelledby="floor-plans-catalogue"
        className="u-container pb-(--spacing-section-lg)"
      >
        <div className="mb-10 flex items-baseline justify-between gap-6 border-t border-line pt-5 md:mb-14">
          <Metadata as="h2" className="text-accent-text">
            <span id="floor-plans-catalogue">The layouts</span>
          </Metadata>
          <Metadata>{String(plans.length).padStart(2, "0")} plans</Metadata>
        </div>

        <FloorPlanCatalogue plans={plans} />
      </section>

      {/* 03. GUIDANCE */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Choosing a layout</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left leading-tight">
                  Start with how you want to use the space.
                </h2>
              </Reveal>
            </div>

            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-lead leading-relaxed text-text-muted">
                  Tell us what the yurt needs to accommodate and how you imagine
                  using it. We can help you explore the layout that best suits
                  your requirements.
                </p>

                <p className="mt-8 font-sans text-meta uppercase text-text-muted">
                  A plan depends on
                </p>
                <ul className="mt-3 border-t border-line">
                  {factors.map((factor) => (
                    <li
                      key={factor}
                      className="border-b border-line py-3 font-sans text-body text-text"
                    >
                      {factor}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button href="/experiences/builder">Explore the 3D Builder</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* 04. CLOSING */}
      <section className="border-t border-line py-(--spacing-section-lg)">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Enquire</Metadata>
                <h2 className="mt-3 font-display text-display-lg u-optical-left">
                  Have a layout in mind?
                </h2>
              </Reveal>
            </div>

            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-lead leading-relaxed text-text-muted">
                  Share your intended use, preferred arrangement and site details
                  with us. We&apos;ll help you explore the next steps.
                </p>
                <div className="mt-9">
                  <Button href="/enquire" variant="hairline">
                    Start an enquiry
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
