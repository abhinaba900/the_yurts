import type { Metadata as NextMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct, getProductSlugs } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { pageMetadata } from "@/lib/seo";
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
import { Rule } from "@/components/primitives/Rule";

/**
 * Product detail. One template, every yurt.
 *
 * Every block below the title is conditional. A product can be published with a
 * name and a paragraph while its specifications, floor plans and downloads are
 * still being prepared, and the page simply gets shorter — no empty headings, no
 * "TBC" rows, nothing for an editor to feel obliged to fill with a guess.
 */

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found", robots: { index: false } };

  return pageMetadata({
    title: product.seo?.metaTitle ?? product.title,
    description:
      product.seo?.metaDescription ??
      product.summary ??
      product.tagline ??
      `${product.title} — a yurt by ${site.name}.`,
    path: `/yurts/${product.slug}`,
    image:
      imageUrl(product.seo?.shareImage ?? product.heroImage, { width: 1200, height: 630 }) ??
      undefined,
    noIndex: product.seo?.noIndex ?? false,
  });
}

/** Product schema. Deliberately no `offers` — there is no published pricing. */
function productSchema(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  const image = imageUrl(product.heroImage, { width: 1200 });

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(product.summary ? { description: product.summary } : {}),
    ...(image ? { image: [image] } : {}),
    ...(product.category ? { category: product.category.title } : {}),
    brand: { "@type": "Brand", name: site.name },
    url: new URL(`/yurts/${product.slug}`, site.url).toString(),
    ...(product.specs?.length
      ? {
          additionalProperty: product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: [spec.value, spec.unit].filter(Boolean).join(" "),
          })),
        }
      : {}),
  };
}

function faqSchema(faqs: NonNullable<Awaited<ReturnType<typeof getProduct>>>["faqs"]) {
  if (!faqs?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        // Plain-text flattening of the portable text answer.
        text: item.answer
          .map((block) =>
            "children" in block && Array.isArray(block.children)
              ? block.children.map((child) => ("text" in child ? child.text : "")).join("")
              : "",
          )
          .filter(Boolean)
          .join(" "),
      },
    })),
  };
}

/* -------------------------------------------------------------------------- */

function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-(--spacing-block)">
      <div className="u-grid">
        <header className="col-span-4 md:col-span-6 lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <Metadata className="text-accent-text">{index}</Metadata>
            <h2 className="mt-3 font-display text-display-sm">{title}</h2>
          </div>
        </header>
        <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
          {children}
        </div>
      </div>
    </section>
  );
}

function NoteList({
  items,
}: {
  items: { title: string; body: string | null }[];
}) {
  return (
    <dl className="grid gap-x-10 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="border-t border-line py-5">
          <dt className="font-display text-display-sm">{item.title}</dt>
          {item.body ? (
            <dd className="mt-2 font-sans text-small text-text-muted">{item.body}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const faqs = faqSchema(product.faqs);
  let blockIndex = 0;
  const nextIndex = () => String(++blockIndex).padStart(2, "0");

  return (
    <>
      <JsonLd schema={faqs ? [productSchema(product), faqs] : productSchema(product)} />

      <div className="u-container pt-8 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Yurts", href: "/yurts" },
            { label: product.title, href: `/yurts/${product.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="u-container mt-12">
        <Reveal kind="media">
          <CmsImage
            image={product.heroImage}
            ratio="cinema"
            sizes="100vw"
            width={2400}
            priority
            pendingLabel={`${product.slug}-hero.jpg`}
          />
        </Reveal>
      </div>

      {/* Title */}
      <header className="u-container py-(--spacing-block)">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-6">
            <Reveal kind="up">
              {product.category ? <Metadata>{product.category.title}</Metadata> : null}
              <h1 className="mt-5 font-display text-display-lg u-optical-left">
                {product.title}
              </h1>
              {product.tagline ? (
                <p className="mt-6 u-measure font-sans text-lead">{product.tagline}</p>
              ) : null}
            </Reveal>
          </div>
          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
            <Reveal kind="up" delay={0.1}>
              {product.summary ? (
                <p className="u-measure font-sans text-body text-text-muted">
                  {product.summary}
                </p>
              ) : null}
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href={`/enquire?product=${product.slug}`}>
                  Request a quote
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>

        {product.specs?.length ? (
          <Reveal kind="up" className="mt-14 border-t border-line pt-10">
            <SpecList specs={product.specs} />
          </Reveal>
        ) : null}
      </header>

      <div className="u-container">
        {product.body?.length ? (
          <Block index={nextIndex()} title="About">
            <Prose value={product.body} />
          </Block>
        ) : null}

        {product.gallery?.length ? (
          <section className="border-t border-line py-(--spacing-block)">
            <Metadata className="mb-8 text-accent-text">{nextIndex()} &mdash; Gallery</Metadata>
            <div className="u-grid gap-y-8">
              {product.gallery.map((image, i) => (
                <Reveal
                  key={image.url ?? i}
                  kind="media"
                  delay={i * 0.05}
                  className={
                    i % 3 === 0
                      ? "col-span-4 md:col-span-6 lg:col-span-8"
                      : "col-span-2 md:col-span-3 lg:col-span-4"
                  }
                >
                  <CmsImage
                    image={image}
                    ratio={i % 3 === 0 ? "landscape" : "portrait"}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                  />
                  {image.caption ? (
                    <p className="mt-3 font-sans text-meta uppercase text-text-muted">
                      {image.caption}
                    </p>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {product.sizes?.length ? (
          <Block index={nextIndex()} title="Sizes">
            <div className="space-y-12">
              {product.sizes.map((size) => (
                <div key={size.name} className="border-t border-line pt-6">
                  <h3 className="font-display text-display-md">{size.name}</h3>
                  <SpecList specs={size.specs} size="small" className="mt-6" />
                  {size.floorPlan ? (
                    <div className="mt-8 max-w-xl">
                      <CmsImage
                        image={size.floorPlan}
                        ratio="square"
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        pendingLabel={`${product.slug}-${size.name}-plan.jpg`}
                      />
                      <p className="mt-3 font-sans text-meta uppercase text-text-muted">
                        Floor plan &middot; {size.name}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Block>
        ) : null}

        {product.materials?.length ? (
          <Block index={nextIndex()} title="Materials">
            <NoteList items={product.materials} />
          </Block>
        ) : null}

        {product.features?.length ? (
          <Block index={nextIndex()} title="Features">
            <NoteList items={product.features} />
          </Block>
        ) : null}

        {product.customisation?.length ? (
          <Block index={nextIndex()} title="Customisation">
            <NoteList items={product.customisation} />
          </Block>
        ) : null}

        {product.interiorOptions?.length ? (
          <Block index={nextIndex()} title="Interior">
            <NoteList items={product.interiorOptions} />
          </Block>
        ) : null}

        {product.technical?.length ? (
          <Block index={nextIndex()} title="Technical">
            <Prose value={product.technical} />
          </Block>
        ) : null}

        {product.downloads?.length ? (
          <Block index={nextIndex()} title="Downloads">
            <ul>
              {product.downloads.map((file) => (
                <li key={file.slug} className="border-t border-line last:border-b">
                  <a
                    href={file.gated ? `/resources#${file.slug}` : (file.fileUrl ?? "#")}
                    {...(file.gated ? {} : { download: true })}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span>
                      <span className="block font-sans text-lead">{file.title}</span>
                      {file.description ? (
                        <span className="mt-1 block font-sans text-small text-text-muted">
                          {file.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-sans text-meta uppercase text-text-muted transition-colors group-hover:text-accent-text">
                      {file.gated ? "Request" : formatSize(file.fileSize)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {product.faqs?.length ? (
          <Block index={nextIndex()} title="Questions">
            <dl>
              {product.faqs.map((item) => (
                <div key={item._id} className="border-t border-line py-6">
                  <dt className="font-sans text-lead">{item.question}</dt>
                  <dd className="mt-3">
                    <Prose value={item.answer} />
                  </dd>
                </div>
              ))}
            </dl>
          </Block>
        ) : null}

        {product.applications?.length ? (
          <Block index={nextIndex()} title="Suited to">
            <ul>
              {product.applications.map((item) => (
                <li key={item.slug} className="border-t border-line last:border-b">
                  <Link
                    href={`/applications/${item.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="font-display text-display-sm">{item.title}</span>
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
          </Block>
        ) : null}
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Rule index="Next" label="Get a price" />
              <p className="mt-8 font-display text-display-lg u-optical-left">
                What would it cost on your land?
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Every quote depends on the site — access, ground, services and how
                the structure will be used. Tell us those and you get a real
                number rather than a range.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href={`/enquire?product=${product.slug}`}>
                  Request a quote for the {product.title}
                </ArrowLink>
                <ArrowLink href="/yurts">Back to the range</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function formatSize(bytes: number | null) {
  if (!bytes) return "PDF";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `PDF · ${mb.toFixed(1)} MB` : `PDF · ${Math.round(bytes / 1024)} KB`;
}
