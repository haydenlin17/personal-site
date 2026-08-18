/**
 * The eight channels tracked on /channels.
 *
 * `id` is the YouTube channel id (UC...). It is only needed for the Data API
 * path, which reads all eight in a single request. The scrape path works from
 * the handle alone.
 *
 * `startedAt` is the channel's public "Joined" date. It anchors a lifetime
 * average views-per-second, which is the seed rate for the live counter before
 * two real readings exist to measure against.
 *
 * `baseline` is the last hand verified reading, taken 2026-08-17. It is a floor,
 * not a display value: the page shows it only when both the API and the scrape
 * fail, and labels the card as showing a cached number when it does.
 */

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
    handle: "solarusbs",
    id: "UCCJNM0bh56-EWM1-TOaLT9g",
    name: "Solarus",
    niche: "Brawl Stars",
    startedAt: "2016-08-09",
    flagship: true,
    baseline: { subscribers: 133_000, views: 379_271_229, videos: 738 },
  },
  {
    handle: "AcedMemes",
    id: "UCH__U7gNB-voA0miKoVumew",
    name: "Ace Memes",
    niche: "Memes",
    startedAt: "2023-07-18",
    baseline: { subscribers: 15_700, views: 106_992_860, videos: 218 },
  },
  {
    handle: "winterlmfao",
    id: "UCoCAHJsAr0BFjtPNpuGFWkA",
    name: "Winter Memes",
    niche: "Memes",
    startedAt: "2025-07-25",
    baseline: { subscribers: 6_580, views: 48_856_516, videos: 335 },
  },
  {
    handle: "MysticW1nter",
    id: "UCQYBIMZI8leQdofV3WfYNcg",
    name: "Winter Top 5",
    niche: "Top 5 lists",
    startedAt: "2025-07-30",
    baseline: { subscribers: 1_180, views: 1_358_899, videos: 47 },
  },
  {
    handle: "scallyblox",
    id: "UCu-fx8f0yRhWGizIwX3i8SQ",
    name: "Scally",
    niche: "Roblox",
    startedAt: "2026-07-21",
    baseline: { subscribers: 380, views: 186_702, videos: 27 },
  },
  {
    handle: "LlamaBloxx",
    id: "UC29zMQpJAOqlKTIymV2hjAw",
    name: "LlamaBlox",
    niche: "Roblox",
    startedAt: "2024-08-05",
    baseline: { subscribers: 22, views: 0, videos: 0 },
  },
  {
    handle: "scallyanimations",
    id: "UClU_A0Jk5T3uyV-yZwvgBFA",
    name: "Scally Animations",
    niche: "Animation",
    startedAt: "2026-06-17",
    baseline: { subscribers: 13, views: 354, videos: 3 },
  },
  {
    handle: "scally_reacts",
    id: "UCvkSOrVCSQlJNocNQKJ0Guw",
    name: "Scally Reacts",
    niche: "Reactions",
    startedAt: "2025-03-20",
    baseline: { subscribers: 7, views: 46, videos: 4 },
  },
];

/**
 * Screenshots from YouTube Studio's realtime view, kept as proof that the
 * network numbers are what they claim to be. Cropped above the "Top videos"
 * list, which carries video titles and thumbnails; originals are kept out of
 * the repo entirely.
 */
export type ProofShot = { src: string; views: number; alt: string };

export const proofShots: ProofShot[] = [
  {
    src: "/proof/peak-d.png",
    views: 22_672_281,
    alt: "YouTube Studio realtime chart showing 22,672,281 views over 48 hours",
  },
  {
    src: "/proof/peak-b.png",
    views: 19_005_914,
    alt: "YouTube Studio realtime chart showing 19,005,914 views over 48 hours",
  },
  {
    src: "/proof/peak-c.png",
    views: 10_093_869,
    alt: "YouTube Studio realtime chart showing 10,093,869 views over 48 hours",
  },
  {
    src: "/proof/peak-a.png",
    views: 9_477_985,
    alt: "YouTube Studio realtime chart showing 9,477,985 views over 48 hours",
  },
];
