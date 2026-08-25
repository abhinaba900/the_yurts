import Link from "next/link";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { journalTopics } from "@/data/home";

/**
 * Journal.
 *
 * No articles have been published, so there are no article cards — an empty
 * three-up grid of placeholder headlines would be worse than nothing. The band
 * shows what the Journal will cover and gets out of the way. Phase 5 replaces
 * this with real entries once there are some.
 */
export function JournalBand() {
  return (
    <section className="u-container py-(--spacing-section) lg:min-h-[50vh] lg:flex lg:flex-col lg:justify-center">
      <div className="u-grid items-start gap-y-10 border-t border-line pt-10">
        <div className="col-span-4 md:col-span-6 lg:col-span-4">
          <Reveal kind="up">
            <Metadata>Journal</Metadata>
            <h2 className="mt-5 font-display text-display-md">
              Notes, as we go.
            </h2>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6">
          <Reveal kind="up" delay={0.08}>
            <p className="u-measure font-sans text-body text-text-muted">
              Writing on building with yurts, and on the businesses people build
              around them. The first entries are being written now.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {journalTopics.map((topic) => (
                <li key={topic}>
                  <Link
                    href="/journal"
                    className="u-tap font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-quick) hover:text-accent-text"
                  >
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <ArrowLink href="/journal">The Journal</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
