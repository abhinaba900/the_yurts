import { sanityFetch } from "./fetch";
import * as q from "./queries";
import {
  localProduct,
  localProductSlugs,
  localProductSummaries,
} from "@/data/products";
import {
  localPost,
  localPostCategories,
  localPostCategory,
  localPostSlugs,
  localPostSummaries,
  localPostsByCategory,
} from "@/data/journal";
import type {
  Application,
  ApplicationSummary,
  ConfiguratorOption,
  Faq,
  Post,
  PostCategory,
  PostSummary,
  Product,
  ProductSummary,
  Project,
  ProjectSummary,
  Resource,
  SiteSettings,
} from "./types";

/**
 * The content API.
 *
 * Pages import from here and nowhere else — never from `client`, `queries` or
 * `fetch` directly. One module owns the query, its type, its cache tag and its
 * empty value, so a page cannot accidentally fetch untagged or untyped.
 *
 * Every list returns `[]` and every single document returns `null` when there is
 * nothing — including when Sanity is not configured at all. Callers treat those
 * two situations identically, which is why the site works today with no CMS
 * connected and will keep working if one goes down.
 */

export const getSiteSettings = () =>
  sanityFetch<SiteSettings>({
    query: q.siteSettingsQuery,
    tags: ["siteSettings"],
    fallback: null,
  });

/* -- Products -------------------------------------------------------------- */

/**
 * The ten models fall back to `data/products.ts` — derived from the same
 * `data/range.ts` the rail and the /yurts index read — so every /yurts/<slug>
 * resolves before the CMS has a single document in it. Without the fallback
 * those URLs 404, which is what they did until the image band started linking
 * to them.
 */

export const getProducts = async () => {
  const products = await sanityFetch<ProductSummary[]>({
    query: q.productsQuery,
    tags: ["product"],
    fallback: [],
  });
  return products.length > 0 ? products : localProductSummaries;
};

export const getProductSlugs = async () => {
  const slugs = await sanityFetch<string[]>({
    query: q.productSlugsQuery,
    tags: ["product"],
    fallback: [],
  });
  return slugs.length > 0 ? slugs : localProductSlugs;
};

export const getProduct = async (slug: string) => {
  const product = await sanityFetch<Product | null>({
    query: q.productQuery,
    params: { slug },
    tags: ["product", `product:${slug}`],
    fallback: null,
  });
  return product ?? localProduct(slug);
};

/* -- Applications ---------------------------------------------------------- */

export const getApplications = () =>
  sanityFetch<ApplicationSummary[]>({
    query: q.applicationsQuery,
    tags: ["application"],
    fallback: [],
  });

export const getApplicationSlugs = () =>
  sanityFetch<string[]>({
    query: q.applicationSlugsQuery,
    tags: ["application"],
    fallback: [],
  });

export const getApplication = (slug: string) =>
  sanityFetch<Application | null>({
    query: q.applicationQuery,
    params: { slug },
    tags: ["application", `application:${slug}`],
    fallback: null,
  });

/* -- Projects -------------------------------------------------------------- */

export const getProjects = () =>
  sanityFetch<ProjectSummary[]>({
    query: q.projectsQuery,
    tags: ["project"],
    fallback: [],
  });

export const getProjectSlugs = () =>
  sanityFetch<string[]>({
    query: q.projectSlugsQuery,
    tags: ["project"],
    fallback: [],
  });

export const getProject = (slug: string) =>
  sanityFetch<Project | null>({
    query: q.projectQuery,
    params: { slug },
    tags: ["project", `project:${slug}`],
    fallback: null,
  });

/* -- Journal --------------------------------------------------------------- */

/* -- Journal ---------------------------------------------------------------- */

/**
 * The journal is the one area with a static fallback: `data/journal.ts` holds
 * the launch articles so the section reads as a finished publication before the
 * client writes anything in the Studio.
 *
 * The rule is the same one `lib/settings.ts` follows — the CMS wins wherever it
 * has an answer. A dataset with even one published post takes over completely,
 * so an editor never sees their work sitting beside hard-coded articles.
 */

export const getPosts = async ({
  start = 0,
  end = 12,
}: { start?: number; end?: number } = {}) => {
  const posts = await sanityFetch<PostSummary[]>({
    query: q.postsQuery,
    params: { start, end },
    tags: ["post"],
    fallback: [],
  });
  return posts.length > 0 ? posts : localPostSummaries.slice(start, end);
};

export const getPostCount = async () => {
  const count = await sanityFetch<number>({
    query: q.postCountQuery,
    tags: ["post"],
    fallback: 0,
  });
  return count > 0 ? count : localPostSummaries.length;
};

export const getPostSlugs = async () => {
  const slugs = await sanityFetch<string[]>({
    query: q.postSlugsQuery,
    tags: ["post"],
    fallback: [],
  });
  return slugs.length > 0 ? slugs : localPostSlugs;
};

export const getPost = async (slug: string) => {
  const post = await sanityFetch<Post | null>({
    query: q.postQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
    fallback: null,
  });
  return post ?? localPost(slug);
};

export const getPostCategories = async () => {
  const categories = await sanityFetch<PostCategory[]>({
    query: q.postCategoriesQuery,
    tags: ["post", "postCategory"],
    fallback: [],
  });
  return categories.length > 0 ? categories : localPostCategories;
};

export const getPostCategorySlugs = async () => {
  const slugs = await sanityFetch<string[]>({
    query: q.postCategorySlugsQuery,
    tags: ["postCategory"],
    fallback: [],
  });
  return slugs.length > 0
    ? slugs
    : localPostCategories.map((category) => category.slug);
};

export const getPostCategory = async (slug: string) => {
  const category = await sanityFetch<PostCategory | null>({
    query: q.postCategoryQuery,
    params: { slug },
    tags: ["postCategory"],
    fallback: null,
  });
  return category ?? localPostCategory(slug);
};

export const getPostsByCategory = async (slug: string) => {
  const posts = await sanityFetch<PostSummary[]>({
    query: q.postsByCategoryQuery,
    params: { slug },
    tags: ["post", "postCategory"],
    fallback: [],
  });
  return posts.length > 0 ? posts : localPostsByCategory(slug);
};

/* -- Support --------------------------------------------------------------- */

export const getFaqs = () =>
  sanityFetch<Faq[]>({
    query: q.faqsQuery,
    tags: ["faq"],
    fallback: [],
  });

export const getResources = () =>
  sanityFetch<Resource[]>({
    query: q.resourcesQuery,
    tags: ["resource"],
    fallback: [],
  });

export const getConfiguratorOptions = () =>
  sanityFetch<ConfiguratorOption[]>({
    query: q.configuratorOptionsQuery,
    tags: ["configuratorOption"],
    fallback: [],
  });
