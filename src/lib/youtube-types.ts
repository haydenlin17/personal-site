/**
 * Shared between the reader and the persistence layer. Kept in its own module
 * so the store does not have to import the reader, which would drag the whole
 * fetching path into anything that only wants the types.
 */

export type StatSource = "api" | "scrape" | "cached";

/** One channel's view history, as persisted between invocations. */
export type ChannelSample = {
  /** The most recent view total, and when that total first appeared. */
  views: number;
  at: string;
  /** The reading before `views` last changed. Absent until it has changed once. */
  prevViews?: number;
  prevAt?: string;
  /** Last displayed views-per-second, carried forward so it can be smoothed. */
  rate?: number;
  /**
   * True while `rate` is still the lifetime-average seed. A lifetime average is
   * a poor description of a channel that scaled recently, so the first real
   * measurement replaces it outright instead of being averaged into it.
   */
  seeded?: boolean;
};

export type ChannelStats = {
  /**
   * Opaque and stable, safe to use as a React key. Deliberately not the handle:
   * this object is serialised into the page and served from /api/channels, so
   * anything identifying in it is public no matter what the UI chooses to draw.
   */
  id: string;
  /** Stable ordinal used as the public label while `privacy.anonymous` is on. */
  index: number;
  niche: string;
  flagship: boolean;
  subscribers: number;
  views: number;
  videos: number;
  source: StatSource;
  /**
   * Estimated views per second, used to keep the counter moving between polls.
   * Measured from two real readings once a wide enough window exists, and the
   * channel's lifetime average until then.
   */
  viewsPerSecond: number;
  /** When `views` was measured. Drift is counted from here. */
  viewsAt: string;
  /**
   * Identifying fields, omitted entirely while `privacy.anonymous` is on rather
   * than merely hidden by the components.
   */
  handle?: string;
  name?: string;
  url?: string;
  avatar?: string | null;
};

export type StatsPayload = {
  channels: ChannelStats[];
  totals: {
    subscribers: number;
    views: number;
    videos: number;
    viewsPerSecond: number;
  };
  fetchedAt: string;
  /** True when every channel fell all the way back to its baseline. */
  degraded: boolean;
};
