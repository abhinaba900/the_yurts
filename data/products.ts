import type { PortableTextBlock } from "sanity";
import type { Product, ProductSummary } from "@/sanity/lib/types";
import { media } from "./media";
import { rangeFallback, type RangeEntry } from "./range";

/**
 * PRODUCT FALLBACK
 *
 * The ten models as product documents, derived from `data/range.ts` so the
 * range rail, the /yurts index and each model's own page cannot drift apart —
 * there is one description of a Classic yurt, not three.
 *
 * Same rule as the journal and the site settings: the CMS wins wherever it has
 * an answer, and this is what the site serves until it does. Without it every
 * /yurts/<slug> URL 404s, because `getProduct` has no document to return.
 *
 * It carries only what `data/range.ts` already publishes elsewhere on the site —
 * the tagline, the description, and the three summary specs. Every richer field
 * (gallery, sizes, technical detail, materials, downloads, FAQs) stays null on
 * purpose, and the product page hides those sections rather than filling them
 * with invented specification. See lib/site.ts for why.
 */

let keySeed = 0;
const key = () => `product-local-${(keySeed += 1)}`;

const p = (text: string): PortableTextBlock =>
  ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }) as unknown as PortableTextBlock;

/** The manifest already holds the photograph and its alt text — reuse both. */
const heroFor = (entry: RangeEntry) => {
  if (!entry.media) return null;
  const asset = media[entry.media];
  if (!asset?.src) return null;
  return {
    assetId: asset.src,
    url: asset.src,
    lqip: null,
    aspectRatio: null,
    alt: asset.alt,
    caption: null,
  };
};

const toProduct = (entry: RangeEntry): Product => ({
  _id: `local-product-${entry.slug}`,
  title: entry.name,
  slug: entry.slug,
  tagline: entry.tagline,
  summary: entry.use,
  category: null,
  specs: [
    { label: "Diameter", value: entry.diameter, unit: null, note: null },
    { label: "Capacity", value: entry.capacity, unit: null, note: null },
    { label: "Ideal for", value: entry.idealFor, unit: null, note: null },
  ],
  heroImage: heroFor(entry),
  body: [
    p(entry.use),
    p(
      "Every structure is configured around the conditions of the place it will stand in — climate, insulation, ventilation, rain, heat, wind and the ground itself.",
    ),
    p(
      "Tell us about the site and we will come back with a specification for it rather than a generic one.",
    ),
  ],
  gallery: null,
  sizes: null,
  technical: null,
  materials: null,
  features: null,
  customisation: null,
  interiorOptions: null,
  applications: null,
  downloads: null,
  faqs: null,
  // Only the description is authored locally; the rest of the SEO block is the
  // CMS editor's to fill, and a null here lets pageMetadata fall through.
  seo: entry.metaDescription
    ? {
        metaTitle: null,
        metaDescription: entry.metaDescription,
        noIndex: false,
        shareImage: null,
      }
    : null,
});

const products: Product[] = rangeFallback.map(toProduct);

export const localProductSummaries: ProductSummary[] = products.map((product) => ({
  _id: product._id,
  title: product.title,
  slug: product.slug,
  tagline: product.tagline,
  summary: product.summary,
  category: product.category,
  specs: product.specs,
  heroImage: product.heroImage,
}));

export const localProductSlugs: string[] = products.map((p) => p.slug);

export const localProduct = (slug: string): Product | null =>
  products.find((product) => product.slug === slug) ?? null;
