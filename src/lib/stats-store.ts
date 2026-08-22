import type { ChannelSample } from "./youtube-types";

const BLOB_PATH = "personal-site/channel-stats.json";

/**
 * Two readings per channel: the current one and the one before it actually
 * changed. The gap between them is what a real views-per-second is measured
 * from, so both timestamps have to survive between invocations.
 *
 * This is an optimisation, not a dependency. When it is unavailable the rate
 * falls back to the baseline measurement in channels.ts, which needs nothing
 * persisted at all.
 *
 * Keys are the opaque channel ordinals ("c1".."c5"), never handles, so even a
 * public bucket holds nothing that would name a channel. Reordering channels.ts
 * resets a channel's history, which costs a few hours of convergence.
 */
export type StoredState = {
  samples: Record<string, ChannelSample>;
};

/** Survives warm invocations; the only store when Blob is not configured. */
let memory: StoredState | null = null;

/**
 * Blob stores are created as either public or private and reject the wrong
 * access mode outright. Rather than hardcode one, the first successful write
 * settles it and every later call reuses that answer.
 */
let access: "public" | "private" | null = null;

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readPrivate(): Promise<StoredState | null> {
  const { get } = await import("@vercel/blob");
  // useCache: false, because a CDN copy from the last refresh would hand back
  // the sample this run is meant to be advancing past.
  const found = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!found) return null;
  return (await new Response(found.stream).json()) as StoredState;
}

async function readPublic(): Promise<StoredState | null> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const url = blobs[0]?.url;
  if (!url) return null;
  const res = await fetch(url, { cache: "no-store" });
  return res.ok ? ((await res.json()) as StoredState) : null;
}

export async function loadState(): Promise<StoredState | null> {
  if (hasBlob()) {
    for (const mode of access ? [access] : (["private", "public"] as const)) {
      try {
        const state = mode === "private" ? await readPrivate() : await readPublic();
        if (state) {
          access = mode;
          memory = state;
          return memory;
        }
      } catch {
        // Wrong access mode, or nothing written yet. Try the other, then give up
        // quietly: the baseline measurement covers this.
      }
    }
  }
  return memory;
}

export async function saveState(state: StoredState): Promise<void> {
  memory = state;
  if (!hasBlob()) return;

  const { put } = await import("@vercel/blob");
  for (const mode of access ? [access] : (["private", "public"] as const)) {
    try {
      await put(BLOB_PATH, JSON.stringify(state), {
        access: mode,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      });
      access = mode;
      return;
    } catch (e) {
      if (mode === (access ?? "public")) {
        console.warn("[channels] blob write failed, kept in memory only:", e);
      }
    }
  }
}
