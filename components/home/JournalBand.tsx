import Link from "next/link";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { journalTopics, featuredArticles } from "@/data/home";

/**
 * 14. JOURNAL
 *
 * Heading: The Yurt Journal
 * Lead: Ideas, guides and stories about yurts, glamping, hospitality, architecture, wellness and building differently.
 * Categories & Featured article examples.
 * CTA: Explore the Journal →
 */
export function JournalBand() {
  return (
    <section className="u-container py-16 lg:py-20 lg:min-h-[50vh] lg:flex lg:flex-col lg:justify-center">
      <div className="border-t border-line pt-10">
        <div className="u-grid items-start gap-y-10">
          {/* Left Column: Heading & Topic Tags */}
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <Reveal kind="up">
              <Metadata className="text-accent-text">Journal</Metadata>
              <h2 className="mt-3 font-display text-display-lg u-optical-left">
                The Yurt Journal
              </h2>
              <p className="mt-5 u-measure font-sans text-body text-text-muted leading-relaxed">
                Ideas, guides and stories about yurts, glamping, hospitality,
                architecture, wellness and building differently.
              </p>

              <div className="mt-8 border-t border-line/60 pt-5">
                <span className="font-sans text-meta uppercase text-text-muted text-xs">
                  Featured Categories:
                </span>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {journalTopics.map((topic) => (
                    <li key={topic}>
                      <Link
                        href="/journal"
                        className="u-tap font-sans text-[0.6875rem] uppercase text-text-muted hover:text-accent-text transition-colors duration-200"
                      >
                        {topic}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Featured Article Previews */}
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6">
            <Reveal kind="up" delay={0.08}>
              <span className="font-sans text-meta uppercase text-text-muted text-xs">
                Featured Articles:
              </span>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featuredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/journal/${article.slug}`}
                    className="group rounded-sm border border-line bg-surface-alt/40 p-5 shadow-xs transition-all duration-300 hover:border-accent hover:bg-surface-alt hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-text-muted font-sans text-meta uppercase text-[0.625rem]">
                        <span className="text-accent-text font-semibold">{article.tag}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="mt-3 font-display text-display-xs sm:text-base text-text leading-snug group-hover:text-accent-text transition-colors duration-300">
                        {article.title}
                      </h3>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-meta uppercase text-accent-text text-[0.6875rem] group-hover:underline">
                      <span>Read article</span>
                      <span>&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-line/70 pt-5 flex items-center justify-between">
                <ArrowLink href="/journal">Explore the Journal</ArrowLink>
                <span className="font-sans text-meta uppercase text-text-muted text-xs">
                  Guides, Notes & Stories
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
