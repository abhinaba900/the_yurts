"use client";

import { useEffect, useState } from "react";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Starts false so server and client agree on the first render, then corrects in
 * an effect. Anything that must be right before paint belongs in CSS, where the
 * media query is handled without JavaScript at all — this hook is only for the
 * few places that need the value in JS, such as disabling inertia on 3D
 * controls.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
