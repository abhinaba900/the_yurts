import { defineField, defineType } from "sanity";

/**
 * A yurt in the range.
 *
 * Every factual field is optional. The product template renders only the
 * sections that have content, so a product can be published with a name and a
 * description while its specifications are still being confirmed — rather than
 * forcing an editor to invent a figure to get past validation.
 */
export const product = defineType({
  name: "product",
  title: "Yurt",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "specs", title: "Specifications" },
    { name: "options", title: "Options" },
    { name: "support", title: "Downloads & questions" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "productCategory" }],
      group: "content",
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "content",
      description: "One short line, shown under the name.",
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 4,
      group: "content",
      description: "A paragraph. Used on the range page and in search results.",
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "blockContent",
      group: "content",
    }),

    defineField({
      name: "heroImage",
      type: "captionedImage",
      group: "media",
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "captionedImage" }],
      group: "media",
    }),

    defineField({
      name: "specs",
      title: "Headline specifications",
      type: "array",
      of: [{ type: "specRow" }],
      group: "specs",
      description:
        "The three or four figures shown large at the top of the page. Detailed figures belong under Sizes.",
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [{ type: "sizeOption" }],
      group: "specs",
    }),
    defineField({
      name: "technical",
      title: "Technical notes",
      type: "blockContent",
      group: "specs",
    }),

    defineField({
      name: "materials",
      type: "array",
      of: [{ type: "namedNote" }],
      group: "options",
    }),
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "namedNote" }],
      group: "options",
    }),
    defineField({
      name: "customisation",
      title: "Customisation options",
      type: "array",
      of: [{ type: "namedNote" }],
      group: "options",
    }),
    defineField({
      name: "interiorOptions",
      title: "Interior options",
      type: "array",
      of: [{ type: "namedNote" }],
      group: "options",
    }),
    defineField({
      name: "applications",
      title: "Suited to",
      type: "array",
      of: [{ type: "reference", to: [{ type: "application" }] }],
      group: "options",
    }),

    defineField({
      name: "downloads",
      type: "array",
      of: [{ type: "reference", to: [{ type: "resource" }] }],
      group: "support",
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
      group: "support",
    }),

    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first in the range.",
      initialValue: 100,
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Range order",
      name: "rangeOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "heroImage" },
  },
});
