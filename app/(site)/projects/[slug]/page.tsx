import type { Metadata as NextMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProject, getProjectSlugs } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { pageMetadata } from "@/lib/seo";
import { formatDate, isoDate } from "@/lib/format";
import { site } from "@/lib/site";

import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CmsImage } from "@/components/page/CmsImage";
import { Prose } from "@/components/page/Prose";
import { SpecList } from "@/components/page/SpecList";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Project detail. Only reachable for projects marked published in the Studio —
 * the query filters on it, so an unfinished or unapproved installation cannot be
 * linked into existence.
 *
 * The testimonial block renders only when there is a real quote. There is no
 * placeholder testimonial and no default attribution.
 */

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not found", robots: { index: false } };

  return pageMetadata({
    title: project.seo?.metaTitle ?? project.title,
    description:
      project.seo?.metaDescription ??
      project.summary ??
      `${project.title} — a yurt installation by ${site.name}.`,
    path: `/projects/${project.slug}`,
    image:
      imageUrl(project.seo?.shareImage ?? project.heroImage, {
        width: 1200,
        height: 630,
      }) ?? undefined,
    noIndex: project.seo?.noIndex ?? false,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const image = imageUrl(project.heroImage, { width: 1200 });

  const facts = [
    project.location && { label: "Location", value: project.location },
    project.projectType && { label: "Type", value: project.projectType },
    project.clientName && { label: "Client", value: project.clientName },
    project.completedAt && {
      label: "Completed",
      value: formatDate(project.completedAt),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          ...(project.summary ? { description: project.summary } : {}),
          ...(image ? { image: [image] } : {}),
          ...(project.completedAt
            ? { dateCreated: isoDate(project.completedAt) }
            : {}),
          ...(project.location ? { locationCreated: project.location } : {}),
          creator: { "@type": "Organization", name: site.name },
          url: new URL(`/projects/${project.slug}`, site.url).toString(),
        }}
      />

      <div className="u-container pt-8 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Projects", href: "/projects" },
            { label: project.title, href: `/projects/${project.slug}` },
          ]}
        />
      </div>

      <div className="u-container mt-12">
        <Reveal kind="media">
          <CmsImage
            image={project.heroImage}
            ratio="cinema"
            sizes="100vw"
            width={2400}
            priority
            pendingLabel={`${project.slug}.jpg`}
          />
        </Reveal>
      </div>

      <header className="u-container py-(--spacing-block)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-7">
            <Reveal kind="up">
              <h1 className="font-display text-display-lg u-optical-left">
                {project.title}
              </h1>
              {project.summary ? (
                <p className="mt-8 u-measure font-sans text-lead text-text-muted">
                  {project.summary}
                </p>
              ) : null}
            </Reveal>
          </div>

          {facts.length ? (
            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-3">
              <Reveal kind="up" delay={0.1}>
                <dl className="space-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-t border-line pt-3">
                      <dt className="font-sans text-meta uppercase text-text-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 font-sans text-body">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          ) : null}
        </div>

        {project.specs?.length ? (
          <Reveal kind="up" className="mt-14 border-t border-line pt-10">
            <SpecList specs={project.specs} />
          </Reveal>
        ) : null}
      </header>

      {project.story?.length ? (
        <section className="u-container pb-(--spacing-block-lg)">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
              <Prose value={project.story} />
            </div>
          </div>
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section className="u-container pb-(--spacing-block-lg)">
          <div className="u-grid gap-y-10">
            {project.gallery.map((item, i) => (
              <Reveal
                key={item.url ?? i}
                kind="media"
                delay={Math.min(i, 4) * 0.05}
                className={
                  i % 3 === 0
                    ? "col-span-4 md:col-span-6 lg:col-span-8"
                    : "col-span-2 md:col-span-3 lg:col-span-4"
                }
              >
                <CmsImage
                  image={item}
                  ratio={i % 3 === 0 ? "landscape" : "portrait"}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                {item.caption ? (
                  <p className="mt-3 font-sans text-meta uppercase text-text-muted">
                    {item.caption}
                  </p>
                ) : null}
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {project.floorPlans?.length ? (
        <section className="u-container pb-(--spacing-block-lg)">
          <Metadata className="mb-8 text-accent-text">Floor plans</Metadata>
          <div className="u-grid gap-y-10">
            {project.floorPlans.map((plan, i) => (
              <div key={plan.url ?? i} className="col-span-2 md:col-span-3 lg:col-span-5">
                <CmsImage image={plan} ratio="square" sizes="(min-width: 1024px) 40vw, 45vw" />
                {plan.caption ? (
                  <p className="mt-3 font-sans text-meta uppercase text-text-muted">
                    {plan.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Only ever the client's own words, and only when they exist. */}
      {project.testimonial?.quote ? (
        <Section surface="alt" space="lg">
          <div className="u-container">
            <div className="u-grid">
              <figure className="col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-3">
                <blockquote className="font-display text-display-md">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>
                {project.testimonial.attribution ? (
                  <figcaption className="mt-7 font-sans text-meta uppercase text-text-muted">
                    {project.testimonial.attribution}
                    {project.testimonial.role ? ` · ${project.testimonial.role}` : ""}
                  </figcaption>
                ) : null}
              </figure>
            </div>
          </div>
        </Section>
      ) : null}

      {project.products?.length ? (
        <section className="u-container py-(--spacing-block-lg)">
          <Metadata className="mb-6 text-accent-text">Yurts used</Metadata>
          <ul>
            {project.products.map((product) => (
              <li key={product.slug} className="border-t border-line last:border-b">
                <Link
                  href={`/yurts/${product.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="font-display text-display-sm">{product.title}</span>
                  <span
                    aria-hidden
                    className="text-text-muted transition-transform duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent-text"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <p className="font-display text-display-lg u-optical-left">
                Something like this?
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Tell us where the land is and what has to happen on it.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/projects">All projects</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
