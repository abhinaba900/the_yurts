import type { Metadata as NextMetadata } from "next";
import { notFound } from "next/navigation";

import { getPost, getPostSlugs } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { pageMetadata } from "@/lib/seo";
import { isoDate, readingTimeFrom } from "@/lib/format";
import { site } from "@/lib/site";

import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CmsImage } from "@/components/page/CmsImage";
import { Prose } from "@/components/page/Prose";
import { ShareLinks } from "@/components/page/ShareLinks";
import { PostMeta } from "@/components/journal/PostMeta";
import { PostRow } from "@/components/journal/PostRow";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Article.
 *
 * Body copy is held to a single column at reading measure with the metadata in
 * the margin — the layout of a page in a magazine, not a blog post inside a
 * sidebar. Images inside the body can break out to wide or full bleed, which is
 * the only place the measure is allowed to change.
 */

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found", robots: { index: false } };

  return pageMetadata({
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt ?? post.title,
    path: `/journal/${post.slug}`,
    type: "article",
    image:
      imageUrl(post.seo?.shareImage ?? post.heroImage, { width: 1200, height: 630 }) ??
      undefined,
    noIndex: post.seo?.noIndex ?? false,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Editors can override; otherwise it is estimated from the body.
  const readingTime = post.readingTime ?? readingTimeFrom(post.body);
  const image = imageUrl(post.heroImage, { width: 1200 });

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          ...(post.excerpt ? { description: post.excerpt } : {}),
          ...(image ? { image: [image] } : {}),
          datePublished: isoDate(post.publishedAt),
          ...(post.author?.name
            ? { author: { "@type": "Person", name: post.author.name } }
            : {}),
          publisher: {
            "@type": "Organization",
            name: site.name,
            "@id": `${site.url}#organization`,
          },
          mainEntityOfPage: new URL(`/journal/${post.slug}`, site.url).toString(),
          inLanguage: "en-IN",
        }}
      />

      <div className="u-container pt-8 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Journal", href: "/journal" },
            { label: post.title, href: `/journal/${post.slug}` },
          ]}
        />
      </div>

      <header className="u-container py-(--spacing-block)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-8">
            <Reveal kind="up">
              <h1 className="font-display text-display-lg u-optical-left">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="mt-8 u-measure font-sans text-lead text-text-muted">
                  {post.excerpt}
                </p>
              ) : null}
              <div className="mt-9">
                <PostMeta post={{ ...post, readingTime }} />
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {post.heroImage ? (
        <div className="u-container">
          <Reveal kind="media">
            <CmsImage
              image={post.heroImage}
              ratio="cinema"
              sizes="100vw"
              width={2400}
              priority
              pendingLabel={`${post.slug}.jpg`}
            />
            {post.heroImage.caption ? (
              <p className="mt-3 font-sans text-meta uppercase text-text-muted">
                {post.heroImage.caption}
              </p>
            ) : null}
          </Reveal>
        </div>
      ) : null}

      <article className="u-container py-(--spacing-block-lg)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
            <Prose value={post.body} />

            <div className="mt-16 border-t border-line pt-6">
              <ShareLinks path={`/journal/${post.slug}`} title={post.title} />
            </div>

            {post.author?.name && post.author.bio ? (
              <div className="mt-14 border-t border-line pt-8">
                <div className="flex items-start gap-6">
                  {post.author.image ? (
                    <div className="w-20 shrink-0">
                      <CmsImage
                        image={post.author.image}
                        ratio="square"
                        sizes="80px"
                        width={200}
                      />
                    </div>
                  ) : null}
                  <div>
                    <Metadata className="text-accent-text">Written by</Metadata>
                    <p className="mt-2 font-display text-display-sm">
                      {post.author.name}
                    </p>
                    {post.author.role ? (
                      <p className="mt-1 font-sans text-meta uppercase text-text-muted">
                        {post.author.role}
                      </p>
                    ) : null}
                    <p className="mt-3 u-measure font-sans text-small text-text-muted">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {post.related?.length ? (
        <section className="u-container pb-(--spacing-section)">
          <Metadata className="text-accent-text">Read next</Metadata>
          <ul className="mt-6">
            {post.related.map((related, i) => (
              <PostRow key={related._id} post={related} index={i + 1} />
            ))}
          </ul>
        </section>
      ) : null}

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <p className="font-display text-display-lg u-optical-left">
                Working something out?
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Tell us about the site and you will get an answer specific to it.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/journal">All writing</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
