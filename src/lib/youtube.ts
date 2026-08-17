import { unstable_cache } from "next/cache";
import { channels, type Channel } from "./channels";

/**
 * Reading the eight channels, in order of preference:
 *
 *   1. The YouTube Data API, if YOUTUBE_API_KEY is set. One request covers all
 *      eight channels and costs a single quota unit out of a daily 10,000.
 *   2. The public channel page, scraped. Same numbers YouTube shows a logged
 *      out visitor, so this is a true fallback rather than a downgrade.
 *   3. The hand verified baseline in channels.ts, clearly labelled as cached.
 *
 * Subscriber counts arrive rounded to three significant figures either way,
 * because that is all YouTube publishes. View counts are exact.
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export type StatSource = "api" | "scrape" | "cached";

export type ChannelStats = {
  handle: string;
  name: string;
  niche: string;
  flagship: boolean;
  url: string;
  subscribers: number;
  views: number;
  videos: number;
  avatar: string | null;
  source: StatSource;
};

export type StatsPayload = {
  channels: ChannelStats[];
  totals: { subscribers: number; views: number; videos: number };
  fetchedAt: string;
  /** True when every channel fell all the way back to its baseline. */
  degraded: boolean;
};

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

/** One request for all eight channels. Returns a map keyed by channel id. */
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

function toStats(channel: Channel, read: Read | null, source: StatSource): ChannelStats {
  const value = read ?? { ...channel.baseline, avatar: null };
  return {
    handle: channel.handle,
    name: channel.name,
    niche: channel.niche,
    flagship: channel.flagship ?? false,
    url: `https://www.youtube.com/@${channel.handle}`,
    subscribers: value.subscribers,
    views: value.views,
    videos: value.videos,
    avatar: value.avatar,
    source: read ? source : "cached",
  };
}

async function readAll(): Promise<StatsPayload> {
  const key = process.env.YOUTUBE_API_KEY;

  let fromApi: Map<string, Read> | null = null;
  if (key) {
    try {
      fromApi = await readViaApi(key);
    } catch (e) {
      console.warn("[channels] data api failed, falling back to scrape:", e);
    }
  }

  const results = await Promise.all(
    channels.map(async (channel) => {
      const api = fromApi?.get(channel.id);
      if (api) return toStats(channel, api, "api");
      return toStats(channel, await readViaScrape(channel.handle), "scrape");
    }),
  );

  const totals = results.reduce(
    (acc, c) => ({
      subscribers: acc.subscribers + c.subscribers,
      views: acc.views + c.views,
      videos: acc.videos + c.videos,
    }),
    { subscribers: 0, views: 0, videos: 0 },
  );

  return {
    channels: results,
    totals,
    fetchedAt: new Date().toISOString(),
    degraded: results.every((c) => c.source === "cached"),
  };
}

/**
 * Eight page reads take a second or two, so the result is held for ten minutes
 * and shared by every visitor. Only the compact JSON is stored, never the HTML
 * it was parsed out of.
 */
export const getStats = unstable_cache(readAll, ["youtube-channel-stats"], {
  revalidate: 600,
  tags: ["channels"],
});
