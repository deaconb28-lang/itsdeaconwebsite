---
description: Where a business actually shows up in Google for the searches its customers use — pulled live and charted.
argument-hint: <domain> <keyword> [more keywords...]
allowed-tools: Bash(treg:*), Read, Skill, Artifact
---

Find where **$1** ranks for the remaining arguments as search terms, and chart
it. If only a domain was given, propose 4–6 terms a real customer would type —
service plus place, not brand names, because someone who already knows the brand
is not the visitor this site's whole argument is about — and confirm them before
spending anything.

## Before you spend anything

Run `treg balance`. Each keyword is one call at roughly **$0.002**, so state the
total for the set you are about to run *before* running it. Budget: **~$0.02**.
Report actual spend at the end.

## Pull

One call per keyword:

```bash
treg call treg.google.serp.organic --method POST --data '{"q":"<keyword>","country":"us","limit":20}'
```

This is a **routed** endpoint: treg picks the provider and names it in
`_treg.served_by`. Say which one served, since results differ by provider.

Then find $1's position in each result set. Results carry **two** positions and
they are not the same number: `rank_group` is the organic position, while
`rank_absolute` counts ads and SERP features too. Chart `rank_group` and say so
— mixing the two across keywords produces a chart that is quietly wrong, which
is worse than no chart.

**Not being in the top 20 is the finding, not a failure** — record it as absent rather than dropping the keyword,
because an absent term is usually the most useful thing on the chart.

## Chart it

Use the **dataviz** skill before writing any chart code.

Rank is inverted — position 1 is the best — so the axis has to run the right way
or the chart says the opposite of the truth. Mark "not in top 20" distinctly; it
is a different thing from a bad rank, not a worse one.

## Say what it means

One paragraph, plainly. Which terms they are winning, which they are invisible
for, and which single term would be worth the most to them. Do not project
traffic or revenue — that number is not in the data you pulled, and this repo
does not ship figures it cannot cite.

Offer to publish it as an artifact.
