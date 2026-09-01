---
description: Cross-check this repo's own audit findings against an independent measurement of the same page.
argument-hint: <url>
allowed-tools: Bash, Read, Glob, Grep, Edit, Skill
---

`src/lib/audit.ts` measures a page and turns those measurements into findings.
Nothing verifies it against a second opinion. This command does that for **$0**.

> Arguments here are **zero-indexed**: `$0` is the first. A `$` immediately
> before a digit is treated as a placeholder, which is why prices below are
> written without one.

## What this is for

The README is explicit that no model decides whether a finding exists — findings
are measured. That guarantee is only worth as much as the measuring, so the
question here is narrow: **does our audit agree with an independent crawl of the
same page?**

## Run both sides

Independent measurement:

```bash
treg call dataforseo.web.page.audit --method POST --data '[{"url":"$0","enable_javascript":true,"enable_browser_rendering":true}]'
```

Costs about **0.003 USD** with rendering on (more than the 0.00015 default — worth
it, because half of `audit.ts` is about what a page shows once JS has run).
Check `treg balance` first and report the spend.

Ours: read `src/lib/audit.ts` and apply it to the same page, either by reasoning
through it or by calling the running route if a dev server is up.

## Compare finding by finding

Build a table: finding id · ours · theirs · agree?

Then account for every disagreement. The interesting ones:

- **We fire, they don't** → likely a false positive. That is the expensive kind:
  it tells an owner something is wrong with their site when it isn't, and the
  section's entire argument is that it shows them the truth.
- **They fire, we don't** → a gap, possibly a deliberate one. Check whether
  `looksBlocked()` or the did-it-render guard suppressed it *on purpose* before
  calling it a bug. Both suppressions exist so the audit stays silent rather
  than guessing, and a "gap" that is one of them working correctly is not a gap.
- **Load timing differs** → expected. Different vantage point, different network.
  Only worth reporting if it crosses one of our thresholds.

## Then

Report findings first and let the human decide. Propose a patch only for a
disagreement you can actually explain; if you cannot explain it, say so and stop
— a threshold nudged until the two sources agree is fitting to noise.

If you do change `audit.ts`, keep finding ids identical across both audiences.
The README explains why: the model-rewrite guard matches on those ids, and an id
that varies by audience disables that check silently rather than loudly.

Finish by running `npm run lint` and `npm run typecheck`.
