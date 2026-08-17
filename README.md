# haydenlin.vercel.app

Personal site. Next.js 16 (App Router, Turbopack) and Tailwind v4, deployed on Vercel.

Two tabs:

- `/` the profile a recruiter reads: hero, about, experience, selected work, education, skills, contact.
- `/channels` live subscriber and view counts for the eight YouTube channels Hayden runs.

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
| Resume PDF | `public/Hayden-Lin-Resume.pdf` |

Colours for both themes live at the top of `src/app/globals.css`, as two blocks of
CSS variables (`:root` for light, `.dark` for dark). Nothing else hardcodes a colour.

## How the channel stats work

`src/lib/youtube.ts` reads the eight channels in this order:

1. **YouTube Data API**, if `YOUTUBE_API_KEY` is set. One request covers all eight
   channels and costs one unit out of a daily quota of 10,000.
2. **The public channel page**, scraped. This is what runs today, and it is what
   the numbers on the live site come from.
3. **The baseline in `src/lib/channels.ts`**, hand verified on 2026-08-17. Only used
   when both of the above fail, and the card says so when it happens.

Subscriber counts arrive rounded to three significant figures on every path,
because that is all YouTube publishes. View and video counts are exact.

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
