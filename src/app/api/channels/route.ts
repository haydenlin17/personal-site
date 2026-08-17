import { getStats } from "@/lib/youtube";

/**
 * Reading eight YouTube pages takes a second or two, so the answer is cached at
 * the edge rather than on every visit. `stale-while-revalidate` means a visitor
 * arriving after the ten minute window still gets an instant response and the
 * refresh happens behind them.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const stats = await getStats();
  return Response.json(stats, {
    headers: {
      "cache-control": stats.degraded
        ? // Nothing worth caching for long if every source failed.
          "public, s-maxage=60, stale-while-revalidate=300"
        : "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
