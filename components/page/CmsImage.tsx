import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageUrl } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

const ratioClass = {
  portrait: "aspect-portrait",
  editorial: "aspect-editorial",
  landscape: "aspect-landscape",
  cinema: "aspect-cinema",
  panorama: "aspect-panorama",
  square: "aspect-square",
  auto: "",
} as const;

export type CmsRatio = keyof typeof ratioClass;

const ratioLabel: Record<CmsRatio, string> = {
  portrait: "3:4",
  editorial: "4:5",
  landscape: "16:9",
  cinema: "21:9",
  panorama: "2.6:1",
  square: "1:1",
  auto: "",
};

/**
 * An image from the CMS, in a crop the layout has already reserved.
 *
 * When the field is empty it renders the same designed placeholder the static
 * `<Media>` component uses, so a product published before its photography
 * arrives looks deliberately unfinished rather than broken — and the page does
 * not shift when the picture lands.
 *
 * The crop comes from the editor's hotspot, so one upload serves every ratio the
 * layouts ask for.
 */
export function CmsImage({
  image,
  ratio = "landscape",
  sizes = "100vw",
  width = 2400,
  priority,
  quality = 100,
  unoptimized = true,
  pendingLabel,
  className,
}: {
  image: SanityImage | null | undefined;
  ratio?: CmsRatio;
  sizes?: string;
  width?: number;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  /** Shown on the placeholder when there is no image. */
  pendingLabel?: string;
  className?: string;
}) {
  let src = imageUrl(image, { width });
  if (!src && image?.url) {
    src = image.url;
  }
  if (!src && typeof image?.assetId === "string" && (image.assetId.startsWith("/") || image.assetId.startsWith("http"))) {
    src = image.assetId;
  }

  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden",
        ratioClass[ratio],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={image?.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          placeholder={image?.lqip ? "blur" : undefined}
          blurDataURL={image?.lqip ?? undefined}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={pendingLabel ? `Image pending: ${pendingLabel}` : "Image pending"}
          className="absolute inset-0 flex flex-col justify-between bg-surface-deep p-5"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent 0 7px, color-mix(in oklab, var(--color-text-muted) 26%, transparent) 7px 8px)",
            }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <span className="font-sans text-meta uppercase text-text-muted">
              Image pending
            </span>
            {ratioLabel[ratio] ? (
              <span className="font-sans text-meta uppercase text-text-muted">
                {ratioLabel[ratio]}
              </span>
            ) : null}
          </div>
          {pendingLabel ? (
            <p className="relative font-display text-display-sm text-text-muted">
              {pendingLabel}
            </p>
          ) : null}
        </div>
      )}
    </figure>
  );
}
