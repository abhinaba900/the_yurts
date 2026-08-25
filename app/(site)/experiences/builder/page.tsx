import { pageMetadata } from "@/lib/seo";
import { getConfiguratorOptions } from "@/sanity/lib/content";
import { resolveGroups } from "@/lib/configurator";
import { BuilderLoader } from "@/components/builder/BuilderLoader";

export const metadata = pageMetadata({
  title: "3D yurt builder",
  description:
    "Configure a yurt in 3D — size, exterior, roof, doors, windows, flooring and interior — and send the configuration with your enquiry.",
  path: "/experiences/builder",
});

/**
 * The 3D builder.
 *
 * The page itself is a server component that only resolves which options exist.
 * Everything three-dimensional is loaded on demand by `BuilderLoader`, so this
 * route costs a visitor nothing until they open it.
 */
export default async function BuilderPage() {
  const cmsOptions = await getConfiguratorOptions();
  const groups = resolveGroups(cmsOptions);

  return (
    <>
      {/*
        The visible headings live inside a component that is loaded on demand
        and never server-rendered, so without this the page ships to crawlers
        and to assistive technology with no h1 at all. Visually hidden because
        the stage fills the screen and has nowhere to put a heading — but it is
        the page's real title, and it is in the HTML from the first byte.
      */}
      <h1 className="sr-only">
        3D yurt builder — configure a yurt and send it with your enquiry
      </h1>
      <BuilderLoader groups={groups} />
    </>
  );
}
