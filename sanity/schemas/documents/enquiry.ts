import { defineField, defineType } from "sanity";

/**
 * An enquiry submitted through the site.
 *
 * Written by the server actions in Phase 8, never created by hand — the Studio
 * is where they are read and worked through, so the client has one place for
 * content and leads rather than a separate inbox.
 *
 * `configuration` holds the 3D builder output as JSON when the enquiry came from
 * the configurator, so the first reply can be about something specific.
 *
 * This document holds personal data. It is excluded from every public query and
 * from the sitemap, and the dataset must be private.
 */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({
      name: "enquiryType",
      title: "Type",
      type: "string",
      options: {
        list: [
          "General",
          "Request a quote",
          "Product enquiry",
          "Consultation",
          "Brochure download",
          "3D configuration",
        ],
      },
    }),
    defineField({ name: "location", title: "Site location", type: "string" }),
    defineField({ name: "message", type: "text", rows: 6 }),
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Set when the enquiry came from a specific yurt's page.",
    }),
    defineField({
      name: "configuration",
      title: "3D configuration",
      type: "text",
      rows: 8,
      description: "JSON from the configurator, when the enquiry came from it.",
    }),
    defineField({
      name: "sourcePath",
      title: "Sent from",
      type: "string",
      description: "The page the enquiry was submitted from.",
    }),
    defineField({ name: "submittedAt", title: "Received", type: "datetime" }),
    defineField({
      name: "status",
      type: "string",
      readOnly: false,
      options: {
        list: ["New", "In progress", "Quoted", "Won", "Closed"],
        layout: "radio",
      },
      initialValue: "New",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 4,
      readOnly: false,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "enquiryType", date: "submittedAt", status: "status" },
    prepare: ({ title, subtitle, date, status }) => ({
      title: title || "Unnamed enquiry",
      subtitle: [status, subtitle, date ? new Date(date).toISOString().slice(0, 10) : null]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
