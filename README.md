# itsdeacon.com

The marketing site for Deacon — a one-person service building websites for
local restaurants.

One page, one argument. The section order *is* the pitch, and it is deliberate:
a visitor sees the price before they are invited to look up their own site, and
works through the napkin math before reaching the form that inherits its
figures. `src/app/page.tsx` says as much; please don't reorder it.

Built from the design handoff in [`docs/design-reference/`](docs/design-reference/),
which remains the source of truth for copy, colour and behaviour.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in a mail provider
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## The two moving parts

Everything else on the page is static. These two are not.

### The contact form → `hello@itsdeacon.com`

`POST /api/contact` validates the submission, renders a plain-text and an HTML
copy, and hands it to whichever provider is configured — **Resend** if
`RESEND_API_KEY` is set, otherwise **SMTP** if `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`
are. `Reply-To` is the restaurant's address, so replying from the inbox goes
straight back to them. The email carries the visitor's napkin-math figures.

Also handled: required name and email with server-side validation, a hidden
honeypot field, and a rate limit of 5 submissions per address per 10 minutes.

**If no provider is configured** the route answers `502` and the form says so
plainly, offering a `mailto:` link pre-filled with everything the visitor
typed. Nothing is silently dropped. Configure a provider before launch.

### "Check yours" — the website looker

`POST /api/preview` fetches the visitor's site server-side and reads its
`X-Frame-Options` and CSP `frame-ancestors` headers to decide whether it can be
embedded.

- **It can** → the site loads live in the phone frame at 375px, untouched.
- **It can't** (most sites) → `GET /api/screenshot` renders it instead.

The screenshot renderers, in order of preference:

| Renderer | Needs | Phone width? |
|---|---|---|
| ScreenshotOne | `SCREENSHOTONE_API_KEY` | Yes — true 375px viewport |
| ApiFlash | `APIFLASH_KEY` | Yes — true 375px viewport |
| Playwright | `npm i playwright && npx playwright install chromium` | Yes — true 375px viewport |
| mShots | nothing at all | **No** — renders desktop and crops |

mShots is the reason the lookup works on a fresh deployment with no
configuration. It is also the reason the page reads the `X-Deacon-Renderer`
response header before writing its caption: when the desktop fallback was used
the copy says so rather than claiming phone width. That honesty is load-bearing
— the section's whole argument is that it shows the visitor the truth.

Both routes normalise the URL and refuse anything that resolves to a loopback,
link-local, private or otherwise non-public address, checked after DNS
resolution rather than on the hostname alone.

## Layout of the code

```
src/
  app/
    layout.tsx            fonts, metadata, structured data
    page.tsx              section order — the pitch
    globals.css           design tokens, keyframes, reveal + reduced-motion
    api/contact/          the form
    api/preview/          can this site be framed?
    api/screenshot/       render it when it can't
  components/             one file per section, colocated CSS module
  lib/
    napkin.ts             the arithmetic behind sections 10 and 12
    url.ts                normalising and the public-address rules
    safe-fetch.ts         DNS-checked fetch that re-validates redirects
    mail.ts               Resend / SMTP
    renderer.ts           which screenshot renderer is active
    rate-limit.ts         in-memory fixed window
```

Design tokens live once, in `globals.css`. The accent is a single custom
property (`--ac`), so the site can be re-themed from one line.

## Things worth knowing before changing it

- **The copy is deliberate.** The italic asides, "no hostages", "the quiet
  part", and the 0-of-4 verdict that tells an owner to keep their site have all
  been iterated on. The statistics are cited and real; keep the attributions.
- **Harbor & Vine is fictional** — invented for the before/after. Never present
  it as a client.
- **The heavy border is the brand.** 3px is structural, 2px secondary. Don't
  soften either to 1px.
- **No-JS must stay readable.** The scroll-reveal hidden state is only applied
  once an inline script confirms JS is running.
- `prefers-reduced-motion` stops the loops and the diner wave, and shows
  count-ups at their final value.

### Deliberate departures from the handoff

The handoff calls for a fluid layout with no media queries. There are now two,
both to fix things that were broken rather than to restyle anything:

1. **The nav** (`Nav.module.css`, `max-width: 620px`). Left to wrap freely the
   sticky capsule grew to four rows and 27% of a phone viewport, covering the
   page as you scrolled. Below 620px the brand and the call to action take the
   first line and the links scroll along the second — the two lines the handoff
   describes.
2. **The hero headline** (`Hero.module.css`, `max-width: 359px`). Its
   non-breaking hyphen means "hardest-working" can never split, so the word has
   to fit whole; at the 44px floor it needs more room than a 320px screen has.
   Below the handoff's narrowest tested width the type steps down. 375px and up
   are untouched.

Every `repeat(auto-fit, minmax(Npx, 1fr))` also became
`minmax(min(Npx, 100%), 1fr)`, which behaves identically above the floor and
stops the grid forcing a sideways scroll below it.

## Assets

`public/assets/hv-hero.png` is an **AI-generated placeholder** and should be
swapped for a licensed food photograph before launch. The three client
screenshots are real work. Two figures on the page are placeholders that want
confirming: the hero card's `41 bookings` and Glacier House's `18 days`.

## Deploying

Any Node host running `npm run build && npm start` will do. Set the environment
variables from `.env.example` — at minimum a mail provider, or the contact form
cannot deliver.

`vercel.json` pins the framework preset to `nextjs`. This matters: a Vercel
project created against the repository *before* it had any commits detects no
framework and silently falls back to "Other", which builds the site correctly
and then serves nothing — every route 404s at the edge with `NOT_FOUND` even
though the build log looks perfect. Pinning it in the repo makes the preset
independent of what the dashboard guessed.

Playwright will not run on most serverless platforms. On Vercel, set
`SCREENSHOTONE_API_KEY` or `APIFLASH_KEY` for phone-width captures; without one
the lookup still works via mShots and says it is showing a desktop render.
