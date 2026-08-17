"use client";

import { useEffect, useRef, useState } from "react";

const nf = new Intl.NumberFormat("en-US");

/**
 * Counts from the previously shown number up to the new one.
 *
 * State starts at the real value so the server renders the real number: a
 * crawler, a reader with JavaScript off, and the pre-hydration paint all see
 * something true. The counter starts at zero, so the first effect after
 * hydration still runs the full count up.
 */
export function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  /** Mirrors `shown` so an interrupted animation can resume from where it was. */
  const current = useRef(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = from.current;
    const delta = value - start;
    if (delta === 0) return;

    const reduced =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduced ? 0 : duration;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = ms === 0 ? 1 : Math.min(1, (now - t0) / ms);
      // easeOutExpo: fast out of the gate, then settles onto the real number.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      current.current = Math.round(start + delta * eased);
      setShown(current.current);
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      from.current = current.current;
    };
  }, [value, duration]);

  return <span className="tnum">{nf.format(shown)}</span>;
}
