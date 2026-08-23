"use client";

import { useSyncExternalStore } from "react";

/**
 * The class on <html> is the single source of truth: the inline script in the
 * root layout sets it before first paint, and this button reads it back rather
 * than keeping a second copy in React state. Subscribing to the attribute keeps
 * the icon honest even if something else flips the theme.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");
/** The server cannot know the visitor's choice, so it always renders light. */
const serverSnapshot = () => false;

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private browsing can refuse writes. The class still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-rule text-ink-soft transition hover:border-rule-strong hover:text-ink"
    >
      <ContrastIcon flipped={dark} />
    </button>
  );
}

/**
 * A disc with one half filled, the same mark in both themes and simply turned
 * over. Reads as contrast rather than as weather, and sidesteps the sun and
 * moon that every other site reaches for.
 */
function ContrastIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-[17px] transition-transform duration-500 ${flipped ? "rotate-180" : ""}`}
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" />
    </svg>
  );
}
