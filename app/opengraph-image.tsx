import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card — the hero banner, with the wordmark and tagline held over
 * the bottom of it so a shared link is recognisable at thumbnail size.
 *
 * Every page inherits this: `pageMetadata` points og:image and twitter:image at
 * `/opengraph-image` unless a page supplies its own share image, so this file is
 * the one place the default preview is decided.
 *
 * Individual pages can still override it by exporting their own
 * `opengraph-image`.
 */

/** The same photograph the homepage opens with (`home.hero` in data/media.ts). */
const BANNER = "hero-yurt.jpg";

async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  // Fetched at build time. If it is unavailable the card still renders in the
  // fallback face rather than failing the build.
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Read off disk rather than over HTTP: this runs at build time, when the site
 * is not yet serving itself. JPEG rather than the .webp the page uses — the
 * image renderer does not decode WebP.
 */
async function loadBanner(): Promise<string | null> {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "media", BANNER),
    );
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [font, banner] = await Promise.all([loadDisplayFont(), loadBanner()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          // Stands in for the photograph if it cannot be read, and shows
          // through as the letterbox if the crop ever falls short.
          backgroundColor: "#17110D",
          fontFamily: font ? "Display" : "sans-serif",
        }}
      >
        {banner ? (
          <img
            src={banner}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: size.width,
              height: size.height,
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Scrim, so the type below stays legible whatever the photograph does. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: size.width,
            height: 360,
            display: "flex",
            backgroundImage:
              "linear-gradient(to bottom, rgba(23,17,13,0) 0%, rgba(23,17,13,0.55) 45%, rgba(23,17,13,0.93) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 68,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "#F4F1EA",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 30,
              letterSpacing: "-0.01em",
              color: "rgba(244,241,234,0.78)",
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 84,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ width: 64, height: 2, backgroundColor: "#A8552F" }} />
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(244,241,234,0.72)",
            }}
          >
            {site.domain}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Display", data: font, style: "normal", weight: 400 }]
        : undefined,
    },
  );
}
