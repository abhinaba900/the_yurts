/**
 * VR / 360° SCENES.
 *
 * Every viewpoint in the experience is declared here. To go live with real
 * capture:
 *
 *   1. Drop the equirectangular image into /public/vr/
 *   2. Set `src: "/vr/<file>"` on the matching scene below
 *
 * Nothing else changes — the hotspots, the navigation and the viewer are all
 * driven from this file. Until `src` is set, the viewer renders a generated
 * reference panorama showing the expected filename and a yaw grid, so the
 * experience is genuinely testable before any photography exists.
 *
 * EQUIRECTANGULAR, 2:1 ratio. 4096×2048 is a sensible delivery size; anything
 * above 8192 wide will fail to upload as a texture on some mobile GPUs.
 *
 * ANGLES. `yaw` is degrees clockwise from the scene's forward direction, so 0 is
 * straight ahead, 90 is to the right, -90 to the left, 180 behind. `pitch` is
 * degrees above (positive) or below (negative) the horizon.
 */

/* -------------------------------------------------------------------------- */
/* The 3D model on the stage                                                  */
/* -------------------------------------------------------------------------- */

export type VrModel = {
  /**
   * Sketchfab model UID — the 32 hex characters at the end of the model's URL
   * (sketchfab.com/3d-models/<slug>-<uid>), or in Share → Embed.
   */
  id: string;
  title: string;
  /**
   * Set true when the viewer hides its own chrome, which turns off the crop in
   * `SketchfabStage`.
   *
   * That happens when the model is on the Theyurts account AND the plan honours
   * the `ui_*` embed options — Sketchfab gates several of them (the title/author
   * bar, the watermark) behind a paid tier, so ownership alone is not always
   * enough. It is therefore something to confirm by looking, not to assume:
   *
   *   - switch the model over and set this true;
   *   - if Sketchfab's bars are gone, it is correct;
   *   - if they are still showing, set it back to false and the crop takes them
   *     off as it does today. Nothing else needs changing either way.
   *
   * The crop is a blunt instrument — it also removes the author credit, which
   * Sketchfab's embed terms ask us to keep. That only stops being a problem once
   * the model on the stage is our own, which is the point of replacing it.
   */
  owned: boolean;
  /** Author credit. Meaningful only while `owned` is false. */
  author?: { name: string; url: string };
};

/**
 * CURRENT STATE — this is a placeholder model and not a Theyurts yurt.
 *
 * It is a third-party Mongolian ger: red felt, ornate carpets, painted furniture.
 * It is the wrong building to be showing on a page selling a modern UPVC-windowed
 * structure, and it is not ours to strip the credit from.
 *
 * TO REPLACE IT with the workshop's own model: upload the SketchUp file to the
 * Theyurts Sketchfab account — Sketchfab imports `.skp` natively, so the model
 * does not need converting first — then set `id` to the new UID, `title` to the
 * model's name, `owned` to true, and delete `author`. Nothing else changes.
 */
export const vrModel: VrModel = {
  id: "9dbc41311f4543e79fbb6bf2d30aacaf",
  title: "Tent - Yurt V2 (With Cloth Simulation)",
  owned: false,
  // Recorded so the credit the crop removes is at least written down somewhere.
  // Read off the viewer chrome itself; the /models/<uid> form resolves to the
  // model page without needing its slug.
  author: {
    name: "Aykut Serin",
    url: "https://sketchfab.com/models/9dbc41311f4543e79fbb6bf2d30aacaf",
  },
};

/* -------------------------------------------------------------------------- */
/* 360° scenes                                                                */
/* -------------------------------------------------------------------------- */

export type VrHotspot = {
  yaw: number;
  pitch: number;
  label: string;
  /** Scene id this hotspot moves to. */
  to: string;
};

export type VrScene = {
  id: string;
  label: string;
  /** Expected filename from the client. Shown on the placeholder. */
  file: string;
  /** Direction for whoever captures it. */
  note?: string;
  /** Set this when the real capture lands. */
  src?: string;
  hotspots: VrHotspot[];
};

export const vrScenes: VrScene[] = [
  {
    id: "approach",
    label: "Approach",
    file: "vr-approach-360.jpg",
    note: "Shot from the path, a few metres back from the door, tripod at eye height.",
    src: "/vr/vr-approach-360.jpg",
    hotspots: [{ yaw: 0, pitch: -4, label: "Go inside", to: "interior" }],
  },
  {
    id: "interior",
    label: "Inside",
    file: "vr-interior-360.jpg",
    note: "Centre of the floor, under the crown, tripod at seated eye height.",
    src: "/vr/vr-interior-360.jpg",
    hotspots: [
      { yaw: 180, pitch: -6, label: "Back outside", to: "approach" },
      { yaw: 0, pitch: 62, label: "Look up at the crown", to: "crown" },
      { yaw: -78, pitch: -10, label: "The bed", to: "sleeping" },
    ],
  },
  {
    id: "crown",
    label: "The crown",
    file: "vr-crown-360.jpg",
    note: "Directly beneath the crown wheel, camera looking up. Roof poles radiating.",
    src: "/vr/vr-crown-360.jpg",
    hotspots: [{ yaw: 0, pitch: -55, label: "Back down", to: "interior" }],
  },
  {
    id: "sleeping",
    label: "Sleeping",
    file: "vr-sleeping-360.jpg",
    note: "From the bed, looking back into the room and towards the door.",
    src: "/vr/vr-sleeping-360.jpg",
    hotspots: [{ yaw: 92, pitch: -6, label: "Back to the centre", to: "interior" }],
  },
];

export const defaultSceneId = vrScenes[0].id;

export const hasVrAssets = vrScenes.some((scene) => Boolean(scene.src));
