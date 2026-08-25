import { isSanityConfigured } from "@/sanity/env";
import { StudioNotConfigured } from "@/components/site/StudioNotConfigured";
import { StudioMount } from "./StudioMount";

/**
 * The Studio, served from the site itself so the client has one URL and one
 * login rather than a separately deployed admin.
 *
 * Rendered outside the (site) route group, so none of the marketing chrome
 * wraps it.
 *
 * Sanity's config throws if it is constructed without a project id, so the
 * Studio is only mounted once one is set. Before that this route explains how to
 * connect it rather than returning a 500.
 */

export const metadata = {
  title: "Theyurts — Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured) return <StudioNotConfigured />;
  return <StudioMount />;
}
