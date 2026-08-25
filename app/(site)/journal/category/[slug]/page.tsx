import type { Metadata as NextMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPostCategories,
  getPostCategory,
  getPostCategorySlugs,
  getPostsByCategory,
} from "@/sanity/lib/content";
import { pageMetadata } from "@/lib/seo";

import { PageHeader } from "@/components/page/PageHeader";
import { PostRow } from "@/components/journal/PostRow";
import { EmptyState } from "@/components/page/EmptyState";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * Journal category.
 *
 * Its own indexable URL rather than a client-side filter — these are the pages
 * that rank for "yurts", "glamping", "farm stays" and the rest, and a filtered
 * view behind a query string cannot.
 *
 * `/journal/category` with no slug falls through to the article route and 404s,
 * which is correct: it is not a page.
 */

export async function generateStaticParams() {
  const slugs = await getPostCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const category = await getPostCategory(slug);
  if (!category) return { title: "Not found", robots: { index: false } };

  return pageMetadata({
    title: category.title,
    description:
      category.description ??
      `Writing on ${category.title.toLowerCase()} from the Theyurts Journal.`,
    path: `/journal/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, posts, allCategories] = await Promise.all([
    getPostCategory(slug),
    getPostsByCategory(slug),
    getPostCategories(),
  ]);

  if (!category) notFound();

  const others = allCategories.filter(
    (item) => item.slug !== slug && item.count > 0,
  );

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={category.title}
        lead={category.description ?? undefined}
        trail={[
          { label: "Journal", href: "/journal" },
          { label: category.title, href: `/journal/category/${category.slug}` },
        ]}
      />

      <div className="u-container pb-(--spacing-section-lg)">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post, i) => (
              <PostRow key={post._id} post={post} index={i + 1} />
            ))}
          </ul>
        ) : (
          <EmptyState
            label="Nothing here yet"
            title={`No writing on ${category.title.toLowerCase()} so far.`}
            body="This category exists but has no published articles in it yet."
            action={{ href: "/journal", label: "All writing" }}
          />
        )}

        {others.length > 0 ? (
          <nav aria-label="Other categories" className="mt-16">
            <Metadata className="text-accent-text">Elsewhere in the Journal</Metadata>
            <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6">
              {others.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/journal/category/${item.slug}`}
                    className="u-tap font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-quick) hover:text-accent-text"
                  >
                    {item.title}
                    <span className="ml-2 opacity-60">{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  );
}
