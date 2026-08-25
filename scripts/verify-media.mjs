/**
 * Verifies the media manifest against what is actually on disk.
 *
 * Catches the failures that are invisible until someone loads the page: a `src`
 * pointing at a file that was never delivered, a filename that drifted from the
 * one declared, an image with no alt text, and files sitting in public/media
 * that nothing references.
 *
 *   npm run verify:media
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const source = readFileSync("data/media.ts", "utf8");

const entries = [...source.matchAll(/"([a-z]+\.[a-z0-9-]+)":\s*\{([^}]*)\}/g)].map(
  (match) => {
    const body = match[2];
    const field = (key) => {
      const found = body.match(new RegExp(`${key}:\\s*"([^"]*)"`));
      return found ? found[1] : null;
    };
    return {
      id: match[1],
      file: field("file"),
      src: field("src"),
      ratio: field("ratio"),
      alt: field("alt"),
      note: field("note"),
    };
  },
);

const onDisk = existsSync("public/media") ? readdirSync("public/media") : [];

const broken = [];
const pending = [];
const mismatched = [];
const noAlt = [];

for (const entry of entries) {
  if (!entry.alt) noAlt.push(entry.id);
  if (!entry.src) {
    pending.push(`${entry.id} → ${entry.file}`);
    continue;
  }
  const filename = entry.src.replace("/media/", "");
  if (!onDisk.includes(filename)) broken.push(`${entry.id} → ${entry.src}`);
  if (filename !== entry.file) {
    mismatched.push(`${entry.id}: declares "${entry.file}" but src is "${filename}"`);
  }
}

const referenced = new Set(
  entries.filter((e) => e.src).map((e) => e.src.replace("/media/", "")),
);
const orphans = onDisk.filter((file) => !referenced.has(file));

/* -- VR panoramas are declared separately -- */
const vrSource = readFileSync("data/vr.ts", "utf8");
const vrScenes = [...vrSource.matchAll(/id:\s*"([a-z-]+)"[\s\S]*?file:\s*"([^"]+)"/g)].map(
  (m) => ({ id: m[1], file: m[2] }),
);
// Excludes the "/vr/<file>" example in this file's own documentation.
const vrWithSrc = [...vrSource.matchAll(/src:\s*"\/vr\/([^"<]+)"/g)].map((m) => m[1]);

const report = (label, list) =>
  console.log(`${label.padEnd(34)} ${list.length ? "\n  - " + list.join("\n  - ") : "none"}`);

console.log(`Manifest entries: ${entries.length}`);
console.log(`Files in public/media: ${onDisk.length}`);
console.log(`Supplied: ${entries.filter((e) => e.src).length} / ${entries.length}\n`);

report("BROKEN (src not on disk)", broken);
report("Still awaiting an image", pending);
report("Filename drifted from src", mismatched);
report("Missing alt text", noAlt);
report("On disk but unreferenced", orphans);

console.log(`\n360° panoramas: ${vrWithSrc.length} / ${vrScenes.length} supplied`);
report(
  "  awaiting capture",
  vrScenes.filter((s) => !vrWithSrc.includes(s.file)).map((s) => s.file),
);

const failed = broken.length + mismatched.length + noAlt.length;
process.exitCode = failed > 0 ? 1 : 0;
