/**
 * Experience Centre visit requests: shape and validation.
 *
 * Separate from lib/enquiry.ts because the contract is different — a visit
 * needs a phone number and a date, and an email address is optional — but
 * the record lands in the same place (Studio enquiry + notification email),
 * so whoever reads leads has one inbox.
 *
 * This is a REQUEST. Nothing here checks or holds availability; the team
 * confirms each visit by hand. If a scheduling system is ever connected, it
 * belongs in app/actions/visit.ts, not in the form.
 */

import { experienceCentre, timePreferences, visitPurposes } from "@/data/experienceCentre";

export type VisitInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  purpose: string;
  details: string;
};

export type VisitErrors = Partial<Record<keyof VisitInput, string>>;

export type VisitState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: VisitErrors;
  values?: Partial<VisitInput>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const text = (value: FormDataEntryValue | null, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/** Today's date in India as YYYY-MM-DD — the centre's calendar, not the server's. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

/** The times the form may offer: confirmed slots if any, else a rough preference. */
export const timeOptions: readonly string[] = experienceCentre.visiting.slots.length
  ? experienceCentre.visiting.slots
  : timePreferences;

export function parseVisit(formData: FormData): { data: VisitInput; errors: VisitErrors } {
  const data: VisitInput = {
    name: text(formData.get("name"), 120),
    phone: text(formData.get("phone"), 40),
    email: text(formData.get("email"), 200),
    date: text(formData.get("date"), 10),
    time: text(formData.get("time"), 80),
    purpose: text(formData.get("purpose"), 80),
    details: text(formData.get("details"), 4000),
  };

  const errors: VisitErrors = {};

  if (data.name.length < 2) {
    errors.name = "Please tell us your full name.";
  }

  if (!data.phone) {
    errors.phone = "We need a number to call you on to arrange the visit.";
  } else if (data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "That does not look like a phone number.";
  }

  if (data.email && !EMAIL.test(data.email)) {
    errors.email = "That does not look like an email address.";
  }

  if (!data.date) {
    errors.date = "Choose a day you would like to visit.";
  } else if (!ISO_DATE.test(data.date) || Number.isNaN(Date.parse(data.date))) {
    errors.date = "That does not look like a date.";
  } else {
    const today = todayInIndia();
    const latest = todayInIndia(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    // ISO dates compare correctly as strings.
    if (data.date < today) errors.date = "Choose a day from today onwards.";
    else if (data.date > latest) errors.date = "Choose a day within the next year.";
  }

  // Unknown values are dropped rather than rejected — they can only come from a
  // tampered form, and the rest of the request is still worth having.
  if (data.time && !timeOptions.includes(data.time)) data.time = "";
  if (data.purpose && !(visitPurposes as readonly string[]).includes(data.purpose)) {
    data.purpose = "";
  }

  return { data, errors };
}

/** "Saturday 14 November 2026" — unambiguous for whoever phones back. */
export function formatVisitDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Plain-text body for the notification email and the Studio record. */
export function formatVisit(data: VisitInput, sourcePath: string): string {
  const lines: [string, string][] = [
    ["Type", "Experience Centre visit request (not yet confirmed)"],
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Preferred date", data.date ? formatVisitDate(data.date) : ""],
    ["Preferred time", data.time],
    ["What brings them", data.purpose],
    ["Sent from", sourcePath],
  ];

  const body = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return data.details ? `${body}\n\nDetails:\n${data.details}` : body;
}
