/**
 * SITE CONFIGURATION
 *
 * Company facts live here and nowhere else.
 *
 * Fields set to `null` are genuinely unknown — the client has not supplied them.
 * Components must hide the corresponding UI rather than invent a value. Do not
 * fill these in with plausible-looking placeholders: a missing phone number is
 * recoverable, a wrong one on a live site is not.
 */

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && envUrl.length > 0) {
    return envUrl.startsWith("http://") || envUrl.startsWith("https://")
      ? envUrl
      : `https://${envUrl}`;
  }
  const vercelUrl = (
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL
  )?.trim();
  if (vercelUrl && vercelUrl.length > 0) {
    return `https://${vercelUrl}`;
  }
  return "https://theyurts.in";
}

export const site = {
  name: "Theyurts",
  wordmark: "Theyurts",
  domain: "theyurts.in",
  url: getSiteUrl(),
  locale: "en_IN",

  tagline: "Premium yurts, designed and made in India.",
  description:
    "Theyurts designs, manufactures and installs premium yurts for resorts, glamping sites, wellness retreats, farm stays and private landowners across India.",

  /**
   * Email and phone supplied by the client. The remaining fields are still
   * PENDING CLIENT — see docs/CONTENT-NEEDED.md. A value set here is only the
   * fallback: anything filled into the Sanity site-settings document wins.
   */
  contact: {
    email: "unthink@theyurts.com" as string | null,
    phone: "+91 9880114331" as string | null,
    whatsapp: null as string | null,
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    postalCode: null as string | null,
    mapsUrl: null as string | null,
  },

  /** PENDING CLIENT — only add a profile once it exists and is populated. */
  social: {
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    pinterest: null as string | null,
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Shown in the fullscreen mobile navigation only. */
  note?: string;
};

/** Primary navigation. Six items — anything more and it stops being a decision. */
export const primaryNav: NavItem[] = [
  { label: "Yurts", href: "/yurts", note: "The range" },
  { label: "Applications", href: "/applications", note: "What they are for" },
  { label: "Experiences", href: "/experiences", note: "Configure and explore" },
  { label: "Projects", href: "/projects", note: "Gallery and inspiration" },
  { label: "Journal", href: "/journal", note: "Writing" },
  { label: "About", href: "/about", note: "The company" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Yurts",
    items: [
      { label: "The range", href: "/yurts" },
      { label: "Build process", href: "/process" },
      { label: "Why a yurt", href: "/why-theyurts" },
      { label: "Materials", href: "/about#materials" },
    ],
  },
  {
    title: "Applications",
    items: [
      { label: "Resorts", href: "/applications/resorts" },
      { label: "Glamping", href: "/applications/glamping" },
      { label: "Wellness retreats", href: "/applications/wellness-retreats" },
      { label: "Starting a glamping business", href: "/glamping-business" },
    ],
  },
  {
    title: "Experiences",
    items: [
      { label: "3D yurt builder", href: "/experiences/builder" },
      { label: "VR experience", href: "/experiences/vr" },
      { label: "Projects", href: "/projects" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Resources", href: "/resources" },
      { label: "Frequently asked", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * Whether the header's utility bar has anything to show.
 *
 * Lives here rather than in the TopBar component because that component is
 * pulled into the client graph by Header ("use client"); a named export read
 * from there by a server component resolves to a client reference, not the
 * function. SiteChrome needs the real predicate to pick its layout offset.
 */
export function hasTopBar(contact: {
  email: string | null;
  phone: string | null;
}): boolean {
  return Boolean(contact.email || contact.phone);
}
