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
 * The loading state is laid out like the finished page — stage, stepper, step,
 * back and next — so nothing jumps when it arrives.
 */
function BuilderSkeleton() {
  return (
    <div className="landscape-split:grid landscape-split:h-[calc(100svh-4rem)] landscape-split:grid-cols-[minmax(0,1fr)_22rem] lg:grid lg:h-[calc(100svh-8.25rem)] lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_25rem] xl:grid-cols-[minmax(0,1fr)_28rem]">
      <div className="relative h-[44svh] min-h-[18rem] bg-surface-alt landscape-split:h-full lg:h-full">
        <div className="absolute left-0 top-0 p-4 lg:p-6">
          <Metadata className="text-accent-text">3D yurt builder</Metadata>
          <p className="mt-1.5 font-display text-display-sm leading-none">Your yurt</p>
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <Metadata>Preparing the model</Metadata>
        </div>
      </div>
      <div className="border-line landscape-split:border-l lg:border-l" aria-hidden>
        <div className="flex justify-between border-b border-line px-6 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="size-7 rounded-full border border-line-strong" />
          ))}
        </div>
        <div className="px-6 pt-7">
          <div className="h-3 w-20 bg-surface-deep" />
          <div className="mt-4 h-7 w-48 bg-surface-deep" />
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="h-56 border border-line" />
            <div className="h-56 border border-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderLoader({ groups }: { groups: GroupDef[] }) {
  return <BuilderExperience groups={groups} />;
}
