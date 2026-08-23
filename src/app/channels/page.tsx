import type { Metadata } from "next";
import { ChannelsLive } from "@/components/channels-live";
import { getStats } from "@/lib/youtube";

/**
 * Prerendered with real numbers and refreshed every ten minutes, which is also
 * how long the underlying read is held. The client takes over from there.
 */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Channels",
  description:
    "Live subscriber and view counts for the YouTube channels Hayden Lin runs and manages.",
};

export default async function ChannelsPage() {
  const initial = await getStats();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-4 sm:px-8 sm:pt-20">
      <p className="eyebrow rise">Network</p>
      <h1
        className="rise mt-4 font-serif text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink"
        style={{ animationDelay: "60ms" }}
      >
        Channels
      </h1>
      <p
        className="rise mt-5 max-w-2xl text-[17px] leading-[1.7] text-ink-soft"
        style={{ animationDelay: "120ms" }}
      >
        The channels that took off, pulled live from YouTube every time this page loads. They are
        run facelessly, so they are listed by number rather than by name.
      </p>

      <div className="rise mt-12" style={{ animationDelay: "180ms" }}>
        <ChannelsLive initial={initial} />
      </div>
    </div>
  );
}
