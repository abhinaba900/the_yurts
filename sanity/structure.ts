import type { StructureResolver } from "sanity/structure";

/**
 * Studio navigation.
 *
 * Grouped the way the client thinks about the site — the range, what it is for,
 * writing, then the things that support them — rather than as a flat alphabetical
 * list of document types. Enquiries sit at the bottom, separated, because they
 * are the one place personal data lives.
 */

const SINGLETONS = ["siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Theyurts")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.listItem()
        .title("The range")
        .child(
          S.list()
            .title("The range")
            .items([
              S.documentTypeListItem("product").title("Yurts"),
              S.documentTypeListItem("productCategory").title("Categories"),
              S.documentTypeListItem("configuratorOption").title("Configurator options"),
            ]),
        ),

      S.documentTypeListItem("application").title("Applications"),
      S.documentTypeListItem("project").title("Projects"),

      S.divider(),

      S.listItem()
        .title("Journal")
        .child(
          S.list()
            .title("Journal")
            .items([
              S.documentTypeListItem("post").title("Articles"),
              S.documentTypeListItem("postCategory").title("Categories"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("faq").title("Questions"),
      S.documentTypeListItem("resource").title("Resources"),

      S.divider(),

      S.documentTypeListItem("enquiry").title("Enquiries"),
    ]);

/** Singletons are edited in place, never created or deleted from a list. */
export const isSingleton = (type: string) => SINGLETONS.includes(type);
