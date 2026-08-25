"use client";

import dynamic from "next/dynamic";
import type { GroupDef } from "@/lib/configurator";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * Loads the configurator on demand.
 *
 * Three.js and the scene are a large dependency, and they are downloaded only by
 * someone who has actually opened this page — nothing about the 3D reaches the
 * rest of the site's bundle. `ssr: false` because the scene needs a canvas and a
 * DOM, and pre-rendering it would produce nothing useful.
 */
const BuilderExperience = dynamic(
  () => import("./BuilderExperience").then((mod) => mod.BuilderExperience),
  {
    ssr: false,
    loading: () => <BuilderSkeleton />,
  },
);

/**
 * The loading state is laid out like the finished page, so nothing jumps when it
 * arrives. A spinner in the middle of an empty screen would be worse.
 */
function BuilderSkeleton() {
  return (
    <div className="landscape-split:flex lg:flex lg:min-h-[calc(100svh-5rem)]">
      <div className="relative h-[52svh] w-full bg-surface-alt landscape-split:h-[calc(100svh-5rem)] landscape-split:w-[58%] landscape-split:shrink-0 lg:h-[calc(100svh-5rem)] lg:w-[58%] lg:shrink-0">
        <div className="absolute inset-0 flex items-end p-5">
          <Metadata>Preparing the model</Metadata>
        </div>
      </div>
      <div className="landscape-split:w-[42%] lg:w-[42%]">
        <div className="u-container py-14 lg:px-10 lg:py-16">
          <Metadata className="text-accent-text">Build one</Metadata>
          <p className="mt-4 font-display text-display-md">Your yurt.</p>
          <div className="mt-12 space-y-6" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-t border-line pt-4">
                <div className="h-3 w-24 bg-surface-deep" />
                <div className="mt-4 h-3 w-full bg-surface-deep opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderLoader({ groups }: { groups: GroupDef[] }) {
  return <BuilderExperience groups={groups} />;
}
