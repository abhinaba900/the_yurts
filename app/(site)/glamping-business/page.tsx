import { pageMetadata } from "@/lib/seo";
import { glampingTopics } from "@/data/pages";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Button } from "@/components/primitives/Button";

export const metadata = pageMetadata({
  title: "Starting a glamping business",
  description:
    "Land, access, permissions, site planning, investment and guest experience — what to work out before building glamping accommodation in India.",
  path: "/glamping-business",
});

/**
 * Glamping business.
 *
 * A commercial page with no financial claims in it. There are no returns, no
 * payback periods, no occupancy figures and no "from ₹X per night" — every one
 * of those depends on a specific site and market, and putting a number here
 * would be inventing the client's business case for them.
 *
 * The revenue section says so explicitly, which is a stronger position than a
 * projection anyone can see through.
 */
export default function GlampingBusinessPage() {
  return (
    <>
      <PageHeader
        eyebrow="For landowners and operators"
        title="Starting a glamping business."
        lead="Written for people weighing up a first site. What to look at, what to plan for, and what to ask before committing anything."
        trail={[
          { label: "Starting a glamping business", href: "/glamping-business" },
        ]}
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              There are no revenue projections on this page. Rate, occupancy and
              season length depend on your land and your market, and anyone
              quoting you a return before seeing the site is guessing.
            </p>
            <div className="mt-6">
              <ArrowLink href="/contact">Book a consultation</ArrowLink>
            </div>
          </div>
        }
      />

      <div className="u-container">
        <Reveal kind="media">
          <Media id="home.application-glamping" ratio="cinema" sizes="100vw" />
        </Reveal>
      </div>

      <section className="u-container py-(--spacing-section-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
            <Reveal kind="up">
              <p className="u-measure-wide font-display text-display-md">
                The accommodation is the easy part. Everything around it is the
                business.
              </p>
              <p className="mt-8 u-measure font-sans text-body text-text-muted">
                Most first sites are not limited by structures. They are limited
                by access, water, sanitation, permissions and the fact that the
                nicest part of the property is a long walk from anywhere a car
                can stop. Working those out early is what separates a site that
                opens from a site that stays a plan.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="u-container pb-(--spacing-section)">
        <ol>
          {glampingTopics.map((topic) => (
            <Reveal
              key={topic.index}
              kind="up"
              as="li"
              className="border-t border-line py-10 last:border-b lg:py-12"
            >
              <div className="u-grid items-baseline gap-y-5">
                <span className="col-span-1 font-sans text-meta uppercase text-accent-text lg:col-span-1">
                  {topic.index}
                </span>
                <h2 className="col-span-3 font-display text-display-md md:col-span-5 lg:col-span-4">
                  {topic.title}
                </h2>
                <p className="col-span-4 u-measure font-sans text-body text-text-muted md:col-span-6 lg:col-span-6 lg:col-start-7">
                  {topic.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Consultation</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                Bring us the land, not the plan.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                A conversation about the site itself — where the structures would
                sit, what the ground and access allow, and what a realistic first
                phase looks like. If the answer is that yurts are wrong for your
                site, you will hear that too.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Button href="/contact" variant="solid">
                  Book a consultation
                </Button>
                <ArrowLink href="/applications/glamping">
                  Yurts for glamping
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
