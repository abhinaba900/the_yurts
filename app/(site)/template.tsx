"use client";

import { useEffect, useState } from "react";

/**
 * Page transition.
 *
 * Only client-side navigations animate. The first load renders untouched —
 * animating opacity from zero on first paint would delay Largest Contentful
 * Paint for an effect nobody arriving on the page has anything to compare
 * against.
 *
 * The animation itself is a CSS keyframe (see base.css), so this component ships
 * no animation code at all.
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div {...(animate ? { "data-page-transition": "" } : {})}>{children}</div>;
}
