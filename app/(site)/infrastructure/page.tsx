import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";
import {
  capabilities,
  capacity,
  componentDrawings,
  environmentMedia,
  facilityFacts,
  journey,
  qualityPoints,
  supportingDocuments,
  team,
  type Attribution,
} from "@/data/infrastructure";
import { media } from "@/data/media";
import { PageHeader } from "@/components/page/PageHeader";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Button } from "@/components/primitives/Button";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";

export const metadata = pageMetadata({
  title: "Behind the Build: Our Workshop and Production",
  description:
    "How Theyurts are made — the workshop, the components, the people and the checks behind each yurt, and how production connects to transport and installation.",
  path: "/infrastructure",
});

/**
 * Next's optimiser stays on for this page's imagery (the Media default turns it
 * off). The workshop photographs will arrive as full-size camera files, and the
 * drawings are 500kb PNGs — both shrink by an order of magnitude as AVIF/WebP.
 */
const optimised = { unoptimized: false, quality: 80 } as const;

const attributionLabel: Record<Exclude<Attribution, null>, string> = {
  "in-house": "In-house",
  partner: "With a specialist partner",
};

/**
 * Review aid. Marks content whose operational detail still needs sign-off.
 * Development only — production never renders it.
 */
function ToVerify({ show = true }: { show?: boolean }) {
  if (!show || process.env.NODE_ENV !== "development") return null;
  return (
    <span className="ml-3 inline-block whitespace-nowrap rounded-xs border border-dashed border-accent px-2 py-0.5 align-middle font-sans text-meta uppercase text-accent-text">
      To verify
    </span>
  );
}

/** Eyebrow + headline, the opening every section on the page shares. */
function SectionTitle({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <>
      <Metadata className="text-accent-text">{eyebrow}</Metadata>
      <h2
        id={id}
        className="mt-3 font-display text-display-lg u-optical-left leading-tight"
      >
        {title}
      </h2>
    </>
  );
}

/**
 * BEHIND THE BUILD
 *
 * 01. Hero — Built through process. Finished with care.
 * 02. The production environment — Where the work takes shape.
 * 03. Production capabilities
 * 04. The people behind production — People who understand the details.
 * 05. From workshop to site — The work continues beyond the workshop.
 * 06. Quality and materials — Details that determine the finished structure.
 * 07. Production capacity — Capacity built around the project.
 * 08. Final CTA — Let's talk about what you're planning.
 *
 * All content lives in data/infrastructure.ts. Anything unconfirmed there is
 * null or empty and the matching block on this page simply does not render —
 * see the header of that file before adding a figure.
 */
export default function InfrastructurePage() {
  const facts = facilityFacts.filter((f) => f.value);
  const capacityRows = capacity.filter((c) => c.value);

  return (
    <>
      {/* 01. HERO */}
      <PageHeader
        eyebrow="Behind the build"
        title="Built through process. Finished with care."
        lead="A yurt is more than the finished structure. It is a collection of components, materials and details that need to work together. Our production process brings those elements together before the yurt reaches its final site."
        trail={[{ label: "Behind the build", href: "/infrastructure" }]}
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              This page shows the work as it is. Where a detail has not been
              confirmed yet, it is not here — it will be added when it can be
              stated accurately.
            </p>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section)">
        <Reveal kind="media">
          <Media
            id={environmentMedia.lead}
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="rounded-sm"
            {...optimised}
          />
        </Reveal>
      </div>

      {/* 02. THE PRODUCTION ENVIRONMENT */}
      <Section tone="light" space="lg" aria-labelledby="environment-title">
        <div className="u-container">
          <div className="u-grid gap-y-10">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="The production environment"
                  title="Where the work takes shape."
                  id="environment-title"
                />
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-lead text-text-muted leading-relaxed">
                  The workshop is where a yurt is resolved before it travels.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Materials are prepared, components are made to fit one
                  another, the frame is brought together and finishes are
                  applied while every surface can still be reached properly.
                </p>
                <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Doing that work here, rather than in a field, keeps the part
                  of the job that depends on the site — access, ground and
                  weather — as short as it can be.
                </p>

                {facts.length ? (
                  <dl className="mt-10 border-t border-line">
                    {facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:gap-8"
                      >
                        <dt className="font-sans text-meta uppercase text-text-muted sm:w-44 sm:shrink-0">
                          {fact.label}
                        </dt>
                        <dd>
                          <span className="font-display text-display-xs text-text">
                            {fact.value}
                          </span>
                          {fact.note ? (
                            <span className="mt-1 block font-sans text-small text-text-muted">
                              {fact.note}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </Reveal>
            </div>
          </div>

          <div className="u-grid mt-(--spacing-block-lg) gap-y-6">
            {environmentMedia.pair.map((id, i) => (
              <Reveal
                key={id}
                kind="media"
                delay={i * 0.08}
                className={cn(
                  "col-span-4 md:col-span-3",
                  i === 0 ? "lg:col-span-5" : "lg:col-span-5 lg:col-start-8 lg:mt-24",
                )}
              >
                <Media
                  id={id}
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="rounded-sm"
                  {...optimised}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 03. PRODUCTION CAPABILITIES */}
      <section
        aria-labelledby="capabilities-title"
        className="py-(--spacing-section-lg)"
      >
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="Production capabilities"
                  title="What goes into a yurt before it leaves."
                  id="capabilities-title"
                />
              </Reveal>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  The areas of work that make up a yurt, each with its own
                  materials and its own tolerances.
                  {/* Only once attributions exist — saying it with none set
                      would imply every unmarked stage is in-house. */}
                  {capabilities.some((c) => c.by)
                    ? " Each is marked as carried out in-house or with a specialist partner."
                    : null}
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="mt-(--spacing-block-lg)">
            {capabilities.map((cap, i) => {
              // Landscape photographs take the wider column; the side flips on
              // each row so the page reads as a sequence rather than a grid.
              const wide = media[cap.media].ratio === "landscape";
              const flip = i % 2 === 1;

              return (
                <li
                  key={cap.id}
                  className="border-t border-line py-(--spacing-block)"
                >
                  <div className="u-grid items-center gap-y-8">
                    <Reveal
                      kind="media"
                      className={cn(
                        "col-span-4 md:col-span-6",
                        wide ? "lg:col-span-7" : "lg:col-span-5",
                        flip && (wide ? "lg:col-start-6" : "lg:col-start-8"),
                        flip && "lg:order-2",
                      )}
                    >
                      <Media
                        id={cap.media}
                        sizes={
                          wide
                            ? "(min-width: 1024px) 58vw, 100vw"
                            : "(min-width: 1024px) 40vw, 100vw"
                        }
                        className="rounded-sm"
                        {...optimised}
                      />
                    </Reveal>

                    <Reveal
                      kind="up"
                      delay={0.08}
                      className={cn(
                        "col-span-4 md:col-span-6",
                        wide ? "lg:col-span-4" : "lg:col-span-5",
                        flip
                          ? "lg:order-1 lg:col-start-1"
                          : wide
                            ? "lg:col-start-9"
                            : "lg:col-start-7",
                      )}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <span className="font-sans text-meta uppercase font-semibold text-accent-text">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {cap.by ? (
                          <Metadata>{attributionLabel[cap.by]}</Metadata>
                        ) : null}
                        <ToVerify show={!cap.by} />
                      </div>
                      <h3 className="mt-3 font-display text-display-sm text-text leading-tight">
                        {cap.title}
                      </h3>
                      <p className="mt-4 u-measure font-sans text-body text-text-muted leading-relaxed">
                        {cap.body}
                      </p>
                      {cap.details?.length ? (
                        <ul className="mt-6 border-t border-line">
                          {cap.details.map((detail) => (
                            <li
                              key={detail}
                              className="border-b border-line py-3 font-sans text-small text-text"
                            >
                              {detail}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 04. THE PEOPLE BEHIND PRODUCTION */}
      <Section tone="light" space="lg" aria-labelledby="people-title">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="The people behind production"
                  title="People who understand the details."
                  id="people-title"
                />
              </Reveal>
            </div>
          </div>

          {team.length ? (
            <ul className="u-grid mt-(--spacing-block-lg) gap-y-14">
              {team.map((person, i) => (
                <Reveal
                  key={person.name}
                  as="li"
                  kind="up"
                  delay={(i % 4) * 0.06}
                  className="col-span-4 md:col-span-3 lg:col-span-3"
                >
                  {person.photo ? (
                    <Media
                      id={person.photo}
                      ratio="portrait"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="mb-6 rounded-sm"
                      {...optimised}
                    />
                  ) : null}
                  <h3 className="font-display text-display-xs text-text">
                    {person.name}
                  </h3>
                  <Metadata as="p" className="mt-1">
                    {person.role}
                  </Metadata>
                  <p className="mt-4 font-sans text-body text-text-muted leading-relaxed">
                    {person.focus}
                  </p>
                  {person.priorExperience ? (
                    <div className="mt-5 border-t border-line pt-4">
                      <Metadata as="p">Before Theyurts</Metadata>
                      <p className="mt-2 font-sans text-small text-text-muted">
                        {person.priorExperience}
                      </p>
                    </div>
                  ) : null}
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal kind="up" className="mt-(--spacing-block-lg)">
              <div className="u-grid border-y border-line py-(--spacing-block)">
                <div className="col-span-4 md:col-span-6 lg:col-span-5">
                  <Metadata className="text-accent-text">
                    Team profiles to follow
                  </Metadata>
                  <p className="mt-4 font-display text-display-sm text-text leading-tight">
                    Introduced in their own words, not ours.
                  </p>
                </div>
                <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-5 lg:col-start-7 lg:mt-0">
                  <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                    The people who design, make and install Theyurts will be
                    introduced here with their names, roles and the experience
                    they bring. Until each of them has written that, we would
                    rather leave the space open than describe them for them.
                  </p>
                  <div className="mt-8">
                    <ArrowLink href="/enquire">Speak to the team</ArrowLink>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {/* 05. FROM WORKSHOP TO SITE */}
      <section
        aria-labelledby="journey-title"
        className="py-(--spacing-section-lg)"
      >
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="From workshop to site"
                  title="The work continues beyond the workshop."
                  id="journey-title"
                />
              </Reveal>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  Production is one part of a sequence that starts with the
                  land and ends with a finished structure standing on it.
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="u-grid mt-(--spacing-block-lg) gap-y-0">
            {journey.map((step, i) => (
              <Reveal
                key={step.index}
                as="li"
                kind="up"
                delay={(i % 3) * 0.06}
                className="col-span-4 md:col-span-3 lg:col-span-4 border-t border-line pt-6 pb-12 lg:pr-8"
              >
                <span className="block font-display text-numeral text-accent-text">
                  {step.index}
                </span>
                <h3 className="mt-6 font-display text-display-sm text-text leading-tight">
                  {step.title}
                  <ToVerify show={!step.verified} />
                </h3>
                <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>

          <div className="mt-4 border-t border-line pt-6">
            <ArrowLink href="/process">How a yurt is made, in eight stages</ArrowLink>
          </div>
        </div>
      </section>

      {/* 06. QUALITY AND MATERIALS */}
      <Section tone="light" space="lg" aria-labelledby="quality-title">
        <div className="u-container">
          <div className="u-grid items-start">
            <header className="col-span-4 md:col-span-6 lg:col-span-4 lg:sticky lg:top-28 xl:top-32 self-start">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="Quality and materials"
                  title="Details that determine the finished structure."
                  id="quality-title"
                />
              </Reveal>
            </header>

            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <ol>
                {qualityPoints.map((point, i) => (
                  <Reveal
                    key={point.title}
                    kind="up"
                    as="li"
                    delay={i * 0.04}
                    className="border-t border-line py-7 lg:py-8"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-meta uppercase text-accent-text font-semibold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-display-sm text-text leading-tight">
                          {point.title}
                        </h3>
                        <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed">
                          {point.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-(--spacing-block-lg) border-t border-line pt-8">
            <Metadata className="text-accent-text">The components, as drawn</Metadata>
            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {componentDrawings.map((drawing, i) => (
                <Reveal key={drawing.name} as="li" kind="up" delay={i * 0.06}>
                  <figure>
                    {/* White drawings multiplied onto the section surface, as
                        on the home page, so they sit in it rather than on a card. */}
                    <div className="relative isolate aspect-[718/496] w-full bg-surface">
                      <Image
                        src={drawing.file}
                        alt={`Front elevation of a yurt with the ${drawing.name.toLowerCase()} highlighted.`}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain mix-blend-multiply"
                        {...optimised}
                      />
                    </div>
                    <figcaption className="mt-4 border-t border-line pt-3">
                      <span className="block font-display text-display-xs text-text">
                        {drawing.name}
                      </span>
                      <span className="mt-1 block font-sans text-small text-text-muted">
                        {drawing.caption}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>

          {supportingDocuments.length ? (
            <div className="mt-(--spacing-block-lg) border-t border-line pt-8">
              <Metadata className="text-accent-text">
                Specifications and supporting documents
              </Metadata>
              <ul className="mt-6">
                {supportingDocuments.map((doc) => (
                  <li
                    key={doc.href}
                    className="flex flex-col gap-2 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between"
                  >
                    <div>
                      <span className="block font-display text-display-xs text-text">
                        {doc.title}
                      </span>
                      <span className="mt-1 block font-sans text-small text-text-muted">
                        {doc.issuer} ·{" "}
                        <time dateTime={doc.date}>
                          {new Date(doc.date).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </span>
                    </div>
                    <ArrowLink href={doc.href} external>
                      View document
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {/* 07. PRODUCTION CAPACITY — only figures approved for publication. */}
      {capacityRows.length ? (
        <section
          aria-labelledby="capacity-title"
          className="py-(--spacing-section-lg)"
        >
          <div className="u-container">
            <div className="u-grid">
              <div className="col-span-4 md:col-span-6 lg:col-span-6">
                <Reveal kind="up">
                  <SectionTitle
                    eyebrow="Production capacity"
                    title="Capacity built around the project."
                    id="capacity-title"
                  />
                </Reveal>
              </div>
              <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
                <Reveal kind="up" delay={0.08}>
                  <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                    Planning a site with several structures, or a phased
                    build? These are the figures we can confirm today. Tell us
                    the number and timeline you have in mind and we will tell
                    you plainly what is achievable.
                  </p>
                </Reveal>
              </div>
            </div>

            <dl className="mt-(--spacing-block-lg)">
              {capacityRows.map((row, i) => (
                <Reveal
                  key={row.label}
                  kind="up"
                  delay={i * 0.04}
                  className="u-grid border-t border-line py-6 last:border-b"
                >
                  <dt className="col-span-4 font-sans text-meta uppercase text-text-muted md:col-span-2 lg:col-span-3 lg:pt-2">
                    {row.label}
                  </dt>
                  <dd className="col-span-4 mt-2 md:col-span-4 md:mt-0 lg:col-span-8 lg:col-start-5">
                    {(Array.isArray(row.value) ? row.value : [row.value]).map((line) => (
                      <span
                        key={line}
                        className="block font-display text-display-sm text-text leading-tight"
                      >
                        {line}
                      </span>
                    ))}
                    {row.note ? (
                      <span className="mt-2 block u-measure font-sans text-small text-text-muted">
                        {row.note}
                      </span>
                    ) : null}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* 08. FINAL CTA */}
      <Section surface="alt" space="lg" tone="dark" aria-labelledby="cta-title">
        <div className="u-container">
          <div className="u-grid items-end gap-y-10">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Start a project</Metadata>
                <h2
                  id="cta-title"
                  className="mt-4 font-display text-display-lg u-optical-left leading-tight"
                >
                  Let&apos;s talk about what you&apos;re planning.
                </h2>
              </Reveal>
            </div>
            <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  Tell us about your site, the number of yurts you&apos;re
                  considering and your intended timeline. We&apos;ll discuss the
                  requirements and the next steps.
                </p>
                <div className="mt-8">
                  <Button href="/enquire">Discuss your project</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
