"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CmsImage } from "@/components/page/CmsImage";
import { PostMeta } from "./PostMeta";
import { cn } from "@/lib/cn";
import type { PostSummary } from "@/sanity/lib/types";

/**
 * The article index.
 *
 * The list scrolls in the left column while a single image column stays
 * pinned on the right, swapping to whichever article is currently under the
 * reading line. Once the list runs out the pin releases and the page carries
 * on — the same behaviour the home page uses for Applications and the Range,
 * so the site has one idea of what a scrolling index feels like rather than
 * three.
 *
 * The pinned column is desktop-only. Below `lg` there is nowhere to pin
 * anything, so each row carries its own image inline instead.
 */

export function JournalIndex({ posts }: { posts: PostSummary[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setActiveIdx(0);
    rowRefs.current = rowRefs.current.slice(0, posts.length);
  }, [posts.length]);

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
  }, [posts.length]);

  const active = posts[activeIdx] ?? posts[0];

  return (
    <div>
      {/* -- List left, pinned image right ----------------------------------- */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ul>
            {posts.map((post, i) => (
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
                  className="group flex items-start gap-3.5 sm:gap-5 py-6 sm:py-8 lg:py-10"
                >
                  <span
                    className={cn(
                      "shrink-0 font-sans text-meta uppercase pt-0.5 transition-colors duration-300",
                      i === activeIdx
                        ? "font-semibold text-accent-text"
                        : "text-text-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h2
                      className={cn(
                        "font-display text-xl sm:text-display-sm leading-snug transition-colors duration-300",
                        i === activeIdx
                          ? "text-accent-text"
                          : "text-text group-hover:text-accent-text",
                      )}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt ? (
                      <p className="mt-2.5 sm:mt-3 u-measure font-sans text-body text-text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {post.excerpt}
                      </p>
                    ) : null}

                    {/* No pinned column below lg — the image travels with the row. */}
                    <div className="mt-4 sm:mt-5 overflow-hidden rounded-xs border border-line bg-surface-alt lg:hidden">
                      <CmsImage
                        image={post.heroImage}
                        ratio="landscape"
                        sizes="100vw"
                        width={1000}
                        pendingLabel={`${post.slug}.jpg`}
                        className="h-[180px] sm:h-[220px] w-full object-cover"
                      />
                    </div>

                    <div className="mt-3.5 sm:mt-4">
                      <PostMeta post={post} linkCategories={false} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {posts.length === 0 ? (
            <p className="border-t border-line py-14 font-sans text-body text-text-muted">
              No articles published yet.
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
            {posts.map((post, i) => (
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
                  image={post.verticalImage ?? post.heroImage}
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
                {String(posts.length).padStart(2, "0")}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
