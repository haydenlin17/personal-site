/**
 * The channels tracked on /channels.
 *
 * Placeholder data for the public repo. The channels are run facelessly, and
 * publishing their real handles here would identify them just as surely as
 * putting them on the page would, so the handles, ids, names, join dates, and
 * baseline figures below are invented. The shape matches what the live site
 * actually reads; see https://haydenlin.com/channels for the real numbers.
 *
 * `id` is the YouTube channel id (UC...). It is only needed for the Data API
 * path, which reads them all in a single request. The scrape path works from
 * the handle alone.
 *
 * `startedAt` is the channel's public "Joined" date. It anchors a lifetime
 * average views-per-second, which is the seed rate for the live counter before
 * two real readings exist to measure against.
 *
 * `baseline` is the last hand verified reading. It does two jobs: it is what the
 * page falls back to when both the API and the scrape fail (labelled as cached
 * when that happens), and it is the far end of the pair the live view rate is
 * measured from. Comparing today's total against a reading from days ago is a
 * real measurement over a real window, and unlike the in-flight sampling it
 * needs nothing to have been persisted.
 */

/**
 * When the baselines below were taken, and last confirmed still current. Refresh
 * this and the `baseline` figures every month or so: the window only widens, and
 * a wide window averages away whatever the channels are doing lately.
 */
export const baselineAt = "2026-01-01T00:00:00Z";

export type Channel = {
  handle: string;
  id: string;
  name: string;
  niche: string;
  startedAt: string;
  /** Marks the flagship, which renders in a wider card. */
  flagship?: boolean;
  baseline: { subscribers: number; views: number; videos: number };
};

/**
 * When true the page shows the numbers but not whose they are: no channel name,
 * no handle, no avatar, and no outbound link. The channels are run facelessly
 * and this site carries a real name, so linking the two is a one way door.
 *
 * Worth knowing: exact per channel figures are still a fingerprint. Anyone who
 * cares to search a subscriber and view count can find the channel behind it.
 * Set `showPerChannel` to false as well to publish only the network totals,
 * which is the only setting that genuinely cannot be traced back.
 */
export const privacy = {
  anonymous: true,
  showPerChannel: true,
} as const;

export const channels: Channel[] = [
  {
    handle: "example-channel-one",
    id: "UCAAAAAAAAAAAAAAAAAAAAAA",
    name: "Example Channel One",
    niche: "Gaming",
    startedAt: "2020-01-01",
    flagship: true,
    baseline: { subscribers: 100_000, views: 50_000_000, videos: 500 },
  },
  {
    handle: "example-channel-two",
    id: "UCBBBBBBBBBBBBBBBBBBBBBB",
    name: "Example Channel Two",
    niche: "Memes",
    startedAt: "2021-01-01",
    baseline: { subscribers: 20_000, views: 10_000_000, videos: 200 },
  },
  {
    handle: "example-channel-three",
    id: "UCCCCCCCCCCCCCCCCCCCCCCC",
    name: "Example Channel Three",
    niche: "Memes",
    startedAt: "2022-01-01",
    baseline: { subscribers: 8_000, views: 5_000_000, videos: 150 },
  },
  {
    handle: "example-channel-four",
    id: "UCDDDDDDDDDDDDDDDDDDDDDD",
    name: "Example Channel Four",
    niche: "Ranking",
    startedAt: "2022-06-01",
    baseline: { subscribers: 2_000, views: 1_500_000, videos: 60 },
  },
  {
    handle: "example-channel-five",
    id: "UCEEEEEEEEEEEEEEEEEEEEEE",
    name: "Example Channel Five",
    niche: "Roblox",
    startedAt: "2023-01-01",
    baseline: { subscribers: 500, views: 200_000, videos: 30 },
  },
];

/**
 * Screenshots from YouTube Studio's realtime view, kept as proof that the
 * network numbers are what they claim to be. Cropped above the "Top videos"
 * list, which carries video titles and thumbnails; originals are kept out of
 * the repo entirely.
 */
export type ProofShot = { src: string; views: number; date: string; alt: string };

export const proofShots: ProofShot[] = [
  {
    src: "/proof/peak-d.png",
    date: "2 July 2026",
    views: 22_672_281,
    alt: "YouTube Studio realtime chart showing 22,672,281 views over 48 hours",
  },
  {
    src: "/proof/peak-b.png",
    date: "19 March 2026",
    views: 19_005_914,
    alt: "YouTube Studio realtime chart showing 19,005,914 views over 48 hours",
  },
  {
    src: "/proof/peak-c.png",
    date: "25 March 2026",
    views: 10_093_869,
    alt: "YouTube Studio realtime chart showing 10,093,869 views over 48 hours",
  },
  {
    src: "/proof/peak-a.png",
    date: "14 December 2025",
    views: 9_477_985,
    alt: "YouTube Studio realtime chart showing 9,477,985 views over 48 hours",
  },
];
