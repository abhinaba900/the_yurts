/**
 * Turns the client's 6m, 7m and 10m exterior exports into the builder's shells.
 *
 *   node --max-old-space-size=8192 scripts/optimize-yurt-shells.mjs
 *
 * THE SOURCES. "6M Yurt.glb", "7M Yurt.glb" and "10M Yurt.glb" are SketchUp exports of a
 * colour catalogue: 34 copies of the same yurt in a grid, each with a
 * different roof and wall cover. Everything is in one vertex-coloured mesh,
 * plus a handful of material meshes (frames, crown dome).
 *
 * The builder recolours the covers itself, so only ONE copy is needed per size.
 * This takes the copy at `centre`, and splits its vertex-coloured mesh into the
 * parts the scene paints and pulls apart, named so `data/yurtModel.ts` can find
 * them:
 *
 *   Base         the flat ring the wall stands on, at floor level
 *   Roof cover   the copy's roof colour — roof and valance
 *   Wall cover   the copy's wall colour
 *   Glass        window and door panes, drawn as glass by the scene
 *   Roof frame   anything else above the wall head (crown ring, rafters)
 *   Joinery      everything else (window frames, handles, wall band)
 *
 * THE FLOOR is not in that mesh. Each size is drawn on a board of its own —
 * `[Wood Floor]1` on the 6m, `[Wood Lumber ButtJoined]` on the 7m,
 * `Wood_Floor_01_1K` on the 10m — a textured material, flat, at floor level.
 * It is kept whole, texture and UVs and all, as the "Floor" part, so the
 * builder shows the boards the client drew rather than a flat disc of colour.
 * It is the one part of the shell that keeps a map; everything else is drawn
 * in flat colour, so every other UV and image still comes out.
 *
 * THE BASE is what the yurt stands on, and it is drawn, not invented: a ring
 * below the floor, capped by a flat lip at floor level. Measured off the
 * exports, in millimetres:
 *
 *            outer r   thickness   top (floor)   bottom   height
 *     6m      3036        72           300          75      225
 *     7m      3521        42           300         200      100
 *    10m      5067       134           220        -275      495
 *
 * It is that ring's outside face, below the wall, that reads as the band
 * around the foot of the yurt. How far it stands proud of the wall is whatever
 * the drawing does — 26mm on the 10m, 7mm on the 6m, nothing at all on the 7m
 * — so the band is the ring's HEIGHT, not an overhang, and it must be kept to
 * be seen. Everything below floor level used to be thrown away as a ground
 * slab, which is why the yurt appeared to run straight into the deck.
 *
 * It comes out of the vertex-coloured mesh in whatever cover colour that copy
 * was drawn in, so it is pulled out as a part of its own and the builder
 * paints it with the deck, which is what it is the edge of.
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
import sharp from "sharp";
import * as THREE from "three";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Faces meeting at more than this are drawn with a hard edge. */
const CREASE_ANGLE = (35 * Math.PI) / 180;

/** The part, mesh and material name the floor is written out under. */
const FLOOR = "Floor";

/** The ring the wall stands on, at floor level. */
const BASE = "Base";

/** Longest side of the floor image kept in the shell, in pixels. */
const FLOOR_TEXTURE_SIZE = 512;

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
    roof: rgb255(84, 60, 35),
    wall: rgb255(43, 43, 43),
    wallHead: 2.95,
    floorY: 0.22,
    floorMaterial: "Wood_Floor_01_1K",
  },
  {
    id: "yurt-6m",
    source: "public/3D-Modal/6M Yurt.glb",
    centre: [3.1, 41.7],
    reach: 4.5,
    roof: rgb255(107, 41, 0),
    wall: rgb255(43, 43, 43),
    wallHead: 2.55,
    floorY: 0.30,
    floorMaterial: "[Wood Floor]1",
  },
  {
    id: "yurt-7m",
    source: "public/3D-Modal/7M Yurt.glb",
    centre: [8.8, 96.7],
    reach: 5.0,
    roof: rgb255(107, 41, 0),
    wall: rgb255(43, 43, 43),
    wallHead: 2.55,
    floorY: 0.30,
    floorMaterial: "[Wood Lumber ButtJoined]",
  },
];

const GLASS = [rgb255(0, 0, 0), rgb255(30, 30, 30), rgb255(146, 232, 146)];
const VERTEX_COLOURED = "SKP Vertex Colors";

/**
 * The 2025 re-exports moved the window and door panes out of the
 * vertex-coloured mesh and into materials of their own. They are drawn as
 * glass by the scene, so they all become one "Glass" part.
 */
const GLASS_MATERIALS = new Set(["Glass Generic", "Glass Black", "[Color M08]"]);

/**
 * The named materials the shell keeps: the crown dome, and the door and window
 * joinery. Everything else named — the fit-out the client now leaves in the
 * exterior exports (wall lining, veneer, wood floors) and SketchUp's edge
 * overlay — is dropped: the builder stands the chosen interior inside this
 * shell, and a second copy of the fit-out would fight with it.
 */
const KEEP_MATERIALS = new Set([
  "[Translucent Glass Sky Reflection]2",
  "Charcoal Blue",
  "Charcoal Blue1",
]);

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
      // SketchUp now exports its edge overlay as a line soup; skip anything
      // that is not triangles.
      if (prim.getMode() !== 4) continue;
      const position = prim.getAttribute("POSITION");
      const color = prim.getAttribute("COLOR_0");
      const uv = prim.getAttribute("TEXCOORD_0");
      const indices = prim.getIndices();
      const name = (prim.getMaterial()?.getName() || mesh.getName() || "unnamed").trim();
      const isFloor = name === shell.floorMaterial;
      if (
        name !== VERTEX_COLOURED &&
        !KEEP_MATERIALS.has(name) &&
        !GLASS_MATERIALS.has(name) &&
        !isFloor
      ) {
        continue;
      }
      const count = indices ? indices.getCount() : position.getCount();

      const local = [0, 0, 0];
      const c = [0, 0, 0, 0];
      const t = [0, 0];
      const tri = [[], [], []];
      const uvTri = [[], [], []];

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
          if (uv) {
            uv.getElement(v, t);
            uvTri[k] = [t[0], t[1]];
          }
          sx += tri[k][0];
          sy += tri[k][1];
          sz += tri[k][2];
        }
        if (Math.hypot(sx / 3, sz / 3) > shell.reach) continue;
        // Below floor level is the ring the yurt stands on. It is kept as the
        // base; nothing else of the copy is drawn down there. The margin is
        // only a couple of millimetres: at two centimetres the top of the ring
        // fell through to the colour tests below and came out as roof cover,
        // leaving a stripe of the wrong colour between the wall and the band.
        const below = sy / 3 < shell.floorY - 0.002;
        if (below && name !== VERTEX_COLOURED) continue;

        let part = GLASS_MATERIALS.has(name) ? "Glass" : name;
        let colour = null;
        if (isFloor) {
          // The board material is used for odd bits of joinery too, so take
          // only the flat sheet lying at floor level: that is the floor.
          const flat = tri.every((p) => Math.abs(p[1] - tri[0][1]) < 0.005);
          if (!flat || Math.abs(sy / 3 - shell.floorY) > 0.02) continue;
          part = "Floor";
        } else if (name === VERTEX_COLOURED) {
          color.getElement(indices ? indices.getScalar(i) : i, c);
          colour = c.slice(0, 3);
          // The ring below the floor, and the flat lip that caps it at floor
          // level. Both are drawn in a cover colour, so this has to come
          // before the colour tests below or they read as roof or wall.
          const flat = tri.every((p) => Math.abs(p[1] - tri[0][1]) < 0.005);
          if (below || (flat && Math.abs(sy / 3 - shell.floorY) < 0.02)) part = BASE;
          else if (same(colour, shell.roof)) part = "Roof cover";
          else if (same(colour, shell.wall)) part = "Wall cover";
          else if (GLASS.some((glass) => same(colour, glass))) part = "Glass";
          else if (sy / 3 > shell.wallHead) part = "Roof frame";
          else part = "Joinery";
        }

        if (!buckets.has(part)) {
          buckets.set(part, {
            positions: [],
            colours: [],
            uvs: [],
            prim,
            coloured: !!colour,
            textured: isFloor && !!uv,
          });
        }
        const bucket = buckets.get(part);
        for (let k = 0; k < 3; k++) {
          bucket.positions.push(...tri[k]);
          floor = Math.min(floor, tri[k][1]);
          if (colour) bucket.colours.push(...colour);
          if (bucket.textured) bucket.uvs.push(...uvTri[k]);
        }
      }
    }
  }

  const buffer = root.listBuffers()[0];
  for (const [part, bucket] of buckets) {
    const positions = new Float32Array(bucket.positions);
    // Stand the yurt on its floor, not on whatever stray triangle sits lowest.
    for (let i = 1; i < positions.length; i += 3) positions[i] -= shell.floorY;

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
    if (bucket.textured) {
      prim.setAttribute(
        "TEXCOORD_0",
        doc.createAccessor().setType("VEC2").setArray(new Float32Array(bucket.uvs)).setBuffer(buffer),
      );
      // The floor is a flat sheet, so its normals are known: giving them here
      // keeps it out of the creasing pass below, which welds vertices and
      // would leave the boards' UVs attached to the wrong corners.
      const up = new Float32Array(positions.length);
      for (let i = 1; i < up.length; i += 3) up[i] = 1;
      prim.setAttribute(
        "NORMAL",
        doc.createAccessor().setType("VEC3").setArray(up).setBuffer(buffer),
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
    if (prim.getMaterial()?.getName() === FLOOR) continue;
    prim.setAttribute("TEXCOORD_0", null);
  }

  // The 2025 re-exports carry SketchUp's texture images. Every part but the
  // floor is drawn in flat colour — the builder paints the covers itself — so
  // the UVs above and the maps here come out, and `prune()` drops the images
  // with them. The floor keeps its base colour map: the boards the client drew.
  for (const material of root.listMaterials()) {
    const keepBoards = material.getName() === FLOOR;
    if (!keepBoards) material.setBaseColorTexture(null);
    material
      .setEmissiveTexture(null)
      .setNormalTexture(null)
      .setOcclusionTexture(null)
      .setMetallicRoughnessTexture(null);
  }

  // SketchUp's floor images are up to 1024px of PNG. The floor is mostly
  // covered by the interior and seen from across the room, so half that, as
  // JPEG, is plenty — and keeps the shell under a few hundred KB.
  const boards = root.listMaterials().find((material) => material.getName() === FLOOR);
  const texture = boards?.getBaseColorTexture();
  if (texture) {
    const before = texture.getImage().byteLength;
    const image = await sharp(Buffer.from(texture.getImage()))
      .resize(FLOOR_TEXTURE_SIZE, FLOOR_TEXTURE_SIZE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
    texture.setImage(new Uint8Array(image)).setMimeType("image/jpeg").setURI("");
    console.log(
      `  floor texture ${(before / 1024).toFixed(0)}KB → ${(image.byteLength / 1024).toFixed(0)}KB`,
    );
  }

  await doc.transform(prune(), dedup(), weld(), meshopt({ encoder: MeshoptEncoder, level: "high" }));

  const dir = path.join("public/models", shell.id);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "exterior.glb");
  await io.write(file, doc);
  console.log(`  → ${file}: ${(fs.statSync(file).size / 1024).toFixed(0)}KB, floor at y = ${shell.floorY.toFixed(2)}, lowest ${floor.toFixed(2)}`);
}
