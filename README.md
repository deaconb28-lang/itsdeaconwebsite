# itsdeacon.com

The marketing site for Deacon — a one-person service building websites for
local businesses.

## Three routes

| Route | What it is |
|---|---|
| `/` | The front page. Who Deacon is, the tagline, two doors into the pitches, and three sites he built. |
| `/restaurants` | The original pitch, moved here verbatim. |
| `/small-business` | The same argument, made to someone who gets *found* rather than recommended. |

`/` has been a segmentation gate twice — first two side-by-side cards (the
pattern Upwork, PayPal, Loom, Sketch and, fatally, Wix all use to sort a
signup), then two trade names at 96px over a drifting mass of liquid. The
second was worse than the first: one diffuse organic shape on a bare ground
with tracked-uppercase-mono chrome is the house style of every infrastructure
company's landing page, and the headline underneath it was
`clamp(21px, 2.2vw, 32px)` — smaller than the scale this site reserves for
calculators. The page shouted about which funnel you belonged to and mumbled
about the work.

So it is not a gate any more. The sentence about the work is the largest thing
on the page, and it carries what somebody actually wants before they call a
stranger: his face, his town, and three sites he really built that open in a
new tab. The two pitches follow it as **ruled rows, not a card pair** — a card
pair is the segmentation pattern above, and rows let the type run at `--show`
without boxing the reader into a choice before he has been told anything. They
are phrased in the visitor's voice ("I run a restaurant"), not as category
labels. **Nothing on `/` may be
larger than its `<h1>`** — `check2.mjs` asserts it at three widths, because
that inversion is the whole point and it is easy to undo by accident.

Each pitch is one page and one argument, and **the section order *is* the
pitch**: a visitor sees the price before they are invited to look up their own
site, and works through the napkin math before reaching the form that inherits
its figures. Both page files say as much; please don't reorder them.

Metadata is declared per route through `metadataFor()` in
`src/lib/page-meta.tsx`. A canonical URL in the root layout would tell Google
that every page is a duplicate of whichever one it named, so the layout carries
only what is true of all three.

Moving the restaurant pitch off `/` has a cost worth knowing: any inbound link
to `/#pricing` now lands on the chooser instead. Fragments never reach the
server, so that cannot be redirected.

**One idea per section.** The restaurant page was twelve sections and 1,675
words, and two pairs of them argued the same point twice — so the three sourced statistics
folded into the 68% band they were restating, and "How I start" folded into the
process it was previewing. Nothing was rewritten and no claim was dropped;
adding a section back means finding a point none of the others already make.

Built from the design handoff in [`docs/design-reference/`](docs/design-reference/),
which remains the source of truth for copy, colour and behaviour.

## Two audiences, one set of machinery

`src/lib/audience.ts` carries the two readers and **only what genuinely
differs**: the noun a figure is counted in (`table` / `customer`), the number
the calculator starts from ($70 / $120), the words a form labels its fields
with. Sentences do not go there. The test is stated in the file: if a value
would ever want a `<span>`, a second sentence, or an em dash mid-clause, it is
prose, and prose lives beside the page that says it — `src/app/*/copy.ts`.

That boundary is the point. Parameterising everything would turn deliberate
copy into template soup, and a general-audience page that reads as a template
is the one thing a one-person shop cannot afford.

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

Enquiries go **from `form@itsdeacon.com` to `hello@itsdeacon.com`** — both are
the code defaults, so neither needs an environment variable. `CONTACT_FROM` and
`CONTACT_TO` override them if set, which is worth remembering: a stale value
left in a deployment wins over the default silently. Each successful send is
logged with the addresses used and the provider's message id, so a delivery can
be traced afterwards.

`POST /api/contact` validates the submission, renders a plain-text and an HTML
copy, and hands it to whichever provider is configured — **Resend** if
`RESEND_API_KEY` is set, otherwise **SMTP** if `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`
are. `Reply-To` is the sender's address, so replying from the inbox goes straight
back to them. The email carries the visitor's napkin-math figures and says
which page they came from.

The route also accepts the old `restaurant` and `table` field names alongside
today's `business` and `spend`, and answers a missing name under both keys.
Vercel serves stale JS chunks for a while after a deploy, and an enquiry lost
to a field rename is the one failure this route exists to prevent. **Drop the
aliases a release after they stop appearing in the logs.**

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

### "What I'd fix" — the audit

`POST /api/analyze` fetches the page and **measures** things: a missing
viewport tag, a PDF where a page should be, load time, HTML weight, a phone
number that isn't a `tel:` link, a copyright two years stale, no way to act, a
missing title. `src/lib/audit.ts` turns those measurements into findings. No
model is involved in deciding a finding exists.

The audience changes two things there and only two: the words a finding is
written in, and whether a quote form counts as a way to act — it does for a
small business, and does not for a restaurant, where a contact page is still
not a way to order dinner. **Finding ids are identical for both audiences on
purpose**, because the guard below matches the model's rewrite against them; an
id that varied by page would disable that check silently rather than loudly.

`ANTHROPIC_API_KEY` adds a rewrite pass: Claude puts the findings in Deacon's
voice and orders them by what matters. It may reword and reorder — it may not
invent or drop one. Any id it returns that wasn't measured is discarded, and
anything it forgets keeps its measured wording; if the counts don't match, the
whole rewrite is thrown away. Without the key, or if the call fails, the
measured wording ships as-is.

Two things this deliberately refuses to do, because the section's whole
argument is that it shows an owner the truth:

- **Absence is only reported when the page actually rendered.** A JavaScript
  shell that hasn't run tells you nothing about whether ordering exists, so
  those findings are suppressed rather than guessed at.
- **A bot challenge is never analysed.** Hosts behind a shield answer a
  datacenter request with a CAPTCHA page that parses perfectly well. Without
  the check in `looksBlocked()` the audit would describe *that* page — telling
  an owner their site is broken, or that it is flawless, having never seen it.

## Layout of the code

```
src/
  app/
    layout.tsx            fonts, and only the metadata true of every route
    page.tsx              the chooser
    restaurants/          section order — the pitch, plus its copy.ts
    small-business/       the same, for a business that gets found
    globals.css           design tokens, keyframes, reveal + reduced-motion
    api/contact/          the form
    api/preview/          can this site be framed?
    api/screenshot/       render it when it can't
  components/             one file per section, colocated CSS module
  lib/
    audience.ts           the two readers — nouns and defaults, never sentences
    napkin.ts             the arithmetic behind the math and contact sections
    url.ts                normalising and the public-address rules
    safe-fetch.ts         DNS-checked fetch that re-validates redirects
    mail.ts               Resend / SMTP
    renderer.ts           which screenshot renderer is active
    rate-limit.ts         in-memory fixed window
```

## The look

Cream, deep teal, and one orange.

`--ink` `#13312C` is a deep blue-green teal and carries the type and the
structure. `--cream` `#F8F1E3` is the ground. The orange is the only hue on the
site that is Deacon's, and it arrives in single strokes — a filled phrase
inside a headline, a tick, a price suffix, a CTA.

**Three rules, all constraints rather than preferences.**

1. **`--ac` is the full inverse of its ground** — teal on cream, cream on teal.
   It is the *figure* colour, not the orange, and it is redefined per section
   rather than fixed. Sections declare themselves with `data-ground="dark"` (or
   `"light"`, for an island like the napkin inside a dark section). Because the
   accent equals the foreground, **anything that fills with `--ac` must put
   `--ground` on top, never `--ink`** — on a light section those are the same
   colour and the text vanishes. Ten places shipped that way once.

   **A panel that flips the ground must declare the whole set, not just
   `--ac`.** `.solid` in `Pricing.module.css` set the accent and left `--ground`
   inheriting from the light section around it, which made its badge and its
   call to action invisible. Prefer `data-ground` on the element; only reach
   for the CSS flip where there is no element to put it on.

2. **The orange has two jobs and two values.** `#E0571C` is only 3.37:1 on the
   cream and takes white at 3.78:1 — both large-text-only. So `--brand`
   `#E0571C` is for display type at 24px+ bold and for fills that carry no
   text; `--brand-deep` `#B8420F` is for orange at body size on cream (4.89:1)
   and for any filled control with a white label (5.49:1). Side by side they
   read as one orange. The original palette had only the bright one, which is
   why its pill CTAs and its small orange labels sat below AA.

3. **`--faint` cannot be shared between grounds.** `#9AA8A1` is 5.65:1 on the
   teal and 2.20:1 on the cream, so it is the dark-ground value only and the
   light ground borrows `--muted-2`'s `#5C6B64`.

Accent phrases are filled blocks rather than coloured text. A block's height is
its line box, so any headline containing one needs `line-height` at or above
about 1.05 — below that the blocks overlap the line above.

**Shape is four radii and no others.** `--r-panel` 12px for cards and frames,
`--r-field` 8px for inputs and small controls, `--r-chip` 4px for the tiny
stuff, `--r-pill` 999px for CTAs. Pick the role and let the token carry the
number. The brand's shadow is a hard offset — `14px 14px 0 var(--ink-12)` on
the hero card and the lookup's laptop, `16px 16px 0 var(--ink-18)` on the
napkin — never a blur, except the nav capsule, which floats.

Type is two faces. Archivo carries display and body both; mixing families as
well as weights fights the one-material feeling. The mono carries measurements
and labels only. **Do not reach for Bricolage Grotesque, Instrument Sans,
Instrument Serif or Inter** — that pairing is the most common signature of a
generated design and it was removed on purpose.

**Section headings get their size from the job they do**, not from how much
their author liked the sentence: `--say` for the argument, `--show` for the
supporting work, `--run` for the instruments. The hero sits above all three,
and nothing else on a page may out-shout the first thing you read. There are no
eyebrow labels — a tiny uppercase kicker above every heading is what made eight
of ten sections read as the same section.

**The demo panes keep their own colour.** Harbor & Vine is terracotta and
Ridgeline is hi-vis, and against the cream they detonate — which is the point.
Those are other people's businesses and they are supposed to look like
themselves, not like Deacon.

### One line, one page

**"Your website should be your hardest worker."** is the homepage's, and it is
the homepage's alone. It sat on `/small-business` for a while, and putting it
back on `/` without moving it would have left two indexed pages making the same
claim in the same words — which is the thing the per-route canonicals exist to
avoid. `/small-business` took back **"You're one of three names on a screen."**,
which is also the better line for it: the hero's own graphic beside that
headline is three local search results.

Anything that quotes a headline has to move with it. The `SiteFooter` marquee's
first phrase is a quote of the hero above it, and `HeroBusiness`'s card aside
captions the picture — both changed too.

**Trailing punctuation goes inside the accent span**, never after it. The block
carries `padding: 0 .14em`, so a comma or full stop left outside sits away from
the word with a visible gap in it.

### Social cards

Each route has its own `opengraph-image.png` beside its `page.tsx`, and Next's
file convention turns it into `og:image` and `twitter:image` at 1200×630 with
no code in `page-meta.tsx`. They are rendered by `scripts/og.mjs`, which drives
a browser at the running site and swaps the body for the card — so the type is
the site's own Archivo and the colours are the live tokens, with no font binary
in the repo and no network call at build time. **Regenerate them whenever the
palette or a hero headline changes**; nothing checks that they still match.

## Things worth knowing before changing it

- **The copy is deliberate.** The italic asides, "no hostages", "the quiet
  part", and the 0-of-4 verdict that tells an owner to keep their site have all
  been iterated on. The statistics are cited and real; keep the attributions.
- **Harbor & Vine and Ridgeline Plumbing & Heating are both fictional** —
  invented for the before/after panes. Never present either as a client. The
  demo businesses in the search-results graphic (Cascade, Meridian) are
  invented too.
- **The two before/after panes tell different jokes on purpose.** Harbor &
  Vine's is about *age* — marquees, WebRings, a hit counter. Ridgeline's is
  about *neglect*: a 2016 drag-and-drop template nobody has opened since 2019,
  which looks fine at a glance and falls apart when you read it. Repeating the
  2004 gag would have been the same joke twice.
- **Ridgeline is hi-vis yellow on near-black**, because that is what the trade
  literally wears. It was cyan on navy, which read as a SaaS dashboard — and a
  plumber is not one. Its hero is the phone number at display size, not the
  booking widget: when the heating fails at 2am nobody wants an availability
  picker, they want somebody to pick up. The booking panel stays, demoted to
  the polite option.
- **Ridgeline's panes are deliberately image-free.** A plumber has no
  equivalent of the food shot, and a stock photograph of a smiling tradesperson
  would be *less* honest than none — it is the exact cliché the "before" pane
  is making fun of. Its stock photo is rendered as the grey box with a filename
  that it actually is.
- **The keyline and the corner are both the brand.** Panels have a drawn
  border, a radius from the four-token scale, and — where they are objects you
  could pick up, like the hero card or the lookup's laptop — a hard offset
  shadow. Genuine curvature is separate: a phone frame and a dot stay round
  because the real object is, so those keep literal values rather than tokens.
- **No-JS must stay readable.** The scroll-reveal hidden state is only applied
  once an inline script confirms JS is running.
- `prefers-reduced-motion` stops the loops and the diner wave, and shows
  count-ups at their final value.
- **The statistics on `/small-business` are the ones already on the site.** The
  68% headline is about *diners* and cannot move, and no small-business figure
  was invented to replace it. The three that transfer honestly — 0.05s and 57%
  (Google), 75% (Stanford) — carry that page's `#why` section as a sequence
  rather than a single number, with every attribution kept. A new headline
  statistic would have to be one Deacon can cite.

### Deliberate departures from the handoff

The handoff calls for a fluid layout with no media queries. There are now two,
both to fix things that were broken rather than to restyle anything:

1. **The nav** (`Nav.module.css`, `max-width: 620px`). Left to wrap freely the
   sticky capsule grew to four rows and 27% of a phone viewport, covering the
   page as you scrolled. Below 620px the brand and the call to action take the
   first line and the links scroll along the second — the two lines the handoff
   describes.

Every `repeat(auto-fit, minmax(Npx, 1fr))` also became
`minmax(min(Npx, 100%), 1fr)`, which behaves identically above the floor and
stops the grid forcing a sideways scroll below it.

## Assets

`public/assets/hv-hero.png` is an **AI-generated placeholder** and should be
swapped for a licensed food photograph before launch. The three client
screenshots are real work. Two figures on the restaurant page are placeholders
that want confirming: the hero card's `41 bookings` and Glacier House's
`18 days`. `/small-business` deliberately carries no unverified figure — its
hero graphic is type, and every number in the Ridgeline panes is either a
price, a licence number or a made-up business's own detail.

## Deploying

Any Node host running `npm run build && npm start` will do. Set the environment
variables from `.env.example` — at minimum a mail provider, or the contact form
cannot deliver.

Every environment variable is read through `src/lib/env.ts`, which treats a
blank value as absent. This is not fussiness: importing a deployment's
variables from a template leaves empty strings behind, `??` only falls back on
`undefined`, and an empty `NEXT_PUBLIC_SITE_URL` reaching `new URL()` fails the
build outright with "Invalid URL". Read new variables through those helpers
rather than `process.env` directly.

`vercel.json` pins the framework preset to `nextjs`. This matters: a Vercel
project created against the repository *before* it had any commits detects no
framework and silently falls back to "Other", which builds the site correctly
and then serves nothing — every route 404s at the edge with `NOT_FOUND` even
though the build log looks perfect. Pinning it in the repo makes the preset
independent of what the dashboard guessed.

Playwright will not run on most serverless platforms. On Vercel, set
`SCREENSHOTONE_API_KEY` or `APIFLASH_KEY` for phone-width captures; without one
the lookup still works via mShots and says it is showing a desktop render.
