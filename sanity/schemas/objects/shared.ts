import { defineField, defineType } from "sanity";

/**
 * Small reusable objects.
 *
 * Specifications are stored as label/value/unit rather than as free text, so the
 * site can set them as typography (`24 FT`, `452 SQ FT`) rather than dumping a
 * sentence into a table cell. Values stay strings — a spec is often a range
 * ("6–8") and forcing a number would push editors into rounding.
 */

export const specRow = defineType({
  name: "specRow",
  title: "Specification",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: 'For example "Diameter", "Floor area", "Sleeps".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      type: "string",
      description: 'The figure only — "24", "452", "6–8". Leave the unit out.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "unit",
      type: "string",
      description: 'The unit only — "ft", "sq ft", "guests". Leave blank if there is none.',
    }),
    defineField({
      name: "note",
      type: "string",
      description: "Optional qualification, shown small beneath the figure.",
    }),
  ],
  preview: {
    select: { label: "label", value: "value", unit: "unit" },
    prepare: ({ label, value, unit }) => ({
      title: label,
      subtitle: [value, unit].filter(Boolean).join(" "),
    }),
  },
});

export const sizeOption = defineType({
  name: "sizeOption",
  title: "Size",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: 'How this size is referred to — for example "5m" or "Large".',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "specs", type: "array", of: [{ type: "specRow" }] }),
    defineField({
      name: "floorPlan",
      title: "Floor plan",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required().error("Alt text is required."),
        }),
      ],
    }),
  ],
  preview: { select: { title: "name" } },
});

export const namedNote = defineType({
  name: "namedNote",
  title: "Item",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});

export const contactDetails = defineType({
  name: "contactDetails",
  title: "Contact",
  type: "object",
  description:
    "Leave a field empty and it is hidden across the whole site rather than shown blank. Never fill one in with a placeholder value.",
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "state", type: "string" }),
    defineField({ name: "postalCode", title: "PIN code", type: "string" }),
    defineField({ name: "mapsUrl", title: "Google Maps link", type: "url" }),
  ],
});

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social",
  type: "object",
  description: "Only add a profile once it exists and has something on it.",
  fields: [
    defineField({ name: "instagram", type: "url" }),
    defineField({ name: "linkedin", type: "url" }),
    defineField({ name: "youtube", type: "url" }),
    defineField({ name: "pinterest", type: "url" }),
  ],
});
