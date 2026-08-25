import { pageMetadata } from "@/lib/seo";
import { whyPoints, whyNot } from "@/data/pages";
import { PageHeader } from "@/components/page/PageHeader";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Why a yurt",
  description:
    "Modular construction, difficult sites, staged expansion and relocatability — the case for building with yurts, and the situations where it is the wrong answer.",
  path: "/why-theyurts",
});

/**
 * Why a yurt.
 *
 * Two halves, and the second one is the point: a page that only argues in
 * favour is advertising. The "wrong answer" section is set on the dark tone so
 * it reads as a deliberate counterweight rather than a caveat in small print.
 *
 * No insulation values, wind ratings, lifespans or installation times. Those are
 * exactly the claims this page would want, and exactly the ones that have to
 * come from the workshop.
 */
export default function WhyPage() {
  return (
    <>
      <PageHeader
        eyebrow="The case"
        title="Why build this way."
        lead="A yurt is not a cheaper building or a nicer tent. It is a different set of trade-offs, and it is worth being clear about both sides of them."
        trail={[{ label: "Why a yurt", href: "/why-theyurts" }]}
      />

      <div className="u-container pb-(--spacing-section)">
        <ol>
          {whyPoints.map((point, i) => (
            <Reveal
              key={point.title}
              kind="up"
              as="li"
              className="border-t border-line py-9 last:border-b lg:py-11"
            >
              <div className="u-grid items-baseline gap-y-4">
                <span className="col-span-1 font-display text-numeral text-accent-text lg:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="col-span-3 font-display text-display-md md:col-span-5 lg:col-span-4">
                  {point.title}
                </h2>
                <p className="col-span-4 u-measure font-sans text-body text-text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="u-container pb-(--spacing-section)">
        <Reveal kind="media">
          <Media id="home.gallery-1" sizes="100vw" />
        </Reveal>
      </div>

      {/* The counterweight. */}
      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <header className="col-span-4 md:col-span-6 lg:col-span-4">
              <Metadata className="text-accent-text">The other side</Metadata>
              <h2 className="mt-5 font-display text-display-lg u-optical-left">
                When it is the wrong answer.
              </h2>
              <p className="mt-7 u-measure-tight font-sans text-body text-text-muted">
                We would rather lose an enquiry here than six months into a
                project that was never going to suit.
              </p>
            </header>

            <div className="col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <dl>
                {whyNot.map((item) => (
                  <Reveal
                    key={item.title}
                    kind="up"
                    className="border-t border-line py-6 last:border-b"
                  >
                    <dt className="font-display text-display-sm">{item.title}</dt>
                    <dd className="mt-3 u-measure font-sans text-body text-text-muted">
                      {item.body}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      <section className="u-container py-(--spacing-section-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <Metadata>Technical claims</Metadata>
            <h2 className="mt-5 font-display text-display-md">
              What we have not said here.
            </h2>
          </div>
          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
            <p className="u-measure font-sans text-body text-text-muted">
              You will notice there are no insulation values, wind ratings,
              lifespans or installation times on this page. Those figures matter,
              and they are being established properly in the workshop rather than
              estimated for a website. When we publish them they will be ours to
              stand behind.
            </p>
            <p className="mt-5 u-measure font-sans text-body text-text-muted">
              If you need one of them to make a decision now, ask — you will get
              the real answer, including where it is still &ldquo;we do not know
              yet&rdquo;.
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/enquire">Ask a technical question</ArrowLink>
              <ArrowLink href="/process">How one gets made</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
