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
          <div className="overflow-hidden">
            <CmsImage
              image={post.heroImage}
              ratio="landscape"
              sizes="100vw"
              width={2000}
              pendingLabel={`${post.slug}.jpg`}
              className="transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
            />
          </div>
          <div className="u-grid mt-8">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <h2 className="font-display text-display-lg u-optical-left">
                {post.title}
              </h2>
              {post.excerpt ? (
                <p className="mt-6 u-measure font-sans text-lead text-text-muted">
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
          <span className="col-span-1 font-sans text-meta uppercase text-text-muted lg:col-span-1">
            {String(index).padStart(2, "0")}
          </span>
        ) : null}

        <div className="col-span-3 md:col-span-5 lg:col-span-6">
          <h2 className="font-display text-display-sm">{post.title}</h2>
          {post.excerpt ? (
            <p className="mt-3 u-measure font-sans text-body text-text-muted">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-4">
            <PostMeta post={post} linkCategories={false} />
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-span-3 lg:col-start-10">
          <div className="overflow-hidden">
            <CmsImage
              image={post.heroImage}
              ratio="editorial"
              sizes="(min-width: 1024px) 24vw, 100vw"
              width={800}
              pendingLabel={`${post.slug}.jpg`}
              className="transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
