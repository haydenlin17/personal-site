import { unstable_cache } from "next/cache";
import { baselineAt, channels, privacy, type Channel } from "./channels";
import { loadState, saveState, type StoredState } from "./stats-store";
import type { ChannelSample, ChannelStats, StatsPayload, StatSource } from "./youtube-types";

export type { ChannelStats, StatsPayload, StatSource } from "./youtube-types";

/**
 * Reading the channels, in order of preference:
 *
 *   1. The YouTube Data API, if YOUTUBE_API_KEY is set. One request covers all
 *      the channels and costs a single quota unit out of a daily 10,000.
 *   2. The public channel page, scraped. Same numbers YouTube shows a logged
 *      out visitor, so this is a true fallback rather than a downgrade.
 *   3. The hand verified baseline in channels.ts, clearly labelled as cached.
 *
 * Subscriber counts arrive rounded to three significant figures either way,
 * because that is all YouTube publishes. View counts are exact.
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/**
 * YouTube publishes channel view totals in lumps hours apart, so a rate is only
 * trusted once the two readings behind it sit far enough apart that several
 * lumps have landed. Below this the number measures YouTube's publishing
 * schedule rather than the channel.
 */
const MIN_RATE_WINDOW_S = 3 * 60 * 60;

/**
 * Absolute ceiling, for legibility rather than correctness: past a few hundred
 * a second the digits blur into noise. No channel here comes close.
 */
const MAX_RATE = 500;

/**
 * How much of a newly measured rate is taken on board at each refresh. Lumps
 * arrive unevenly, so a single wide gap should nudge the rate rather than
 * redefine it.
 */
const SMOOTHING = 0.5;

async function get(url: string, headers: Record<string, string> = {}, ms = 9000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    // No cache hint: Next 16 leaves fetch uncached by default, and the result
    // of the whole read is what gets cached, not the megabyte of HTML behind it.
    return await fetch(url, {
      signal: ctl.signal,
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9", ...headers },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** "133K" -> 133000, "1.2M" -> 1200000, "4,096" -> 4096 */
export function parseCompact(raw: string): number | null {
  const m = raw.trim().replace(/,/g, "").match(/^([\d.]+)\s*([KMB])?/i);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] ?? "").toLowerCase()] ?? 1;
  return Math.round(n * mult);
}

type Read = { subscribers: number; views: number; videos: number; avatar: string | null };

/** One request covering every channel. Returns a map keyed by channel id. */
async function readViaApi(key: string): Promise<Map<string, Read>> {
  const ids = channels.map((c) => c.id).join(",");
  const res = await get(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${ids}&key=${key}`,
  );
  if (!res.ok) throw new Error(`youtube api http ${res.status}`);
  const json = (await res.json()) as {
    items?: {
      id: string;
      statistics?: Record<string, string>;
      snippet?: { thumbnails?: Record<string, { url?: string }> };
    }[];
  };
  const out = new Map<string, Read>();
  for (const item of json.items ?? []) {
    const s = item.statistics;
    if (!s) continue;
    const thumbs = item.snippet?.thumbnails;
    out.set(item.id, {
      subscribers: Number(s.subscriberCount ?? 0),
      views: Number(s.viewCount ?? 0),
      videos: Number(s.videoCount ?? 0),
      avatar: thumbs?.high?.url ?? thumbs?.medium?.url ?? thumbs?.default?.url ?? null,
    });
  }
  return out;
}

/**
 * The public channel page. A channel with no published videos omits the view
 * and video counts entirely, so those are allowed to be absent; only a missing
 * subscriber count means the page shape changed and the read has failed.
 */
async function readViaScrape(handle: string): Promise<Read | null> {
  try {
    const res = await get(`https://www.youtube.com/@${handle}/about`);
    if (!res.ok) return null;
    const html = await res.text();

    const subsRaw = html.match(/"subscriberCountText":"([^"]+)"/)?.[1];
    const viewsRaw = html.match(/"viewCountText":"([\d,]+) views?"/)?.[1];
    const videosRaw =
      html.match(/"videoCountText":"([\d,]+) videos?"/)?.[1] ??
      html.match(/"content":"([\d,]+) videos?"/)?.[1];
    const avatar = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? null;

    const subscribers = subsRaw ? parseCompact(subsRaw) : null;
    if (subscribers == null) return null;

    return {
      subscribers,
      views: viewsRaw ? (parseCompact(viewsRaw) ?? 0) : 0,
      videos: videosRaw ? (parseCompact(videosRaw) ?? 0) : 0,
      avatar,
    };
  } catch {
    return null;
  }
}

/**
 * A rate that needs nothing persisted: today's total against the hand verified
 * baseline, over the days between them. The window is far too wide for lumpy
 * publishing to distort it, and unlike a lifetime average it describes the
 * channel as it is now rather than as it averaged out over every year it has
 * existed. A dormant channel correctly reads as zero.
 *
 * Falls back to the lifetime average only when that comparison cannot be made:
 * a baseline too fresh to measure against, or a total that has gone backwards.
 */
const MIN_SEED_WINDOW_S = 6 * 60 * 60;

function seedRate(channel: Channel, views: number): number {
  const since = (Date.now() - Date.parse(baselineAt)) / 1000;
  const delta = views - channel.baseline.views;
  if (since > MIN_SEED_WINDOW_S && delta >= 0) return delta / since;

  const age = Math.max(1, (Date.now() - Date.parse(channel.startedAt)) / 1000);
  return views / age;
}

/**
 * Advances a channel's view history and returns the rate to display with it.
 *
 * `at` is when a total became true, not when it was last confirmed: an
 * unchanged reading keeps the timestamp it arrived with. Stamping every
 * successful poll would make the window one poll interval wide while the delta
 * covered hours, which is how a counter ends up climbing at forty a second.
 */
function advance(
  channel: Channel,
  views: number,
  prev: ChannelSample | undefined,
  nowIso: string,
): { sample: ChannelSample; rate: number } {
  const seed = seedRate(channel, views);

  if (!prev) {
    return { sample: { views, at: nowIso, rate: seed, seeded: true }, rate: seed };
  }

  const changed = prev.views !== views;
  const sample: ChannelSample = changed
    ? {
        views,
        at: nowIso,
        prevViews: prev.views,
        prevAt: prev.at,
        rate: prev.rate,
        seeded: prev.seeded,
      }
    : { ...prev };

  let rate = sample.rate ?? seed;
  let seeded = sample.seeded ?? true;

  if (sample.prevViews !== undefined && sample.prevAt) {
    const dv = sample.views - sample.prevViews;
    const dt = (Date.parse(sample.at) - Date.parse(sample.prevAt)) / 1000;
    if (dt > MIN_RATE_WINDOW_S && dv > 0) {
      const measured = dv / dt;
      // A lifetime average is replaced outright: it describes the channel's
      // whole history, which for a channel that scaled recently is not the
      // channel it is now. Later measurements only nudge, so one unusually
      // wide gap cannot redefine the rate.
      rate = seeded ? measured : rate * (1 - SMOOTHING) + measured * SMOOTHING;
      seeded = false;
    }
  }

  rate = Math.min(MAX_RATE, Math.max(0, rate));
  return { sample: { ...sample, rate, seeded }, rate };
}

/**
 * Builds the object that is serialised into the page and served from
 * /api/channels. While `privacy.anonymous` is on, the name, handle, URL and
 * avatar are left out here rather than hidden in the components: a field that
 * reaches the payload is public whether or not anything renders it.
 */
function toStats(
  channel: Channel,
  index: number,
  read: Read | null,
  source: StatSource,
): Omit<ChannelStats, "viewsPerSecond" | "viewsAt"> {
  const value = read ?? { ...channel.baseline, avatar: null };
  const base = {
    id: `c${index + 1}`,
    index,
    niche: channel.niche,
    flagship: channel.flagship ?? false,
    subscribers: value.subscribers,
    views: value.views,
    videos: value.videos,
    source: read ? source : ("cached" as StatSource),
  };
  if (privacy.anonymous) return base;
  return {
    ...base,
    handle: channel.handle,
    name: channel.name,
    url: `https://www.youtube.com/@${channel.handle}`,
    avatar: value.avatar,
  };
}

async function readAll(): Promise<StatsPayload> {
  const key = process.env.YOUTUBE_API_KEY;
  const nowIso = new Date().toISOString();

  let fromApi: Map<string, Read> | null = null;
  if (key) {
    try {
      fromApi = await readViaApi(key);
    } catch (e) {
      console.warn("[channels] data api failed, falling back to scrape:", e);
    }
  }

  const prev = await loadState();

  const base = await Promise.all(
    channels.map(async (channel, i) => {
      const api = fromApi?.get(channel.id);
      if (api) return toStats(channel, i, api, "api");
      return toStats(channel, i, await readViaScrape(channel.handle), "scrape");
    }),
  );

  const samples: StoredState["samples"] = {};
  const results: ChannelStats[] = base.map((stats, i) => {
    const channel = channels[i];
    const { sample, rate } = advance(channel, stats.views, prev?.samples?.[stats.id], nowIso);
    samples[stats.id] = sample;
    // A cached read is a guess, so it gets no rate: better a still number than
    // one drifting away from a total that was never confirmed.
    const live = stats.source !== "cached";
    return {
      ...stats,
      viewsPerSecond: live ? rate : 0,
      viewsAt: sample.at,
    };
  });

  await saveState({ samples });

  const totals = results.reduce(
    (acc, c) => ({
      subscribers: acc.subscribers + c.subscribers,
      views: acc.views + c.views,
      videos: acc.videos + c.videos,
      viewsPerSecond: acc.viewsPerSecond + c.viewsPerSecond,
    }),
    { subscribers: 0, views: 0, videos: 0, viewsPerSecond: 0 },
  );

  return {
    channels: results,
    totals,
    fetchedAt: nowIso,
    degraded: results.every((c) => c.source === "cached"),
  };
}

/**
 * Eight page reads take a second or two, so the result is held for ten minutes
 * and shared by every visitor. Only the compact JSON is stored, never the HTML
 * it was parsed out of. The client keeps the view counters moving in between
 * using `viewsPerSecond`, so a warm cache still reads as live.
 */
// The key carries a version: the payload shape changed when the live rate was
// added, and a cache entry written by an older deploy would otherwise be served
// to a page that now expects viewsPerSecond on every channel.
export const getStats = unstable_cache(readAll, ["youtube-channel-stats-v2"], {
  revalidate: 600,
  tags: ["channels"],
});
