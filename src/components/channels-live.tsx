"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CountUp } from "./count-up";
import { privacy, proofShots } from "@/lib/channels";
import { productionTools } from "@/lib/content";
import type { ChannelStats, StatsPayload } from "@/lib/youtube";

/** How often the page asks again. The endpoint itself is cached for ten minutes. */
const REFRESH_MS = 60_000;

const nf = new Intl.NumberFormat("en-US");

/**
 * The server hands over a full payload, so the page paints real numbers with no
 * skeleton and no layout shift. Everything here is about keeping those numbers
 * current afterwards.
 */
export function ChannelsLive({ initial }: { initial: StatsPayload }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [failing, setFailing] = useState(false);
  /** Held briefly after a successful refresh so the click has a visible result. */
  const [confirmed, setConfirmed] = useState(false);
  const inFlight = useRef(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * Set when a person asked for the refresh, as opposed to the timer. Kept in a
   * ref so a click that lands while a background refresh is already running can
   * still claim the acknowledgement when that one finishes, instead of being
   * swallowed by the in-flight guard and looking like a dead button.
   */
  const announce = useRef(false);

  const run = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    const started = Date.now();
    try {
      const res = await fetch("/api/channels", { cache: "no-store" });
      if (!res.ok) throw new Error(`request failed with ${res.status}`);
      setData((await res.json()) as StatsPayload);
      setFailing(false);
      if (announce.current) {
        // The endpoint often answers from the edge cache faster than the eye can
        // register, so hold the spinner long enough to be seen before confirming.
        const elapsed = Date.now() - started;
        if (elapsed < 450) await new Promise((r) => setTimeout(r, 450 - elapsed));
        setConfirmed(true);
        clearTimeout(confirmTimer.current);
        confirmTimer.current = setTimeout(() => setConfirmed(false), 1800);
      }
    } catch {
      // The numbers already on screen stay on screen; only the label changes.
      setFailing(true);
    } finally {
      setLoading(false);
      announce.current = false;
      inFlight.current = false;
    }
  }, []);

  /** What the button calls. Always acknowledges, in flight or not. */
  const requestRefresh = useCallback(() => {
    announce.current = true;
    setLoading(true);
    void run();
  }, [run]);

  useEffect(() => {
    // Confirm the server's snapshot once the page has painted, then keep it warm.
    const first = setTimeout(run, 400);
    const id = setInterval(run, REFRESH_MS);
    // Coming back to the tab should show current numbers, not whatever was on
    // screen when it was backgrounded.
    const onVisible = () => {
      if (document.visibilityState === "visible") void run();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      clearTimeout(confirmTimer.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [run]);

  const stale = data.degraded || failing;

  return (
    <>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
        <Total label="Total subscribers" value={data.totals.subscribers} />
        <Total
          label="Lifetime views"
          value={data.totals.views}
          perSecond={data.totals.viewsPerSecond}
          since={data.fetchedAt}
        />
        <Total label="Videos published" value={data.totals.videos} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] text-ink-muted">
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${stale ? "bg-rule-strong" : "bg-accent"} ${
              loading ? "animate-pulse" : ""
            }`}
          />
          {stale ? "Showing cached numbers" : "Live from YouTube"}
          <span className="text-rule-strong">/</span>
          <RelativeTime iso={data.fetchedAt} />
        </p>
        <button
          type="button"
          onClick={requestRefresh}
          disabled={loading}
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition disabled:opacity-70 ${
            confirmed
              ? "border-accent text-accent"
              : "border-rule text-ink-soft hover:border-rule-strong hover:text-ink"
          }`}
        >
          {confirmed ? (
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
          ) : null}
          {confirmed ? "Updated" : loading ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {privacy.showPerChannel ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.channels.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      ) : null}

      <ProofSection />

      <section className="mt-14 border-t border-rule pt-10">
        <p className="eyebrow">Toolkit</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight font-semibold tracking-tight text-ink">
          What runs the operation
        </h2>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {productionTools.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-rule bg-surface px-3 py-1 text-[13px] text-ink-soft"
            >
              {tool}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ChannelCard({ channel: c }: { channel: ChannelStats }) {
  const label = privacy.anonymous
    ? `Channel ${String(c.index + 1).padStart(2, "0")}`
    : (c.name ?? "Channel");

  return (
    <article
      className={`rounded-lg border border-rule bg-surface p-5 transition hover:border-rule-strong ${
        c.flagship ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <Mark channel={c} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h3 className="font-serif text-lg leading-snug font-semibold tracking-tight text-ink">
              {label}
            </h3>
            {c.flagship ? (
              <span className="rounded-full border border-rule bg-sunk px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                Flagship
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            {privacy.anonymous ? null : (
              <>
                @{c.handle}
                <span className="mx-1.5 text-rule-strong">/</span>
              </>
            )}
            {c.niche}
          </p>
        </div>
        {privacy.anonymous ? null : (
          <a
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-rule px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:border-rule-strong hover:text-ink"
          >
            Visit
          </a>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-rule pt-4">
        <Stat label="Subscribers" value={c.subscribers} />
        <Stat label="Views" value={c.views} perSecond={c.viewsPerSecond} since={c.viewsAt} />
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

/**
 * The card's leading mark. An avatar names the channel as surely as its title
 * does, so while `privacy.anonymous` is on this is just the ordinal.
 */
function Mark({ channel: c }: { channel: ChannelStats }) {
  const [failed, setFailed] = useState(false);

  if (privacy.anonymous) {
    return (
      <div className="tnum grid size-11 shrink-0 place-items-center rounded-full border border-rule bg-sunk font-serif text-[15px] font-semibold text-ink-muted">
        {String(c.index + 1).padStart(2, "0")}
      </div>
    );
  }
  if (!c.avatar || failed) {
    return (
      <div className="grid size-11 shrink-0 place-items-center rounded-full border border-rule bg-sunk font-serif text-[15px] font-semibold text-ink-muted">
        {c.name?.charAt(0) ?? "?"}
      </div>
    );
  }
  return (
    // A plain img keeps this out of the image optimizer: Google signs these URLs
    // and rotates them, so there is nothing stable to cache on our side.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={c.avatar}
      alt=""
      width={44}
      height={44}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-11 shrink-0 rounded-full border border-rule object-cover"
    />
  );
}

function ProofSection() {
  return (
    <section className="mt-16 border-t border-rule pt-10">
      <p className="eyebrow">Receipts</p>
      <h2 className="mt-2 font-serif text-2xl leading-tight font-semibold tracking-tight text-ink">
        Peak 48 hour windows
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">
        Each of these is a two day window from YouTube Studio, the private dashboard behind a
        channel. The large number is how many times the videos were watched across those 48 hours,
        and the bars underneath show when those views came in. Cropped above the video list, so they
        show the totals and the shape of the traffic and nothing else.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofShots.map((shot) => (
          <figure key={shot.src} className="overflow-hidden rounded-lg border border-rule bg-black">
            <Image
              src={shot.src}
              alt={shot.alt}
              width={1170}
              height={1222}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
            <figcaption className="border-t border-rule bg-surface px-4 py-3">
              <p className="tnum font-serif text-[17px] font-semibold text-ink">
                {nf.format(shot.views)}
              </p>
              <p className="eyebrow mt-0.5">views in 48 hours</p>
              <p className="tnum mt-2 text-[12px] text-ink-muted">{shot.date}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Total({
  label,
  value,
  perSecond,
  since,
}: {
  label: string;
  value: number;
  perSecond?: number;
  since?: string;
}) {
  return (
    <div className="bg-surface px-6 py-7">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-[clamp(1.9rem,4.5vw,2.6rem)] leading-none font-semibold tracking-tight text-ink">
        <CountUp value={value} perSecond={perSecond} since={since} />
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  perSecond,
  since,
}: {
  label: string;
  value: number;
  perSecond?: number;
  since?: string;
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="tnum mt-1 font-serif text-[17px] font-semibold text-ink">
        <CountUp value={value} perSecond={perSecond} since={since} />
      </dd>
    </div>
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
