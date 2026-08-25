import * as THREE from "three";

/**
 * Generates a placeholder equirectangular panorama.
 *
 * Not a grey void: a proper reference environment with a horizon, a yaw and
 * pitch grid, degree labels and the filename the scene is waiting for. That
 * makes the viewer genuinely testable before any capture exists — you can see
 * whether dragging tracks correctly, whether a hotspot sits where its angles say
 * it should, and whether the seam is where it belongs.
 *
 * MAPPING. x spans yaw −180°…+180° with 0° at the centre of the image, y spans
 * pitch +90° at the top to −90° at the bottom. That is the standard convention
 * for delivered equirectangular stills, so a real capture drops straight in.
 */
export function createPlaceholderPanorama({
  file,
  label,
}: {
  file: string;
  label: string;
}): THREE.Texture | null {
  if (typeof document === "undefined") return null;

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const horizon = height / 2;

  // Sky — bone down to canvas at the horizon.
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#f4f1ea");
  sky.addColorStop(1, "#dbd2c1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);

  // Ground — sand down to timber.
  const ground = ctx.createLinearGradient(0, horizon, 0, height);
  ground.addColorStop(0, "#c9bda6");
  ground.addColorStop(1, "#6b5138");
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon, width, height - horizon);

  // Grid — every 15° of yaw, every 15° of pitch.
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(88,82,69,0.28)";
  for (let yaw = -180; yaw <= 180; yaw += 15) {
    const x = ((yaw + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let pitch = -75; pitch <= 75; pitch += 15) {
    const y = ((90 - pitch) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Horizon, in clay, heavier than the grid.
  ctx.strokeStyle = "#a8552f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  ctx.lineTo(width, horizon);
  ctx.stroke();

  // Yaw labels along the horizon, every 45°.
  ctx.fillStyle = "#585245";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  for (let yaw = -180; yaw <= 180; yaw += 45) {
    const x = ((yaw + 180) / 360) * width;
    ctx.fillText(`${yaw > 0 ? "+" : ""}${yaw}°`, x, horizon - 16);
  }

  // Pitch labels up the centre.
  ctx.textAlign = "left";
  for (let pitch = -60; pitch <= 60; pitch += 30) {
    if (pitch === 0) continue;
    const y = ((90 - pitch) / 180) * height;
    ctx.fillText(`${pitch > 0 ? "+" : ""}${pitch}°`, width / 2 + 12, y - 8);
  }

  // Zenith and nadir, so up and down are unambiguous.
  ctx.textAlign = "center";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#585245";
  ctx.fillText("UP", width / 2, 54);
  ctx.fillStyle = "#dbd2c1";
  ctx.fillText("DOWN", width / 2, height - 34);

  // The point of the whole thing: what this scene is waiting for.
  ctx.textAlign = "center";
  ctx.fillStyle = "#221f1a";
  ctx.font = "600 26px Inter, system-ui, sans-serif";
  ctx.fillText("360° IMAGE PENDING", width / 2, horizon + 78);
  ctx.font = "44px Georgia, serif";
  ctx.fillText(file, width / 2, horizon + 136);
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#585245";
  ctx.fillText(label.toUpperCase(), width / 2, horizon + 176);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** Loads a real equirectangular image, correctly colour-managed. */
export function loadPanorama(src: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}
