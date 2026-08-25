import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getApplicationSlugs, getProductSlugs, getProjectSlugs, getPostSlugs } from "@/sanity/lib/content";
import { applicationsFallback } from "@/data/applications";

/**
 * Static routes. Once Sanity lands in Phase 3 this file also maps over
 * products, applications, projects and journal entries.
 */
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/yurts", priority: 0.9, changeFrequency: "monthly" },
  { path: "/applications", priority: 0.9, changeFrequency: "monthly" },
  { path: "/experiences", priority: 0.8, changeFrequency: "monthly" },
  { path: "/experiences/builder", priority: 0.8, changeFrequency: "monthly" },
  { path: "/experiences/vr", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/process", priority: 0.7, changeFrequency: "yearly" },
  { path: "/why-theyurts", priority: 0.7, changeFrequency: "yearly" },
  { path: "/glamping-business", priority: 0.8, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/enquire", priority: 0.8, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Detail pages. Applications fall back to the written static set, so those
  // URLs are in the sitemap from launch rather than waiting on the CMS.
  const [productSlugs, cmsApplicationSlugs, projectSlugs, postSlugs] = await Promise.all([
    getProductSlugs(),
    getApplicationSlugs(),
    getProjectSlugs(),
    getPostSlugs(),
  ]);

  const applicationSlugs = [
    ...new Set([...cmsApplicationSlugs, ...applicationsFallback.map((a) => a.slug)]),
  ];

  const detail: MetadataRoute.Sitemap = [
    ...productSlugs.map((slug) => ({ url: `${site.url}/yurts/${slug}`, priority: 0.8 })),
    ...applicationSlugs.map((slug) => ({ url: `${site.url}/applications/${slug}`, priority: 0.7 })),
    ...projectSlugs.map((slug) => ({ url: `${site.url}/projects/${slug}`, priority: 0.6 })),
    ...postSlugs.map((slug) => ({ url: `${site.url}/journal/${slug}`, priority: 0.6 })),
  ].map((entry) => ({ ...entry, lastModified, changeFrequency: "monthly" as const }));

  const staticRoutes = routes.map(({ path, priority, changeFrequency }) => ({
    // Root is emitted without a trailing slash so it matches the canonical
    // Next generates for "/". Two spellings of the home URL is a duplicate-
    // content signal for no benefit.
    url: path === "/" ? site.url : new URL(path, site.url).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));

  return [...staticRoutes, ...detail];
}
