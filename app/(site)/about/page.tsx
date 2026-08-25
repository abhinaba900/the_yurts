import { pageMetadata } from "@/lib/seo";
import { beliefs } from "@/data/pages";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { EmptyState } from "@/components/page/EmptyState";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Theyurts designs, manufactures and installs premium yurts across India — for resorts, glamping sites, retreats, farm stays and private land.",
  path: "/about",
});

/**
 * About.
 *
 * The hardest page to write honestly for a company with no history. It says
 * what Theyurts is doing and what it believes, and it does not claim years of
 * experience, a team, a factory floor or certifications — none of which have
 * been supplied.
 *
 * The team and certifications sections are empty states rather than omissions,
 * so the client can see exactly where their information goes.
 */
export default async function AboutPage() {
  const settings = await getSettings();
  const hasLocation = Boolean(settings.contact.city || settings.contact.address);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A new company, building an old structure properly."
        lead="Theyurts designs, manufactures and installs yurts in India. We are early — and we would rather say so than perform a history we do not have."
      />

      <div className="u-container">
        <Reveal kind="media">
          <Media id="home.material-crown" ratio="cinema" sizes="100vw" />
        </Reveal>
      </div>

      {/* Story */}
      <section className="u-container py-(--spacing-section-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-2">
            <Metadata>The idea</Metadata>
          </div>
          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-4 lg:mt-0">
            <Reveal kind="up">
              <p className="u-measure-wide font-display text-display-md">
                There is a gap between a tent and a building, and almost nothing
                good in it.
              </p>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <p className="font-sans text-body text-text-muted">
                  India has an enormous amount of land where a conventional
                  building is difficult, slow, expensive, or simply not the right
                  idea — hillsides, farms, forest edges, sites that flood, sites
                  nobody wants to pour concrete on. It also has a growing number
                  of people who want to spend a night somewhere that is not a
                  hotel room.
                </p>
                <p className="font-sans text-body text-text-muted">
                  The structures serving that gap are mostly imported at
                  unhelpful cost, or improvised locally and not really built to
                  last. Theyurts exists to make the properly designed, properly
                  manufactured version here — and to install it on the land it
                  is meant for rather than shipping a kit and wishing you luck.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <header className="col-span-4 md:col-span-6 lg:col-span-4">
              <Metadata className="text-accent-text">What we hold to</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                Four positions.
              </h2>
            </header>
            <div className="col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <dl>
                {beliefs.map((belief, i) => (
                  <Reveal
                    key={belief.title}
                    kind="up"
                    delay={i * 0.04}
                    className="border-t border-line py-7 last:border-b"
                  >
                    <dt className="font-display text-display-sm">{belief.title}</dt>
                    <dd className="mt-3 u-measure font-sans text-body text-text-muted">
                      {belief.body}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* Making */}
      <section className="u-container py-(--spacing-section-lg)">
        <div className="u-grid gap-y-12">
          <Reveal
            kind="media"
            className="col-span-2 md:col-span-3 lg:col-span-5 lg:mt-16"
          >
            <Media
              id="home.material-timber"
              sizes="(min-width: 1024px) 40vw, 45vw"
            />
          </Reveal>

          <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <Reveal kind="up">
              <Metadata>How we make them</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                In a workshop, then on your site.
              </h2>
              <p className="mt-8 u-measure font-sans text-body text-text-muted">
                The frame is manufactured under a roof where tolerances can be
                held and every piece is checked, then assembled on site onto a
                prepared base. That split is the whole reason the structure works
                on land a builder would struggle with.
              </p>
              <p className="mt-5 u-measure font-sans text-body text-text-muted">
                Specific timbers, fabrics, coatings and fixings are being settled
                now. They will be published with the figures behind them —
                material grades, treatments and the reasoning — rather than as
                adjectives.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
                <ArrowLink href="/process">The build process</ArrowLink>
                <ArrowLink href="/why-theyurts">Why a yurt</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pending sections — visible so the client can see where their content goes. */}
      <div className="u-container pb-(--spacing-section)">
        <EmptyState
          label="Team"
          title="The people, shortly."
          body="Who is behind Theyurts, what they did before, and who will be on your site. Being written with the founders rather than filled with stock portraits."
        />
        <EmptyState
          label="Certifications"
          title="Nothing to show yet."
          body="Any certification, testing or accreditation will be listed here with the issuing body and the date. Until there is something real, this section stays empty."
        />
        {hasLocation ? null : (
          <EmptyState
            label="Workshop"
            title="Where we build."
            body="The workshop address and how to visit will be published here once it is confirmed."
            action={{ href: "/contact", label: "Contact us in the meantime" }}
          />
        )}
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <p className="font-display text-display-lg u-optical-left">
                Tell us about the land.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Being early means we have time for your project, and every
                structure we build now matters more than the last. That is worth
                something.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/contact">Book a consultation</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
