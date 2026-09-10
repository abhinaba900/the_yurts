import type { PortableTextBlock } from "sanity";
import type { NamedNote, Product, ProductSummary, SizeOption } from "@/sanity/lib/types";
import { media } from "./media";
import { rangeFallback, type RangeEntry } from "./range";
import {
  doorDepthsMm,
  doorTypes,
  domeOperation,
  finishColours,
  layouts,
  shellSizesByIds,
  sizeLabel,
  toiletWindowColours,
  windowSpec,
} from "./specifications";

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
 * It carries what `data/range.ts` already publishes elsewhere on the site — the
 * tagline, the description, the three summary specs — plus the parts of the
 * workshop's specification sheet that are now confirmed: the shell sizes, the
 * three standard layouts, and the door, window and dome finishes. Those come
 * from `data/specifications.ts` rather than being retyped here.
 *
 * Everything still unconfirmed (gallery, floor plans, materials, downloads,
 * FAQs) stays null on purpose, and the product page hides those sections rather
 * than filling them with invented specification. See lib/site.ts for why.
 *
 * PRICES ARE NOT HERE, DELIBERATELY. The sheet quotes one price per layout and
 * door depth with no size against it — a Symmetry is priced once, not once per
 * diameter. Printing that figure on ten model pages would imply the model and
 * the size do not move it, which the sheet does not say. The prices are shown
 * once, range-wide, on /yurts where that caveat can be stated beside them.
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

/**
 * The confirmed shell sizes this model can be built at, as `SizeOption` rows.
 *
 * Returns null rather than an empty array when the model has none, because the
 * product template tests `product.sizes?.length` to decide whether the Sizes
 * block exists at all — Event has no quoted size and should show no heading.
 */
const sizesFor = (entry: RangeEntry): SizeOption[] | null => {
  const sizes = shellSizesByIds(entry.standardSizes);
  if (sizes.length === 0) return null;

  return sizes.map((size) => ({
    name: sizeLabel(size),
    specs: [
      { label: "Floor area", value: String(size.areaSqFt), unit: "sq ft", note: null },
      { label: "Diameter", value: String(size.diameterMm), unit: "mm", note: null },
      { label: "Wall height", value: String(size.wallHeightMm), unit: "mm", note: null },
      { label: "Roof rise", value: String(size.roofRiseMm), unit: "mm", note: null },
    ],
    // No plans supplied with the sheet; the template omits the image.
    floorPlan: null,
  }));
};

/** The three standard layouts, described by what they open into the wall. */
const layoutNotes: NamedNote[] = layouts.map((layout) => ({
  title: layout.name,
  body: `${layout.doors} ${layout.doors === 1 ? "door" : "doors"}, ${layout.windows} windows and ${layout.toiletWindows} toilet ${layout.toiletWindows === 1 ? "window" : "windows"}. ${layout.note}`,
}));

/** Door, window and dome options — identical across every layout on the sheet. */
const finishNotes: NamedNote[] = [
  {
    title: "Doors",
    body: `${doorTypes.join(" or ")}, at ${doorDepthsMm.join("mm or ")}mm. Finished in ${finishColours.join(", ")}.`,
  },
  {
    title: "Windows",
    body: `${windowSpec.material} ${windowSpec.type.toLowerCase()}s, finished in ${windowSpec.colours.join(", ")}.`,
  },
  {
    title: "Toilet windows",
    body: `${windowSpec.material} ${windowSpec.type.toLowerCase()}s, in ${toiletWindowColours.join(", ")}.`,
  },
  {
    title: "Crown dome",
    body: `${domeOperation}, on every size and layout.`,
  },
];

/**
 * The Technical block.
 *
 * The wall height is the one figure constant across the whole sheet, so it is
 * worth stating once — but only on a model that actually has a quoted size. On
 * a model that has none (Event), saying "the wall stands 2700mm on every size"
 * would be describing sizes the page has just declined to show, so that
 * sentence is dropped and only the per-project note remains.
 */
const technicalFor = (entry: RangeEntry): PortableTextBlock[] => {
  const sizes = shellSizesByIds(entry.standardSizes);
  const blocks: PortableTextBlock[] = [];

  if (sizes.length > 0) {
    blocks.push(
      p(
        `The wall stands ${sizes[0].wallHeightMm}mm whichever size is built; what changes with the diameter is the rise from the wall head to the crown.`,
      ),
    );
  }

  blocks.push(
    p(
      "The sizes, layouts and finishes above are the workshop's standard specification. Anything outside it — another diameter, an extra opening, a conjoined pair of domes — is drawn and quoted per project.",
    ),
  );

  return blocks;
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
  sizes: sizesFor(entry),
  technical: technicalFor(entry),
  materials: null,
  features: layoutNotes,
  customisation: finishNotes,
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
