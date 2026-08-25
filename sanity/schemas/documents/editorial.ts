import { defineField, defineType } from "sanity";

/**
 * A Journal article.
 *
 * Reading time is stored rather than computed on the fly so the number shown to
 * a reader is stable and an editor can override it — an article that is mostly
 * photographs reads far faster than its word count implies.
 */
export const post = defineType({
  name: "post",
  title: "Journal article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
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
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown on the Journal index and in search results.",
      validation: (rule) => rule.max(240).warning("Keep it under 240 characters."),
    }),
    defineField({ name: "heroImage", type: "captionedImage", group: "content" }),
    defineField({ name: "body", type: "blockContent", group: "content" }),

    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
    }),
    defineField({
      name: "publishedAt",
      title: "Published on",
      type: "datetime",
      group: "meta",
      description:
        "Articles with a date in the future are not shown on the site until that date passes.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      type: "number",
      group: "meta",
      validation: (rule) => rule.min(1).max(90),
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "postCategory" }] }],
      group: "meta",
    }),
    defineField({
      name: "related",
      title: "Related articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      group: "meta",
      description: "Leave empty to fall back to the most recent articles in the same category.",
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "heroImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toISOString().slice(0, 10) : "No date",
      media,
    }),
  },
});

/**
 * A completed installation.
 *
 * `published` defaults to false. Theyurts has no finished installations yet, and
 * the gallery must not show one until a real project has been handed over and
 * the client has agreed it can be shown.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
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
      name: "published",
      title: "Show on the site",
      type: "boolean",
      group: "content",
      initialValue: false,
      description:
        "Off until the installation is complete and the client has agreed it can be shown.",
    }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content" }),
    defineField({ name: "story", title: "Project story", type: "blockContent", group: "content" }),

    defineField({ name: "location", type: "string", group: "details" }),
    defineField({
      name: "projectType",
      title: "Type",
      type: "string",
      group: "details",
      options: {
        list: [
          "Resort",
          "Glamping site",
          "Farm stay",
          "Wellness retreat",
          "Event space",
          "Private residence",
          "Other",
        ],
      },
    }),
    defineField({
      name: "products",
      title: "Yurts used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      group: "details",
    }),
    defineField({ name: "specs", type: "array", of: [{ type: "specRow" }], group: "details" }),
    defineField({ name: "clientName", title: "Client", type: "string", group: "details" }),
    defineField({ name: "completedAt", title: "Completed", type: "date", group: "details" }),
    defineField({
      name: "testimonial",
      type: "object",
      group: "details",
      description: "Only ever the client's own words, with their permission.",
      fields: [
        defineField({ name: "quote", type: "text", rows: 4 }),
        defineField({ name: "attribution", type: "string" }),
        defineField({ name: "role", type: "string" }),
      ],
    }),

    defineField({ name: "heroImage", type: "captionedImage", group: "media" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "captionedImage" }], group: "media" }),
    defineField({ name: "floorPlans", type: "array", of: [{ type: "captionedImage" }], group: "media" }),
    defineField({
      name: "videoUrl",
      title: "Video",
      type: "url",
      group: "media",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", location: "location", media: "heroImage", published: "published" },
    prepare: ({ title, location, media, published }) => ({
      title,
      subtitle: `${published ? "" : "Hidden — "}${location ?? ""}`,
      media,
    }),
  },
});
