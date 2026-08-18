"use client";

import { useEffect, useRef, useState } from "react";

const nf = new Intl.NumberFormat("en-US");

/** Never project more than this far past the last real reading. */
const MAX_DRIFT_S = 24 * 60 * 60;

/**
 * A number that counts up on arrival and, when given a rate, keeps climbing
 * afterwards.
 *
 * State starts at the real value so the server renders the real number: a
 * crawler, a reader with JavaScript off, and the pre-hydration paint all see
 * something true. The counter starts at zero, so the first effect after
 * hydration still runs the full count up.
 *
 * With `perSecond` set, the target is the reading plus however long ago it was
 * taken, which is what keeps a view count moving between ten minute polls
 * instead of sitting still like a screenshot.
 */
export function CountUp({
  value,
  perSecond = 0,
  since,
  duration = 1100,
}: {
  value: number;
  perSecond?: number;
  /** ISO timestamp `value` was measured. Drift is counted from here. */
  since?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  /** Mirrors `shown` so an interrupted animation can resume from where it was. */
  const current = useRef(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const sampledAt = since ? Date.parse(since) : Date.now();
    /** The value as it should be right now: reading plus elapsed time. */
    const projected = () => {
      if (perSecond <= 0) return value;
      const elapsed = Math.min(MAX_DRIFT_S, Math.max(0, (Date.now() - sampledAt) / 1000));
      return value + perSecond * elapsed;
    };

    const reduced =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // No sweep and no per-frame movement. The number still tracks reality,
      // it just steps there once a second instead of gliding.
      const apply = () => {
        current.current = Math.round(projected());
        from.current = current.current;
        setShown(current.current);
      };
      // Scheduled rather than called outright: a synchronous setState in an
      // effect body is the cascading-render pattern React warns about.
      const first = requestAnimationFrame(apply);
      const id = perSecond > 0 ? setInterval(apply, 1000) : undefined;
      return () => {
        cancelAnimationFrame(first);
        if (id !== undefined) clearInterval(id);
      };
    }

    const start = from.current;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      // easeOutExpo: fast out of the gate, then settles onto the real number.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const next = Math.round(start + (projected() - start) * eased);

      // Only re-render when a digit actually changes. At a couple of views a
      // second that is once a second, not sixty times.
      if (next !== current.current) {
        current.current = next;
        setShown(next);
      }
      if (p < 1 || perSecond > 0) frame.current = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      from.current = current.current;
    };
  }, [value, perSecond, since, duration]);

  return <span className="tnum">{nf.format(shown)}</span>;
}
