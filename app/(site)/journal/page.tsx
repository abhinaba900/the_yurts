import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getPosts, getPostCategories } from "@/sanity/lib/content";
import { PageHeader } from "@/components/page/PageHeader";
import { PostRow } from "@/components/journal/PostRow";
import { JournalResearchHub } from "@/components/journal/JournalResearchHub";
import { JournalAdvisory } from "@/components/journal/JournalAdvisory";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Journal & Architectural Research",
  description:
    "Architectural intelligence, land feasibility, hospitality economics, and thermal engineering for yurts and glamping developments across India.",
  path: "/journal",
});

/**
 * Journal & Architectural Research Hub.
 *
 * Provides actionable architectural, economic, and land planning
 * intelligence for landowners, retreat founders, and resort developers.
 */
export default async function JournalPage() {
  const [posts, categories] = await Promise.all([
    getPosts({ end: 24 }),
    getPostCategories(),
  ]);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="Journal & Research"
        title="Notes, models, and working papers."
        lead="Actionable intelligence on building with circular timber yurts, resort unit economics, land permissions, and extreme climate engineering across India."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Written for landowners, resort developers, and retreat founders
              evaluating what works on their terrain before commissioning.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Discuss your land with our workshop</ArrowLink>
            </div>
          </div>
        }
      />

      {categories.length > 0 ? (
        <nav aria-label="Journal categories" className="u-container pb-10">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6">
            {categories
              .filter((category) => category.count > 0)
              .map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/journal/category/${category.slug}`}
                    className="u-tap font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-quick) hover:text-accent-text"
                  >
                    {category.title}
                    <span className="ml-2 opacity-60">{category.count}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      ) : null}

      <div className="u-container pb-(--spacing-section-lg)">
        {posts.length > 0 ? (
          <ul className="space-y-14">
            {featured ? <PostRow post={featured} feature /> : null}
            {rest.length > 0 ? (
              <li>
                <ul>
                  {rest.map((post, i) => (
                    <PostRow key={post._id} post={post} index={i + 2} />
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        ) : (
          <JournalResearchHub />
        )}
      </div>

      {/* Interactive Direct Site Advisory & Land Consultation */}
      <JournalAdvisory />
    </>
  );
}
