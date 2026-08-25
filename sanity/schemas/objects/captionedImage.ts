import { defineField, defineType } from "sanity";

/**
 * The standard image. Alt text is required everywhere, without exception —
 * it is the one accessibility decision that cannot be retrofitted later, and
 * making it optional guarantees it never gets written.
 *
 * Hotspot is on so the site can crop the same asset to 3:4, 16:9 or 21:9 without
 * an editor re-uploading it.
 */
export const captionedImage = defineType({
  name: "captionedImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what the image shows, for screen readers and search engines.",
      validation: (rule) =>
        rule.required().error("Alt text is required on every image."),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});
