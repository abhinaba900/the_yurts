import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/page/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { EmptyState } from "@/components/page/EmptyState";
import { Metadata } from "@/components/primitives/Metadata";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Contact Us and Book a Consultation",
  description:
    "Talk to Theyurts about your site or project — book a consultation, or get in touch directly by email, phone or WhatsApp.",
  path: "/contact",
});

/**
 * Contact and consultation booking.
 *
 * Every contact detail is conditional on the client having supplied it. Nothing
 * here invents an address, a phone number or an office — and the map only
 * appears once there is a real location to point at.
 */
export default async function ContactPage() {
  const settings = await getSettings();
  const { contact } = settings;

  const hasAnyDetail = Boolean(
    contact.email || contact.phone || contact.whatsapp || contact.city,
  );
  const addressLines = [contact.address, contact.city, contact.state, contact.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a consultation."
        lead="A conversation about your site specifically — where structures could sit, what the ground and access allow, and what a realistic first phase looks like."
        trail={[{ label: "Contact", href: "/contact" }]}
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              If yurts are the wrong answer for your site, you will hear that in
              the consultation rather than after a deposit.
            </p>
          </div>
        }
      />

      <section className="u-container pb-(--spacing-section-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7">
            <EnquiryForm kind="consultation" sourcePath="/contact" />
          </div>

          <aside className="col-span-4 mt-16 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            {hasAnyDetail ? (
              <div className="border-t border-line pt-5">
                <Metadata className="text-accent-text">Directly</Metadata>
                <div className="mt-5 space-y-3">
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="block font-sans text-lead transition-colors hover:text-accent-text"
                    >
                      {contact.email}
                    </a>
                  ) : null}
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="block font-sans text-lead transition-colors hover:text-accent-text"
                    >
                      {contact.phone}
                    </a>
                  ) : null}
                  <WhatsAppLink
                    number={contact.whatsapp}
                    message="Hello — I am enquiring about a yurt."
                  />
                </div>

                {addressLines ? (
                  <div className="mt-8 border-t border-line pt-5">
                    <Metadata className="text-accent-text">Workshop</Metadata>
                    <p className="mt-3 u-measure-tight font-sans text-body text-text-muted">
                      {addressLines}
                    </p>
                    {contact.mapsUrl ? (
                      <div className="mt-4">
                        <a
                          href={contact.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-2.5 font-sans text-meta uppercase text-text"
                        >
                          Open in Google Maps
                          <span
                            aria-hidden
                            className="transition-transform duration-(--duration-base) group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          >
                            ↗
                          </span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                label="Contact details"
                title="Being confirmed."
                body="A phone number, an email address and the workshop location will be published here once they are settled. Until then the form is the way through, and it reaches us."
              />
            )}

            <div className="mt-12 border-t border-line pt-5">
              <Metadata className="text-accent-text">Bring if you have it</Metadata>
              <ul className="mt-5">
                {[
                  "Where the site is, and how a vehicle reaches it",
                  "Photographs of the plot, however rough",
                  "What you want to run there",
                  "Any planning position you already know",
                ].map((item) => (
                  <li
                    key={item}
                    className="border-t border-line py-3 font-sans text-small text-text-muted first:border-t-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Not ready to talk</Metadata>
              <p className="mt-5 font-display text-display-md">
                Have a look around first.
              </p>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <p className="u-measure font-sans text-body text-text-muted">
                Build one in the configurator, step inside in 360°, or read
                through the questions other people ask before they commission a
                structure.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
                <ArrowLink href="/experiences/builder">3D builder</ArrowLink>
                <ArrowLink href="/experiences/vr">VR experience</ArrowLink>
                <ArrowLink href="/faq">Questions</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
