import Link from "next/link";
import { footerNav } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";

/**
 * Footer. An editorial closing passage — a line, an invitation, then the index.
 * Not a link dump under a rule.
 */
export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSettings();
  const { contact } = settings;
  const hasContact = Boolean(
    contact.email || contact.phone || contact.city || contact.whatsapp,
  );

  return (
    <footer className="bg-surface text-text">
      {/* --- Closing line --- */}
      <div className="u-container pt-(--spacing-section) pb-16">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-8">
            <h2 className="font-display text-display-lg u-optical-left">
              Tell us about the land.
            </h2>
            <p className="mt-6 u-measure font-sans text-lead text-text-muted">
              Where it is, what you want to put on it, and roughly when. That is
              enough to start a conversation.
            </p>
          </div>
          <div className="col-span-4 mt-10 flex md:col-span-6 lg:col-span-3 lg:col-start-10 lg:mt-2 lg:justify-end">
            <div className="flex flex-col items-start gap-5">
              <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
              <ArrowLink href="/contact">Book a consultation</ArrowLink>
            </div>
          </div>
        </div>
      </div>

      {/* --- Index --- */}
      <div className="u-container py-14">
        <div className="u-grid gap-y-12 border-t border-line pt-10">
          {footerNav.map((group) => (
            <div key={group.title} className="col-span-2 md:col-span-3 lg:col-span-2">
              <Metadata as="h3" className="text-accent-text">
                {group.title}
              </Metadata>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="u-tap font-sans text-small text-text-muted transition-colors duration-(--duration-quick) hover:text-text"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact renders only when the client has supplied details. */}
          {hasContact ? (
            <div className="col-span-4 md:col-span-6 lg:col-span-3 lg:col-start-10">
              <Metadata as="h3" className="text-accent-text">
                Contact
              </Metadata>
              <div className="mt-5 space-y-2.5">
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="block font-sans text-small text-text-muted transition-colors duration-(--duration-quick) hover:text-text"
                  >
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="block font-sans text-small text-text-muted transition-colors duration-(--duration-quick) hover:text-text"
                  >
                    {contact.phone}
                  </a>
                ) : null}
                {contact.city ? (
                  <p className="font-sans text-small text-text-muted">
                    {[contact.city, contact.state].filter(Boolean).join(", ")}
                  </p>
                ) : null}
                <WhatsAppLink
                  number={contact.whatsapp}
                  message="Hello — I am enquiring about a yurt."
                  className="text-text-muted hover:text-text"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* --- Wordmark. Type as a graphic, nothing else in the band. --- */}
      <div className="u-container pb-10" aria-hidden>
        <span className="block font-display leading-[0.8] tracking-[-0.03em] text-[clamp(3.5rem,15vw,13rem)] text-text-muted opacity-25">
          Theyurts
        </span>
      </div>

      {/* --- Legal --- */}
      <div className="u-container pb-10">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-6">
          <Metadata>
            &copy; {year} {settings.name}
          </Metadata>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/privacy" className="u-tap font-sans text-meta uppercase text-text-muted">
              Privacy
            </Link>
            <Link href="/terms" className="u-tap font-sans text-meta uppercase text-text-muted">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
