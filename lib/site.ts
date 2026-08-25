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
  domain: "theyurts.in",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://theyurts.in",
  locale: "en_IN",

  tagline: "Premium yurts, designed and made in India.",
  description:
    "Theyurts designs, manufactures and installs premium yurts for resorts, glamping sites, wellness retreats, farm stays and private landowners across India.",

  /** PENDING CLIENT — see docs/CONTENT-NEEDED.md */
  contact: {
    email: null as string | null,
    phone: null as string | null,
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
