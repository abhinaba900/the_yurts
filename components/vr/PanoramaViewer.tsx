"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  clampPitch,
  cameraEulerFromAngles,
  directionFromAngles,
  normaliseYaw,
  yawDelta,
} from "@/lib/vr";
import type { VrHotspot, VrScene } from "@/data/vr";
import { createPlaceholderPanorama, loadPanorama } from "./panoramaTexture";

/**
 * The 360° scene: an inside-out sphere with the panorama on it, a camera at the
 * centre, and hotspots placed by angle.
 *
 * ORIENTATION. A three.js sphere puts texture u=0.5 on +X. Scaling x by −1 turns
 * the sphere inside out (which is what makes the panorama visible from within,
 * and unmirrored) and carries that point to −X. A −90° turn about Y then brings
 * it to −Z, which is forward. Net effect: the centre of an equirectangular image
 * faces the viewer's initial heading, which is how every delivered panorama is
 * composed.
 */

const SPHERE_RADIUS = 500;
const HOTSPOT_DISTANCE = 300;

/** Look controls: drag to turn, wheel to zoom, with damping. */
type DragState = { moved: number };

function LookControls({
  yawRef,
  pitchRef,
  enabled,
  onInteract,
  dragRef,
}: {
  yawRef: React.RefObject<number>;
  pitchRef: React.RefObject<number>;
  enabled: boolean;
  onInteract: () => void;
  dragRef: React.RefObject<DragState>;
}) {
  const { camera, gl, invalidate } = useThree();
  const current = useRef({ yaw: yawRef.current, pitch: pitchRef.current });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = gl.domElement;
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      dragging.current = true;
      dragRef.current.moved = 0;
      last.current = { x: event.clientX, y: event.clientY };
      // Capture keeps the drag alive if the pointer leaves the canvas. It can
      // throw if the pointer is already gone, which must not abort the drag.
      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        // Non-fatal: dragging still works, it just stops at the canvas edge.
      }
      element.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;

      // Scaled by field of view so zoomed-in dragging is not hypersensitive.
      const perspective = camera as THREE.PerspectiveCamera;
      const speed = perspective.fov / 1400;

      yawRef.current = normaliseYaw(
        yawRef.current - (event.clientX - last.current.x) * speed,
      );
      pitchRef.current = clampPitch(
        pitchRef.current + (event.clientY - last.current.y) * speed,
      );

      dragRef.current.moved +=
        Math.abs(event.clientX - last.current.x) +
        Math.abs(event.clientY - last.current.y);

      last.current = { x: event.clientX, y: event.clientY };
      onInteract();
      invalidate();
    };

    const endDrag = (event: PointerEvent) => {
      dragging.current = false;
      try {
        if (element.hasPointerCapture(event.pointerId)) {
          element.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Already released.
      }
      element.style.cursor = "grab";
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const perspective = camera as THREE.PerspectiveCamera;
      perspective.fov = Math.max(30, Math.min(88, perspective.fov + event.deltaY * 0.05));
      perspective.updateProjectionMatrix();
      invalidate();
    };

    element.style.cursor = "grab";
    element.style.touchAction = "none";
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", endDrag);
    element.addEventListener("pointercancel", endDrag);
    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", endDrag);
      element.removeEventListener("pointercancel", endDrag);
      element.removeEventListener("wheel", onWheel);
      element.style.cursor = "";
    };
  }, [camera, gl, invalidate, enabled, onInteract, yawRef, pitchRef, dragRef]);

  useFrame(() => {
    // Damp towards the target, taking the short way across the seam.
    const dYaw = yawDelta(current.current.yaw, yawRef.current);
    const dPitch = pitchRef.current - current.current.pitch;

    if (Math.abs(dYaw) < 0.01 && Math.abs(dPitch) < 0.01) {
      current.current.yaw = yawRef.current;
      current.current.pitch = pitchRef.current;
    } else {
      current.current.yaw = normaliseYaw(current.current.yaw + dYaw * 0.18);
      current.current.pitch += dPitch * 0.18;
      // Keep the frames coming until it has settled.
      invalidate();
    }

    const euler = cameraEulerFromAngles(current.current.yaw, current.current.pitch);
    camera.rotation.set(euler.x, euler.y, euler.z, "YXZ");
  });

  return null;
}

function Hotspot({
  hotspot,
  onSelect,
  dragRef,
}: {
  hotspot: VrHotspot;
  onSelect: (to: string) => void;
  dragRef: React.RefObject<DragState>;
}) {
  const [hovered, setHovered] = useState(false);

  const position = useMemo(() => {
    const [x, y, z] = directionFromAngles(hotspot.yaw, hotspot.pitch);
    return new THREE.Vector3(x, y, z).multiplyScalar(HOTSPOT_DISTANCE);
  }, [hotspot.yaw, hotspot.pitch]);

  // The camera never leaves the origin, so facing the origin once is enough —
  // no per-frame billboarding required.
  const quaternion = useMemo(() => {
    const matrix = new THREE.Matrix4().lookAt(
      position,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
    );
    return new THREE.Quaternion().setFromRotationMatrix(matrix);
  }, [position]);

  const scale = hovered ? 1.18 : 1;

  return (
    <group position={position} quaternion={quaternion} scale={scale}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          // A drag that happens to finish over a hotspot is a look, not a click.
          if (dragRef.current.moved > 6) return;
          onSelect(hotspot.to);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        {/* Generous invisible hit area — a thin ring is hard to hit. */}
        <circleGeometry args={[26, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh>
        <ringGeometry args={[17, 20, 48]} />
        <meshBasicMaterial
          color={hovered ? "#f4f1ea" : "#d69a72"}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <circleGeometry args={[5.5, 24]} />
        <meshBasicMaterial
          color={hovered ? "#f4f1ea" : "#d69a72"}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function PanoramaViewer({
  scene,
  yawRef,
  pitchRef,
  controlsEnabled,
  onSelectScene,
  onInteract,
}: {
  scene: VrScene;
  yawRef: React.RefObject<number>;
  pitchRef: React.RefObject<number>;
  controlsEnabled: boolean;
  onSelectScene: (id: string) => void;
  onInteract: () => void;
}) {
  const { invalidate } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const dragRef = useRef<DragState>({ moved: 0 });

  useEffect(() => {
    let cancelled = false;
    let created: THREE.Texture | null = null;

    const apply = (next: THREE.Texture | null) => {
      if (cancelled) {
        next?.dispose();
        return;
      }
      created = next;
      setTexture(next);
      invalidate();
    };

    if (scene.src) {
      loadPanorama(scene.src)
        .then(apply)
        // A missing or broken capture falls back to the reference grid rather
        // than leaving a black sphere with no explanation.
        .catch(() =>
          apply(createPlaceholderPanorama({ file: scene.file, label: scene.label })),
        );
    } else {
      apply(createPlaceholderPanorama({ file: scene.file, label: scene.label }));
    }

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [scene.src, scene.file, scene.label, invalidate]);

  return (
    <>
      <LookControls
        yawRef={yawRef}
        pitchRef={pitchRef}
        enabled={controlsEnabled}
        onInteract={onInteract}
        dragRef={dragRef}
      />

      {/* Rotated so the centre of the image faces forward. */}
      <mesh rotation={[0, -Math.PI / 2, 0]} scale={[-1, 1, 1]}>
        <sphereGeometry args={[SPHERE_RADIUS, 64, 40]} />
        <meshBasicMaterial map={texture ?? undefined} side={THREE.FrontSide} />
      </mesh>

      {scene.hotspots.map((hotspot) => (
        <Hotspot
          key={`${hotspot.to}-${hotspot.yaw}-${hotspot.pitch}`}
          hotspot={hotspot}
          onSelect={onSelectScene}
          dragRef={dragRef}
        />
      ))}
    </>
  );
}
