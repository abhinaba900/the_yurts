/**
 * Turns the client's SketchUp export into web-sized models for the 3D builder.
 *
 *   node --max-old-space-size=8192 scripts/optimize-yurt-model.mjs [source.glb]
 *
 * THE SOURCE. "10m YURT WITH 3 INTERNAL OPTIONS.glb" is a single 328MB scene
 * exported from Innerscene's SketchUp viewer: four 10m yurts standing in a row
 * along X, about 65m end to end, with three fitted-out layouts and one empty
 * shell. It has no useful node names. Geometry is grouped by *material*, so one
 * mesh holds, say, every piece of cushion fabric in all four yurts.
 *
 * WHAT THIS DOES.
 *  1. Splits every mesh by triangle position into the four yurts, and drops
 *     each yurt's shell — covers, crown, roof frame, and the lattice, doors and
 *     windows at the wall. The builder stands every layout inside the same
 *     shell, `exterior.glb` (see `optimize-yurt-shells.mjs`), so all the 10m
 *     options look alike from outside.
 *  2. Moves each yurt to the origin, floor at y = 0.
 *  3. Names every mesh after its material, so the scene can find the floor by
 *     name (see `data/yurtModel.ts`).
 *  4. Welds, simplifies and meshopt-compresses each interior, and writes it to
 *     `public/models/yurt-10m/<id>.glb`.
 *
 * Separate files rather than one: someone looking at one layout downloads one
 * layout, and the others arrive only if they ask for them.
 */
import path from "node:path";
import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import {
  cloneDocument,
  compactPrimitive,
  dedup,
  meshopt,
  prune,
  simplifyPrimitive,
  transformPrimitive,
  weld,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import * as THREE from "three";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const SOURCE =
  process.argv[2] ?? "public/3D-Modal/10m YURT WITH 3 INTERNAL OPTIONS.glb";
const OUT_DIR = "public/models/yurt-10m";

/**
 * The four yurts, west to east, split at the gaps between them. The gaps were
 * read off the source: geometry clusters at x 48–59, 68–79, 88–99 and 104–115.
 * `centre` is (x, z) of each roof cover, also measured from the source (and
 * re-measured and logged below, so a re-export that moves them shows up).
 */
const YURTS = [
  // Layout A stands on a raised platform; its floor is 0.4m up.
  { id: "layout-a", maxX: 63.5, centre: [53.84, 7.16], floor: 0.4 },
  { id: "layout-b", maxX: 83.5, centre: [73.25, 8.21], floor: 0 },
  { id: "layout-c", maxX: 101.5, centre: [93.25, 8.21], floor: 0 },
  { id: "shell", maxX: Infinity, centre: [109.19, 9.67], floor: 0 },
];

/** The roof cover is the one material every yurt has, and it is round. */
const ROOF_COVER = "fabric_1";

const binOf = (x) => YURTS.findIndex((yurt) => x < yurt.maxX);

/** The shell's own materials: the covers and the crown dome. */
const SHELL_MATERIALS = new Set([
  "fabric_1",
  "fabric_2",
  "fabric_03",
  "[Translucent Glass Sky Reflection]2",
]);

/**
 * The furthest out the fit-out reaches from the centre. Past it, above the
 * floor, is the lattice and the door and window joinery — read off the source,
 * where the interiors stop at 4.7m and the wall starts at 4.8m.
 */
const INTERIOR_RADIUS = 4.75;

/**
 * Most of the joinery — rafters, crown, partitions, kitchen, door and window
 * frames — arrives as ONE mesh coloured per vertex, so it cannot be told apart
 * by material. Two pieces are pulled out of it, because the scene needs them:
 *
 *  - the window and door glass, a single flat green (146, 232, 146), so it can
 *    be drawn as glass instead of as opaque green panels;
 *  - everything above the wall head, which is the roof frame, so "take it
 *    apart" can lift it with the roof.
 */
const VERTEX_COLOURED = "SKP Vertex Colors";
const GLASS = "Glass";
const ROOF_FRAME = "Roof frame";
/**
 * Where a yurt's floor or wall cover was left in SketchUp's default material,
 * it is in the vertex-coloured mesh too, so it is pulled out by shape: flat
 * at floor level is floor, default grey (204) at the wall is wall cover. That
 * gives every layout a floor and a wall cover the panel can recolour.
 */
const FLOOR = "Floor";
const WALL_COVER = "Wall cover";
const WALL_RADIUS = 4.7;
const isDefaultGrey = ([r, g, b]) =>
  [r, g, b].every((value) => Math.abs(value - 204 / 255) < 0.01);
const WALL_HEAD = 2.55;

/** Faces meeting at more than this are drawn with a hard edge. */
const CREASE_ANGLE = (35 * Math.PI) / 180;

/** Triangle count below which a mesh is left exactly as the client drew it. */
const SIMPLIFY_ABOVE = 5000;
const isGlass = ([r, g, b]) =>
  Math.abs(r - 146 / 255) < 0.01 &&
  Math.abs(g - 232 / 255) < 0.01 &&
  Math.abs(b - 146 / 255) < 0.01;

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

console.log(`Reading ${SOURCE}`);
const source = await io.read(SOURCE);
const root = source.getRoot();
const scene = root.getDefaultScene() ?? root.listScenes()[0];

/* -------------------------------------------------------------------------- */
/* 1. Split by yurt                                                           */
/* -------------------------------------------------------------------------- */

const groups = YURTS.map((yurt) => {
  const node = source.createNode(yurt.id);
  scene.addChild(node);
  return node;
});

const roofBounds = YURTS.map(() => ({
  min: [Infinity, Infinity, Infinity],
  max: [-Infinity, -Infinity, -Infinity],
}));

const grow = (box, p) => {
  for (let k = 0; k < 3; k++) {
    box.min[k] = Math.min(box.min[k], p[k]);
    box.max[k] = Math.max(box.max[k], p[k]);
  }
};

/** Shell triangles left out of each yurt. */
const dropped = YURTS.map(() => 0);

const oldMeshes = root.listMeshes().slice();
const oldNodes = scene.listChildren().filter((node) => !groups.includes(node));

for (const mesh of oldMeshes) {
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute("POSITION");
    const color = prim.getAttribute("COLOR_0");
    const indices = prim.getIndices();
    const material = prim.getMaterial();
    const name = (material?.getName() || mesh.getName() || "unnamed").trim();

    const count = indices ? indices.getCount() : position.getCount();
    const index = (i) => (indices ? indices.getScalar(i) : i);

    /** "<yurt>|<mesh name>" → triangle indices. */
    const buckets = new Map();
    const a = [0, 0, 0];
    const b = [0, 0, 0];
    const c = [0, 0, 0];
    const rgb = [0, 0, 0, 0];

    for (let i = 0; i < count; i += 3) {
      const ia = index(i);
      const ib = index(i + 1);
      const ic = index(i + 2);
      position.getElement(ia, a);
      position.getElement(ib, b);
      position.getElement(ic, c);
      const bin = binOf((a[0] + b[0] + c[0]) / 3);
      const cy = (a[1] + b[1] + c[1]) / 3;
      const radius = Math.hypot(
        (a[0] + b[0] + c[0]) / 3 - YURTS[bin].centre[0],
        (a[2] + b[2] + c[2]) / 3 - YURTS[bin].centre[1],
      );

      let part = name;
      if (name === VERTEX_COLOURED) {
        color.getElement(ia, rgb);
        const flat = Math.abs(a[1] - b[1]) < 0.005 && Math.abs(a[1] - c[1]) < 0.005;

        if (isGlass(rgb)) part = GLASS;
        else if (cy > WALL_HEAD) part = ROOF_FRAME;
        else if (flat && Math.abs(cy) < 0.05) part = FLOOR;
        else if (isDefaultGrey(rgb) && radius > WALL_RADIUS && cy > 0.05) part = WALL_COVER;
      }

      if (name === ROOF_COVER) {
        grow(roofBounds[bin], a);
        grow(roofBounds[bin], b);
        grow(roofBounds[bin], c);
      }

      const shell =
        SHELL_MATERIALS.has(part) ||
        part === ROOF_FRAME ||
        part === WALL_COVER ||
        (radius > INTERIOR_RADIUS && cy > YURTS[bin].floor + 0.05);
      if (shell) {
        dropped[bin] += 1;
        continue;
      }

      const key = `${bin}|${part}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(ia, ib, ic);
    }

    for (const [key, list] of buckets) {
      const [bin, part] = key.split("|");

      const accessor = source
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(list))
        .setBuffer(position.getBuffer());

      const piece = prim.clone().setIndices(accessor);
      const newMesh = source.createMesh(part).addPrimitive(piece);
      groups[Number(bin)].addChild(source.createNode(part).setMesh(newMesh));
    }
  }
}

// The originals are now duplicated into the groups; drop them.
for (const node of oldNodes) node.dispose();
for (const mesh of oldMeshes) mesh.dispose();

/* -------------------------------------------------------------------------- */
/* 2. Centre each yurt, floor at zero                                         */
/* -------------------------------------------------------------------------- */

const centres = YURTS.map((yurt, bin) => {
  const roof = roofBounds[bin];
  const cx = (roof.min[0] + roof.max[0]) / 2;
  const cz = (roof.min[2] + roof.max[2]) / 2;
  // The floor, not the lowest vertex: the wall skirt hangs a little below it.
  const floor = yurt.floor;
  return [cx, floor, cz];
});

YURTS.forEach((yurt, bin) => {
  const [cx, cy, cz] = centres[bin];
  const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -cx, -cy, -cz, 1];

  for (const node of groups[bin].listChildren()) {
    for (const prim of node.getMesh().listPrimitives()) {
      // Compacting first gives every piece its own vertex buffer, so moving
      // one yurt cannot move the shared vertices of another.
      compactPrimitive(prim);
      transformPrimitive(prim, matrix);
    }
  }

  const roof = roofBounds[bin];
  console.log(
    `${yurt.id}: centre (${cx.toFixed(2)}, ${cz.toFixed(2)}), ` +
      `roof ${(roof.max[0] - roof.min[0]).toFixed(2)} × ${(roof.max[2] - roof.min[2]).toFixed(2)}m, ` +
      `${groups[bin].listChildren().length} meshes, ` +
      `${dropped[bin].toLocaleString()} shell triangles dropped`,
  );
});

/**
 * Rebuilds a primitive's normals with a crease angle: smooth across gentle
 * curves (the covers), hard across sharp edges (the joinery). Done here rather
 * than in the browser, where it held the main thread for over a second per
 * layout.
 */
function creaseNormals(doc, prim) {
  const position = prim.getAttribute("POSITION");
  const color = prim.getAttribute("COLOR_0");
  const indices = prim.getIndices();

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position.getArray(), 3));
  if (color) {
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(color.getArray(), color.getElementSize()),
    );
  }
  if (indices) geometry.setIndex(new THREE.BufferAttribute(indices.getArray(), 1));

  geometry = mergeVertices(toCreasedNormals(geometry, CREASE_ANGLE), 1e-5);

  const buffer = position.getBuffer();
  const accessor = (attribute, type) =>
    doc.createAccessor().setType(type).setArray(attribute.array).setBuffer(buffer);

  prim.setAttribute("POSITION", accessor(geometry.getAttribute("position"), "VEC3"));
  prim.setAttribute("NORMAL", accessor(geometry.getAttribute("normal"), "VEC3"));
  if (color) {
    const attribute = geometry.getAttribute("color");
    prim.setAttribute("COLOR_0", accessor(attribute, attribute.itemSize === 4 ? "VEC4" : "VEC3"));
  }
  prim.setIndices(
    doc.createAccessor().setType("SCALAR").setArray(new Uint32Array(geometry.index.array)).setBuffer(buffer),
  );
}

/* -------------------------------------------------------------------------- */
/* 3. One optimised file per yurt                                             */
/* -------------------------------------------------------------------------- */

fs.mkdirSync(OUT_DIR, { recursive: true });

const triangles = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((mesh) => mesh.listPrimitives())
    .reduce((sum, prim) => sum + (prim.getIndices()?.getCount() ?? 0) / 3, 0);

for (const [bin, yurt] of YURTS.entries()) {
  // The empty shell is superseded by the client's own exterior drawings,
  // which `optimize-yurt-shells.mjs` turns into `exterior.glb`. It is still
  // split out above, because the split needs every yurt's bounds.
  if (yurt.id === "shell") continue;
  const doc = cloneDocument(source);
  const docScene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];

  for (const node of docScene.listChildren()) {
    if (node.getName() !== yurt.id) node.dispose();
  }

  // SketchUp exports flat-shaded: every triangle carries its own three
  // vertices, so nothing is shared and the simplifier has nothing to collapse.
  // Normals are dropped so the vertices can weld (and are rebuilt below, after
  // simplifying), and UVs because the model has no textures.
  for (const prim of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    prim.setAttribute("NORMAL", null);
    prim.setAttribute("TEXCOORD_0", null);
  }

  await doc.transform(prune(), dedup(), weld());
  const before = triangles(doc);

  // Only the heavy meshes are simplified. The covers are a few thousand
  // triangles each and are the first thing anyone looks at, and simplifying
  // them saves nothing worth having while it puts a sawtooth in the eave.
  for (const prim of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    if ((prim.getIndices()?.getCount() ?? 0) / 3 < SIMPLIFY_ABOVE) continue;
    simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: 0.1, error: 0.01, lockBorder: false });
  }

  for (const prim of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    creaseNormals(doc, prim);
  }

  await doc.transform(
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "high" }),
  );

  const file = path.join(OUT_DIR, `${yurt.id}.glb`);
  await io.write(file, doc);
  const size = fs.statSync(file).size / 1024 / 1024;
  console.log(
    `  → ${file}: ${Math.round(before).toLocaleString()} → ${Math.round(triangles(doc)).toLocaleString()} triangles, ${size.toFixed(2)}MB`,
  );
}
