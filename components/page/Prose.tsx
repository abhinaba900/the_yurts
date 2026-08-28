import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { cn } from "@/lib/cn";
import { imageUrl } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

/**
 * Renders rich text from the CMS in the site's own typography.
 *
 * There is no `prose` utility class and no typography plugin — every element is
 * mapped explicitly to the design system. Editors cannot introduce styling the
 * site does not have, because there is nowhere for it to land.
 */

const widthClass = {
  column: "u-measure",
  wide: "u-measure-wide lg:-mx-12",
  full: "lg:-mx-24",
} as const;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="u-measure font-sans text-body text-text-muted [&:not(:first-child)]:mt-5">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 font-display text-display-md u-optical-left first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-display text-display-sm first:mt-0">{children}</h3>
    ),
    // Styled as a lead paragraph rather than an indented quote — it is used to
    // open a section, which is what editors reach for it to do.
    blockquote: ({ children }) => (
      <p className="mt-8 u-measure font-sans text-lead text-text first:mt-0">
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 u-measure space-y-2.5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 u-measure space-y-2.5">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-4 border-t border-line pt-2.5 font-sans text-body text-text-muted">
        <span aria-hidden className="text-accent-text">
          &mdash;
        </span>
        <span>{children}</span>
      </li>
    ),
    number: ({ children, index }) => (
      <li className="flex gap-4 border-t border-line pt-2.5 font-sans text-body text-text-muted">
        <span aria-hidden className="font-sans text-meta uppercase text-accent-text">
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>
        <span>{children}</span>
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="text-text">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noreferrer" : undefined}
        className="border-b border-line-strong text-text transition-colors duration-(--duration-quick) hover:border-accent hover:text-accent-text"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => {
      const slug = value?.reference?.slug?.current;
      const type = value?.reference?._type;
      const base =
        type === "product"
          ? "/yurts"
          : type === "application"
            ? "/applications"
            : type === "post"
              ? "/journal"
              : "/projects";

      if (!slug) return <>{children}</>;

      return (
        <Link
          href={`${base}/${slug}`}
          className="border-b border-line-strong text-text transition-colors duration-(--duration-quick) hover:border-accent hover:text-accent-text"
        >
          {children}
        </Link>
      );
    },
  },

  types: {
    figure: ({ value }) => {
      const image = value as SanityImage & { width?: keyof typeof widthClass };
      const src = imageUrl(value, { width: 1800 });
      if (!src) return null;

      return (
        <figure className={cn("mt-12", widthClass[image.width ?? "column"])}>
          <Image
            src={src}
            alt={image.alt ?? ""}
            width={2400}
            height={Math.round(2400 / (image.aspectRatio || 1.5))}
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={100}
            unoptimized={true}
            className="w-full"
            placeholder={image.lqip ? "blur" : undefined}
            blurDataURL={image.lqip ?? undefined}
          />
          {image.caption ? (
            <figcaption className="mt-4 font-sans text-meta uppercase text-text-muted">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    videoEmbed: ({ value }) => {
      const embed = toEmbedUrl(value?.url);
      if (!embed) return null;

      return (
        <figure className="mt-12 u-measure-wide">
          <div className="relative aspect-landscape w-full overflow-hidden bg-surface-deep">
            <iframe
              src={embed}
              title={value?.caption ?? "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 size-full border-0"
            />
          </div>
          {value?.caption ? (
            <figcaption className="mt-4 font-sans text-meta uppercase text-text-muted">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    pullQuote: ({ value }) => (
      <figure className="mt-14 border-t border-line pt-8">
        <blockquote className="u-measure-wide font-display text-display-md">
          {value?.quote}
        </blockquote>
        {value?.attribution ? (
          <figcaption className="mt-5 font-sans text-meta uppercase text-text-muted">
            {value.attribution}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
};

/** Converts a YouTube or Vimeo watch URL into its embed form. */
function toEmbedUrl(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function Prose({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value?.length) return null;

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
