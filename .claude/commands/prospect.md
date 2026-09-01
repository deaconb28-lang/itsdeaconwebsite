---
description: Research a local business before pitching them — their live site, where they rank, who they are — written up as a shareable brief.
argument-hint: <domain> [restaurant|small-business]
allowed-tools: Bash(treg:*), Read, Glob, Grep, Skill, Artifact, WebFetch
---

Research **$1** as a prospect and write the brief Deacon would read before
getting in touch. If `$2` names an audience use it; otherwise infer it from what
the business turns out to be, and say which you picked.

## Before you spend anything

`treg` calls cost real money from a prepaid team balance. Run `treg balance`
first. The budget for this command is **~$0.01**. Report what you actually spent
at the end — every response carries its own cost.

## Gather

Run these; skip any that 4xx rather than retrying elsewhere (a 4xx is your
parameters, and re-trying costs money for one mistake):

```bash
treg call branddev.brand.screenshot --query domain=$1
treg call dataforseo.web.page.audit --method POST --data '[{"url":"https://$1/"}]'
treg call treg.companies.enrich --method POST --data '{"domain":"$1"}'
```

The page audit is the one that matters most — it measures load timing, status,
meta and h-tags on the real page.

## Judge it with this repo's own vocabulary

Read `src/lib/audit.ts` and use **its** findings and their wording. That file is
the site's opinion about what is wrong with a small business's website, and the
brief should agree with the product rather than invent a parallel set of
criteria. Read `src/lib/audience.ts` for the noun the audience counts in.

Two rules from that file that bind here too, because they are about honesty
rather than implementation:

- **Only report absence when the page actually rendered.** If the audit shows a
  JS shell that never ran, you have learned nothing about whether ordering or a
  contact route exists. Say the page did not render; do not guess.
- **Never analyse a bot challenge.** If the fetch came back as a CAPTCHA or a
  shield page, that is not their website. Stop and say so.

## Write it

Lead with the single thing you would say to this owner first — one sentence,
their language, not ours. Then the findings that are actually true of their
page, worst first. Then where they rank if you looked. Close with whether they
are worth approaching at all: **"keep your site" is a real and frequent answer**,
and the repo's 0-of-4 verdict exists precisely so it can be given.

Do not invent figures. Every number is either measured above or absent.

## Publish

Use the **artifact-design** skill, then publish the brief as an artifact so it
can be shared. Title it after the business.
