import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { enquiryKinds, type EnquiryKind } from "@/lib/enquiry";
import { PageHeader } from "@/components/page/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Enquire",
  description:
    "Tell us about the site — where it is, what you want to put on it and roughly when. Quotes, product questions and consultations all start here.",
  path: "/enquire",
});

/**
 * The enquiry page.
 *
 * Everything that carries context into an enquiry arrives as a query parameter:
 * `?config=` from the 3D builder, `?product=` from a yurt page, `?resource=`
 * from a gated download. They are read here on the server and passed into the
 * form as values, so the context survives a submission made without JavaScript.
 */
export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const settings = await getSettings();

  const first = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value) ?? "";

  const configuration = first(params.config);
  const product = first(params.product);
  const resource = first(params.resource);

  const requested = first(params.kind) as EnquiryKind;
  const kind: EnquiryKind = enquiryKinds.includes(requested)
    ? requested
    : configuration
      ? "configuration"
      : resource
        ? "brochure"
        : product
          ? "product"
          : "general";

  const title =
    kind === "configuration"
      ? "Send us your configuration."
      : kind === "brochure"
        ? "Where should we send it?"
        : kind === "quote"
          ? "Tell us about the site."
          : "Start a conversation.";

  const { contact } = settings;
  const hasDirect = Boolean(contact.email || contact.phone || contact.whatsapp);

  return (
    <>
      <PageHeader
        eyebrow="Enquire"
        title={title}
        lead="Where the land is, what has to happen on it, and roughly when. That is enough for a useful first reply — nothing has to be decided yet."
        aside={
          hasDirect ? (
            <div className="border-t border-line pt-5">
              <Metadata className="text-accent-text">Or directly</Metadata>
              <div className="mt-4 space-y-2.5">
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="block font-sans text-body text-text-muted transition-colors hover:text-text"
                  >
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="block font-sans text-body text-text-muted transition-colors hover:text-text"
                  >
                    {contact.phone}
                  </a>
                ) : null}
                <WhatsAppLink number={contact.whatsapp} />
              </div>
            </div>
          ) : undefined
        }
      />

      <section className="u-container pb-(--spacing-section-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7">
            <EnquiryForm
              kind={kind}
              product={product}
              configuration={configuration}
              resource={resource}
              sourcePath="/enquire"
            />
          </div>

          <aside className="col-span-4 mt-16 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <div className="border-t border-line pt-5">
              <Metadata className="text-accent-text">What happens next</Metadata>
              <ol className="mt-5">
                {[
                  "We read it — a person, not an autoresponder.",
                  "We reply with questions about the site, or with an answer if it is a straight question.",
                  "If it looks like a fit, we talk properly about what you would actually build.",
                ].map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-4 border-t border-line py-4 first:border-t-0"
                  >
                    <span className="font-sans text-meta uppercase text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-small text-text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 border-t border-line pt-5">
              <Metadata className="text-accent-text">Before you write</Metadata>
              <p className="mt-4 u-measure font-sans text-small text-text-muted">
                It may be worth building one first — it makes the first
                conversation much more specific.
              </p>
              <div className="mt-5 flex flex-col items-start gap-3">
                <ArrowLink href="/experiences/builder">Open the 3D builder</ArrowLink>
                <ArrowLink href="/faq">Common questions</ArrowLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
