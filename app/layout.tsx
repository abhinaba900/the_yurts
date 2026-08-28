import type { Metadata, Viewport } from "next";
import { instrumentSerif, inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Root layout. Deliberately minimal — html, body, fonts and site-wide metadata.
 *
 * The site chrome (header, footer, smooth scroll, page transitions) lives in
 * `app/(site)/layout.tsx` instead, so that `/studio` can render the Sanity
 * Studio full-bleed without a marketing header wrapped around it. Layouts nest
 * and cannot be opted out of, so this separation is the only way to have both.
 */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    images: [
      {
        url: `${site.url}/og-image.jpg`,
        secureUrl: `${site.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${site.url}/og-image.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#17110d" },
    { media: "(prefers-color-scheme: dark)", color: "#17110d" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${instrumentSerif.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Declares two capabilities before first paint: that JavaScript ran at
          all (`js`), and that the browser can drive animation from scroll
          position (`sda`).

          Reveals hide themselves behind `.js`, so a visitor without JavaScript —
          or if this script fails — sees all content rather than a page of
          invisible elements waiting on an observer that will never run.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              // Scroll-driven animation is gated on a real capability check
              // rather than @supports, because Lightning CSS does not recognise
              // `animation-timeline` and strips such blocks from the build.
              "try{if(CSS.supports('animation-timeline','view()'))" +
              "document.documentElement.classList.add('sda')}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
