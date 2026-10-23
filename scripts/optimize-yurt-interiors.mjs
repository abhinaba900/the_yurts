/**
 * Turns the client's Symmetry interiors into web-sized models for the 3D builder.
 *
 *   node --max-old-space-size=8192 scripts/optimize-yurt-interiors.mjs [source.glb]
 *
 * THE SOURCE. "Symmetry interiors.glb" is a 190MB SketchUp export of three
 * yurts standing in a row along X — the 10m, 7m and 6m, each fitted out to the
 * same Symmetry standard. Like the other exports it has no useful node names;
 * geometry is grouped by *material*, one mesh across all three yurts.
 *
 * WHAT THIS DOES. The same as `optimize-yurt-model.mjs` does for the old 10m
 * layouts, per size:
 *  1. Splits every mesh by triangle position into the three yurts, and drops
 *     each yurt's shell — crown dome, roof frame, and the lattice, doors and
 *     windows at the wall. The builder stands the interior inside that size's
 *     own shell, `exterior.glb` (see `optimize-yurt-shells.mjs`).
 *  2. Moves each yurt to the origin, crown dome centred, floor at y = 0. The
 *     7m and 6m are drawn on a raised floor, so they come down to meet the
 *     deck. The source has the door at +z, as the shells do, so nothing is
 *     rotated.
 *  3. Names every mesh after its material, and pulls the floor out of the
 *     vertex-coloured mesh as "Floor", so the panel can recolour it.
 *  4. Welds, simplifies and meshopt-compresses each interior, and writes it to
 *     `public/models/yurt-<size>/symmetry.glb`.
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
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import * as THREE from "three";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const SOURCE = process.argv[2] ?? "public/3D-Modal/Symmetry interiors.glb";

/**
 * The three yurts, west to east, split at the gaps between them: geometry
 * clusters at x 48–59, 67–74 and 80–87.
 *
 * `interiorRadius` is the furthest out the fit-out reaches from the centre;
 * past it, above the floor, is the lattice and the door and window joinery.
 * `wallHead` is where the roof frame starts, and `floor` the height of the
 * floor the fit-out stands on. All read off the source.
 */
const YURTS = [
  { size: "10m", maxX: 63, interiorRadius: 4.7, wallHead: 2.55, floor: 0 },
  { size: "7m", maxX: 77, interiorRadius: 3.25, wallHead: 2.3, floor: 0.131 },
  { size: "6m", maxX: Infinity, interiorRadius: 2.78, wallHead: 2.3, floor: 0.142 },
];

const binOf = (x) => YURTS.findIndex((yurt) => x < yurt.maxX);

/** The crown dome: round, one per yurt, so it gives each yurt's centre. */
const DOME = "[Translucent Glass Sky Reflection]2";

/** Most of the joinery is one mesh coloured per vertex; see the old script. */
const VERTEX_COLOURED = "SKP Vertex Colors";
const FLOOR = "Floor";

/**
 * The shells have a floor of their own at y = 0, in their wall cover or
 * joinery mesh. Level with it, the two fight and the shell's (wall-coloured)
 * floor shows through, so the interior's sits just above.
 */
const FLOOR_LIFT = 0.005;

/** Door and window frames and panes: the shell draws its own. */
const JOINERY = new Set(["Charcoal Blue", "Charcoal Blue1", "Glass Generic", "Glass Black"]);

/** Faces meeting at more than this are drawn with a hard edge. */
const CREASE_ANGLE = (35 * Math.PI) / 180;

/** Triangle count below which a mesh is left exactly as the client drew it. */
const SIMPLIFY_ABOVE = 5000;

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

console.log(`Reading ${SOURCE}`);
const source = await io.read(SOURCE);
const root = source.getRoot();
const scene = root.getDefaultScene() ?? root.listScenes()[0];

/* -------------------------------------------------------------------------- */
/* 1. Find each yurt's centre, from its crown dome                            */
/* -------------------------------------------------------------------------- */

const domeBounds = YURTS.map(() => ({ min: [Infinity, Infinity], max: [-Infinity, -Infinity] }));

for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    if (prim.getMaterial()?.getName().trim() !== DOME) continue;
    const position = prim.getAttribute("POSITION");
    const p = [0, 0, 0];
    for (let i = 0; i < position.getCount(); i++) {
      position.getElement(i, p);
      const box = domeBounds[binOf(p[0])];
      box.min[0] = Math.min(box.min[0], p[0]);
      box.max[0] = Math.max(box.max[0], p[0]);
      box.min[1] = Math.min(box.min[1], p[2]);
      box.max[1] = Math.max(box.max[1], p[2]);
    }
  }
}

const centres = domeBounds.map((box) => [
  (box.min[0] + box.max[0]) / 2,
  (box.min[1] + box.max[1]) / 2,
]);

/* -------------------------------------------------------------------------- */
/* 2. Split by yurt, dropping the shell                                       */
/* -------------------------------------------------------------------------- */

const groups = YURTS.map((yurt) => {
  const node = source.createNode(yurt.size);
  scene.addChild(node);
  return node;
});

/** Shell triangles left out of each yurt. */
const dropped = YURTS.map(() => 0);

const oldMeshes = root.listMeshes().slice();
const oldNodes = scene.listChildren().filter((node) => !groups.includes(node));

for (const mesh of oldMeshes) {
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute("POSITION");
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

    for (let i = 0; i < count; i += 3) {
      const ia = index(i);
      const ib = index(i + 1);
      const ic = index(i + 2);
      position.getElement(ia, a);
      position.getElement(ib, b);
      position.getElement(ic, c);
      const bin = binOf((a[0] + b[0] + c[0]) / 3);
      const yurt = YURTS[bin];
      const cy = (a[1] + b[1] + c[1]) / 3;
      const radius = Math.hypot(
        (a[0] + b[0] + c[0]) / 3 - centres[bin][0],
        (a[2] + b[2] + c[2]) / 3 - centres[bin][1],
      );

      let part = name;
      if (name === VERTEX_COLOURED) {
        const flat = Math.abs(a[1] - b[1]) < 0.005 && Math.abs(a[1] - c[1]) < 0.005;
        if (flat && Math.abs(cy - yurt.floor) < 0.05) part = FLOOR;
      }

      const shell =
        part === DOME ||
        JOINERY.has(part) ||
        (name === VERTEX_COLOURED && cy > yurt.floor + yurt.wallHead) ||
        (radius > yurt.interiorRadius && cy > yurt.floor + 0.05);
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
/* 3. Centre each yurt, floor at zero                                         */
/* -------------------------------------------------------------------------- */

YURTS.forEach((yurt, bin) => {
  const [cx, cz] = centres[bin];
  for (const node of groups[bin].listChildren()) {
    const lift = node.getName() === FLOOR ? FLOOR_LIFT : 0;
    const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -cx, lift - yurt.floor, -cz, 1];
    for (const prim of node.getMesh().listPrimitives()) {
      // Compacting first gives every piece its own vertex buffer, so moving
      // one yurt cannot move the shared vertices of another.
      compactPrimitive(prim);
      transformPrimitive(prim, matrix);
    }
  }

  console.log(
    `${yurt.size}: centre (${cx.toFixed(2)}, ${cz.toFixed(2)}), ` +
      `${groups[bin].listChildren().length} meshes, ` +
      `${dropped[bin].toLocaleString()} shell triangles dropped`,
  );
});

/**
 * Rebuilds a primitive's normals with a crease angle: smooth across gentle
 * curves, hard across the joinery's edges. Done here rather than in the
 * browser, where it held the main thread for over a second per layout.
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
/* 4. One optimised file per yurt                                             */
/* -------------------------------------------------------------------------- */

const triangles = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((mesh) => mesh.listPrimitives())
    .reduce((sum, prim) => sum + (prim.getIndices()?.getCount() ?? 0) / 3, 0);

for (const yurt of YURTS) {
  const doc = cloneDocument(source);
  const docScene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];

  for (const node of docScene.listChildren()) {
    if (node.getName() !== yurt.size) node.dispose();
  }

  // SketchUp exports flat-shaded: every triangle carries its own three
  // vertices. Normals are dropped so the vertices can weld (and are rebuilt
  // below, after simplifying), and UVs because the model has no textures.
  for (const prim of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    prim.setAttribute("NORMAL", null);
    prim.setAttribute("TEXCOORD_0", null);
  }

  await doc.transform(prune(), dedup(), weld());
  const before = triangles(doc);

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

  const dir = path.join("public/models", `yurt-${yurt.size}`);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "symmetry.glb");
  await io.write(file, doc);
  const size = fs.statSync(file).size / 1024 / 1024;
  console.log(
    `  → ${file}: ${Math.round(before).toLocaleString()} → ${Math.round(triangles(doc)).toLocaleString()} triangles, ${size.toFixed(2)}MB`,
  );
}
