"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ThemeToggle } from "./theme-toggle";
import { person, sections } from "@/lib/content";

const tabs = [
  { href: "/", label: "Profile" },
  { href: "/channels", label: "Channels" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onProfile = pathname === "/";
  const active = useActiveSection(onProfile);
  const lifted = useScrolled();

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-paper/85 backdrop-blur-md transition-colors duration-300 ${
        lifted ? "border-rule" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm border border-rule-strong font-serif text-[13px] font-semibold tracking-tight text-ink transition group-hover:border-accent group-hover:text-accent">
            HL
          </span>
          <span className="font-serif text-[15px] font-semibold tracking-tight text-ink">
            {person.name}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Sections">
          {onProfile &&
            sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`text-[13px] transition ${
                  active === s.id ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            ))}
        </nav>

        <div className={`flex items-center gap-2 ${onProfile ? "lg:ml-6" : "ml-auto"}`}>
          <div
            className="flex items-center rounded-full border border-rule bg-sunk p-0.5"
            role="tablist"
            aria-label="Site sections"
          >
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  role="tab"
                  aria-selected={isActive}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                    isActive
                      ? "bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Below lg the section links move to their own scrollable row, because a
          phone is where most of these links get opened and there was no way to
          jump between sections there at all. */}
      {onProfile ? (
        <nav
          aria-label="Sections"
          className="scrollbar-none flex gap-5 overflow-x-auto border-t border-rule px-5 py-2.5 sm:px-8 lg:hidden"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`shrink-0 text-[13px] whitespace-nowrap transition ${
                active === s.id ? "text-ink" : "text-ink-muted"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Adds the bottom rule only once the page has moved, so the hero sits clean. */
function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
}

/**
 * Highlights the section nearest the top of the viewport. The band stops short
 * of the bottom so the last section can win while it is still on screen.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [enabled]);

  // Held rather than cleared when disabled, so navigating away and back does
  // not have to re-observe before the nav looks right.
  return enabled ? active : null;
}
