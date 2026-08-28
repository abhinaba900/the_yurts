import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/site/Breadcrumbs";

/**
 * The standard page opening: eyebrow, title, lead, and an optional aside held
 * out to the right.
 *
 * Every page below the home page starts this way so that the site has one
 * recognisable entry rhythm — the variation belongs further down the page, not
 * in six different interpretations of a masthead.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
  trail,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: React.ReactNode;
  trail?: Crumb[];
}) {
  return (
    <header className="u-container pt-6 pb-10 sm:pt-8 sm:pb-14 md:pt-14 md:pb-20">
      {trail ? (
        <div className="mb-8 sm:mb-12">
          <Breadcrumbs trail={trail} />
        </div>
      ) : null}

      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <Reveal kind="up">
            {eyebrow ? <Metadata>{eyebrow}</Metadata> : null}
            <h1 className="mt-3 sm:mt-5 font-display text-3xl sm:text-display-md md:text-display-lg u-optical-left leading-tight">
              {title}
            </h1>
            {lead ? (
              <p className="mt-4 sm:mt-8 u-measure font-sans text-body sm:text-lead text-text-muted leading-relaxed">
                {lead}
              </p>
            ) : null}
          </Reveal>
        </div>

        {aside ? (
          <div className="col-span-4 mt-8 sm:mt-12 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
            <Reveal kind="up" delay={0.1}>
              {aside}
            </Reveal>
          </div>
        ) : null}
      </div>
    </header>
  );
}
