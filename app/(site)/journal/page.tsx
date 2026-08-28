import { pageMetadata } from "@/lib/seo";
import { getPosts } from "@/sanity/lib/content";
import { PageHeader } from "@/components/page/PageHeader";
import { PostRow } from "@/components/journal/PostRow";
import { JournalIndex } from "@/components/journal/JournalIndex";
import { EmptyState } from "@/components/page/EmptyState";
import { JournalAdvisory } from "@/components/journal/JournalAdvisory";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "The Yurt Journal: Guides and Ideas",
  description:
    "Guides and writing on yurts, glamping and hospitality in India — planning a site, permits, climate, materials, costs and building differently.",
  path: "/journal",
});

/**
 * The Journal index.
 *
 * Articles come from `getPosts`, which serves the CMS where it has posts and
 * the launch articles in `data/journal.ts` where it does not — so this page has
 * real writing on it from the first deploy.
 */
export default async function JournalPage() {
  const posts = await getPosts({ end: 24 });

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="The Yurt Journal"
        lead="Ideas, guides and stories about yurts, glamping, hospitality, architecture, wellness and building differently."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              Written for landowners, hospitality operators and anyone weighing
              up what to build on a piece of land.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Tell us about your site</ArrowLink>
            </div>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section-lg)">
        {posts.length > 0 ? (
          <>
            {featured ? (
              <ul className="mb-14">
                <PostRow post={featured} feature />
              </ul>
            ) : null}
            {rest.length > 0 ? <JournalIndex posts={rest} /> : null}
          </>
        ) : (
          <EmptyState
            label="Journal"
            title="The first articles are being written."
            body="This is where our guides and notes on yurts, glamping, hospitality and building differently will live."
            action={{ href: "/enquire", label: "Ask us directly" }}
          />
        )}
      </div>

      {/* Interactive Direct Site Advisory & Land Consultation */}
      <JournalAdvisory />
    </>
  );
}
