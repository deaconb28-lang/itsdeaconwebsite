# Handoff: Deacon — Restaurant Website Service, Marketing Site

## Overview

A single-page marketing site for **Deacon**, a one-person web design service that builds
websites for local restaurants. Domain: `itsdeacon.com`. Contact: `hello@itsdeacon.com`.

The page is a **linear sales argument**, not a portfolio grid. Section order is the pitch and
must be preserved:

1. **Hero** — "Your website should be your hardest-working employee."
2. **Why it matters** — three sourced statistics about first impressions
3. **The 68% band** — the emotional peak: 68% of diners have been talked out of visiting a
   restaurant by its website, visualised as 100 human figures
4. **The difference** — a draggable before/after comparison of a fictional restaurant
5. **How I start** — the free-homepage-first offer
6. **Examples** — three real shipped sites
7. **How it goes** — four-step process
8. **What it costs** — three plans, all $1,200 up front
9. **Check yours** — an interactive tool that loads the visitor's own site in a phone frame
10. **The napkin math** — a live payback calculator
11. **Who you're hiring** — about, single-operator positioning
12. **Next step** — contact form that inherits the calculator's figures

Business facts that must not be altered: the build is **$1,200 flat**; care is **+$75/mo**;
all-in-one is **+$200/mo**; capacity is **three projects a month**; the first homepage is
**free and the client keeps it** whether or not they hire him.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype that
demonstrates the intended look, copy, and behaviour. They are **not production code to copy
directly**.

`Deacon.dc.html` is authored in a bespoke prototyping runtime. It uses:
- a `<x-dc>` wrapper and a `<helmet>` block for document-level CSS
- `{{ mustache }}` holes filled by a `renderVals()` method on a `Component` class
- `<sc-if>` / `<sc-for>` elements for conditionals and repetition
- `style-hover` / `style-focus` attributes instead of CSS pseudo-classes
- `<image-slot>`, a custom element that renders a drag-and-drop image placeholder

**None of those constructs should be reproduced.** The task is to recreate this design in the
target codebase's existing environment — React, Vue, Svelte, Astro, plain HTML, whatever is
already there — using its established component patterns, styling approach, and libraries. If
no environment exists yet, pick the most appropriate one for a marketing site (a static-first
framework such as Astro or Next.js is a good fit; the page has no backend beyond a form POST).

Translation notes:
- `renderVals()` returns are just derived values and handlers. In React they become
  `useState` + computed values. See **State Management** below.
- `<sc-if value="{{ x }}">` → conditional render. `<sc-for list="{{ xs }}">` → `.map()`.
- `style-hover="..."` → a real `:hover` rule.
- `<image-slot src="...">` → a plain `<img>` with `object-fit: cover`.
- All styling in the prototype is inline. **Do not ship it that way** — move it to whatever the
  codebase uses (CSS modules, Tailwind, styled-components). The token table below is the source
  of truth for values.

## Fidelity

**High-fidelity.** Colors, type, spacing, copy and interactions are final. Recreate faithfully.
The one deliberate exception is imagery — see **Assets**.

---

## Design Tokens

### Colors

| Token | Hex | Use |
|---|---|---|
| `ink` | `#13312C` | Primary text, dark section backgrounds, all borders |
| `cream` | `#F8F1E3` | Page background, text on dark sections |
| `accent` | `#E0571C` | CTAs, eyebrow labels, emphasis, progress bar. **Themeable** — see note |
| `muted` | `#3F5049` | Body copy on cream |
| `muted-2` | `#5C6B64` | Labels, captions, meta |
| `faint` | `#9AA8A1` | Inactive comparison label |
| `panel` | `#fff` | Cards on cream backgrounds |
| `green` | `#2E9E5B` | (available, currently unused) |

Alpha derivations used throughout — keep these rather than inventing new solids:
- On cream: `rgba(19,49,44,.04 / .06 / .07 / .12 / .15 / .18 / .2 / .22 / .25 / .3 / .35)`
- On ink: `rgba(248,241,227,.04 / .1 / .2 / .22 / .25 / .28 / .3 / .35 / .45 / .5 / .55 / .7 / .75 / .78 / .8 / .82)`
- Accent tint: `rgba(224,87,28,.07 / .1 / .13 / .16 / .55)`

**Accent is a single themeable variable.** The prototype exposes it as `--ac` on
`document.documentElement`, defaulting to `#E0571C`, with alternates `#C4342E`, `#146B4E`,
`#B4552D`. Implement it as one CSS custom property so the whole site can be re-themed from one
place. Every accent usage in the design reads `var(--ac, #E0571C)`.

### Sample-site palette (deliberately separate)

The fictional "Harbor & Vine" restaurant inside the comparison slider uses its **own** palette so
it doesn't read as Deacon's brand. Do not merge these into the main tokens.

| Token | Hex |
|---|---|
| Warm cream | `#F6F1E6` |
| Near-black | `#22201C` |
| Deep brown-black | `#1A1714` |
| Terracotta | `#C8503C` |
| Blush (phone number) | `#E4886F` |
| Off-white (button text) | `#F9F5EC` |

### Typography

Three families, from Google Fonts:

```
Bricolage Grotesque — opsz 12..96, weights 500/700/800
Instrument Sans     — weights 400/500/600 + italic 400
DM Mono             — weights 400/500
Instrument Serif    — regular + italic  (sample site only)
```

| Role | Family | Weight | Size | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Hero H1 | Bricolage Grotesque | 800 | `clamp(44px, 6.6vw, 104px)` | .92 | -.035em | sentence |
| Section H2 | Bricolage Grotesque | 800 | `clamp(36px, 5.6vw, 88px)` | .94 | -.035em | sentence |
| Section H2 (small) | Bricolage Grotesque | 800 | `clamp(34px, 4.6vw, 72px)` | .94 | -.035em | sentence |
| Big stat | Bricolage Grotesque | 800 | `clamp(48px, 5vw, 76px)` | 1 | -.04em | — |
| Hero stat (68%) | Bricolage Grotesque | 800 | `clamp(96px, 15vw, 240px)` | .82 | -.05em | — |
| Card H3 | Bricolage Grotesque | 700–800 | 20–30px | 1–1.15 | -.02em | sentence |
| Body large | Instrument Sans | 400 | 19–20px | 1.55–1.6 | — | — |
| Body | Instrument Sans | 400 | 15–17px | 1.5–1.6 | — | — |
| Small / caption | Instrument Sans | 400 | 13–14px | 1.45–1.55 | — | — |
| Eyebrow / label | DM Mono | 400–500 | 9–11px | — | .12–.24em | UPPERCASE |
| Aside (italic) | Instrument Sans | 400 italic | 14–19px | 1.5 | — | — |
| Sample-site accent | Instrument Serif | 400 italic | `clamp(21px,3.5vw,40px)` | .94 | -.02em | sentence |

Rules: **Bricolage is display only** — never body copy. **DM Mono is labels only** — always
uppercase with wide tracking, never a full sentence. Italic Instrument Sans carries the
conversational asides ("it never calls in sick, either").

### Spacing & shape

- Section padding: `clamp(60px, 7.4vw, 96px)` vertical, `clamp(18px, 3.6vw, 36px)` horizontal
- Grid gaps: 64px (two-column sections), 20–24px (card grids), 10–16px (within cards)
- Card padding: 28–30px; small panels 16–22px
- Radii: `10px` / `12px` cards, `8px` inputs and inner panels, `6px` small fields,
  `26px` nav capsule, `999px` pills and buttons
- Borders: `3px solid ink` = primary/structural. `2px solid ink` = secondary. `2px solid rgba(19,49,44,.22)`
  = quiet card. `1px` hairlines inside the sample site only. **The heavy border is the brand** — do
  not soften it to 1px.
- Shadows: offset flat shadows, not blurs — `14px 14px 0 rgba(19,49,44,.12)`,
  `16px 16px 0 rgba(19,49,44,.18)`. Nav uses `0 6px 22px rgba(19,49,44,.1)`.
  The sample-site card uses a real blur: `0 22px 60px rgba(0,0,0,.42)`.
- Easing: `cubic-bezier(.16,.8,.24,1)` for reveals and lifts; `ease-in-out` for loops.

---

## Screens / Views

Single scrolling page. No routes.

### 0. Navigation (sticky)

Floating capsule, not a full-width bar. `position: sticky; top: 0; z-index: 80`, sitting in
14px/24px padding over a `linear-gradient(#F8F1E3 62%, transparent)` fade so content dissolves
behind it.

- Capsule: `2px solid ink`, `border-radius: 26px`, `background: rgba(248,241,227,.92)`,
  `backdrop-filter: blur(14px)`, `box-shadow: 0 6px 22px rgba(19,49,44,.1)`, `flex-wrap: wrap`
- Left: 28px accent circle containing an inline SVG **cloche** (domed serving cover: a circle for
  the handle knob, a half-dome path, a rounded tray bar), then "Deacon" in Bricolage 800 19px
- Centre: links — Why / Before-after / Work / Check yours / Pricing / The math. `8px 10px`
  padding, `white-space: nowrap`, `border-radius: 999px`, color `muted`; hover fills
  `rgba(19,49,44,.08)` and goes ink. Labels are short **on purpose** — longer ones wrap the
  capsule to two lines
- Right: "Get your mockup →" pill, ink fill, cream text; hover → accent fill, ink text
- Below the capsule: a 2px scroll-progress track, `rgba(19,49,44,.12)`, whose inner bar is accent
  and whose width is `scrollY / (scrollHeight - innerHeight)`

### 1. Hero (`#top`)

Two columns, `repeat(auto-fit, minmax(330px, 1fr))`, 64px gap, `align-items: center`.

**Left:**
- Availability pill: `2px solid ink`, 999px, DM Mono 11px uppercase, containing an 8px accent
  dot that **pulses** (`dc-pulse`, 1.6s ease-in-out infinite: opacity 1→.35→1 with an expanding
  `box-shadow: 0 0 0 5px rgba(224,87,28,0)` ring). Text: "Open for new projects". Beside it, in
  italic muted-2: "(as of this morning, anyway)"
- Italic 19px muted-2: "hi — I'm Deacon."
- H1: "Your website should be your **hardest-working employee.**" — the last three words in
  accent. Uses a non-breaking hyphen (`&#8209;`) in "hardest-working" so it never breaks badly
- Lede, max 50ch: "I design and build websites for local restaurants — by hand, one at a time.
  The kind of website that greets people, fills tables, and never calls in sick."
- Buttons: "Get a free mockup ↗" (ink fill, hover → accent) and "See the difference"
  (`2px solid ink` outline, hover → ink fill). Both `19px 30px`, 999px, 16px/600
- DM Mono kicker: "Three projects a month — that's the whole company"

**Right — the "Employee of the Month" card.** This is the page's signature object.
- 360px max width, `3px solid ink`, `border-radius: 14px`, white, `14px 14px 0 rgba(19,49,44,.12)`
- **Floats**: `dc-float` 7s ease-in-out infinite — `translateY(0 → -9px → 0)` with
  `rotate(-.35deg → .35deg → -.35deg)`
- Centred accent ★, then DM Mono 10px "Employee of the Month"
- A 196px phone mock, `3px solid ink`, `border-radius: 26px`, ink body, cream screen:
  status row (9:41 / ●●●), header "GLACIER PUBLIC HOUSE" + ☰, then "Glacier / House" in
  Bricolage 800 24px, "MT. HOOD, ORE." in accent DM Mono, an accent "Order online" pill, and
  three rows — Pizza served 11:30–5 / Oyster Fest Labor Day / Walk-ins Welcome
- Footer inside the card: "YOUR WEBSITE" and "took **41** bookings this month. asked for nothing."
  The 41 **counts up** on first view
- Below the card, italic muted-2: "it never calls in sick, either"

### 2. Why it matters (`#why`)

Ink background, cream text.

- Eyebrow "Why it matters" in accent DM Mono
- H2: "People meet your website / before they meet you."
- Lede, 58ch: "Somebody hears about you from a friend, pulls out their phone, and looks. That
  look happens hours before they ever walk in — and it usually decides whether they do."
- Three cards, `repeat(auto-fit, minmax(265px, 1fr))`, gap 20px. Each:
  `2px solid rgba(248,241,227,.28)`, radius 10px, `background: rgba(248,241,227,.05)`, 28px padding,
  flex column. Contents in order: DM Mono kicker, giant accent stat, body copy, **visualiser**,
  source line above a `1px` top border.

  | Stat | Kicker | Body | Visualiser | Source |
  |---|---|---|---|---|
  | `0.05s` | Faster than a blink | "for someone to form a first impression of a website. They decide before they finish reading a word." | 14px outlined track; a 5%-wide accent fill; captions "↑ their decision" / "one full second" | Google research |
  | `75%` | Judged on looks | "of people judge how trustworthy a business is by how its website looks." | Four 26px diner figures — three solid accent, one outlined at .35 opacity; caption "Three in every four" | Stanford University |
  | `57%` | Word of mouth | "won't recommend a business whose site is a pain to use on a phone." | 44px outlined track with a 1px centre line marking half; 57% accent fill; captions "Stay quiet about you" / "Half" | Google research |

  The two bar fills carry `data-grow`: `transform: scaleX(0)` → `none` over 1.1s with a 250ms
  delay, triggered when the card reveals.
- Closing chip row: italic "so a clean site earns you:" then four outlined pills — Found on
  Google / Trusted at a glance / Right on every phone / Booking one tap away

### 3. The 68% band

**Accent background**, ink text. The loudest section on the page. Two columns,
`repeat(auto-fit, minmax(320px, 1fr))`, `align-items: center`.

**Left:** eyebrow "The quiet part"; `68%` at `clamp(96px, 15vw, 240px)` / -.05em, where the
number **counts 0 → 68** over 1500ms with cubic ease-out on first view; then a 30ch H2:
"of diners say a restaurant's website has **talked them out of going.**" — the last clause on a
`rgba(19,49,44,.14)` highlight with `padding: 0 .12em`. Source: "MGH survey of 1,101 U.S.
diners". Italic closer: "so go ahead — look yourself up. I'll wait." (this is the hand-off into
section 9).

**Right — the diner grid.** `display: grid; grid-template-columns: repeat(20, 1fr); gap: 9px 7px`,
100 cells. Each cell is an inline SVG human figure on a `0 0 12 18` viewBox — a circle head
(cx 6, cy 3.6, r 3.1) and a body path `M6 8.2c-3 0-4.6 2.2-4.6 5.3V17h9.2v-3.5C10.6 10.4 9 8.2 6 8.2Z`.
First 68 are **solid ink**; last 32 are **stroked ink at .4 opacity**.

Animation: all 100 start at `opacity: 0`. When the grid reaches 30% visibility they run
`dc-dot` (`.45s cubic-bezier(.16,.8,.24,1) both`, `opacity 0→1` + `scale(.4)→1`) staggered
`240ms + index × 14ms` — a ~1.6s wave that fills left to right. Legend below: a solid figure
"Talked out of going", an outlined figure "Still came in", and "Of every 100 diners asked".

### 4. The difference (`#difference`) — draggable before/after

Intro on cream: eyebrow "The difference", H2 "Same restaurant. / **Different website.**", and a
lede ending "Drag the handle — the right side is what I build."

**The comparison frame.** Fixed height `min(78vh, 760px)`, `min-height: 520px` — deliberately
**not** scroll-driven (an earlier scroll-scrub version was rejected). Above it, three DM Mono
labels: "◀ Before — the site they had", "drag the handle", "After — the site I build ▶". The
before/after labels swap between ink and `#9AA8A1` as the handle crosses 50%.

Frame: `3px solid ink`, radius 10px, containing a fake browser bar — `#EFEADC`, three
`#C9C2AE` dots, centred DM Mono "harborandvine.com" — then the comparison area.

**Before pane** (bottom layer, always fully painted): a hand-built 2004 restaurant website. Times
New Roman throughout. `#000080` header with `#FFFF00` text reading "~*~ WELCOME 2 HARBOR & VINE ~*~";
a `#FFFF99` strip with a **blinking** `#CC0000` "(UPDATED WEEKLY!)" (`dc-blink`, 1.1s steps(1));
a black/`#00FF00` Courier **marquee** scrolling right-to-left (`dc-old-marq`, 16s linear); a
`#C0C0C0` nav of `1px outset` beige buttons including "MENU (PDF, 14MB)" and "PHOTO'S!!"; a
168px sidebar with a yellow dashed "UNDER CONSTRUCTION" box, a broken-image placeholder
("photo1.jpg (12 MB) / our chef Gary"), a green-on-black hit counter, and IE/800×600/Netscape
badges; a body paragraph of contradictory hours and "Do not use the online form, it is broken.
Ask 4 Linda!!"; a WebRing footer credited to "Gary's nephew Kyle"; and a fake `2px outset`
Windows dialog — "YOU ARE OUR 1,000,000th VISITOR!!!" with a CLAIM NOW button.

This pane is doing real persuasive work. Keep the specifics; they are what makes people laugh
and then check their own site.

**After pane** (top layer, revealed by `clip-path: inset(0 0 0 X%)`): a modern restaurant site in
the Harbor & Vine palette.
- Cream top bar, 46px: DM Mono nav (Raw bar / Kitchen / Private / Visit), the "HARBOR **&** VINE"
  wordmark (ampersand in terracotta), and a near-black "Book a table" pill
- Full-bleed food photograph, `object-fit: cover`, `object-position: 62% 50%`, over `#1A1714`
- A left-to-right scrim: `linear-gradient(90deg, rgba(26,23,20,.72) 0%, rgba(26,23,20,.18) 34%, transparent 55%)`
- **Left column** (`min(34%, 206px)`, cream text on the dark side): "LANDED THIS MORNING" and four
  priced rows — Winter Point oysters 4 / Scallop crudo 19 / Whole monkfish 46 / Hake over embers 34
  — closed by an Instrument Serif italic line "Written at four, / when the boats are in."
- **Right card** (`min(46%, 338px)`, vertically centred, sizes to content): solid `#F6F1E6`,
  square corners, `0 22px 60px rgba(0,0,0,.42)`, 18px padding, 14px gap, right-aligned. Holds a
  rule + "PIER 9 · PORTLAND, MAINE", the wordmark, then the headline — "OFF THE / BOATS," in
  Bricolage 800 uppercase followed by "*on the fire.*" in **Instrument Serif italic terracotta** —
  then a 27ch line and two square buttons ("Reserve tonight" terracotta fill, "The menu" outlined)
- Near-black bottom strip: hours, "Raw bar until midnight", and the phone number in blush

**The handle.** `position: absolute; top: 0; bottom: 0; left: 50%`, 6px wide with `margin-left: -3px`,
accent fill, `box-shadow: 0 0 0 1px rgba(19,49,44,.4)`, `cursor: ew-resize`, `touch-action: none`.
Centred on it: an accent pill, `3px solid ink`, DM Mono 11px, reading "◀ Drag ▶".
A transparent `data-wipe-grab` layer covers the whole comparison area so dragging works anywhere.

Behaviour: `pointerdown` on either the grab layer or the handle starts a drag and calls
`setPointerCapture`; `pointermove` maps `clientX` to a percentage of the box width, clamped
**2–98%**; `pointerup` / `pointercancel` on `window` ends it. Starts at **50%**.

### 5. How I start

Two columns on cream. Left: eyebrow "How I start", H2 "**Your homepage first.** / Before you owe
me a cent.", body, a "Get your free homepage →" ink button, and italic "no deposit, no contract,
no call required". Right: three numbered rows separated by `2px` rules —
**01 Built before you commit** / **02 A working page, not a picture** / **03 Yours either way**
("Turn me down and the page is still yours to use or hand to anyone else. Fair trade for your time.").

### 6. Examples (`#work`)

Ink background. Eyebrow "You've seen my work", H2 "Examples", and a note: "Designed, built and
launched end to end — no agency, no template. Open them on your phone; I'll wait."

Grid: `repeat(auto-fit, minmax(300px, 1fr))`, 24px gap.

Every card is wrapped in a **browser chrome bar** — `rgba(248,241,227,.1)` ground, a
`2px` bottom border, three 9px dots, a pill-shaped URL field (`rgba(19,49,44,.5)`, DM Mono 11px,
ellipsis on overflow), and a right-side status: accent "● Live" for shipped links, muted "Client"
otherwise.

- **Glacier House** — `grid-column: 1/-1`. Screenshot column (chrome + `glacierpublichouse.com`,
  min-height 300px) beside a 360px detail column separated by a `2px` left border: "01 ·
  Restaurant & pizzeria", the name at `clamp(28px, 2.8vw, 42px)`, a description, then two rows —
  Built / "Identity, ordering, hours" and Live in / "18 days"
- **Kylani** — half width, links to `https://kylani.app`. Chrome, a 16/10 screenshot, then
  "02 · Product site", the name, "One claim, one input, one thing to do next.", and a 44px
  outlined circle "↗"
- **Supercruise** — half width, links to `https://bagcheck-oev7.vercel.app`, chrome URL
  `supercruise.app`. Same anatomy. Its screenshot uses `object-fit: contain` because the source
  image is wide and gets cropped badly otherwise

Hover on any card: `translateY(-6px)`, border → accent, and the screenshot scales to 1.05 over
0.7s.

### 7. How it goes (`#process`)

Cream. H2 "From mockup / to launch." plus a note and a DM Mono kicker "About two weeks, start to
launch". Four columns, `repeat(auto-fit, minmax(215px, 1fr))`, each with a `3px` ink top border,
an accent DM Mono timing label, an H3 and body:

| Timing | Step | Body |
|---|---|---|
| Free · step one | The mockup | "I design a real homepage for your place and send it over. No invoice, no meeting needed." |
| Right now | Your notes | "Tell me what's wrong with it — the colors, the photos, your name for a dish. I'll change it while you watch." |
| About a week | Build | "Say 'build it' and I turn that one page into the whole site — menu, story, contact, booking." |
| I handle it | Launch | "I put it live, set up Google, and hand you every file. The domain stays in your name." |

### 8. What it costs (`#pricing`)

Cream, opening on a `3px` ink top border. H2 "What it costs." beside an **anchor-price panel**:
`2px solid ink`, white, holding "An agency quotes this site at" / `$6,000–15,000` struck through
in `#9AA8A1`, a grey "→", then accent "You pay" / `$1,200`.

Three plans, `repeat(auto-fit, minmax(265px, 1fr))`. All `3px` borders, radius 10px, flex columns
with a `flex: 1` feature list so the CTAs align. Each has an italic muted subtitle under the price.

| | 01 The Full Redesign | 02 Redesign + Care | 03 Redesign + Care + Hosting |
|---|---|---|---|
| Treatment | Outlined on cream; hover `rgba(19,49,44,.04)` | **Solid ink**, cream text | **Accent border + `rgba(224,87,28,.07)` tint**; hover `.13` |
| Badge | — | "Most folks pick this one" — accent pill, ink text, offset `top: -14px` | "Hands off entirely" — accent outline on cream |
| Price | `$1,200` one time | `$1,200` **+ $75/mo** | `$1,200` **+ $200/mo** |
| Subtitle | "the site, done right" | "the site, plus us on call" | "never think about your website again" |
| Features | Whole new site — home, menu, story, contact · One-tap calls, directions, booking or ordering · Google Search & Maps done right — you own every file | Everything in the Full Redesign · Changes and specials — text me, done same-day · Menu, hours, and photos kept current | Everything in Redesign + Care · Hosting, SSL, and security patches — on me · Booking, ordering, and map connections kept running |
| Extra | — | — | Value note: "Hosting, domain and SSL alone run **$30–50 a month** if you buy them yourself — and then you're the one renewing them." |
| CTA | "Start here" outlined | "Get your mockup" accent fill | "Hand it all over" accent fill |

Feature bullets use an accent `✓`, not list markers. Monthly plans both say "Cancel the monthly
anytime". Footer row: "**The mockup is free and yours to keep** — even if you tell me no today."
and italic "you talk, I type — no homework".

### 9. Check yours (`#lookup`) — interactive

Cream, `3px` ink top border, content capped at 1180px and centred. Placed **after** pricing on
purpose: the visitor has seen the price before they test their own site.

- Eyebrow "Look yourself up"; H3 "See your own site the way a diner does."; note: "Paste your
  address. It loads at phone width, unchanged. Most owners haven't looked at it this way in years."
- Input row: a text field (`2px` border, radius 8px, white, placeholder `yourrestaurant.com`,
  `min-width: 220px`, `flex: 1`) and an ink "Show me on a phone" button (hover → accent)
- On submit, if the value looks like a domain, a **phone frame** appears: 306px outer,
  `3px solid ink`, radius 26px, ink body, 9px padding, holding a 375×675 `<iframe>` scaled
  `0.752` from `top left` inside a 282×540 cream screen with radius 18px.
  `sandbox="allow-scripts allow-forms allow-popups"`, `referrerPolicy="no-referrer"`
- Beside it: "Showing {domain}", then two paragraphs — one explaining nothing has been altered,
  one saying that a blank panel means the site blocks embedding, "That's normal and not a fault"
- **Self-assessment**: "Then be honest — tap any that are true", then four toggle buttons in
  `repeat(auto-fit, minmax(255px, 1fr))` — `2px` ink border, radius 8px, a 19px ink-bordered
  checkbox that fills with ✓, background `#fff` → `rgba(224,87,28,.16)` when on:
  1. "Our menu is a PDF, or a photo of a menu"
  2. "Buttons are fiddly to tap on a phone"
  3. "It takes a moment to load"
  4. "The hours or phone number are out of date"
- **Verdict bar**: `rgba(19,49,44,.06)`, radius 10px — a Bricolage "N of 4" score, a sentence,
  and an accent "Fix it for $1,200" pill linking to `#contact`.

  The verdict copy by count — the 0 case is what makes the rest credible, do not soften it:
  ```
  0 → "Nothing to fix from here. Genuinely — keep it and spend the money on the room."
  1 → "One thing, and it's the cheap kind. Worth an email even if you never hire me."
  2 → "That's two of the reasons the 68% gave. Both are a week's work, not a rebuild."
  3 → "Three of four. A diner deciding between you and the next place is not getting past this."
  4 → "All four. You are losing tables you never hear about, every week, quietly."
  ```

### 10. The napkin math (`#math`) — live calculator

**Accent background**, ink text. Two columns, `repeat(auto-fit, minmax(330px, 1fr))`, centred.

Left: eyebrow "The back of the napkin", H2 "Two extra tables a week covers the whole thing.",
body, and a `2px dashed` ink pill: "✎ $70 is a guess — type your own table price and every line
below moves."

Right — the napkin: `3px solid ink`, radius 12px, cream, `16px 16px 0 rgba(19,49,44,.18)`, 40px
padding, rows separated by `2px dashed rgba(19,49,44,.25)`, type at `clamp(17px, 1.5vw, 21px)`:

1. "two extra tables a week × **[$70]** ≈ **{monthly}** a month" — the input is the emphasised
   element: `3px solid accent`, radius 8px, white, `0 3px 0 accent`, with a floating cream-backed
   label "YOUR TABLE — EDIT ME" in accent at `top: -9px` and a ✎ glyph after the field.
   Numeric only, max 3 characters
2. "the site: **$1,200** once, then **$75** a month"
3. "→ the whole thing clears by **{payback}**"
4. "every month after that: **{surplus}**, yours"
5. "the care plan ≈ **{careTables}**"
6. An accent-outlined 999px pill: "the cheapest employee you'll ever hire"
7. An ink "Email me this →" button and, under it, "your figures come with you — no retyping"

Formulas, with `price` defaulting to 70:
```
monthly     = round(2 × price × 4.33 / 50) × 50      // 2 tables/week → month, rounded to $50
net         = monthly − 75                            // after the care plan
months      = ceil(1200 / net)                        // months to clear the build
payback     = months ≤ 12 ? "month " + word(months)   // "month three"
              : months > 12 ? "month " + months
              : "the first month"
surplus     = net > 0 ? "about $" + round(net/100)×100 : "not yet"
careTables  = max(1, round(75 / price)) + " table(s) a month"
```
Number words 0–12 are spelled out ("month three", not "month 3").

### 11. Who you're hiring (`#about`)

Ink background. Two columns.

Left: eyebrow "Who you're hiring", H2 "It's just me. **On purpose.**", lede "A Lakeside student
who will care more about your website than any agency ever would. My whole pitch:", then three
rows separated by `1px` rules — **You've seen my work** / **Two weeks, start to finish** /
**No hostages** ("Your site, your domain, your files — yours from day one. If we ever part ways,
everything comes with you."). Closing statement at `clamp(21px, 2.1vw, 30px)`: "Take the free
homepage first. If it's right, tell me and the whole site is live in two weeks." Then italic
"I take three projects a month — that's the whole company."

Right: a 4:5 portrait, `2px` cream-alpha border, radius 8px, `object-position: 50% 22%`; the name
"Deacon" at 22px; the email as a link; and below, a signature panel — `2px` border,
`rgba(248,241,227,.05)`, "SIGNED" over "— Deacon" in Bricolage 700 24px.

### 12. Next step (`#contact`)

Cream. Two columns, 72px gap.

Left: eyebrow "Next step", H2 "Send me your restaurant." at `clamp(40px, 6.4vw, 110px)` / -.04em,
body "Tell me the restaurant and I'll build the homepage first, free, before you decide
anything.", and a contact row (`2px` rules top and bottom): "**Deacon**" beside
`hello@itsdeacon.com` in DM Mono, the whole row a mailto link that turns accent on hover.

Right — the form: `3px solid ink`, radius 10px, white, 32px padding. Label in DM Mono 10px
uppercase above each field; fields are `2px solid rgba(19,49,44,.3)`, radius 6px, cream fill,
16px text, focus border → ink with `outline: none`.

1. Restaurant name — placeholder "Harbor & Vine"
2. Where to reach you — email, "you@restaurant.com"
3. Current site, if any — "or paste your Instagram"
4. **What an average table spends** — a `$` prefix and a numeric field **bound to the same state
   as the napkin-math input**. Typing in either updates both
5. Anything I should know — 3-row textarea, "Nobody can find our menu on a phone."

Directly under field 4 sits the **carry-over panel**: `rgba(224,87,28,.1)`, radius 8px, an accent
DM Mono label "Carried over from your napkin math", then "Two extra tables a week at that price is
**{monthly}** a month. The build clears by **{payback}**, then it's **{surplus}** a month, yours."

Submit: full-width ink "Send it over", hover → accent fill with `box-shadow: inset 0 0 0 2px ink`.
Under it: "No forms is fine too — just email me. I answer."

On submit the form is replaced by an ink panel: "**Got it.**" and "I'll look your place up tonight
and come back with a homepage you can keep either way." **No backend is wired** — see
**State Management**.

### 13. Closing marquee + footer

An ink strip with a `3px` accent top border, scrolling Bricolage 700 26px uppercase phrases
separated by accent ● bullets: "Your hardest-working employee · Free mockup first · Live in two
weeks · No hostages". Implemented as two identical spans in a `width: max-content` flex row
animated `translateX(0 → -50%)` over 32s linear, so the loop is seamless. Duplicate the content
and mark the second copy `aria-hidden`.

Footer: ink, DM Mono 11px uppercase at `rgba(248,241,227,.6)` — "Deacon — itsdeacon.com",
links (Work / Pricing / Contact), "© 2026".

---

## Interactions & Behavior

### Scroll reveal
Elements marked `data-reveal` start at `opacity: 0; translateY(26px)` and transition to visible
over 0.8s `cubic-bezier(.16,.8,.24,1)`. Driven by one `IntersectionObserver`
(`rootMargin: "0px 0px -10% 0px"`, `threshold: 0.06`), unobserved after firing, with a stagger of
`(index % 3) × 80ms`. **The initial hidden state is applied only when JS is present** — the
prototype adds a class to `<html>` first, so the page is fully readable if JS fails. Preserve
that: no-JS must not mean an invisible page.

### Count-ups
`data-count-to` elements animate 0 → target over 1500ms with `1 - (1-p)³` easing, fired at 30%
visibility, once. Used on the 68 and the hero card's 41.

### The diner wave
Described in section 3. One observer on the grid container triggers all 100 staggered animations.

### Comparison slider
Pointer-events drag, described in section 4. Clamped 2–98%. Not scroll-linked.

### Scroll progress
The nav's inner bar width = `scrollY / (scrollHeight - innerHeight)`, updated in a
`requestAnimationFrame`-throttled scroll handler.

### Parallax
`data-parallax="N"` elements translate by `-(distance from viewport centre) × N`, skipped when
more than 200px outside the viewport. Currently a light effect; safe to drop if the codebase
prefers no parallax.

### Hover states
- Buttons: ink ↔ accent inversions, never opacity fades
- Work cards: `translateY(-6px)` + accent border + 1.05 image scale
- Nav links: pill background fill
- Pricing cards: subtle background tint

### Continuous animations
| Name | Target | Timing |
|---|---|---|
| `dc-pulse` | Availability dot | 1.6s ease-in-out ∞ |
| `dc-float` | Employee card | 7s ease-in-out ∞ |
| `dc-marquee` | Closing strip | 32s linear ∞ |
| `dc-old-marq` | 2004 site marquee | 16s linear ∞ |
| `dc-blink` | 2004 red text | 1.1s steps(1) ∞ |

Consider honouring `prefers-reduced-motion` — the prototype does not, and should. Suggested:
disable float, pulse, both marquees and the diner wave; keep reveals as instant appearance.

### Responsive
Fluid, **no media queries**. Every multi-column grid is
`repeat(auto-fit, minmax(<floor>, 1fr))`, so columns collapse on their own. Section padding uses
`clamp()`. The nav capsule wraps to two lines on phones (intended). The comparison frame keeps
its `min(78vh, 760px)` height and stays draggable by touch via `touch-action: none`.
Inside the after-pane, the menu column (`min(34%, 206px)`) and the card (`min(46%, 338px)`) are
proportional so they can never collide.

Verify at 375, 768, 1024, 1440. The two pain points historically were the after-pane card
overflowing its frame and the nav wrapping — both are constraint-driven now, so don't reintroduce
fixed heights there.

---

## State Management

Five pieces of state, all local to the page. No routing, no persistence, no data fetching.

```js
sent       : boolean          // contact form submitted
table      : string  = "70"   // average table spend, digits only, max 3 chars
url        : string  = ""     // what the visitor typed in the lookup field
previewSrc : string  = ""     // committed, normalised URL for the iframe
checks     : { A,B,C,D: boolean }  // the four self-assessment toggles
```

Transitions:
- `table` — changed by **either** the napkin input or the form's field; strips non-digits and caps
  at 3 characters. Drives every derived figure in section 10 and the carry-over panel in 12
- `url` → `previewSrc` only on button press, via a normaliser that strips any scheme, requires
  something matching `^[a-z0-9.-]+.[a-z]{2,}`, prepends `https://` and trims trailing slashes.
  An invalid value yields `""` and the frame stays hidden
- `checks` — independent toggles; the count selects one of five verdict strings
- `sent` — set true on submit, swapping the form for the confirmation panel

**The form is not wired.** It has no action, no validation, no network call. Implement submission
in the target codebase (a form service, a serverless function, or a mailto fallback). Sensible
additions: required on name + email, email format validation, a pending state on the button, and
an error state that falls back to showing the email address. Keep the confirmation copy.

**The lookup iframe will fail for many sites** — most set `X-Frame-Options` or a frame-ancestors
CSP. That is expected and the UI already explains it. Do not add a proxy or a screenshot service
without discussing it; the honesty of the current message is part of the pitch. If a server-side
screenshot API is available, that would be a genuine improvement.

---

## Assets

In `assets/`:

| File | Use | Notes |
|---|---|---|
| `glacier-house.png` | Glacier House work card | Real client screenshot |
| `kylani.png` | Kylani work card | Real client screenshot |
| `supercruise.png` | Supercruise work card | Real client screenshot. Needs `object-fit: contain` — 1895×998, crops badly on cover |
| `deacon.jpg` | Portrait in section 11 | Real photo, `object-position: 50% 22%` |
| `hv-hero.png` | Harbor & Vine hero photo | **AI-generated placeholder.** Replace before launch |
| `hv-1.jpg`–`hv-4.jpg` | Previously used in the sample site | **Now unused.** Safe to delete |

Icons are all inline SVG, no icon library:
- **Cloche** (nav logo) — circle knob + dome path + rounded tray bar
- **Diner figure** — `0 0 12 18`, circle head + body path, in solid and stroked variants

Fonts load from Google Fonts. For production, self-host or preload to avoid the flash — the
display type is large enough that a swap is very visible.

**Licensing:** the three client screenshots are real work. `hv-hero.png` is AI-generated and
should be swapped for a licensed food photograph. There are no other third-party images.

## Content notes

- **Do not rewrite the copy.** Voice is first-person singular, plain, and occasionally
  self-deprecating. It has been iterated on deliberately. Specific things to preserve: the italic
  parentheticals, "no hostages", "the quiet part", the 0-of-4 verdict that tells people to keep
  their site, and the FAQ-style honesty in the pricing footnotes
- **Statistics are cited and real** — Google research (0.05s, 57%), Stanford (75%), MGH survey of
  1,101 U.S. diners (68%). Keep the attributions visible
- **"18 days"** on the Glacier House card and the `41 bookings` figure in the hero card are
  placeholders that should be confirmed or replaced with real numbers
- Harbor & Vine is **fictional**, invented to demo the before/after. Do not present it as a client
- **There are no testimonials**, deliberately — invented ones were built and removed. If real
  quotes become available, the natural home is between Examples and How it goes

## Files

| File | What it is |
|---|---|
| `Deacon.dc.html` | The design reference. Template + logic in one file |
| `assets/` | All images listed above |
| `README.md` | This document |
| `screenshots/` | Rendered reference captures, one per section (see below) |

### Screenshots

Captured at 939px wide from the live prototype. Section numbering matches **Screens / Views**
above. Continuous animations are frozen at an arbitrary frame, and scroll-triggered reveals are
shown in their revealed state.

| File | Section |
|---|---|
| `01-hero.png` | Nav + hero, with the floating Employee-of-the-Month card |
| `02-why-it-matters.png` | The three sourced statistics with their visualisers |
| `03-the-68-percent.png` | The accent band and the 100-figure diner grid |
| `04-before-after-slider.png` | The comparison frame at the 50% default — 2004 site left, Harbor & Vine right |
| `12-how-i-start.png` | The free-homepage offer (section 5; captured last, hence the filename) |
| `05-examples.png` | The three work cards in browser chrome |
| `06-process.png` | The four-step timeline |
| `07-pricing.png` | Anchor price panel and the three plans |
| `08-check-yours.png` | The lookup tool in its empty state, with the four toggles and verdict bar |
| `09-napkin-math.png` | The calculator at its `$70` default |
| `10-about.png` | Single-operator section with the portrait |
| `11-contact.png` | Contact form including the carry-over panel |

Not captured, because they only exist in an interactive state: the slider mid-drag at other
percentages, the lookup tool with a live iframe loaded, toggles in their checked state, and the
form's post-submit confirmation panel. All four are specified in **Screens / Views**.

The prototype needs its runtime (`support.js`) to render, which is not included and is not
needed — read the HTML as a spec, not as something to run.
