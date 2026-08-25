import { SiteChrome } from "@/components/site/SiteChrome";

/**
 * Site chrome for every page in this group. `/studio` sits outside the group
 * and gets none of it.
 *
 * The route group adds no path segment — `app/(site)/about/page.tsx` is still
 * served at `/about`.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
