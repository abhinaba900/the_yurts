import { NotFoundContent } from "@/components/site/NotFoundContent";

/**
 * 404 for `notFound()` thrown inside the site group — a product or article slug
 * that does not exist. The group layout already provides the chrome.
 */
export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return <NotFoundContent />;
}
