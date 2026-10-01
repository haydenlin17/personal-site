# haydenlin.com

Hayden Lin's personal site. Next.js 16 (App Router, Turbopack), React 19, and
Tailwind v4, deployed on Vercel at [haydenlin.com](https://haydenlin.com).

The site has two tabs:

- `/` the profile a recruiter reads: hero, about, experience, selected work,
  education, skills, and contact.
- `/channels` live subscriber, view, and video counts for the YouTube channels
  Hayden runs, plus proof screenshots and the production toolkit.

Two case study pages hang off the work section: `/work/life-time` (an equity
research memo) and `/work/griff-leaderboard` (a Discord economy leaderboard).

## Architecture: content as data

Almost everything on the page is data, not markup. Components read from a
handful of files in `src/lib/` and lay the content out; editing the site means
editing those files, not the JSX.

| What | Where |
| --- | --- |
| Name, headline, email, LinkedIn, intro | `src/lib/content.ts` (`person`) |
| Hero fact strip | `src/lib/content.ts` (`quickFacts`) |
| Scale numbers (views, editors, community) | `src/lib/content.ts` (`trackRecord`) |
| About paragraphs | `src/lib/content.ts` (`about`) |
| Jobs and bullets | `src/lib/content.ts` (`experience`) |
| Selected work cards | `src/lib/content.ts` (`projects`) |
| School, GPA, coursework, clubs | `src/lib/content.ts` (`education`) |
| Skills, platforms, credentials, honors, languages | `src/lib/content.ts` |
| Header section links | `src/lib/content.ts` (`sections`) |
| Channel list, ids, niches, baselines | `src/lib/channels.ts` (`channels`) |
| Whether channels are named publicly | `src/lib/channels.ts` (`privacy`) |
| Proof screenshots and their captions | `src/lib/channels.ts` (`proofShots`) |
| Site's canonical URL | `src/lib/site.ts` |
| Resume PDF | `public/Hayden-Lin-Resume.pdf` |

Colors for both themes live at the top of `src/app/globals.css`, as two blocks
of CSS variables (`:root` for light, `.dark` for dark). Nothing else in the
codebase hardcodes a color. Theme choice is stored in `localStorage` and
applied before first paint by an inline script in `src/app/layout.tsx`, so
there is no light-to-dark flash on load.

The two case study pages (`src/app/work/life-time/page.tsx` and
`src/app/work/griff-leaderboard/page.tsx`) follow the same pattern: their copy
and numbers live in `src/lib/life-time.ts` and `src/lib/griff.ts`
respectively, and the page components just render them.

## The YouTube channels feature

`/channels` (`src/app/channels/page.tsx`) renders a live snapshot of every
channel Hayden runs, served through `src/components/channels-live.tsx` (a
client component) and backed by `src/app/api/channels/route.ts`.

### Reading the numbers

`src/lib/youtube.ts` tries three sources in order, cheapest and most reliable
first:

1. **YouTube Data API v3**, if the `YOUTUBE_API_KEY` env var is set. One
   request covers every channel and costs a single quota unit out of a daily
   allowance of 10,000.
2. **The public channel "about" page**, scraped with a plain `fetch` and
   regexes over the embedded JSON. This is what the live site runs on today.
3. **The hand verified baseline** in `src/lib/channels.ts`. Used only when
   both of the above fail, and the UI marks the card as showing cached numbers
   when that happens.

Subscriber counts come back rounded to three significant figures on every
path, because that's all YouTube publishes. View and video counts are exact.

### The live view counter

Channel view totals move, so the counter on the page should too.
`viewsPerSecond` is computed server-side and returned with every payload; the
client (`CountUp` in `src/components/count-up.tsx`) projects the number
forward from `viewsAt` between reads, which is what keeps it climbing between
the ten-minute cache refreshes instead of sitting still.

The rate itself is derived carefully, because YouTube only publishes view
totals in lumps hours apart:

- A reading's timestamp records when the total *became* true, not when it was
  last polled. An unchanged reading keeps the timestamp it arrived with.
- A rate is only trusted once two readings are at least three hours apart
  (`MIN_RATE_WINDOW_S` in `src/lib/youtube.ts`), so it measures the channel
  rather than YouTube's publishing schedule.
- Until two live readings exist, the rate is seeded from `baseline` /
  `baselineAt` in `channels.ts`: today's total against a hand-verified reading
  from days ago, divided by the days between. That's a real measurement over a
  window wide enough to survive a cold start with nothing persisted.
- A lifetime average (`views / channel age`) is the last-resort seed, used
  only when the baseline itself is too fresh to measure against.
- Once live sampling works, the first real measurement replaces the seed
  outright; later ones are blended in at half weight (`SMOOTHING`) so one wide
  gap can't redefine the rate on its own.

Live readings persist across serverless invocations via `src/lib/stats-store.ts`,
which writes to Vercel Blob (`BLOB_READ_WRITE_TOKEN`) keyed by opaque channel
ordinals (`c1`, `c2`, ...), never handles or names. Without that token the
history lives in memory only, gets wiped on every cold start, and the page
falls back to the baseline measurement. That's a graceful degradation, not a
failure.

The full read is cached for ten minutes with `unstable_cache`
(`src/lib/youtube.ts`) and shared by every visitor. `/channels` itself is
prerendered with real numbers at build/request time, then the client
(`channels-live.tsx`) refreshes from `/api/channels` on load, once a minute,
and whenever the tab regains focus.

### Privacy

The channels are run facelessly. `privacy.anonymous` in `src/lib/channels.ts`
keeps the site from linking them to Hayden's real name: when it's on, name,
handle, avatar, and channel URL are dropped inside `getStats()` in
`src/lib/youtube.ts` before the response object even exists, so they're absent
from both the page source and the raw `/api/channels` JSON. Cards show an
ordinal and a niche instead.

Exact per-channel figures are still a fingerprint (anyone can search a
subscriber/view count and find the channel behind it). Setting
`privacy.showPerChannel` to `false` as well publishes only network totals and
the proof screenshots, which is the only configuration that can't be traced
back at all.

**This public repo ships placeholder channels.** The anonymity above only
covers what a visitor sees; the source still names the real channels, which
would undo it the moment the repo went public. `src/lib/channels.ts` here has
been swapped for channels of the same shape with invented handles, ids, and
numbers, so the code reads and type-checks the same way the real version does.
The live site at haydenlin.com deploys from a separate local copy with the
real data, and the two never meet.

### Proof screenshots

`proofShots` in `src/lib/channels.ts` lists cropped YouTube Studio realtime
view charts, served from `public/proof/`. They're cropped above the "Top
videos" list (which would leak titles and thumbnails). The unredacted
originals are kept in `youtube stats/` at the project root, gitignored (see
below), and never shipped.

### `youtube stats/` folder

This folder is **not** a data pipeline or a set of scripts. It's a local
staging area for source images:

- `IMG_3035.PNG`, `IMG_4319.PNG`, two `.heic` photos — original, unredacted
  YouTube Studio screenshots. Cropped copies of these are what actually ship
  in `public/proof/` and get referenced by `proofShots`.
- `hayden lin profile photo copy.png` — the source image for `public/headshot.jpg`.

The whole `/youtube stats` directory is excluded in `.gitignore` with a
comment explaining why: the cropped copies in `public/proof` are the ones the
site serves, and the originals should never end up in the repo or the deployed
bundle.

### Adding a YouTube Data API key

Scraping works today, but depends on YouTube's page markup staying stable. To
move to the official API instead:

```bash
vercel env add YOUTUBE_API_KEY production
```

Create the key at <https://console.cloud.google.com/apis/credentials> with the
YouTube Data API v3 enabled. No code change is needed: the API path takes over
automatically and the scrape stays as the fallback.

### Adding or removing a channel

Add or remove an entry in `channels` in `src/lib/channels.ts`. `id` is the
channel's `UC...` id, visible in the channel page source as `"externalId"`
(only needed for the Data API path; the scrape works from the handle alone).
Everything else on `/channels` follows from this list.

**Refresh `baseline` and `baselineAt` every month or so.** The measurement
window against them only widens over time, and a wide enough window averages
away whatever the channels are doing lately.

## Folder structure

```
src/
  app/
    page.tsx                     Profile page ("/")
    layout.tsx                   Root layout, fonts, theme script, metadata
    globals.css                  Tailwind + CSS variable theme tokens
    icon.svg, opengraph-image.tsx
    channels/page.tsx             "/channels" page shell (server component)
    api/channels/route.ts         GET endpoint the client polls for live stats
    work/life-time/page.tsx       Equity research memo case study
    work/griff-leaderboard/page.tsx  Discord economy leaderboard case study
  components/
    channels-live.tsx             Client component driving "/channels"
    count-up.tsx                  Animated number, projects forward using a rate
    section.tsx                   Shared section wrapper for the profile page
    site-header.tsx, site-footer.tsx, theme-toggle.tsx, scroll-to-top.tsx
  lib/
    content.ts                    All profile page copy and data
    channels.ts                   Channel list, baselines, proof shots, privacy flags
    youtube.ts                    Reads channel stats (API -> scrape -> baseline)
    youtube-types.ts              Shared types between youtube.ts and stats-store.ts
    stats-store.ts                Persists view-history samples to Vercel Blob
    life-time.ts, griff.ts        Copy/data for the two case study pages
    site.ts                       Canonical site URL
public/
  Hayden-Lin-Resume.pdf
  headshot.jpg
  griff/                          Screenshots for the Griff case study
  logos/                          Company/school/tool logos used in experience & education
  proof/                          Cropped YouTube Studio proof screenshots
youtube stats/                    Gitignored: unredacted screenshot originals, not shipped
```

## Running locally

```bash
npm install
npm run dev
```

Other scripts from `package.json`:

```bash
npm run build   # next build
npm run start   # next start (serve the production build)
npm run lint    # eslint
```

## Environment variables

Names only, values live in `.env.local` (gitignored) and in Vercel's project
settings.

| Variable | Needed for | Without it |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | Official YouTube Data API v3 reads instead of scraping | Falls back to scraping the public channel page, which currently works |
| `BLOB_READ_WRITE_TOKEN` | Persisting live view-rate samples between serverless invocations | Live counter never leaves its lifetime-average/baseline seed |
| `NEXT_PUBLIC_SITE_URL` | Overriding the canonical domain baked into `src/lib/site.ts` | Falls back to `https://haydenlin.com` |
| `VERCEL_OIDC_TOKEN` | Vercel CLI / platform auth, added automatically by `vercel env pull` | Local Vercel CLI commands may need re-linking |

`@vercel/blob` and `@vercel/analytics` are the only Vercel-specific runtime
dependencies; everything else is plain Next.js.

## Deployment

The site is linked to the Vercel project `haydenlin` and deploys to
[haydenlin.com](https://haydenlin.com).

```bash
npx vercel --prod
```

Pushing to the connected git branch also triggers a deployment through
Vercel's normal git integration. `next.config.ts` pins the Turbopack root to
this folder so a lockfile in a parent directory (this project doesn't live in
its own git repo root) doesn't get picked up by mistake.

## Notes on `AGENTS.md` / `CLAUDE.md`

`AGENTS.md` is generated and re-added by `next dev` itself (see
`node_modules/next/dist/server/lib/generate-agent-files.js`); it's not
project-specific guidance to maintain by hand. `CLAUDE.md` just re-exports it
with `@AGENTS.md`.
