import Image from "next/image";
import { cn } from "@/lib/cn";
import { media, type MediaAsset, type MediaId, type MediaRatio } from "@/data/media";

const ratioClass: Record<MediaRatio, string> = {
  portrait: "aspect-portrait",
  editorial: "aspect-editorial",
  landscape: "aspect-landscape",
  cinema: "aspect-cinema",
  panorama: "aspect-panorama",
  square: "aspect-square",
};

const ratioLabel: Record<MediaRatio, string> = {
  portrait: "3:4",
  editorial: "4:5",
  landscape: "16:9",
  cinema: "21:9",
  panorama: "2.6:1",
  square: "1:1",
};

/**
 * The only way an image enters a page. Renders the real photograph once the
 * manifest entry has a `src`, and a designed placeholder until then.
 */
export function Media({
  id,
  className,
  imgClassName,
  sizes = "100vw",
  ratio: ratioOverride,
  parallax,
  quality = 95,
  unoptimized,
  priority,
}: {
  id: MediaId;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  ratio?: MediaRatio;
  /** Slow scroll-linked drift. Full-bleed imagery only. */
  parallax?: boolean;
  quality?: number;
  unoptimized?: boolean;
  priority?: boolean;
}) {
  // Widened to MediaAsset: the manifest is `satisfies`-checked, so each entry
  // narrows to its own literal type and would not expose optional fields.
  const asset: MediaAsset = media[id];
  const ratio = ratioOverride ?? asset.ratio;

  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden",
        ratioClass[ratio],
        className,
      )}
    >
      {asset.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority ?? asset.priority}
          quality={quality}
          unoptimized={unoptimized}
          {...(parallax ? { "data-parallax": "" } : {})}
          className={cn(
            "object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
            imgClassName,
          )}
        />
      ) : (
        <MediaPlaceholder file={asset.file} ratio={ratio} note={asset.note} />
      )}
    </figure>
  );
}

/**
 * Placeholder. Deliberately designed rather than a grey box — it should read as
 * a considered reservation of space, and it should never be mistaken for a
 * finished photograph.
 */
function MediaPlaceholder({
  file,
  ratio,
  note,
}: {
  file: string;
  ratio: MediaRatio;
  note?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder for ${file}`}
      className="absolute inset-0 flex flex-col justify-between bg-surface-deep p-5"
    >
      {/* Fine diagonal weave — canvas, not a checkerboard. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent 0 7px, color-mix(in oklab, var(--color-text-muted) 26%, transparent) 7px 8px)",
        }}
      />
      {/* Corner ticks — a crop mark, the way a layout is marked up. */}
      <div aria-hidden className="pointer-events-none absolute inset-4">
        {(
          [
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ] as const
        ).map((pos) => (
          <span
            key={pos}
            className={cn(
              "absolute size-3 border-line-strong opacity-60",
              pos,
            )}
          />
        ))}
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-sans text-meta uppercase text-text-muted">
          Image pending
        </span>
        <span className="font-sans text-meta uppercase text-text-muted">
          {ratioLabel[ratio]}
        </span>
      </div>

      <div className="relative">
        <p className="font-display text-display-sm text-text-muted">{file}</p>
        {note ? (
          <p className="mt-1.5 max-w-[38ch] font-sans text-small text-text-muted opacity-80">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
