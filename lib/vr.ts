/**
 * Angle conventions for the 360° viewer.
 *
 * Forward is −Z. Yaw is degrees clockwise seen from above, so +90° is to the
 * right. Pitch is degrees above the horizon, so +90° is straight up. This is the
 * convention the scene definitions in `data/vr.ts` are written in, and the one
 * whoever places hotspots will be thinking in.
 *
 * Kept out of the React tree so it can be tested directly.
 */

export const DEG = Math.PI / 180;

/** Unit vector for a yaw/pitch pair, in the convention above. */
export function directionFromAngles(
  yawDeg: number,
  pitchDeg: number,
): [number, number, number] {
  const yaw = yawDeg * DEG;
  const pitch = pitchDeg * DEG;
  const horizontal = Math.cos(pitch);

  return [
    Math.sin(yaw) * horizontal,
    Math.sin(pitch),
    -Math.cos(yaw) * horizontal,
  ];
}

/**
 * Camera euler angles (YXZ order) that look along a yaw/pitch.
 * A camera looks down its own −Z, which is why yaw is negated here.
 */
export function cameraEulerFromAngles(yawDeg: number, pitchDeg: number) {
  return { x: pitchDeg * DEG, y: -yawDeg * DEG, z: 0 };
}

/** Keeps an angle in −180…180 so damping never takes the long way round. */
export function normaliseYaw(deg: number): number {
  let value = ((deg + 180) % 360 + 360) % 360 - 180;
  if (value === -180) value = 180;
  return value;
}

/** Shortest signed distance from one yaw to another, across the seam. */
export function yawDelta(from: number, to: number): number {
  return normaliseYaw(to - from);
}

export const PITCH_LIMIT = 85;

export const clampPitch = (deg: number) =>
  Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, deg));
