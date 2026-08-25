import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { BackgroundAudioProvider } from "@/components/site/BackgroundAudio";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

/**
 * The site chrome: header, footer, smooth scroll, skip link and site-wide
 * structured data.
 *
 * A component rather than only a layout because `app/not-found.tsx` has to sit
 * at the root — outside the (site) route group — to catch unmatched URLs, and
 * would otherwise render with no header or footer. Both entry points use this,
 * so there is one definition of what "the site" looks like.
 */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <BackgroundAudioProvider>
      <JsonLd schema={[organizationSchema(settings), websiteSchema()]} />
      <SmoothScroll />
      <SkipLink />
      <Header contact={settings.contact} />
      {/* Offsets the fixed header. Pages that open with a full-bleed hero pull
          back up with a negative margin of their own. */}
      <main id="main" className="pt-20 md:pt-24">
        {children}
      </main>
      <Footer />
    </BackgroundAudioProvider>
  );
}
