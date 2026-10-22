import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import {
  audiences,
  experienceCentre,
  gallery,
  isCentreOpen,
  visitPoints,
} from "@/data/experienceCentre";
import { hasMedia } from "@/data/media";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/page/PageHeader";
import { CentreGallery } from "@/components/experience-centre/CentreGallery";
import { VisitRequestForm } from "@/components/experience-centre/VisitRequestForm";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Button } from "@/components/primitives/Button";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";

export const metadata = pageMetadata({
  title: "Theyurts Experience Centre, Bengaluru | Visit a Yurt",
  description:
    "Visit the Theyurts Experience Centre in Bengaluru to explore a yurt in person, see its structure and finishes, and discuss your project with our team.",
  path: "/experience-centre",
  // Not advertised to search engines until the centre can receive visitors.
  noIndex: !isCentreOpen,
});

/**
 * Review aid, as on /infrastructure. Marks a claim that depends on how the
 * centre is actually set up. Development only — production never renders it.
 */
function ToVerify({ show = true }: { show?: boolean }) {
  if (!show || process.env.NODE_ENV !== "development") return null;
  return (
    <span className="ml-3 inline-block whitespace-nowrap rounded-xs border border-dashed border-accent px-2 py-0.5 align-middle font-sans text-meta uppercase text-accent-text">
      To verify
    </span>
  );
}

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <>
      <Metadata className="text-accent-text">{eyebrow}</Metadata>
      <h2 id={id} className="mt-3 font-display text-display-lg u-optical-left leading-tight">
        {title}
      </h2>
    </>
  );
}

/**
 * EXPERIENCE CENTRE, BENGALURU
 *
 * 01. Hero — Step inside a yurt.
 * 02. Gallery — See it for yourself.
 * 03. What to experience — More than a look from the outside.
 * 04. Who should visit — Bring us an idea.
 * 05. Location — Find us in Bengaluru.
 * 06. Book a visit — Come and experience it.
 * 07. Final CTA — Have a project in mind?
 *
 * All content lives in data/experienceCentre.ts, photographs in data/media.ts.
 * Anything unconfirmed there is null or empty and the matching detail does not
 * render — the page never shows a guessed address, map or opening time.
 */
export default async function ExperienceCentrePage() {
  const settings = await getSettings();
  const { location, visiting } = experienceCentre;

  const phone = visiting.contactPhone ?? settings.contact.phone;
  const tel = phone ? `tel:${phone.replace(/\s/g, "")}` : null;
  const photosPending = gallery.some((image) => !hasMedia(image.media));

  const addressLines = [
    location.address,
    location.locality,
    [location.city, location.postalCode].filter(Boolean).join(" "),
  ].filter((line): line is string => Boolean(line));
  const hasAddress = Boolean(location.address);

  // Only an actual Google Maps embed is framed — never an arbitrary URL.
  const mapEmbed =
    location.mapEmbedUrl?.startsWith("https://www.google.com/maps/embed") ? location.mapEmbedUrl : null;

  return (
    <>
      {isCentreOpen && hasAddress ? (
        <JsonLd
          schema={{
            "@context": "https://schema.org",
            "@type": "Place",
            name: `${site.name} Experience Centre`,
            url: `${site.url}/experience-centre`,
            address: {
              "@type": "PostalAddress",
              streetAddress: location.address ?? undefined,
              addressLocality: location.city,
              postalCode: location.postalCode ?? undefined,
              addressRegion: "Karnataka",
              addressCountry: "IN",
            },
            ...(location.mapsUrl ? { hasMap: location.mapsUrl } : {}),
            ...(phone ? { telephone: phone } : {}),
          }}
        />
      ) : null}

      {/* 01. HERO */}
      <PageHeader
        eyebrow="Theyurts, Bengaluru"
        title="Step inside a yurt."
        lead="Explore the space, see the structure up close and discover how a yurt could work for your land, retreat or hospitality project."
        trail={[{ label: "Experience Centre", href: "/experience-centre" }]}
        aside={
          <div className="border-t border-line pt-5">
            {isCentreOpen ? null : (
              <>
                <Metadata className="text-accent-text">Opening soon</Metadata>
                <p className="mt-3 font-sans text-small text-text-muted">
                  The centre is being prepared. The address, visiting hours and
                  how visits work will be confirmed on this page before we
                  welcome visitors. You can request a visit now.
                </p>
              </>
            )}
            <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Button href="#book-a-visit" className="w-full sm:w-auto">
                Book a visit
              </Button>
              <ArrowLink href="#gallery">Explore the gallery</ArrowLink>
            </div>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section)">
        <Reveal kind="media">
          <Media
            id="experience-centre.hero"
            sizes="(min-width: 1536px) 1440px, 100vw"
            className="rounded-sm"
            unoptimized={false}
            quality={80}
          />
        </Reveal>
      </div>

      {/* 02. GALLERY */}
      <Section
        tone="light"
        space="lg"
        id="gallery"
        aria-labelledby="gallery-title"
        className="scroll-mt-24"
      >
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <SectionTitle eyebrow="Gallery" title="See it for yourself." id="gallery-title" />
              </Reveal>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  The yurt at the centre, inside and out — the structure, the
                  details and the setting around it. Select any photograph to
                  see it larger.
                </p>
                {photosPending ? (
                  <p className="mt-4 u-measure font-sans text-small text-text-muted">
                    Photographs are taken at the centre itself as it is
                    completed. Spaces marked “Image pending” are still to come.
                  </p>
                ) : null}
              </Reveal>
            </div>
          </div>

          <div className="mt-(--spacing-block-lg)">
            <CentreGallery images={gallery} />
          </div>
        </div>
      </Section>

      {/* 03. WHAT TO EXPERIENCE */}
      <section aria-labelledby="experience-title" className="py-(--spacing-section-lg)">
        <div className="u-container">
          <div className="u-grid items-start">
            <header className="col-span-4 md:col-span-6 lg:col-span-4 lg:sticky lg:top-28 xl:top-32 self-start">
              <Reveal kind="up">
                <SectionTitle
                  eyebrow="On a visit"
                  title="More than a look from the outside."
                  id="experience-title"
                />
                <p className="mt-6 u-measure font-sans text-body text-text-muted leading-relaxed">
                  A visit is time with a real structure and with the people who
                  make it. Come with questions; leave knowing whether a yurt
                  suits what you have in mind.
                </p>
              </Reveal>
            </header>

            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <ol>
                {visitPoints.map((point, i) => (
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
                          <ToVerify show={!point.verified} />
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
        </div>
      </section>

      {/* 04. WHO SHOULD VISIT */}
      <Section tone="light" space="lg" aria-labelledby="audience-title">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Reveal kind="up">
                <SectionTitle eyebrow="Who visits" title="Bring us an idea." id="audience-title" />
              </Reveal>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  The centre is for anyone weighing up a yurt seriously. It is
                  most useful when you arrive with a site, a use or a question
                  in mind — however early it is.
                </p>
              </Reveal>
            </div>
          </div>

          <ul className="mt-(--spacing-block-lg) grid grid-cols-1 gap-x-(--spacing-gutter) md:grid-cols-2">
            {audiences.map((audience, i) => (
              <Reveal
                key={audience.title}
                as="li"
                kind="up"
                delay={(i % 2) * 0.06}
                className="border-t border-line py-6 lg:py-7"
              >
                <h3 className="font-display text-display-xs text-text">{audience.title}</h3>
                <p className="mt-2 u-measure font-sans text-body text-text-muted leading-relaxed">
                  {audience.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 05. LOCATION */}
      <section
        id="location"
        aria-labelledby="location-title"
        className="scroll-mt-24 py-(--spacing-section-lg)"
      >
        <div className="u-container">
          <div className="u-grid gap-y-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Reveal kind="up">
                <SectionTitle eyebrow="Location" title="Find us in Bengaluru." id="location-title" />
              </Reveal>

              <Reveal kind="up" delay={0.08}>
                <dl className="mt-10 border-t border-line">
                  <div className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8">
                    <dt className="font-sans text-meta uppercase text-text-muted sm:w-32 sm:shrink-0 sm:pt-1">
                      Address
                    </dt>
                    <dd>
                      {hasAddress ? (
                        <address className="not-italic font-sans text-body text-text">
                          {addressLines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </address>
                      ) : (
                        <>
                          <span className="block font-sans text-body text-text">
                            {location.city}
                          </span>
                          <span className="mt-1 block font-sans text-small text-text-muted">
                            The exact address will be published here once the
                            centre is ready for visitors.
                          </span>
                        </>
                      )}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8">
                    <dt className="font-sans text-meta uppercase text-text-muted sm:w-32 sm:shrink-0 sm:pt-1">
                      Visiting
                    </dt>
                    <dd className="font-sans text-body text-text">
                      {visiting.appointmentOnly ? (
                        <span className="block">By appointment only</span>
                      ) : null}
                      {visiting.hours.map((row) => (
                        <span key={row.days} className="block">
                          {row.days}
                          <span className="text-text-muted"> · {row.hours}</span>
                        </span>
                      ))}
                      {visiting.appointmentOnly === null && visiting.hours.length === 0 ? (
                        <span className="block text-text-muted">
                          Visits are arranged on request. Hours will be listed
                          here once confirmed.
                        </span>
                      ) : null}
                    </dd>
                  </div>

                  {location.access.length ? (
                    <div className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8">
                      <dt className="font-sans text-meta uppercase text-text-muted sm:w-32 sm:shrink-0 sm:pt-1">
                        Getting there
                      </dt>
                      <dd className="font-sans text-body text-text">
                        {location.access.map((note) => (
                          <span key={note} className="block">
                            {note}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}

                  {tel ? (
                    <div className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8">
                      <dt className="font-sans text-meta uppercase text-text-muted sm:w-32 sm:shrink-0 sm:pt-1">
                        Call
                      </dt>
                      <dd className="font-sans text-body text-text">
                        <a
                          href={tel}
                          className="border-b border-line-strong transition-colors hover:border-accent hover:text-accent-text"
                        >
                          {phone}
                        </a>
                        {visiting.contactName ? (
                          <span className="text-text-muted"> · {visiting.contactName}</span>
                        ) : null}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                  {location.mapsUrl ? (
                    <Button href={location.mapsUrl} className="w-full sm:w-auto">
                      Get directions
                    </Button>
                  ) : null}
                  <ArrowLink href="#book-a-visit">Request a visit</ArrowLink>
                </div>
              </Reveal>
            </div>

            {mapEmbed ? (
              <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
                <Reveal kind="media">
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-surface-alt sm:aspect-landscape lg:aspect-editorial">
                    <iframe
                      src={mapEmbed}
                      title={`Map showing the ${site.name} Experience Centre in ${location.city}`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 06. BOOK A VISIT — light tone, as on /enquire: forms read better dark-on-cream. */}
      <Section
        tone="light"
        space="lg"
        id="book-a-visit"
        aria-labelledby="book-title"
        className="scroll-mt-24"
      >
        <div className="u-container">
          <div className="u-grid gap-y-14">
            <div className="col-span-4 md:col-span-6 lg:col-span-4">
              <Reveal kind="up">
                <SectionTitle eyebrow="Book a visit" title="Come and experience it." id="book-title" />
                <p className="mt-6 u-measure font-sans text-body text-text-muted leading-relaxed">
                  Tell us a little about yourself and when you&apos;d like to
                  visit. We&apos;ll get in touch to confirm a suitable time.
                </p>
                {isCentreOpen ? null : (
                  <p className="mt-4 u-measure font-sans text-small text-text-muted">
                    The centre is still being prepared, so the first visits will
                    be arranged once it is ready. Your request will be with us
                    when they are.
                  </p>
                )}
                {tel ? (
                  <div className="mt-8 border-t border-line pt-5">
                    <Metadata className="text-accent-text">Or call</Metadata>
                    <a
                      href={tel}
                      className="mt-3 block font-sans text-body text-text-muted transition-colors hover:text-text"
                    >
                      {phone}
                    </a>
                  </div>
                ) : null}
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6">
              <VisitRequestForm phone={phone} confirmation={visiting.confirmation} />
            </div>
          </div>
        </div>
      </Section>

      {/* 07. FINAL CTA */}
      <Section surface="alt" space="lg" tone="dark" aria-labelledby="cta-title">
        <div className="u-container">
          <div className="u-grid items-end gap-y-10">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <Reveal kind="up">
                <Metadata className="text-accent-text">Start a project</Metadata>
                <h2 id="cta-title" className="mt-4 font-display text-display-lg u-optical-left leading-tight">
                  Have a project in mind?
                </h2>
              </Reveal>
            </div>
            <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9">
              <Reveal kind="up" delay={0.08}>
                <p className="u-measure font-sans text-body text-text-muted leading-relaxed">
                  If you&apos;re exploring a yurt for your property, we&apos;d be
                  happy to understand the idea and talk through the
                  possibilities.
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
