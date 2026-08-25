import "server-only";
import { cache } from "react";
import { getSiteSettings } from "@/sanity/lib/content";
import { site } from "./site";

/**
 * Resolved site settings: the CMS where it has an answer, the static config in
 * `lib/site.ts` where it does not.
 *
 * This is the seam between Phase 1's hard-coded configuration and the CMS. It
 * means the client can fill in a phone number in the Studio and have it appear
 * everywhere, while the site keeps working exactly as it does today until they
 * do — no empty strings, no "TBC", no placeholder telephone number.
 *
 * Wrapped in `cache` so the several components that need it during one render
 * share a single request.
 */

export type ResolvedSettings = {
  name: string;
  tagline: string;
  description: string;
  contact: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    mapsUrl: string | null;
  };
  social: {
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    pinterest: string | null;
  };
};

/** Treats empty strings as absent — an editor clearing a field means "hide it". */
const clean = (value: string | null | undefined, fallback: string | null = null) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : fallback;
};

export const getSettings = cache(async (): Promise<ResolvedSettings> => {
  const cms = await getSiteSettings();

  return {
    name: clean(cms?.title, site.name) as string,
    tagline: clean(cms?.tagline, site.tagline) as string,
    description: clean(cms?.description, site.description) as string,
    contact: {
      email: clean(cms?.contact?.email, site.contact.email),
      phone: clean(cms?.contact?.phone, site.contact.phone),
      whatsapp: clean(cms?.contact?.whatsapp, site.contact.whatsapp),
      address: clean(cms?.contact?.address, site.contact.address),
      city: clean(cms?.contact?.city, site.contact.city),
      state: clean(cms?.contact?.state, site.contact.state),
      postalCode: clean(cms?.contact?.postalCode, site.contact.postalCode),
      mapsUrl: clean(cms?.contact?.mapsUrl, site.contact.mapsUrl),
    },
    social: {
      instagram: clean(cms?.social?.instagram, site.social.instagram),
      linkedin: clean(cms?.social?.linkedin, site.social.linkedin),
      youtube: clean(cms?.social?.youtube, site.social.youtube),
      pinterest: clean(cms?.social?.pinterest, site.social.pinterest),
    },
  };
});
