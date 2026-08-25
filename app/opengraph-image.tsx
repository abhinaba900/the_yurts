import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card. Typographic, in the brand palette — a share preview
 * should not be a screenshot of a hero nobody has photographed yet.
 *
 * Individual pages can override this by exporting their own opengraph-image.
 */
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

export default async function OpengraphImage() {
  const font = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F4F1EA",
          color: "#221F1A",
          padding: "72px 80px",
          fontFamily: font ? "Display" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6E675A",
          }}
        >
          <span>Theyurts</span>
          <span>India</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            A room without walls.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#6E675A",
              letterSpacing: "-0.01em",
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 96, height: 2, backgroundColor: "#A8552F" }} />
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6E675A",
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
