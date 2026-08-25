/**
 * Generates docs/CONTENT-NEEDED.md.
 *
 *   npm run content:todo
 *
 * This is the document handed to the client, and the one to work from when
 * generating imagery. It is generated from the code — the manifest in
 * data/media.ts and the scenes in data/vr.ts — so it cannot drift from what the
 * site actually asks for. Do not edit the output by hand.
 *
 * Where each image is used is discovered by scanning the source, so the "appears
 * on" column stays correct as pages change.
 */
import { writeFileSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { media, type MediaAsset } from "../data/media.ts";
import { vrScenes } from "../data/vr.ts";

/* -------------------------------------------------------------------------- */
/* Crops                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every crop the layouts ask for.
 *
 * `px4k` is the generation target: 3840px on the long edge, which is what "4K"
 * means for a still. `min` is the smallest size the site can ship without the
 * image going soft on a high-density display — generate at `px4k` and downscale
 * to taste, never the other way round.
 */
const crops: Record<
  string,
  { ratio: string; px4k: string; min: string; use: string }
> = {
  portrait: { ratio: "3:4", px4k: "2880 × 3840", min: "1500 × 2000", use: "Upright cards" },
  editorial: { ratio: "4:5", px4k: "3072 × 3840", min: "1600 × 2000", use: "Editorial blocks" },
  landscape: { ratio: "16:9", px4k: "3840 × 2160", min: "2000 × 1125", use: "Wide blocks" },
  cinema: { ratio: "21:9", px4k: "3840 × 1646", min: "2400 × 1030", use: "Full-bleed banners" },
  panorama: { ratio: "2.6:1", px4k: "3840 × 1477", min: "2600 × 1000", use: "Letterboxed bands" },
  square: { ratio: "1:1", px4k: "3840 × 3840", min: "1600 × 1600", use: "Details and thumbnails" },
};

/* -------------------------------------------------------------------------- */
/* Where each image is used                                                   */
/* -------------------------------------------------------------------------- */

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) sourceFiles(path, out);
    else if (/\.(tsx?|ts)$/.test(entry)) out.push(path);
  }
  return out;
}

const files = [...sourceFiles("components"), ...sourceFiles("app"), ...sourceFiles("data")];
const contents = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

/** Human-readable place an id is referenced from. */
function usedIn(id: string): string {
  // Data files are indirection, not destinations. An image referenced from
  // data/range.ts appears wherever that range is rendered, and answering
  // "data/range" is not useful to whoever is commissioning the photograph.
  const viaData: Record<string, string> = {
    "data/range.ts": "home page, /yurts",
    "data/applications.ts": "/applications",
    "data/home.ts": "home page",
    "data/vr.ts": "/experiences/vr",
  };

  const hits = new Set<string>();

  for (const [rawFile, text] of contents) {
    if (!text.includes(`"${id}"`)) continue;

    const file = rawFile.split("\\").join("/");
    if (file.endsWith("data/media.ts")) continue;

    if (viaData[file]) {
      hits.add(viaData[file]);
      continue;
    }

    hits.add(
      file
        .replace(/^app\/\(site\)\//, "/")
        .replace(/^components\//, "")
        .replace(/\/page\.tsx$/, "")
        .replace(/\.tsx?$/, ""),
    );
  }

  return hits.size ? [...hits].join(", ") : "—";
}

/* -------------------------------------------------------------------------- */
/* Image generation prompt                                                    */
/* -------------------------------------------------------------------------- */

const STYLE = [
  "photorealistic architectural photography",
  "natural light, nothing lit like a studio",
  "warm timber, canvas and rope materials",
  "muted earthy palette of walnut brown, cream canvas and deep green foliage",
  "Indian landscape setting",
  "shot on a 35mm lens, medium depth of field",
  "editorial quality in the manner of Architectural Digest",
  "no text, no logos, no watermarks, no signage",
].join(", ");

const NEGATIVE = [
  "cartoon",
  "illustration",
  "3d render",
  "CGI",
  "oversaturated colours",
  "HDR halos",
  "lens flare",
  "text overlays",
  "watermarks",
  "distorted geometry",
  "extra structures",
  "tipi or teepee shapes",
].join(", ");

function prompt(asset: MediaAsset): string {
  const crop = crops[asset.ratio];
  const subject = asset.note ? `${asset.alt} ${asset.note}` : asset.alt;
  return `A yurt — a round timber-framed tent with a domed roof and a central crown wheel. ${subject} ${STYLE}. Aspect ratio ${crop.ratio}, rendered at ${crop.px4k}.`;
}

/* -------------------------------------------------------------------------- */

const entries = Object.entries(media) as [string, MediaAsset][];
const site = entries.filter(([id]) => !id.startsWith("styleguide."));
const pending = site.filter(([, a]) => !a.src);
const supplied = site.filter(([, a]) => a.src);
const vrPending = vrScenes.filter((scene) => !scene.src);

const lines: string[] = [];
const push = (...l: string[]) => lines.push(...l);

push(
  "# Content needed",
  "",
  "> Generated by `npm run content:todo` from the code. Do not edit by hand —",
  "> regenerate it instead, or the document and the site will disagree.",
  "",
  "## Where things stand",
  "",
  "| | Supplied | Outstanding |",
  "| --- | --- | --- |",
  `| Site images | ${supplied.length} | ${pending.length} |`,
  `| 360° panoramas | ${vrScenes.length - vrPending.length} | ${vrPending.length} |`,
  "",
  "Everything else — product specifications, contact details, company information",
  "— is listed at the end of this document.",
  "",
);

/* -- How to add an image --------------------------------------------------- */

push(
  "## How to add an image",
  "",
  "1. Save the file into `public/media/` using **exactly** the filename below.",
  "2. Open `data/media.ts`, find the matching entry, and add its `src`:",
  "",
  "   ```ts",
  '   src: "/media/<filename>",',
  "   ```",
  "3. Run `npm run verify:media` to confirm it resolves.",
  "",
  "Nothing else changes. The crop is already reserved in the layout, so the page",
  "does not move when the picture lands.",
  "",
);

/* -- Generating imagery ---------------------------------------------------- */

push(
  "## Generating these with an image model",
  "",
  "Every image in the manifest is listed below with a ready-to-paste prompt —",
  "including the ones already supplied, so the whole set can be regenerated at a",
  "higher resolution without reverse-engineering what each shot was meant to be.",
  "",
  "### Size",
  "",
  "Generate at **3840px on the long edge**. Exact target per crop:",
  "",
  "| Crop | Ratio | Generate at | Minimum shippable |",
  "| --- | --- | --- | --- |",
  ...Object.entries(crops).map(
    ([name, c]) => `| ${name} | ${c.ratio} | **${c.px4k}** | ${c.min} |`,
  ),
  "",
  "If the model cannot hit the aspect ratio directly, generate the nearest size",
  "it does support at 4K or above and crop down. Never upscale a small",
  "generation to reach these numbers — an upscaled 1024px image looks worse at",
  "3840 than a sharp 2000px one does.",
  "",
  "### Consistency",
  "",
  "The prompts share one style clause deliberately: generated separately without",
  "it, the set will not look like it was shot by one photographer, which is the",
  "single most obvious sign of assembled imagery. If your tool supports a seed or",
  "a style reference, fix it once and reuse it across the whole set.",
  "",
  "**Use as a negative prompt for all of them:**",
  "",
  "```",
  NEGATIVE,
  "```",
  "",
  "### Two things to check on every result",
  "",
  "Image models get these wrong constantly:",
  "",
  "- A yurt is a **circular** structure with a **domed** roof and a round crown at",
  "  its centre. Reject anything conical, pointed or tipi-shaped.",
  "- The lattice wall is vertical and the roof is shallow. If the whole thing is a",
  "  cone from the ground up, it is not a yurt.",
  "",
  "### Then",
  "",
  "Save into `public/media/` under the exact filename given, replacing the",
  "existing file. Run `npm run verify:media` to confirm every entry still",
  "resolves. Filenames are referenced from `data/media.ts`, so keeping them",
  "identical means no code changes at all.",
  "",
);

/* -- The image library ----------------------------------------------------- */

push(
  "## Every image, with its prompt",
  "",
  `${site.length} images. **Supplied** means a file is already in \`public/media/\``,
  "and wired up — regenerating it means overwriting that file with a larger one",
  "under the same name.",
  "",
);

const groups = new Map<string, [string, MediaAsset][]>();
for (const entry of site) {
  const key = entry[0].split(".")[0];
  groups.set(key, [...(groups.get(key) ?? []), entry]);
}

for (const [group, items] of [...groups].sort()) {
  push(`### ${group}`, "");
  for (const [id, asset] of items) {
    const crop = crops[asset.ratio];
    push(
      `#### \`${asset.file}\``,
      "",
      `- **Status** ${asset.src ? "Supplied" : "**Outstanding**"}`,
      `- **Generate at** ${crop.px4k} (${crop.ratio})`,
      `- **Appears on** ${usedIn(id)}`,
      `- **Manifest id** \`${id}\``,
      `- **Alt text** ${asset.alt}`,
      ...(asset.note ? [`- **Art direction** ${asset.note}`] : []),
      "",
      "```",
      prompt(asset),
      "```",
      "",
    );
  }
}

/* -- 360° panoramas -------------------------------------------------------- */

push(
  "## 360° panoramas",
  "",
  "These drive the VR experience at `/experiences/vr`. They are a different kind",
  "of asset and **cannot be generated reliably by image models** — an",
  "equirectangular projection has to be geometrically correct all the way round",
  "or the viewer will visibly warp. Shoot these with a 360 camera (Insta360,",
  "Ricoh Theta or similar) once a real structure is standing.",
  "",
  "**Format:** equirectangular JPEG, 2:1 ratio, 4096 × 2048 — that is already the",
  "4K target for this kind of asset, so do not scale it to match the 3840 figure",
  "used for the flat images above. Do not exceed 8192 wide either: some mobile",
  "GPUs will fail to upload the texture.",
  "",
  "**To add one:** save into `public/vr/`, then set `src: \"/vr/<file>\"` on the",
  "matching scene in `data/vr.ts`.",
  "",
);

if (vrPending.length) {
  push("| File | Viewpoint | Where to put the camera |", "| --- | --- | --- |");
  for (const scene of vrPending) {
    push(`| \`${scene.file}\` | ${scene.label} | ${scene.note ?? "—"} |`);
  }
  push("");
} else {
  push("All panoramas supplied.", "");
}

/* -- CMS imagery ----------------------------------------------------------- */

push(
  "## Images that come through the CMS",
  "",
  "These are not in the manifest because there is one per piece of content, not a",
  "fixed list. They are uploaded in the Studio at `/studio` alongside the content",
  "they belong to. Each needs alt text — the schema will not let it be published",
  "without.",
  "",
  "Sizes match the table above — upload at the 4K target for the crop and Sanity",
  "serves the smaller variants each layout asks for.",
  "",
  "| Content type | Images it takes | Crop used | Upload at |",
  "| --- | --- | --- | --- |",
  "| Yurt (product) | Hero, gallery, floor plan per size | 21:9 hero, mixed gallery | 3840 × 1646 |",
  "| Application | Hero | 21:9 | 3840 × 1646 |",
  "| Project | Hero, gallery, floor plans | 21:9 hero, mixed gallery | 3840 × 1646 |",
  "| Journal article | Hero | 21:9 | 3840 × 1646 |",
  "| Author | Portrait | 1:1 | 3840 × 3840 |",
  "| Resource | Cover | 3:4 | 2880 × 3840 |",
  "| Site settings | Default share image | 1.91:1 | 1200 × 630 (fixed) |",
  "",
);

/* -- Everything that is not an image --------------------------------------- */

push(
  "## Information still needed",
  "",
  "Each row says where it lands, so it can be filled in as it arrives rather than",
  "waiting for all of it.",
  "",
  "### Contact details",
  "",
  "Every field is hidden site-wide until supplied — nothing renders blank or with",
  "a placeholder value.",
  "",
  "| Detail | Where it goes |",
  "| --- | --- |",
  "| Email | Studio → Site settings → Contact |",
  "| Phone | Studio → Site settings → Contact |",
  "| WhatsApp number | Studio → Site settings → Contact |",
  "| Workshop address | Studio → Site settings → Contact |",
  "| Google Maps link | Studio → Site settings → Contact |",
  "| Social profiles | Studio → Site settings → Social |",
  "",
  "Before the Studio exists, the same fields can go in `lib/site.ts`.",
  "",
  "### Product specifications",
  "",
  "The site currently publishes **no dimensions at all**, deliberately. Sizes in",
  "the 3D builder are relative — Compact, Standard, Large, Grand — because naming",
  "a diameter that has not been confirmed would put an invented figure on a live",
  "website.",
  "",
  "For each yurt in the range: diameter, floor area, wall height, sleeping",
  "capacity, timber species and treatment, cover fabric and coating, insulation",
  "specification, fixings, foundation requirement, wind and rain performance,",
  "expected cover life, expected frame life, warranty terms, and lead time.",
  "",
  "### Company",
  "",
  "| Needed | Where it goes |",
  "| --- | --- |",
  "| Founder and team names, roles, short bios | `/about` — the Team empty state |",
  "| Any certification or testing, with issuing body and date | `/about` — Certifications |",
  "| Workshop location and whether it can be visited | `/about` — Workshop |",
  "| Answers to the questions on `/faq` | Studio → Questions |",
  "| PDFs: catalogue, specifications, buyer's guide | Studio → Resources |",
  "",
  "### Credentials",
  "",
  "| Variable | Unblocks |",
  "| --- | --- |",
  "| `NEXT_PUBLIC_SANITY_PROJECT_ID` | The Studio and all CMS content |",
  "| `SANITY_API_WRITE_TOKEN` | Enquiries landing in the Studio |",
  "| `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` | Enquiry notification emails |",
  "",
  "Until one of the last two groups is set, the enquiry form refuses to report",
  "success and tells the visitor to make contact another way. That is deliberate:",
  "a form that thanks someone while dropping their message loses the enquiry with",
  "no trace that it existed.",
  "",
);

/* -- Supplied -------------------------------------------------------------- */

mkdirSync("docs", { recursive: true });
writeFileSync("docs/CONTENT-NEEDED.md", lines.join("\n"));

console.log(
  `docs/CONTENT-NEEDED.md — ${pending.length} images outstanding, ` +
    `${supplied.length} supplied, ${vrPending.length} panoramas awaited`,
);
