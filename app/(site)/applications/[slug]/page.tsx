import type { Metadata as NextMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getApplication, getApplicationSlugs } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { applicationsFallback } from "@/data/applications";
import { pageMetadata } from "@/lib/seo";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CmsImage } from "@/components/page/CmsImage";
import { Prose } from "@/components/page/Prose";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Application detail.
 *
 * Resolves from the CMS first and falls back to the written set in
 * `data/applications.ts`, so all eleven use cases are real, indexable pages from
 * launch — and each one is quietly replaced the moment an editor writes the CMS
 * version, with no change here and no change to its URL.
 */

/** Trims to a whole word, so a meta description is never cut mid-syllable. */
function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[,.;:]$/, "")}…`;
}

export async function generateStaticParams() {
  const cmsSlugs = await getApplicationSlugs();
  const slugs = new Set([
    ...cmsSlugs,
    ...applicationsFallback.map((item) => item.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

async function resolve(slug: string) {
  const cms = await getApplication(slug);
  if (cms) return { source: "cms" as const, cms, fallback: null };

  const fallback = applicationsFallback.find((item) => item.slug === slug);
  if (fallback) return { source: "static" as const, cms: null, fallback };

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) return { title: "Not found", robots: { index: false } };

  // "Resorts" alone is a label; "Yurts for Resorts" is what someone searches.
  const name = found.cms?.title ?? found.fallback!.name;
  const title = /yurt/i.test(name) ? name : `Yurts for ${name}`;
  const description = truncate(
    found.cms?.seo?.metaDescription ??
      found.fallback?.metaDescription ??
      found.cms?.summary ??
      found.fallback?.body ??
      `Yurts for ${name.toLowerCase()} — how they are used, what the space suits and how it is specified. Designed and made in India.`,
    155,
  );

  return pageMetadata({
    title: found.cms?.seo?.metaTitle ?? title,
    description,
    path: `/applications/${slug}`,
    image:
      imageUrl(found.cms?.seo?.shareImage ?? found.cms?.heroImage, {
        width: 1200,
        height: 630,
      }) ?? undefined,
    noIndex: found.cms?.seo?.noIndex ?? false,
  });
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) notFound();

  const { cms, fallback } = found;
  const title = cms?.title ?? fallback!.name;
  const line = cms?.line ?? fallback?.line ?? null;
  const summary = cms?.summary ?? fallback?.body ?? null;

  const considerations =
    cms?.considerations?.map((item) => ({ title: item.title, body: item.body })) ??
    fallback?.considerations.map((item) => ({ title: item, body: null })) ??
    [];

  return (
    <>
      <div className="u-container pt-8 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Applications", href: "/applications" },
            { label: title, href: `/applications/${slug}` },
          ]}
        />
      </div>

      <header className="u-container py-(--spacing-block)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7">
            <Reveal kind="up">
              {line ? <Metadata>{line}</Metadata> : null}
              <h1 className="mt-5 font-display text-display-lg u-optical-left">
                {title}
              </h1>
              {summary ? (
                <p className="mt-8 u-measure font-sans text-lead text-text-muted">
                  {summary}
                </p>
              ) : null}
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
                <ArrowLink href="/enquire">Talk about your site</ArrowLink>
                <ArrowLink href="/yurts">See the range</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {cms?.heroImage || fallback?.media ? (
        <div className="u-container">
          <Reveal kind="media">
            {cms?.heroImage ? (
              <CmsImage
                image={cms.heroImage}
                ratio="cinema"
                sizes="100vw"
                width={2400}
                priority
                pendingLabel={`${slug}.jpg`}
              />
            ) : fallback?.media ? (
              <Media id={fallback.media} ratio="cinema" sizes="100vw" />
            ) : null}
          </Reveal>
        </div>
      ) : null}

      {cms?.body?.length ? (
        <section className="u-container py-(--spacing-block-lg)">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
              <Prose value={cms.body} />
            </div>
          </div>
        </section>
      ) : null}

      {considerations.length ? (
        <section className="u-container py-(--spacing-block-lg)">
          <div className="u-grid">
            <header className="col-span-4 md:col-span-6 lg:col-span-4">
              <Metadata className="text-accent-text">Before you commit</Metadata>
              <h2 className="mt-4 font-display text-display-md">
                What to work out.
              </h2>
              <p className="mt-6 u-measure-tight font-sans text-small text-text-muted">
                These are the questions worth answering before anyone quotes. We
                will ask most of them anyway.
              </p>
            </header>

            <ol className="col-span-4 mt-10 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
              {considerations.map((item, i) => (
                <Reveal
                  key={item.title}
                  kind="up"
                  delay={i * 0.04}
                  as="li"
                  className="flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                >
                  <span className="font-sans text-meta uppercase text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-sans text-lead">{item.title}</span>
                    {item.body ? (
                      <span className="mt-2 block font-sans text-small text-text-muted">
                        {item.body}
                      </span>
                    ) : null}
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {cms?.products?.length ? (
        <section className="u-container py-(--spacing-block-lg)">
          <Metadata className="mb-8 text-accent-text">Suggested yurts</Metadata>
          <div className="u-grid gap-y-10">
            {cms.products.map((item) => (
              <Link
                key={item.slug}
                href={`/yurts/${item.slug}`}
                className="group col-span-2 md:col-span-3 lg:col-span-4"
              >
                <div className="overflow-hidden">
                  <CmsImage
                    image={item.heroImage}
                    ratio="editorial"
                    sizes="(min-width: 1024px) 32vw, 45vw"
                    pendingLabel={`${item.slug}-hero.jpg`}
                    className="transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-5 border-t border-line pt-4 font-display text-display-sm">
                  {item.title}
                </h3>
                {item.tagline ? (
                  <p className="mt-2 font-sans text-small text-text-muted">
                    {item.tagline}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Next</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                Start from the land.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Where it is, what you want to put on it, and roughly when. That is
                enough for a useful first conversation.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/applications">All applications</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
