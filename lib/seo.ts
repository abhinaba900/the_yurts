import type { Metadata } from "next";
import { site } from "./site";

/**
 * Metadata factory. Every page calls this — no page hand-rolls an
 * openGraph block, so canonicals, OG images and locale can never drift.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, site.url).toString();
  const ogImage = image ?? "/opengraph-image";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [ogImage],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/*                                                                            */
/* Only facts the client has actually supplied are emitted. Address, phone and */
/* social profiles are omitted entirely while they are null — an incomplete    */
/* Organization block is fine, a fabricated one is not.                        */
/* -------------------------------------------------------------------------- */

export function organizationSchema(settings?: {
  name: string;
  description: string;
  contact: Record<string, string | null>;
  social: Record<string, string | null>;
}) {
  const contact = settings?.contact ?? site.contact;
  const social = settings?.social ?? site.social;
  const name = settings?.name ?? site.name;
  const description = settings?.description ?? site.description;

  const sameAs = Object.values(social).filter(
    (v): v is string => typeof v === "string",
  );

  const address =
    contact.address || contact.city
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address ?? undefined,
          addressLocality: contact.city ?? undefined,
          addressRegion: contact.state ?? undefined,
          postalCode: contact.postalCode ?? undefined,
          addressCountry: "IN",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name,
    url: site.url,
    description,
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(address ? { address } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": `${site.url}#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(trail: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: new URL(crumb.href, site.url).toString(),
    })),
  };
}
