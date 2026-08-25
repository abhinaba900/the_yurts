import createImageUrlBuilder from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Accepts either shape an image arrives in:
 *
 *  - projected by `imageFields`, which flattens the asset and keeps `assetId`
 *  - raw from inside Portable Text, where the block still has `asset._ref`
 *
 * Both are common in one page, and requiring callers to know which they hold
 * would guarantee someone gets it wrong.
 */
type ImageLike = {
  assetId?: string | null;
  asset?: { _ref?: string; _id?: string } | null;
  hotspot?: unknown;
  crop?: unknown;
};

/**
 * Builds a CDN URL for a Sanity image.
 *
 * Always pass a width — the point of going through the builder is that the
 * browser receives a cropped, resized, modern-format image rather than the
 * original upload. The crop follows the hotspot the editor set, so one upload
 * serves the 3:4, 16:9 and 21:9 slots the layouts ask for.
 *
 * Returns null when Sanity is unconfigured or the image is missing, which
 * callers treat the same way — they fall back to the designed placeholder.
 */
export function imageUrl(
  source: ImageLike | null | undefined,
  { width, height, quality = 82 }: { width: number; height?: number; quality?: number },
): string | null {
  if (!builder || !source) return null;

  const ref = source.assetId ?? source.asset?._id ?? source.asset?._ref;
  if (!ref) return null;

  const image = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: ref },
    ...(source.hotspot ? { hotspot: source.hotspot } : {}),
    ...(source.crop ? { crop: source.crop } : {}),
  };

  let url = builder
    .image(image)
    .width(width)
    .quality(quality)
    .auto("format")
    .fit("crop");

  if (height) url = url.height(height);

  return url.url();
}
