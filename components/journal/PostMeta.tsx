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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {date ? (
        <time
          dateTime={isoDate(post.publishedAt)}
          className="font-sans text-meta uppercase text-text-muted"
        >
          {date}
        </time>
      ) : null}

      {post.readingTime ? (
        <span className="font-sans text-meta uppercase text-text-muted">
          {post.readingTime} min read
        </span>
      ) : null}

      {post.author?.name ? (
        <span className="font-sans text-meta uppercase text-text-muted">
          {post.author.name}
        </span>
      ) : null}

      {post.categories?.length
        ? post.categories.map((category) =>
            linkCategories ? (
              <Link
                key={category.slug}
                href={`/journal/category/${category.slug}`}
                className="font-sans text-meta uppercase text-accent-text transition-opacity duration-(--duration-quick) hover:opacity-70"
              >
                {category.title}
              </Link>
            ) : (
              <span
                key={category.slug}
                className="font-sans text-meta uppercase text-accent-text"
              >
                {category.title}
              </span>
            ),
          )
        : null}
    </div>
  );
}
