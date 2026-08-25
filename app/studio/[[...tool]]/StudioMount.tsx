"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Mounts the Studio. Split into its own client component so that importing
 * `sanity.config` — which throws without a project id — only happens on the
 * branch where one exists.
 */
export function StudioMount() {
  return <NextStudio config={config} />;
}
