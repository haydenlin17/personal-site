# haydenlin.vercel.app

Personal site. Next.js 16 (App Router, Turbopack) and Tailwind v4, deployed on Vercel.

Two tabs:

- `/` the profile a recruiter reads: hero, about, experience, selected work, education, skills, contact.
- `/channels` live subscriber and view counts for the YouTube channels Hayden runs.

## Editing content

Almost everything is data, not markup.

| What | Where |
| --- | --- |
| Name, headline, email, LinkedIn, intro | `src/lib/content.ts` (`person`) |
| Hero fact strip | `src/lib/content.ts` (`quickFacts`) |
| About paragraphs | `src/lib/content.ts` (`about`) |
| Jobs and bullets | `src/lib/content.ts` (`experience`) |
| Selected work cards | `src/lib/content.ts` (`projects`) |
| School, GPA, coursework, clubs | `src/lib/content.ts` (`education`) |
| Skills, platforms, credentials, honors | `src/lib/content.ts` |
| Header section links | `src/lib/content.ts` (`sections`) |
| Channel list, names, niches | `src/lib/channels.ts` |
| Whether channels are named publicly | `src/lib/channels.ts` (`privacy`) |
| Proof screenshots and their captions | `src/lib/channels.ts` (`proofShots`) |
| Resume PDF | `public/Hayden-Lin-Resume.pdf` |

Colours for both themes live at the top of `src/app/globals.css`, as two blocks of
CSS variables (`:root` for light, `.dark` for dark). Nothing else hardcodes a colour.

## How the channel stats work

`src/lib/youtube.ts` reads the channels in this order:

1. **YouTube Data API**, if `YOUTUBE_API_KEY` is set. One request covers all
   channels and costs one unit out of a daily quota of 10,000.
2. **The public channel page**, scraped. This is what runs today, and it is what
   the numbers on the live site come from.
3. **The baseline in `src/lib/channels.ts`**, hand verified on 2026-08-17. Only used
   when both of the above fail, and the card says so when it happens.

Subscriber counts arrive rounded to three significant figures on every path,
because that is all YouTube publishes. View and video counts are exact.

### Privacy

The channels are run facelessly, so `privacy.anonymous` in `src/lib/channels.ts`
keeps this site from linking them to a real name. It is not a CSS trick: with it
on, the name, handle, avatar and channel URL are dropped in `toStats()` before
the payload is built, so they are absent from the page source and from
`/api/channels` too. Cards show an ordinal and a niche instead.

Exact per channel figures are still a fingerprint. Anyone who cares to search a
subscriber and view count can find the channel behind it. Setting
`privacy.showPerChannel` to false as well publishes only the network totals and
the screenshots, which is the only configuration that genuinely cannot be traced
back.

The persisted view history in Blob is keyed by the same opaque ordinals, so
nothing identifying is written there either.

### The live view counter

Channel view totals move, so the counter should too. `viewsPerSecond` comes back
with every payload and the client projects forward from `viewsAt`, which is what
keeps the number climbing between ten minute reads instead of sitting still.

Working out that rate is the fiddly part. YouTube publishes channel view totals
in lumps hours apart, not continuously, so dividing a delta by the polling
interval measures YouTube's publishing schedule rather than the channel. Two
things prevent that:

- A reading's timestamp records when the total *became* true, not when it was
  last confirmed. An unchanged reading keeps the timestamp it arrived with.
- A rate is only derived once those two timestamps sit at least three hours
  apart.

Until a channel has two live readings that far apart, the rate comes from the
`baseline` figures and `baselineAt` in `channels.ts`: today's total against a
hand verified reading from days ago, divided by the days between them. That is a
real measurement over a window far too wide for lumpy publishing to distort, and
it needs nothing to have been persisted, so it survives a cold start and a
storage outage alike. A dormant channel correctly reads as zero.

**Refresh `baseline` and `baselineAt` every month or so.** The window only
widens, and a wide enough window averages away whatever the channels are doing
lately. Re-read the totals, paste them in, and stamp the date.

A lifetime average (`views / age`) sits underneath as the last resort, used only
when the baseline is too fresh to measure against. It is a poor description of a
channel that scaled recently, which is why it is no longer the primary seed.

Live sampling, when it works, is more responsive than either: the first real
measurement replaces the seed outright, and later ones are blended in at half
weight so a single wide gap cannot redefine the rate. Those readings persist to
Vercel Blob via `BLOB_READ_WRITE_TOKEN`. Without it the history lives in memory
only, which a serverless cold start wipes, and the page runs on the baseline
measurement instead. That is a graceful degradation rather than a failure, which
matters because the shared Blob store was suspended as of 2026-08-22 and writes
were failing.

The read is cached for ten minutes and shared by every visitor, so a busy day
still means six reads an hour. `/channels` is prerendered with real numbers, then
the client refreshes from `/api/channels` on load, once a minute, and whenever the
tab is refocused.

### Adding an API key later

Scraping works but depends on YouTube's page shape. To move to the official API:

```bash
vercel env add YOUTUBE_API_KEY production
```

Create the key at <https://console.cloud.google.com/apis/credentials> with the
YouTube Data API v3 enabled. No further code change is needed; the API path takes
over automatically and the scrape stays as the fallback.

### Adding or removing a channel

Add an entry to `channels` in `src/lib/channels.ts`. The `id` is the `UC...` value,
which is visible in the page source of the channel as `"externalId"`. Everything
else on the page follows from the list.

## Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npx vercel --prod
```

## Environment

| Variable | Needed for | Without it |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Persisting view readings between invocations | Live counter never leaves its lifetime-average seed |
| `YOUTUBE_API_KEY` | Official Data API instead of scraping | Falls back to scraping, which currently works |
