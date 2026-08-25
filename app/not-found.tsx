import { SiteChrome } from "@/components/site/SiteChrome";
import { NotFoundContent } from "@/components/site/NotFoundContent";

/**
 * Root 404. Catches URLs that match no route at all.
 *
 * It has to live here rather than inside the (site) group — Next resolves
 * unmatched URLs against the root — so it brings the chrome with it.
 */
export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
