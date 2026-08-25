import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Rich text.
 *
 * The style list is short on purpose. Editors get the levels the design system
 * actually renders — anything more and articles start arriving with type the
 * site cannot set. No text colours, no font sizes, no alignment.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Body", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Lead", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Italic", value: "em" },
          { title: "Bold", value: "strong" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              }),
            ],
          }),
          defineArrayMember({
            name: "internalLink",
            title: "Link to a page on this site",
            type: "object",
            fields: [
              defineField({
                name: "reference",
                type: "reference",
                to: [
                  { type: "product" },
                  { type: "application" },
                  { type: "post" },
                  { type: "project" },
                ],
              }),
            ],
          }),
        ],
      },
    }),

    defineArrayMember({
      name: "figure",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "What the image shows, for screen readers and search. Describe it; do not repeat the caption.",
          validation: (rule) => rule.required().error("Alt text is required on every image."),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({
          name: "width",
          title: "Width",
          type: "string",
          options: {
            list: [
              { title: "Column", value: "column" },
              { title: "Wide", value: "wide" },
              { title: "Full bleed", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "column",
        }),
      ],
    }),

    defineArrayMember({
      name: "videoEmbed",
      title: "Video",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "YouTube or Vimeo URL",
          type: "url",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      preview: {
        select: { title: "url" },
        prepare: ({ title }) => ({ title: "Video", subtitle: title }),
      },
    }),

    defineArrayMember({
      name: "pullQuote",
      title: "Pull quote",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "attribution", type: "string" }),
      ],
      preview: {
        select: { title: "quote" },
        prepare: ({ title }) => ({ title: "Pull quote", subtitle: title }),
      },
    }),
  ],
});
