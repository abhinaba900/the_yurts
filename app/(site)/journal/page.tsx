import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getPosts, getPostCategories } from "@/sanity/lib/content";
import { journalTopics } from "@/data/home";
import { PageHeader } from "@/components/page/PageHeader";
import { PostRow } from "@/components/journal/PostRow";
import { EmptyState } from "@/components/page/EmptyState";
import { Metadata } from "@/components/primitives/Metadata";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Journal",
  description:
    "Writing on yurts, glamping, hospitality, wellness, farm stays, eco tourism, architecture and sustainable building in India.",
  path: "/journal",
});

/**
 * Journal index.
 *
 * Not a grid: the most recent article takes a full-width landscape crop and
 * display-large type, and everything after it is a hairline row. The difference
 * in weight between the first entry and the rest is what makes this read as an
 * edited publication rather than a feed.
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
        eyebrow="Journal"
        title="Notes, as we go."
        lead="Writing on building with yurts, and on the businesses people build around them. Meant to be useful to someone deciding whether this works on their land."
      />

      {categories.length > 0 ? (
        <nav aria-label="Journal categories" className="u-container pb-12">
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
          <>
            <EmptyState
              label="Nothing published yet"
              title="The first pieces are being written."
              body="We would rather open with something worth reading than fill a page with posts written to have posts. The first entries are in progress."
              action={{ href: "/enquire", label: "Ask us something instead" }}
            />

            <div className="mt-16">
              <Metadata className="text-accent-text">What it will cover</Metadata>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
                {journalTopics.map((topic) => (
                  <li
                    key={topic}
                    className="font-display text-display-sm text-text-muted"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Ask directly</Metadata>
              <p className="mt-5 font-display text-display-md">
                A question beats an article.
              </p>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <p className="u-measure font-sans text-body text-text-muted">
                If you are working something out about your own site, ask us. The
                answer will be more specific than anything we could publish, and
                it usually becomes the next piece here.
              </p>
              <div className="mt-8">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
