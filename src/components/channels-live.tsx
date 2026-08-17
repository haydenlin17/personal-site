"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CountUp } from "./count-up";
import type { ChannelStats, StatsPayload } from "@/lib/youtube";

/** How often the page asks again. The endpoint itself is cached for ten minutes. */
const REFRESH_MS = 60_000;

/**
 * The server hands over a full payload, so the page paints real numbers with no
 * skeleton and no layout shift. Everything here is about keeping those numbers
 * current afterwards.
 */
export function ChannelsLive({ initial }: { initial: StatsPayload }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [failing, setFailing] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/channels", { cache: "no-store" });
      if (!res.ok) throw new Error(`request failed with ${res.status}`);
      setData((await res.json()) as StatsPayload);
      setFailing(false);
    } catch {
      // The numbers already on screen stay on screen; only the label changes.
      setFailing(true);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    // Confirm the server's snapshot once the page has painted, then keep it warm.
    const first = setTimeout(refresh, 400);
    const id = setInterval(refresh, REFRESH_MS);
    // Coming back to the tab should show current numbers, not whatever was on
    // screen when it was backgrounded.
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    <>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
        <Total label="Total subscribers" value={data.totals.subscribers} />
        <Total label="Lifetime views" value={data.totals.views} />
        <Total label="Videos published" value={data.totals.videos} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] text-ink-muted">
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${
              data.degraded || failing ? "bg-rule-strong" : "bg-accent"
            } ${loading ? "animate-pulse" : ""}`}
          />
          {data.degraded || failing ? "Showing cached numbers" : "Live from YouTube"}
          <span className="text-rule-strong">/</span>
          <RelativeTime iso={data.fetchedAt} />
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="rounded-full border border-rule px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-rule-strong hover:text-ink disabled:opacity-50"
        >
          {loading ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {data.channels.map((c) => (
          <ChannelCard key={c.handle} channel={c} />
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-ink-muted">
        Subscriber counts are read straight from YouTube, which publishes them rounded to three
        significant figures. View and video counts are exact. The page refreshes every minute.
      </p>
    </>
  );
}

function ChannelCard({ channel: c }: { channel: ChannelStats }) {
  return (
    <article
      className={`rounded-lg border border-rule bg-surface p-5 transition hover:border-rule-strong ${
        c.flagship ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <Avatar src={c.avatar} name={c.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h3 className="font-serif text-lg leading-snug font-semibold tracking-tight text-ink">
              {c.name}
            </h3>
            {c.flagship ? (
              <span className="rounded-full border border-rule bg-sunk px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                Flagship
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            @{c.handle}
            <span className="mx-1.5 text-rule-strong">/</span>
            {c.niche}
          </p>
        </div>
        <a
          href={c.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full border border-rule px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:border-rule-strong hover:text-ink"
        >
          Visit
        </a>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-rule pt-4">
        <Stat label="Subscribers" value={c.subscribers} />
        <Stat label="Views" value={c.views} />
        <Stat label="Videos" value={c.videos} />
      </dl>

      {c.source === "cached" ? (
        <p className="mt-3 text-[12px] text-ink-muted">
          YouTube did not answer just now. Showing the last verified numbers.
        </p>
      ) : null}
    </article>
  );
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface px-6 py-7">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-[clamp(1.9rem,4.5vw,2.6rem)] leading-none font-semibold tracking-tight text-ink">
        <CountUp value={value} />
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="tnum mt-1 font-serif text-[17px] font-semibold text-ink">
        <CountUp value={value} />
      </dd>
    </div>
  );
}

function Avatar({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="grid size-11 shrink-0 place-items-center rounded-full border border-rule bg-sunk font-serif text-[15px] font-semibold text-ink-muted">
        {name.charAt(0)}
      </div>
    );
  }
  return (
    // A plain img keeps this out of the image optimizer: Google signs these URLs
    // and rotates them, so there is nothing stable to cache on our side.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={44}
      height={44}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-11 shrink-0 rounded-full border border-rule object-cover"
    />
  );
}

/**
 * `now` lives in state rather than being read during render, so the component
 * stays pure. Until the first tick lands the label reads "just now", which is
 * true: the payload it describes has only just arrived.
 */
function RelativeTime({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <span>updated just now</span>;
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 15) return <span>updated just now</span>;
  if (seconds < 90) return <span>updated {seconds}s ago</span>;
  if (seconds < 5400) return <span>updated {Math.round(seconds / 60)}m ago</span>;
  return <span>updated {Math.round(seconds / 3600)}h ago</span>;
}
