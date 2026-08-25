import { cn } from "@/lib/cn";
import { hasTopBar } from "@/lib/site";

/**
 * Utility bar above the primary navigation.
 *
 * Carries the two things a prospective client looks for first — a phone number
 * and an email address — on a solid strip so it stays legible over a cinematic
 * hero, while the navigation row below it remains transparent.
 *
 * Renders nothing at all when neither contact detail is known. See lib/site.ts:
 * a missing number is recoverable, an invented one on a live site is not.
 * Because of that, the bar's height is not a given, and the layout offset in
 * SiteChrome is driven by `hasTopBar` from the same settings object.
 *
 * Shown only at the top of the page. The moment the visitor scrolls it
 * collapses to nothing, leaving the navigation row alone in the fixed header —
 * so the contact details are there when someone arrives looking for them, and
 * out of the way once they are reading. The navigation row does not hide; it
 * only shrinks from h-20/h-24 to h-16, which it already did.
 *
 * The layout offset in SiteChrome deliberately does NOT change with this: it
 * reserves the header's full unscrolled height once, so collapsing the bar
 * cannot shift the page under the reader.
 */
export type TopBarContact = {
  email: string | null;
  phone: string | null;
};

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="size-3.5 shrink-0 opacity-80"
    >
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
      <path strokeLinecap="round" d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="size-3.5 shrink-0 opacity-80"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.75 5.5c0-1 .8-1.75 1.75-1.75h2.1c.8 0 1.5.53 1.7 1.3l.7 2.7c.17.67-.06 1.37-.6 1.8l-1.2.95a12.5 12.5 0 006.3 6.3l.95-1.2c.43-.54 1.13-.77 1.8-.6l2.7.7c.77.2 1.3.9 1.3 1.7v2.1c0 .95-.75 1.75-1.75 1.75C9.9 21.25 2.75 14.1 2.75 5.5z"
      />
    </svg>
  );
}

export function TopBar({
  contact,
  scrolled,
}: {
  contact?: TopBarContact;
  scrolled: boolean;
}) {
  if (!contact || !hasTopBar(contact)) return null;

  return (
    <div
      // Its own deep surface so the bar reads over a full-bleed hero while the
      // navigation row beneath it stays transparent.
      className={cn(
        "overflow-hidden bg-surface-deep",
        "transition-[height,opacity] duration-(--duration-base) ease-(--ease-out-soft)",
        scrolled ? "h-0 opacity-0" : "h-9 opacity-100",
      )}
      // Collapsed it is not just invisible but unreachable — a zero-height strip
      // of live links is a keyboard trap waiting to happen.
      inert={scrolled ? true : undefined}
      aria-hidden={scrolled ? "true" : undefined}
    >
      <div className="u-container">
        <div className="flex h-9 items-center justify-between gap-6">
          <p className="hidden font-sans text-meta uppercase text-text-muted sm:block">
            Designed &amp; made in India
          </p>

          <div className="flex flex-1 items-center justify-end gap-5 sm:flex-none sm:gap-7">
            {contact?.email ? (
              <a
                href={`mailto:${contact.email}`}
                className={cn(
                  "group inline-flex items-center gap-2 font-sans text-meta",
                  "normal-case tracking-normal text-text-muted",
                  "transition-colors duration-(--duration-quick) hover:text-accent-text",
                )}
              >
                <MailIcon />
                <span className="truncate">{contact.email}</span>
              </a>
            ) : null}

            {contact?.phone ? (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className={cn(
                  "group inline-flex items-center gap-2 font-sans text-meta",
                  "normal-case tracking-normal text-text-muted",
                  "transition-colors duration-(--duration-quick) hover:text-accent-text",
                )}
              >
                <PhoneIcon />
                <span className="whitespace-nowrap">{contact.phone}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
