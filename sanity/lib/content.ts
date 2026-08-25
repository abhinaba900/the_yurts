import { sanityFetch } from "./fetch";
import * as q from "./queries";
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

export const getProducts = () =>
  sanityFetch<ProductSummary[]>({
    query: q.productsQuery,
    tags: ["product"],
    fallback: [],
  });

export const getProductSlugs = () =>
  sanityFetch<string[]>({
    query: q.productSlugsQuery,
    tags: ["product"],
    fallback: [],
  });

export const getProduct = (slug: string) =>
  sanityFetch<Product | null>({
    query: q.productQuery,
    params: { slug },
    tags: ["product", `product:${slug}`],
    fallback: null,
  });

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

export const getPosts = ({ start = 0, end = 12 }: { start?: number; end?: number } = {}) =>
  sanityFetch<PostSummary[]>({
    query: q.postsQuery,
    params: { start, end },
    tags: ["post"],
    fallback: [],
  });

export const getPostCount = () =>
  sanityFetch<number>({
    query: q.postCountQuery,
    tags: ["post"],
    fallback: 0,
  });

export const getPostSlugs = () =>
  sanityFetch<string[]>({
    query: q.postSlugsQuery,
    tags: ["post"],
    fallback: [],
  });

export const getPost = (slug: string) =>
  sanityFetch<Post | null>({
    query: q.postQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
    fallback: null,
  });

export const getPostCategories = () =>
  sanityFetch<PostCategory[]>({
    query: q.postCategoriesQuery,
    tags: ["post", "postCategory"],
    fallback: [],
  });

export const getPostCategorySlugs = () =>
  sanityFetch<string[]>({
    query: q.postCategorySlugsQuery,
    tags: ["postCategory"],
    fallback: [],
  });

export const getPostCategory = (slug: string) =>
  sanityFetch<PostCategory | null>({
    query: q.postCategoryQuery,
    params: { slug },
    tags: ["postCategory"],
    fallback: null,
  });

export const getPostsByCategory = (slug: string) =>
  sanityFetch<PostSummary[]>({
    query: q.postsByCategoryQuery,
    params: { slug },
    tags: ["post", "postCategory"],
    fallback: [],
  });

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
