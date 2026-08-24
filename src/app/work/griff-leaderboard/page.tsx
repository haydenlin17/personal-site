import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { leaderboard } from "@/lib/griff";

export const metadata: Metadata = {
  title: "Griff leaderboard",
  description:
    "Top thirty balances from the Discord economy behind the channels, with member names redacted.",
};

export default function GriffLeaderboard() {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
      <Link
        href="/#work"
        className="group inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-3.5 transition group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Projects
      </Link>

      <header className="mt-8 border-b border-rule pb-8">
        <p className="eyebrow">Community Economy</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
          Griff leaderboard
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">
          The top thirty balances in the economy. Commands average out to roughly 200 gems
          each.
        </p>
      </header>

      <ol className="mt-2">
        {leaderboard.map((row) => (
          <li
            key={row.rank}
            className="flex items-center gap-4 border-b border-rule py-3.5 last:border-b-0"
          >
            <span className="tnum w-10 shrink-0 text-[13px] font-semibold text-ink-muted">
              {row.rank}
            </span>

            {row.avatar ? (
              <Image
                src={`/griff/${row.avatar}`}
                alt=""
                width={96}
                height={96}
                loading="eager"
                className="size-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="size-8 shrink-0 rounded-full bg-sunk" />
            )}

            {/* The name that was here, redacted to a bar rather than shown. */}
            <span
              aria-label="name redacted"
              className="inline-block h-3.5 shrink-0 rounded-sm bg-rule"
              style={{ width: `${row.nameWidth}px`, maxWidth: "40vw" }}
            />

            <span className="ml-auto flex shrink-0 items-center gap-1.5">
              <span className="tnum font-serif text-[16px] font-semibold text-ink">
                {row.amount}
              </span>
              {/* The currency the balances are denominated in. */}
              <Image
                src="/griff/gem.png"
                alt="gems"
                width={72}
                height={72}
                loading="eager"
                className="size-[15px] shrink-0"
              />
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-8 border-t border-rule pt-6 text-[13px] leading-relaxed text-ink-muted">
        Read from the UnbelievaBoat leaderboard for the server. Balances are unedited. Each bar is
        as wide as the name it replaces, so the column keeps the shape of the real list.
      </p>
    </article>
  );
}
