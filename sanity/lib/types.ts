import type { PortableTextBlock } from "sanity";

/**
 * The shapes the queries in `queries.ts` return.
 *
 * Hand-written and kept beside the queries deliberately: every field here maps
 * to a line in a projection, so if a query changes and this does not, the
 * mismatch shows up as a type error at the call site rather than as `undefined`
 * on a live page.
 *
 * Almost everything is optional. Content arrives incomplete — a product with no
 * specifications yet, an application with no hero — and the templates render
 * only what exists. Optional types are what force that to be handled.
 */

export type SanityImage = {
  /** Needed by the image-url builder to generate crops. See `imageFields`. */
  assetId: string | null;
  url: string | null;
  lqip: string | null;
  aspectRatio: number | null;
  alt: string | null;
  caption: string | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
};

export type Seo = {
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean | null;
  shareImage: SanityImage | null;
} | null;

export type SpecRow = {
  label: string;
  value: string;
  unit: string | null;
  note: string | null;
};

export type NamedNote = { title: string; body: string | null };

export type SiteSettings = {
  title: string | null;
  tagline: string | null;
  description: string | null;
  contact: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    mapsUrl?: string | null;
  } | null;
  social: {
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    pinterest?: string | null;
  } | null;
  defaultShareImage: SanityImage | null;
} | null;

export type CategoryRef = { title: string; slug: string };

export type ProductSummary = {
  _id: string;
  title: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  category: CategoryRef | null;
  specs: SpecRow[] | null;
  heroImage: SanityImage | null;
};

export type SizeOption = {
  name: string;
  specs: SpecRow[] | null;
  floorPlan: SanityImage | null;
};

export type Download = {
  title: string;
  slug: string;
  description: string | null;
  gated: boolean | null;
  fileUrl: string | null;
  fileSize: number | null;
};

export type Faq = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
};

export type Product = ProductSummary & {
  body: PortableTextBlock[] | null;
  gallery: SanityImage[] | null;
  sizes: SizeOption[] | null;
  technical: PortableTextBlock[] | null;
  materials: NamedNote[] | null;
  features: NamedNote[] | null;
  customisation: NamedNote[] | null;
  interiorOptions: NamedNote[] | null;
  applications: { title: string; slug: string; line: string | null }[] | null;
  downloads: Download[] | null;
  faqs: Faq[] | null;
  seo: Seo;
};

export type ApplicationSummary = {
  _id: string;
  title: string;
  slug: string;
  line: string | null;
  summary: string | null;
  heroImage: SanityImage | null;
};

export type Application = ApplicationSummary & {
  body: PortableTextBlock[] | null;
  considerations: NamedNote[] | null;
  products:
    | { title: string; slug: string; tagline: string | null; heroImage: SanityImage | null }[]
    | null;
  seo: Seo;
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  location: string | null;
  projectType: string | null;
  completedAt: string | null;
  heroImage: SanityImage | null;
};

export type Project = ProjectSummary & {
  story: PortableTextBlock[] | null;
  clientName: string | null;
  videoUrl: string | null;
  specs: SpecRow[] | null;
  testimonial: {
    quote: string | null;
    attribution: string | null;
    role: string | null;
  } | null;
  gallery: SanityImage[] | null;
  floorPlans: SanityImage[] | null;
  products: { title: string; slug: string }[] | null;
  seo: Seo;
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  readingTime: number | null;
  heroImage: SanityImage | null;
  author: { name: string; slug: string; role: string | null } | null;
  categories: CategoryRef[] | null;
};

export type Post = PostSummary & {
  body: PortableTextBlock[] | null;
  author:
    | {
        name: string;
        slug: string;
        role: string | null;
        bio: string | null;
        image: SanityImage | null;
      }
    | null;
  related: PostSummary[] | null;
  seo: Seo;
};

export type PostCategory = {
  _id: string;
  title: string;
  slug: string;
  description: string | null;
  count: number;
};

export type Resource = {
  _id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  gated: boolean | null;
  coverImage: SanityImage | null;
  fileUrl: string | null;
  fileSize: number | null;
};

export type ConfiguratorOption = {
  _id: string;
  group:
    | "size"
    | "exterior"
    | "roof"
    | "doors"
    | "windows"
    | "flooring"
    | "interior"
    | "furniture";
  label: string;
  description: string | null;
  assetKey: string | null;
  isDefault: boolean | null;
  swatch: SanityImage | null;
};
