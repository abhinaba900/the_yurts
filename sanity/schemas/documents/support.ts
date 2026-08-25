import { defineField, defineType } from "sanity";

export const application = defineType({
  name: "application",
  title: "Application",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "line",
      title: "One-line summary",
      type: "string",
      group: "content",
      description: "Shown beside the name in the applications index. Keep it short.",
    }),
    defineField({ name: "summary", type: "text", rows: 4, group: "content" }),
    defineField({ name: "heroImage", type: "captionedImage", group: "content" }),
    defineField({ name: "body", type: "blockContent", group: "content" }),
    defineField({
      name: "considerations",
      title: "What to think about",
      type: "array",
      of: [{ type: "namedNote" }],
      group: "content",
    }),
    defineField({
      name: "products",
      title: "Suggested yurts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      group: "content",
    }),
    defineField({ name: "order", title: "Sort order", type: "number", group: "content", initialValue: 100 }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "line", media: "heroImage" } },
});

/**
 * A question and its answer.
 *
 * The answer is required. A published FAQ entry with no answer is worse than no
 * entry at all, so the schema will not let one exist — the way to have a
 * question with no answer yet is simply not to create it.
 */
export const faq = defineType({
  name: "faq",
  title: "Question",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "answer",
      type: "blockContent",
      validation: (r) => r.required().error("An answer is required before this can be published."),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          "Construction",
          "Installation",
          "Pricing",
          "Customisation",
          "Materials",
          "Maintenance",
          "Lifespan",
          "Weather",
          "Transportation",
          "Delivery",
          "Warranty",
          "Support",
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 100 }),
  ],
  orderings: [
    {
      title: "Category, then order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Catalogue", "Specifications", "Brochure", "Guide", "Technical", "Other"],
      },
    }),
    defineField({ name: "coverImage", type: "captionedImage" }),
    defineField({
      name: "file",
      type: "file",
      options: { accept: ".pdf" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gated",
      title: "Ask for an email first",
      type: "boolean",
      initialValue: false,
      description:
        "When on, the visitor gives a name and email before the download is released.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});

/**
 * Options for the 3D configurator.
 *
 * Kept as content rather than hard-coded so the range of finishes can change
 * without a deploy. `assetKey` is the contract with the 3D scene — it names the
 * material or mesh the option maps to, and Phase 6 reads it.
 */
export const configuratorOption = defineType({
  name: "configuratorOption",
  title: "Configurator option",
  type: "document",
  fields: [
    defineField({
      name: "group",
      type: "string",
      options: {
        list: [
          { title: "Size", value: "size" },
          { title: "Exterior", value: "exterior" },
          { title: "Roof", value: "roof" },
          { title: "Doors", value: "doors" },
          { title: "Windows", value: "windows" },
          { title: "Flooring", value: "flooring" },
          { title: "Interior package", value: "interior" },
          { title: "Furniture", value: "furniture" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "string" }),
    defineField({
      name: "assetKey",
      title: "3D asset key",
      type: "string",
      description:
        "Names the material or mesh in the 3D scene this option maps to. Must match the model exactly.",
    }),
    defineField({ name: "swatch", title: "Swatch", type: "captionedImage" }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 100 }),
    defineField({ name: "isDefault", title: "Selected by default", type: "boolean", initialValue: false }),
  ],
  orderings: [
    {
      title: "Group, then order",
      name: "groupOrder",
      by: [
        { field: "group", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "label", subtitle: "group", media: "swatch" } },
});
