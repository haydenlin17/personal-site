"use client";

import { useEffect } from "react";

/**
 * Forces the profile page to open at the top.
 *
 * Turning off `history.scrollRestoration` stops the browser restoring a
 * position, but the App Router keeps its own record and reapplies it on a back
 * navigation, which landed people in the middle of the About section after they
 * came back from Channels. This runs after that has happened and puts the page
 * where it should have been.
 *
 * An anchor link is left alone: arriving at /#education should go to Education.
 */
export function ScrollToTop() {
  useEffect(() => {
    if (window.location.hash) return;

    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    // The router restores its position after paint, so claim the frame after it.
    const frame = requestAnimationFrame(toTop);
    const timer = setTimeout(toTop, 80);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
