"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure, isSingleton } from "./sanity/structure";

/**
 * Studio configuration, mounted at /studio by app/studio/[[...tool]]/page.tsx.
 *
 * Vision (the GROQ playground) is included — it is the fastest way to answer
 * "why is this not showing on the site", and it is only reachable by someone
 * already authenticated into the Studio.
 */
export default defineConfig({
  name: "theyurts",
  title: "Theyurts",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons are reached through the sidebar, so keep them out of the
    // global "create new" menu where a second copy could be made by accident.
    templates: (templates) => templates.filter(({ schemaType }) => !isSingleton(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      isSingleton(schemaType)
        ? actions.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
