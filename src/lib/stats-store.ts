import type { ChannelSample } from "./youtube-types";

const BLOB_PATH = "personal-site/channel-stats.json";

/**
 * Two readings per channel: the current one and the one before it actually
 * changed. The gap between them is what a real views-per-second is measured
 * from, so both timestamps have to survive between invocations.
 *
 * Keys are the opaque channel ordinals ("c1".."c8"), never handles. The bucket
 * this shares with other projects is a public one, so the file is written as if
 * it were readable: view totals and timestamps that the page already publishes,
 * and nothing that would name a channel. Reordering channels.ts resets a
 * channel's history, which costs a few hours of convergence and nothing else.
 */
export type StoredState = {
  samples: Record<string, ChannelSample>;
};

/** Survives warm invocations; the only store when Blob is not configured. */
let memory: StoredState | null = null;

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function loadState(): Promise<StoredState | null> {
  if (hasBlob()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
      const url = blobs[0]?.url;
      if (url) {
        // no-store, because a CDN copy from the last refresh would hand back
        // the sample this run is meant to be advancing past.
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          memory = (await res.json()) as StoredState;
          return memory;
        }
      }
    } catch (e) {
      console.warn("[channels] blob read failed, using memory:", e);
    }
  }
  return memory;
}

export async function saveState(state: StoredState): Promise<void> {
  memory = state;
  if (!hasBlob()) return;
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(state), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } catch (e) {
    console.warn("[channels] blob write failed, kept in memory only:", e);
  }
}
