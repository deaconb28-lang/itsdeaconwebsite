---
description: Research a local business before pitching them — their live site, where they rank, who they are — written up as a shareable brief.
argument-hint: <domain> [restaurant|small-business]
allowed-tools: Bash(treg:*), Bash(curl:*), Bash(node:*), Read, Glob, Grep, Skill, Artifact, WebFetch
---

Research **$0** as a prospect and write the brief Deacon would read before
getting in touch. If `$1` names an audience use it; otherwise infer it from what
the business turns out to be, and say which you picked.

> Arguments here are **zero-indexed**: `$0` is the first, `$1` the second. Note
> also that a `$` immediately before a digit is treated as one of these
> placeholders, which is why every price below is written without one.

## Before you spend anything

`treg` calls cost real money from a prepaid team balance. Run `treg balance`
first. Budget for this command: **about 1 cent**. Report actual spend at the end
by diffing the balance, not by adding up list prices — see the warning below.

## Gather

Free, and the most important step — this is the page `audit.ts` actually reads:

```bash
curl -sSL -D headers.txt -o page.html -w '%{http_code} %{time_total}s %{size_download}\n' \
  -A 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' \
  https://$0/
```

Then the paid calls. Skip any that 4xx rather than retrying elsewhere — a 4xx is
your parameters, and retrying burns the balance on N providers for one mistake:

```bash
treg call branddev.brand.screenshot --query domain=$0
treg call dataforseo.web.page.audit --method POST --data '[{"url":"https://$0/"}]'
treg call treg.companies.enrich --method POST --data '{"domain":"$0"}' \
  --header 'X-Treg-Route-Max-Cost: 0.004'
```

**That last header is not optional.** `treg.companies.enrich` is a *routed*
endpoint, and the price the catalog quotes is the **first** provider's, not a
cap. On a miss treg walks down the waterfall and bills whoever answers; the
default ceiling is 1 USD. Observed in practice: a quoted 0.0019 that missed and
settled at 0.0098 — five times the estimate, on one call. Cap every routed call.

## Judge it with this repo's own vocabulary

Don't reimplement the rules. **Run the real module** against the page you
fetched — Node can strip the types:

```bash
node --experimental-strip-types <<'JS'
import { readFileSync } from "node:fs";
import { readSignals, findingsFrom, rank, looksBlocked } from "./src/lib/audit.ts";
import { SMALL_BUSINESS, RESTAURANTS } from "./src/lib/audience.ts";
// build a Headers from headers.txt, then looksBlocked() before anything else
JS
```

Read `src/lib/audit.ts` anyway so you can explain what fired. Two rules from it
bind here too, because they are about honesty rather than implementation:

- **Only report absence when the page actually rendered.** If `clientRendered`
  is true, a JS shell told you nothing about whether ordering or a contact route
  exists. Say the page did not render; do not guess.
- **Never analyse a bot challenge.** If `looksBlocked()` is true, that is not
  their website. Stop and say so.

Then **check every finding that fired against the page text before repeating
it.** A false positive is the expensive kind of wrong: it tells an owner
something is broken when it isn't, and the section's whole argument is that it
shows them the truth. `no-action` is the one most likely to misfire — for a
trade, a tappable phone number is the call to action, and `canAct` never
consults `hasTelLink`.

## Write it

Lead with the single thing you would say to this owner first — one sentence,
their language, not ours. Then the findings that survived checking, worst first.
Then where they rank if you looked. Close with whether they are worth
approaching at all: **"keep your site" is a real and frequent answer**, and the
repo's 0-of-4 verdict exists precisely so it can be given.

Do not invent figures. Every number is either measured or absent. Say which
vantage point each measurement came from — your fetch and a third-party crawler
will disagree on load time, and both are true.

## Publish

Use the **artifact-design** skill, then publish as an artifact. Title it after
the business. Say plainly in the page that it is internal research about a real
third party, assessed from public pages — never write it as though it came from
that business or on their behalf.
