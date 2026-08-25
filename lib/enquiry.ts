/**
 * Enquiry shape and validation.
 *
 * Hand-rolled rather than pulling in a schema library: there are eight fields,
 * the rules are simple, and this runs on the server where every byte of
 * dependency is one more thing to keep patched.
 *
 * Validation runs on the server regardless of what the browser did. The client
 * never decides whether something is valid.
 */

export const enquiryKinds = [
  "general",
  "quote",
  "product",
  "consultation",
  "brochure",
  "configuration",
] as const;

export type EnquiryKind = (typeof enquiryKinds)[number];

/** Maps to the `enquiryType` list in the Sanity schema. */
export const kindLabels: Record<EnquiryKind, string> = {
  general: "General",
  quote: "Request a quote",
  product: "Product enquiry",
  consultation: "Consultation",
  brochure: "Brochure download",
  configuration: "3D configuration",
};

export type EnquiryInput = {
  kind: EnquiryKind;
  name: string;
  email: string;
  phone: string;
  interest: string;
  location: string;
  message: string;
  /** Carried through from the builder, a product page, or a resource. */
  product: string;
  configuration: string;
  resource: string;
  sourcePath: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  /** Shown above the form. */
  message?: string;
  errors?: FieldErrors;
  /** Echoed back so a failed submission does not empty the form. */
  values?: Partial<EnquiryInput>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: FormDataEntryValue | null, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function parseEnquiry(formData: FormData): {
  data: EnquiryInput;
  errors: FieldErrors;
} {
  const kindRaw = text(formData.get("kind"), 32) as EnquiryKind;

  const data: EnquiryInput = {
    kind: enquiryKinds.includes(kindRaw) ? kindRaw : "general",
    name: text(formData.get("name"), 120),
    email: text(formData.get("email"), 200),
    phone: text(formData.get("phone"), 40),
    interest: text(formData.get("interest"), 80),
    location: text(formData.get("location"), 160),
    message: text(formData.get("message"), 4000),
    product: text(formData.get("product"), 120),
    configuration: text(formData.get("configuration"), 400),
    resource: text(formData.get("resource"), 120),
    sourcePath: text(formData.get("sourcePath"), 200),
  };

  const errors: FieldErrors = {};

  if (data.name.length < 2) {
    errors.name = "Please tell us what to call you.";
  }

  if (!data.email) {
    errors.email = "We need an email address to reply to.";
  } else if (!EMAIL.test(data.email)) {
    errors.email = "That does not look like an email address.";
  }

  // Phone is optional, but if given it should be plausible.
  if (data.phone && data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "That does not look like a phone number.";
  }

  // A consultation is a conversation about a specific site, so it needs one.
  if (data.kind === "consultation" && data.location.length < 2) {
    errors.location = "Tell us roughly where the site is.";
  }

  // A brochure request is just a delivery address for a file — no message
  // needed. Everything else should say something.
  if (data.kind !== "brochure" && data.message.length < 10) {
    errors.message = "A sentence or two about the project, please.";
  }

  return { data, errors };
}

/** Plain-text body for the notification email and the Studio record. */
export function formatEnquiry(data: EnquiryInput): string {
  const lines: [string, string][] = [
    ["Type", kindLabels[data.kind]],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Interest", data.interest],
    ["Site location", data.location],
    ["Yurt", data.product],
    ["Resource", data.resource],
    ["Configuration", data.configuration],
    ["Sent from", data.sourcePath],
  ];

  const details = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return data.message ? `${details}\n\nMessage:\n${data.message}` : details;
}
