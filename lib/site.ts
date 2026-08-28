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

export const site = {
  name: "Theyurts",
  wordmark: "Theyurts",
  domain: "the-yurts.vercel.app",
  url: "https://the-yurts.vercel.app",
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
    email: "hello@theyurts.in" as string | null,
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
  /**
   * Secondary destinations under this item. The parent stays a real link — the
   * children are an additional way in, not a replacement for it.
   */
  children?: NavItem[];
};

/** Primary navigation. Seven items — anything more and it stops being a decision. */
export const primaryNav: NavItem[] = [
  {
    label: "Yurts",
    href: "/yurts",
    note: "The range",
    children: [
      { label: "Why Yurts", href: "/why-theyurts", note: "The case" },
      { label: "How It’s Made", href: "/process", note: "Eight stages" },
    ],
  },
  { label: "Applications", href: "/applications", note: "What they are for" },
  { label: "Experiences", href: "/experiences", note: "Configure and explore" },
  { label: "Projects", href: "/projects", note: "Gallery and inspiration" },
  { label: "Journal", href: "/journal", note: "Writing" },
  { label: "About", href: "/about", note: "The company" },
  { label: "FAQ", href: "/faq", note: "Before you build one" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Yurts",
    items: [
      { label: "The range", href: "/yurts" },
      { label: "Build process", href: "/process" },
      { label: "Why a yurt", href: "/why-theyurts" },
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
