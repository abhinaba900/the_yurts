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
