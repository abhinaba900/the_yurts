import { defineField, defineType } from "sanity";

/**
 * Per-document SEO overrides. Everything is optional — when a field is empty the
 * page falls back to the document's own title, excerpt and hero image via
 * `pageMetadata()`. Editors should only fill these in when they want something
 * different from the page itself.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Overrides the page title in search results. Aim for under 60 characters.",
      validation: (rule) => rule.max(70).warning("Longer than 70 characters will be truncated by Google."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Overrides the summary shown in search results. Aim for 140–160 characters.",
      validation: (rule) => rule.max(180).warning("Longer than 180 characters will be truncated."),
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "image",
      description: "Shown when the page is shared. 1200 × 630. Falls back to the page hero.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
