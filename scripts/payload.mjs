/**
 * Measures what each route actually ships.
 *
 * Next does not print per-route JS in this setup, and "it feels fast" is not a
 * measurement. Run a production server, then:
 *
 *   npm run build && npm start
 *   npm run payload
 *
 * Point it elsewhere with AUDIT_URL. Sizes are gzipped, because that is what
 * crosses the network.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";

const base = process.env.AUDIT_URL ?? "http://localhost:3000";
const routes = ["/", "/yurts", "/applications/resorts", "/journal", "/faq",
                "/enquire", "/experiences/builder", "/experiences/vr", "/about"];

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const rows = [];

for (const route of routes) {
  const html = await fetch(base + route).then((r) => r.text());
  const chunks = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0]))];

  let raw = 0, gzipped = 0, missing = 0;
  for (const chunk of chunks) {
    const path = ".next" + chunk.replace("/_next", "");
    try {
      const buf = readFileSync(path);
      raw += buf.length;
      gzipped += gz(buf);
    } catch { missing++; }
  }

  const htmlBuf = Buffer.from(html);
  rows.push({
    route,
    html: (gz(htmlBuf) / 1024).toFixed(0) + "kb",
    jsFiles: chunks.length,
    jsRaw: (raw / 1024).toFixed(0) + "kb",
    jsGzip: (gzipped / 1024).toFixed(0) + "kb",
    totalGzip: ((gzipped + gz(htmlBuf)) / 1024).toFixed(0) + "kb",
    missing,
  });
}

console.log("route".padEnd(24), "html".padStart(7), "js#".padStart(5), "jsRaw".padStart(8), "jsGzip".padStart(8), "TOTAL".padStart(8));
for (const r of rows) {
  console.log(r.route.padEnd(24), r.html.padStart(7), String(r.jsFiles).padStart(5),
              r.jsRaw.padStart(8), r.jsGzip.padStart(8), r.totalGzip.padStart(8));
}
