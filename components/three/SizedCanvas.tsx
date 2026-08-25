"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

/**
 * A Canvas that knows how big it is.
 *
 * React Three Fiber measures itself with a ResizeObserver whose initial
 * observation cannot be relied on to fire. When it does not, the root is never
 * created: the canvas sits at its intrinsic 300x150 with nothing drawn, and only
 * corrects if the window happens to be resized. That is a blank 3D feature for
 * anyone who does not resize their browser.
 *
 * So the measurement is owned here instead:
 *
 *  1. Measure the container directly, with a ResizeObserver plus an
 *     animation-frame re-check for layouts that settle late (anything sized in
 *     `svh` does).
 *  2. Mount the Canvas only once there is a real size, at explicit pixels.
 *  3. If the renderer still has not taken that size, dispatch resize events —
 *     bounded, and self-cancelling the moment it has. Where the observer behaves
 *     normally the first check passes and this does nothing at all.
 *
 * Shared by the 3D builder and the VR viewer so the workaround exists once.
 */
export function SizedCanvas({
  children,
  className,
  ...canvasProps
}: { children: React.ReactNode; className?: string } & Omit<CanvasProps, "children">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const hasSize = size.width > 0 && size.height > 0;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize((current) =>
        Math.abs(current.width - rect.width) < 1 &&
        Math.abs(current.height - rect.height) < 1
          ? current
          : { width: rect.width, height: rect.height },
      );
    };

    measure();
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasSize) return;

    let attempts = 0;
    let timer = 0;

    const tick = () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (!canvas) return;
      if (Math.abs(canvas.clientWidth - size.width) < 2) return;

      window.dispatchEvent(new Event("resize"));
      if (++attempts < 10) timer = window.setTimeout(tick, 100);
    };

    timer = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timer);
  }, [hasSize, size.width]);

  return (
    <div ref={containerRef} className={className ?? "size-full"}>
      {hasSize ? (
        <Canvas
          {...canvasProps}
          style={{ ...canvasProps.style, width: size.width, height: size.height }}
        >
          {children}
        </Canvas>
      ) : null}
    </div>
  );
}
