import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/** Shared by the root 404 and any `notFound()` thrown inside the site group. */
export function NotFoundContent() {
  return (
    <article className="u-container py-(--spacing-section-lg)">
      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <Metadata>Error 404</Metadata>
          <h1 className="mt-6 font-display text-display-lg u-optical-left">
            Nothing here.
          </h1>
          <p className="mt-8 u-measure font-sans text-lead text-text-muted">
            The page has moved or never existed. Try the range, or tell us what
            you were looking for.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4">
            <ArrowLink href="/yurts">See the range</ArrowLink>
            <ArrowLink href="/">Back to the start</ArrowLink>
          </div>
        </div>
      </div>
    </article>
  );
}
