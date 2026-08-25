"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CmsImage } from "@/components/page/CmsImage";
import { PostMeta } from "./PostMeta";
import { cn } from "@/lib/cn";
import type { PostSummary } from "@/sanity/lib/types";

/**
 * The filtered article index.
 *
 * Two things happen here:
 *
 * 1. A category filter sits directly under the featured article and narrows the
 *    list below it. Counts are derived from the articles actually in the list
 *    rather than passed in, so a filter can never advertise a number it cannot
 *    then show.
 *
 * 2. The list scrolls in the left column while a single image column stays
 *    pinned on the right, swapping to whichever article is currently under the
 *    reading line. Once the list runs out the pin releases and the page carries
 *    on — the same behaviour the home page uses for Applications and the Range,
 *    so the site has one idea of what a scrolling index feels like rather than
 *    three.
 *
 * The pinned column is desktop-only. Below `lg` there is nowhere to pin
 * anything, so each row carries its own image inline instead.
 */

const ALL = "all";

export function JournalIndex({ posts }: { posts: PostSummary[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [activeIdx, setActiveIdx] = useState(0);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  /** Categories present in this list, with counts that match it exactly. */
  const filters = useMemo(() => {
    const counts = new Map<string, { title: string; slug: string; count: number }>();
    for (const post of posts) {
      for (const category of post.categories ?? []) {
        const existing = counts.get(category.slug);
        counts.set(category.slug, {
          title: category.title,
          slug: category.slug,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [posts]);

  const filtered = useMemo(
    () =>
      activeCategory === ALL
        ? posts
        : posts.filter((post) =>
            post.categories?.some((c) => c.slug === activeCategory),
          ),
    [posts, activeCategory],
  );

  // A filter change rebuilds the list, so the previous index may not exist.
  useEffect(() => {
    setActiveIdx(0);
    rowRefs.current = rowRefs.current.slice(0, filtered.length);
  }, [activeCategory, filtered.length]);

  // Track which row is under the reading line and swap the pinned image to it.
  useEffect(() => {
    const handleScroll = () => {
      const line = window.innerHeight * 0.42;
      for (let i = rowRefs.current.length - 1; i >= 0; i--) {
        const el = rowRefs.current[i];
        if (el && el.getBoundingClientRect().top <= line) {
          setActiveIdx(i);
          return;
        }
      }
      setActiveIdx(0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Lenis drives scrolling on this site; without this the pinned image only
    // updates on native scroll events, which smooth scrolling suppresses.
    const lenis = window.__lenis;
    lenis?.on("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      lenis?.off("scroll", handleScroll);
    };
  }, [filtered.length]);

  const active = filtered[activeIdx] ?? filtered[0];

  return (
    <div>
      {/* -- Filter ---------------------------------------------------------- */}
      <div className="border-t border-line pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-meta uppercase text-text-muted">
            Filter by subject:
          </span>

          <nav aria-label="Filter articles by category">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {[{ title: "All articles", slug: ALL, count: posts.length }, ...filters].map(
                (category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <li key={category.slug}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(category.slug)}
                        aria-pressed={isActive}
                        className={cn(
                          "group relative cursor-pointer py-1 font-sans text-meta uppercase",
                          "transition-colors duration-(--duration-quick)",
                          isActive
                            ? "font-semibold text-accent-text"
                            : "text-text-muted hover:text-text",
                        )}
                      >
                        {category.title}
                        <span className="ml-1.5 text-[10px] opacity-70">
                          ({category.count})
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent-text",
                            "transition-transform duration-(--duration-base) ease-(--ease-reveal)",
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          )}
                        />
                      </button>
                    </li>
                  );
                },
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* -- List left, pinned image right ----------------------------------- */}
      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ul>
            {filtered.map((post, i) => (
              <li
                key={post._id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="border-t border-line last:border-b"
              >
                <Link
                  href={`/journal/${post.slug}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  className="group flex items-start gap-5 py-8 lg:py-10"
                >
                  <span
                    className={cn(
                      "shrink-0 font-sans text-meta uppercase transition-colors duration-300",
                      i === activeIdx
                        ? "font-semibold text-accent-text"
                        : "text-text-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    <h2
                      className={cn(
                        "font-display text-display-sm leading-snug transition-colors duration-300",
                        i === activeIdx
                          ? "text-accent-text"
                          : "text-text group-hover:text-accent-text",
                      )}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt ? (
                      <p className="mt-3 u-measure font-sans text-body text-text-muted leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    ) : null}

                    {/* No pinned column below lg — the image travels with the row. */}
                    <div className="mt-5 overflow-hidden rounded-xs border border-line bg-surface-alt lg:hidden">
                      <CmsImage
                        image={post.heroImage}
                        ratio="landscape"
                        sizes="100vw"
                        width={1000}
                        pendingLabel={`${post.slug}.jpg`}
                        className="h-[200px] w-full object-cover"
                      />
                    </div>

                    <div className="mt-4">
                      <PostMeta post={post} linkCategories={false} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="border-t border-line py-14 font-sans text-body text-text-muted">
              Nothing filed under that subject yet.
            </p>
          ) : null}
        </div>

        {/* Pinned image. Decorative — every article is already reachable from
            the list beside it, so it is not a second tab stop. */}
        <div
          aria-hidden
          className="hidden self-start lg:col-span-5 lg:sticky lg:top-28 lg:block"
        >
          <div className="relative aspect-[4/5] max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-sm border border-line bg-surface-alt shadow-2xl">
            {filtered.map((post, i) => (
              <div
                key={post._id}
                className={cn(
                  "absolute inset-0 h-full w-full transition-all duration-700",
                  "ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === activeIdx
                    ? "z-10 scale-100 opacity-100"
                    : "z-0 scale-105 opacity-0",
                )}
              >
                <CmsImage
                  image={post.heroImage}
                  ratio="editorial"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  width={1400}
                  pendingLabel={`${post.slug}.jpg`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {active ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="font-sans text-meta uppercase text-accent-text">
                {active.categories?.[0]?.title ?? "Journal"}
              </p>
              <span className="font-sans text-meta uppercase text-text-muted">
                {String(activeIdx + 1).padStart(2, "0")} /{" "}
                {String(filtered.length).padStart(2, "0")}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
