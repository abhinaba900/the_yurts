import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Breadcrumbs, type Crumb } from "@/components/site/Breadcrumbs";

/**
 * Route placeholder.
 *
 * Every navigation destination exists from Phase 1 so nothing in the site can
 * 404, and so each page has a real URL, title and description working for SEO
 * from the start. Replaced page by page as the later phases land.
 *
 * It says plainly that the page is being built. It does not pretend to be
 * content, and it does not describe anything the company has not confirmed.
 */
export function PageStub({
  title,
  intro,
  phase,
  covers,
  trail,
}: {
  title: string;
  intro: string;
  /** Which build phase delivers this page. Honest, and useful to the client. */
  phase: string;
  /** What this page will hold. Structure only — no claims. */
  covers?: string[];
  trail?: Crumb[];
}) {
  return (
    <article className="u-container py-(--spacing-section)">
      {trail ? (
        <div className="mb-14">
          <Breadcrumbs trail={trail} />
        </div>
      ) : null}

      <div className="u-grid">
        <header className="col-span-4 md:col-span-6 lg:col-span-7">
          <Metadata>In development &middot; {phase}</Metadata>
          <h1 className="mt-6 font-display text-display-lg u-optical-left">
            {title}
          </h1>
          <p className="mt-8 u-measure font-sans text-lead text-text-muted">
            {intro}
          </p>
          <div className="mt-10 flex flex-col items-start gap-4">
            <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
          </div>
        </header>

        {covers?.length ? (
          <div className="col-span-4 mt-16 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
            <Metadata className="text-accent-text">This page will hold</Metadata>
            <ul className="mt-5">
              {covers.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-5 border-t border-line py-3"
                >
                  <span className="font-sans text-meta uppercase text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-small">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
