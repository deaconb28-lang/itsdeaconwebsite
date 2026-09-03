# itsdeacon.com

The marketing site for Deacon — a one-person service building websites for
local businesses.

## Three routes

| Route | What it is |
|---|---|
| `/` | The door. One viewport, and a single mass of mercury that pools under whichever trade you reach for. |
| `/restaurants` | The original pitch, moved here verbatim. |
| `/small-business` | The same argument, made to someone who gets *found* rather than recommended. |

`/` was two side-by-side cards, which is the pattern Upwork, PayPal, Loom,
Sketch and — fatally — Wix all use to segment a signup. A shop that letters by
hand cannot open on the same screen as the website builder it argues against,
so the trades became ruled rows on a board: a device from the subject's own
world rather than a SaaS onboarding step. The 01/02 numbering went with the
cards, since it implied a sequence and these are alternatives.

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

Black, white, one grey — and one colour per room.

**Colour says which room you are in, and nothing else.** Type stays black and
white everywhere; colour lives only in structure — a filled headline phrase, a
bar, a badge, the figures a statistic is actually about. That is what keeps the
starkness while giving each pitch an identity.

The assignment is a rule rather than a preference: **each page's colour sits
near the complement of its own demo pane**, so Deacon's identity can never
muddle with the client's. Harbor & Vine is terracotta, so `/restaurants` is
blue `#2B4BFF`. Ridgeline is hi-vis yellow-green, so `/small-business` is
cherry `#E5124B`. Both take white text at 4.5:1 and both stay visible as a mark
on `#000` and `#fff` — a narrow set, on a site with two grounds.

On the door the mercury is white at rest and takes the room's colour as you
reach for a trade: the liquid turns into the page you are about to open.

Pages declare their room with `data-brand`; `--brand` resolves from there.

**Two rules, both constraints rather than preferences.**

1. **`--ac` is the full inverse of its ground** — black on light, white on dark
   — so it is redefined per section, not fixed. Sections declare themselves
   with `data-ground="dark"` (or `"light"`, for an island like the napkin
   inside a dark section). Because the accent equals the foreground, **anything
   that fills with `--ac` must put `--ground` on top, never `--ink`** — on a
   light section those are the same colour and the text vanishes. Ten places
   shipped that way during the conversion.

   **A panel that flips the ground must declare the whole set, not just
   `--ac`.** `.solid` in `Pricing.module.css` set the accent and left `--ground`
   inheriting `#fff` from the light section around it, which made its badge and
   its call to action white on white. Set `--ac` and `--ground` together, or use
   `data-ground`.
2. **`#767676` is the only grey that clears 4.5:1 against both `#000` and
   `#fff`.** Anything lighter fails on white, anything darker fails on black.
   Copy on a ground that could be either uses `--muted-2`; only copy that is
   definitely on light may use the darker `--muted`.

Accent phrases are filled blocks rather than coloured text. A block's height is
its line box, so any headline containing one needs `line-height` at or above
about 1.05 — below that the blocks overlap the line above.

Type is two faces. Archivo carries display and body both, because a monochrome
page has no hue to separate them and mixing families as well as weights fights
the one-material feeling. The mono carries measurements and labels only.

**The only colour on the site belongs to the clients.** Harbor & Vine is
terracotta and Ridgeline is hi-vis, and against black and white they detonate —
which is the point. Those are other people's businesses and they are supposed
to look like themselves, not like Deacon.

### The mercury

The homepage's liquid (`src/components/Mercury.tsx`) is the company: one person
taking three projects a month is a single volume of attention that cannot be in
two places, so the mass pools under whichever trade you reach for and leaves
the other. The merging is an SVG goo filter — blur, then crank alpha contrast —
and the pooling runs on `:has()`, so the page ships no JavaScript.

**It appears there and nowhere else.** It was tried behind About's "It's just
me. On purpose." — the same argument in words — and cut: it sat over the lede
and made the section harder to read. Repeating the one thing a site is
remembered for is how a signature becomes wallpaper.

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
- **The keyline is the brand.** Panels have a drawn border and neither a
  radius nor a shadow. The one
  exception is genuine curvature — a phone frame, a dot — which stays round
  because the real object is. Don't reintroduce pill buttons or the hard
  offset shadow; both were removed on purpose.
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
2. **The hero headline** (`Hero.module.css`, `max-width: 359px`). Its
   non-breaking hyphen means "hardest-working" can never split, so the word has
   to fit whole; at the 44px floor it needs more room than a 320px screen has.
   Below the handoff's narrowest tested width the type steps down. 375px and up
   are untouched. That phrase now heads `/small-business`, but the rule stays
   in `Hero.module.css` because both heroes share `.headline` —
   `HeroBusiness` imports this module for its entire left column.

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
