"use client";

import dynamic from "next/dynamic";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * Loads the 360° viewer on demand, so three.js and the WebXR layer are
 * downloaded only by someone who has opened this page.
 */
const VrExperience = dynamic(
  () => import("./VrExperience").then((mod) => mod.VrExperience),
  { ssr: false, loading: () => <VrSkeleton /> },
);

function VrSkeleton() {
  return (
    <div>
      <div className="relative h-[64svh] w-full bg-walnut-deep landscape-split:h-[calc(100svh-4rem)] lg:h-[calc(100svh-6rem)]">
        <div className="absolute inset-x-0 top-0 p-5">
          <Metadata className="text-accent-text">Preparing the view</Metadata>
        </div>
      </div>
      <div className="u-container py-(--spacing-block)">
        <Metadata className="text-accent-text">Viewpoints</Metadata>
        <p className="mt-4 font-display text-display-md">Stand inside one.</p>
      </div>
    </div>
  );
}

export function VrLoader() {
  return <VrExperience />;
}
