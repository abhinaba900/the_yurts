import { defineField, defineType } from "sanity";

/**
 * Singleton. Facts about the company that appear across the whole site.
 *
 * Fields left empty are hidden site-wide rather than rendered blank, so it is
 * always safe to leave something out until it is confirmed.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "sharing", title: "Sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Company name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "general",
      description: "One line. Appears in the browser tab and in search results.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      group: "general",
      description: "The default meta description for pages without their own.",
      validation: (rule) => rule.max(180).warning("Longer than 180 characters will be truncated."),
    }),
    defineField({ name: "contact", type: "contactDetails", group: "contact" }),
    defineField({ name: "social", type: "socialLinks", group: "contact" }),
    defineField({
      name: "defaultShareImage",
      title: "Default share image",
      type: "captionedImage",
      group: "sharing",
      description: "Used when a page has no image of its own. 1200 × 630.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
