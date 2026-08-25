import Link from "next/link";
import { CmsImage } from "@/components/page/CmsImage";
import { Reveal } from "@/components/primitives/Reveal";
import { PostMeta } from "./PostMeta";
import type { PostSummary } from "@/sanity/lib/types";

/**
 * One article in a list.
 *
 * `feature` gives the first entry a full-width landscape crop and display-large
 * type; everything after it is a hairline row with a small portrait. That
 * difference is what stops the index reading as a grid of identical cards.
 */
export function PostRow({
  post,
  index,
  feature,
}: {
  post: PostSummary;
  index?: number;
  feature?: boolean;
}) {
  if (feature) {
    return (
      <Reveal kind="media" as="li" className="border-t border-line pt-10">
        <Link href={`/journal/${post.slug}`} className="group block">
          <div className="overflow-hidden rounded-sm bg-surface-alt border border-line shadow-xl">
            <CmsImage
              image={post.heroImage}
              ratio="landscape"
              sizes="100vw"
              width={2000}
              priority
              pendingLabel={`${post.slug}.jpg`}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>
          <div className="u-grid mt-8">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <h2 className="font-display text-display-lg u-optical-left group-hover:text-accent-text transition-colors duration-300">
                {post.title}
              </h2>
              {post.excerpt ? (
                <p className="mt-5 u-measure font-sans text-lead text-text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              ) : null}
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
              <PostMeta post={post} linkCategories={false} />
            </div>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal kind="up" as="li" className="border-t border-line last:border-b">
      <Link href={`/journal/${post.slug}`} className="group u-grid items-start gap-y-5 py-8 lg:py-10">
        {typeof index === "number" ? (
          <span className="col-span-1 font-sans text-meta uppercase text-accent-text font-semibold lg:col-span-1">
            {String(index).padStart(2, "0")}
          </span>
        ) : null}

        <div className="col-span-3 md:col-span-5 lg:col-span-6">
          <h2 className="font-display text-display-sm text-text leading-snug group-hover:text-accent-text transition-colors duration-300">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-4">
            <PostMeta post={post} linkCategories={false} />
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-span-3 lg:col-start-10">
          <div className="overflow-hidden rounded-xs bg-surface-alt border border-line shadow-md">
            <CmsImage
              image={post.heroImage}
              ratio="landscape"
              sizes="(min-width: 1024px) 25vw, 100vw"
              width={1000}
              pendingLabel={`${post.slug}.jpg`}
              className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
