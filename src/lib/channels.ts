/**
 * The eight channels tracked on /channels.
 *
 * `id` is the YouTube channel id (UC...). It is only needed for the Data API
 * path, which reads all eight in a single request. The scrape path works from
 * the handle alone.
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
  /** Marks the flagship, which renders in a wider card. */
  flagship?: boolean;
  baseline: { subscribers: number; views: number; videos: number };
};

export const channels: Channel[] = [
  {
    handle: "solarusbs",
    id: "UCCJNM0bh56-EWM1-TOaLT9g",
    name: "Solarus",
    niche: "Brawl Stars",
    flagship: true,
    baseline: { subscribers: 133_000, views: 379_271_229, videos: 738 },
  },
  {
    handle: "AcedMemes",
    id: "UCH__U7gNB-voA0miKoVumew",
    name: "Ace Memes",
    niche: "Memes",
    baseline: { subscribers: 15_700, views: 106_992_860, videos: 218 },
  },
  {
    handle: "winterlmfao",
    id: "UCoCAHJsAr0BFjtPNpuGFWkA",
    name: "Winter Memes",
    niche: "Memes",
    baseline: { subscribers: 6_580, views: 48_856_516, videos: 335 },
  },
  {
    handle: "MysticW1nter",
    id: "UCQYBIMZI8leQdofV3WfYNcg",
    name: "Winter Top 5",
    niche: "Top 5 lists",
    baseline: { subscribers: 1_180, views: 1_358_899, videos: 47 },
  },
  {
    handle: "scallyblox",
    id: "UCu-fx8f0yRhWGizIwX3i8SQ",
    name: "Scally",
    niche: "Roblox",
    baseline: { subscribers: 380, views: 186_702, videos: 27 },
  },
  {
    handle: "LlamaBloxx",
    id: "UC29zMQpJAOqlKTIymV2hjAw",
    name: "LlamaBlox",
    niche: "Roblox",
    baseline: { subscribers: 22, views: 0, videos: 0 },
  },
  {
    handle: "scallyanimations",
    id: "UClU_A0Jk5T3uyV-yZwvgBFA",
    name: "Scally Animations",
    niche: "Animation",
    baseline: { subscribers: 13, views: 354, videos: 3 },
  },
  {
    handle: "scally_reacts",
    id: "UCvkSOrVCSQlJNocNQKJ0Guw",
    name: "Scally Reacts",
    niche: "Reactions",
    baseline: { subscribers: 7, views: 46, videos: 4 },
  },
];

export const channelByHandle = new Map(channels.map((c) => [c.handle, c]));
