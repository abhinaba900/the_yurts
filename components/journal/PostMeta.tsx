import Link from "next/link";
import { formatDate, isoDate } from "@/lib/format";
import type { PostSummary } from "@/sanity/lib/types";

/**
 * The metadata line under an article title: date, reading time, categories.
 * Every part is optional — an article can be published before its author record
 * exists, or without categories.
 */
export function PostMeta({
  post,
  linkCategories = true,
}: {
  post: Pick<PostSummary, "publishedAt" | "readingTime" | "categories" | "author">;
  linkCategories?: boolean;
}) {
  const date = formatDate(post.publishedAt);

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3.5 gap-y-1 font-sans text-meta uppercase text-text-muted">
      {date ? (
        <time dateTime={isoDate(post.publishedAt)}>
          {date}
        </time>
      ) : null}

      {post.readingTime ? (
        <>
          <span aria-hidden="true" className="opacity-35 select-none">&middot;</span>
          <span>{post.readingTime} min read</span>
        </>
      ) : null}

      {post.author?.name ? (
        <>
          <span aria-hidden="true" className="opacity-35 select-none">&middot;</span>
          <span>{post.author.name}</span>
        </>
      ) : null}

      {post.categories?.length
        ? post.categories.map((category) => (
            <span key={category.slug} className="inline-flex items-center gap-x-2.5 sm:gap-x-3.5">
              <span aria-hidden="true" className="opacity-35 select-none">&middot;</span>
              {linkCategories ? (
                <Link
                  href={`/journal/category/${category.slug}`}
                  className="text-accent-text transition-opacity duration-(--duration-quick) hover:opacity-70"
                >
                  {category.title}
                </Link>
              ) : (
                <span className="text-accent-text">
                  {category.title}
                </span>
              )}
            </span>
          ))
        : null}
    </div>
  );
}
