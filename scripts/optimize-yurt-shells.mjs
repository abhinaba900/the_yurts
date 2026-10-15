/**
 * Turns the client's 6m and 10m exterior exports into the builder's shells.
 *
 *   node --max-old-space-size=8192 scripts/optimize-yurt-shells.mjs
 *
 * THE SOURCES. "6M Yurt.glb" and "10M Yurt.glb" are SketchUp exports of a
 * colour catalogue: 34 copies of the same yurt in a grid, each with a
 * different roof and wall cover. Everything is in one vertex-coloured mesh,
 * plus a handful of material meshes (frames, crown dome).
 *
 * The builder recolours the covers itself, so only ONE copy is needed per size.
 * This takes the copy at `centre`, and splits its vertex-coloured mesh into the
 * parts the scene paints and pulls apart, named so `data/yurtModel.ts` can find
 * them:
 *
 *   Roof cover   the copy's roof colour — roof and valance
 *   Wall cover   the copy's wall colour
 *   Glass        window and door panes, drawn as glass by the scene
 *   Roof frame   anything else above the wall head (crown ring, rafters)
 *   Joinery      everything else (window frames, handles, wall band)
 *
 * The copy is moved to the origin with its base at y = 0, given creased
 * normals, welded and meshopt-compressed, and written to `public/models/<size>/exterior.glb`.
 */
import path from "node:path";
import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, weld } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import * as THREE from "three";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Faces meeting at more than this are drawn with a hard edge. */
const CREASE_ANGLE = (35 * Math.PI) / 180;

/** Smooth across the covers' curve, hard across the joinery's edges. */
function creaseNormals(doc, prim) {
  const position = prim.getAttribute("POSITION");
  const color = prim.getAttribute("COLOR_0");
  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position.getArray(), 3));
  if (color) geometry.setAttribute("color", new THREE.BufferAttribute(color.getArray(), 3));
  geometry = mergeVertices(toCreasedNormals(geometry, CREASE_ANGLE), 1e-5);

  const buffer = position.getBuffer();
  const accessor = (attribute, type) =>
    doc.createAccessor().setType(type).setArray(attribute.array).setBuffer(buffer);
  prim.setAttribute("POSITION", accessor(geometry.getAttribute("position"), "VEC3"));
  prim.setAttribute("NORMAL", accessor(geometry.getAttribute("normal"), "VEC3"));
  if (color) prim.setAttribute("COLOR_0", accessor(geometry.getAttribute("color"), "VEC3"));
  prim.setIndices(
    doc.createAccessor().setType("SCALAR").setArray(new Uint32Array(geometry.index.array)).setBuffer(buffer),
  );
}

const rgb255 = (r, g, b) => [r, g, b];

/**
 * One copy per size. `centre` is the crown dome's (x, z) in the source, `reach`
 * is how far out from it this copy's geometry goes (the door canopy included)
 * before the neighbouring copy starts. Colours are the copy's covers as
 * exported, in 0–255.
 */
const SHELLS = [
  {
    id: "yurt-10m",
    source: "public/3D-Modal/10M Yurt.glb",
    centre: [65.1, -6.3],
    reach: 6.6,
    roof: rgb255(155, 133, 103),
    wall: rgb255(114, 114, 114),
    wallHead: 2.95,
  },
  {
    id: "yurt-6m",
    source: "public/3D-Modal/6M Yurt.glb",
    centre: [3.1, 41.7],
    reach: 4.5,
    roof: rgb255(173, 112, 0),
    wall: rgb255(114, 114, 114),
    wallHead: 2.55,
  },
];

const GLASS = [rgb255(0, 0, 0), rgb255(30, 30, 30), rgb255(146, 232, 146)];
const VERTEX_COLOURED = "SKP Vertex Colors";

const same = (a, b) => a.every((value, k) => Math.abs(value * 255 - b[k]) < 1.5);

await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

for (const shell of SHELLS) {
  console.log(`Reading ${shell.source}`);
  const doc = await io.read(shell.source);
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  const [cx, cz] = shell.centre;

  const out = doc.createNode(shell.id);
  scene.addChild(out);

  const oldNodes = scene.listChildren().filter((node) => node !== out);
  const oldMeshes = root.listMeshes().slice();

  /** Mesh name → [positions, colours | null, source primitive]. */
  const buckets = new Map();
  let floor = Infinity;

  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();

    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute("POSITION");
      const color = prim.getAttribute("COLOR_0");
      const indices = prim.getIndices();
      const name = (prim.getMaterial()?.getName() || mesh.getName() || "unnamed").trim();
      const count = indices ? indices.getCount() : position.getCount();

      const local = [0, 0, 0];
      const c = [0, 0, 0, 0];
      const tri = [[], [], []];

      for (let i = 0; i < count; i += 3) {
        let sx = 0;
        let sy = 0;
        let sz = 0;
        for (let k = 0; k < 3; k++) {
          const v = indices ? indices.getScalar(i + k) : i + k;
          position.getElement(v, local);
          const [x, y, z] = local;
          tri[k] = [
            m[0] * x + m[4] * y + m[8] * z + m[12] - cx,
            m[1] * x + m[5] * y + m[9] * z + m[13],
            m[2] * x + m[6] * y + m[10] * z + m[14] - cz,
          ];
          sx += tri[k][0];
          sy += tri[k][1];
          sz += tri[k][2];
        }
        if (Math.hypot(sx / 3, sz / 3) > shell.reach) continue;

        let part = name;
        let colour = null;
        if (name === VERTEX_COLOURED) {
          color.getElement(indices ? indices.getScalar(i) : i, c);
          colour = c.slice(0, 3);
          if (same(colour, shell.roof)) part = "Roof cover";
          else if (same(colour, shell.wall)) part = "Wall cover";
          else if (GLASS.some((glass) => same(colour, glass))) part = "Glass";
          else if (sy / 3 > shell.wallHead) part = "Roof frame";
          else part = "Joinery";
        }

        if (!buckets.has(part)) buckets.set(part, { positions: [], colours: [], prim, coloured: !!colour });
        const bucket = buckets.get(part);
        for (const p of tri) {
          bucket.positions.push(...p);
          floor = Math.min(floor, p[1]);
          if (colour) bucket.colours.push(...colour);
        }
      }
    }
  }

  const buffer = root.listBuffers()[0];
  for (const [part, bucket] of buckets) {
    const positions = new Float32Array(bucket.positions);
    for (let i = 1; i < positions.length; i += 3) positions[i] -= floor;

    const material = bucket.prim.getMaterial();
    // Covers and glass are repainted by the scene; give them a material of
    // their own rather than the shared vertex-colour one.
    const own = material.clone().setName(part);
    const prim = doc
      .createPrimitive()
      .setMaterial(own)
      .setAttribute(
        "POSITION",
        doc.createAccessor().setType("VEC3").setArray(positions).setBuffer(buffer),
      );
    if (bucket.coloured) {
      prim.setAttribute(
        "COLOR_0",
        doc.createAccessor().setType("VEC3").setArray(new Float32Array(bucket.colours)).setBuffer(buffer),
      );
    }
    out.addChild(doc.createNode(part).setMesh(doc.createMesh(part).addPrimitive(prim)));
    console.log(`  ${part.padEnd(40)} ${(positions.length / 9).toLocaleString()} triangles`);
  }

  for (const node of oldNodes) node.dispose();
  for (const mesh of oldMeshes) mesh.dispose();

  for (const prim of root.listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    if (prim.getAttribute("NORMAL")) continue;
    creaseNormals(doc, prim);
  }
  for (const prim of root.listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    prim.setAttribute("TEXCOORD_0", null);
  }

  await doc.transform(prune(), dedup(), weld(), meshopt({ encoder: MeshoptEncoder, level: "high" }));

  const dir = path.join("public/models", shell.id);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "exterior.glb");
  await io.write(file, doc);
  console.log(`  → ${file}: ${(fs.statSync(file).size / 1024).toFixed(0)}KB, base was at y = ${floor.toFixed(2)}`);
}
