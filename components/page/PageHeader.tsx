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
    <header className="u-container pt-[clamp(1.5rem,min(4vw,5svh),3.5rem)] pb-[clamp(2.5rem,min(6vw,8svh),5rem)]">
      {trail ? (
        <div className="mb-[clamp(1.5rem,min(4vw,5svh),3rem)]">
          <Breadcrumbs trail={trail} />
        </div>
      ) : null}

      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <Reveal kind="up">
            {eyebrow ? (
              <Metadata className="inline-flex items-center gap-3 text-accent-text">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {eyebrow}
              </Metadata>
            ) : null}
            <h1 className="mt-4 font-display text-display-lg u-optical-left">
              {title}
            </h1>
            {lead ? (
              <p className="mt-5 sm:mt-6 u-measure font-sans text-lead text-text-muted">
                {lead}
              </p>
            ) : null}
          </Reveal>
        </div>

        {aside ? (
          <div className="col-span-4 mt-8 sm:mt-10 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-10">
            <Reveal kind="up" delay={0.1}>
              {aside}
            </Reveal>
          </div>
        ) : null}
      </div>
    </header>
  );
}
