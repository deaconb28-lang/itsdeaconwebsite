# Project skills

Skills in this directory load automatically for anyone running Claude Code in
this repo. They are vendored, not fetched — the agent reads them off disk, so
they work offline and they cannot change under us.

## web-design-engineer

Vendored from [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills)
(MIT). Skill version `1.3.0`, taken from commit
[`aaf9a82`](https://github.com/ConardLi/garden-skills/commit/aaf9a82f5efd73e87cc0998edc398e75bfc35901).
`LICENSE` inside the skill folder is the upstream copy.

It is a design-engineering harness: a design-read step that calibrates five
dials before any code is written, a redesign protocol that names what must be
preserved, a catalogue of AI-cliché failure patterns, and 25 style recipes
anchored to real design schools (Linear, Aesop, Stripe Press, Tufte, Vignelli,
Monocle, Dieter Rams…). Reference material lives under `references/` and is
loaded on demand rather than up front.

Use it for visual front-end work on this site — page redesigns, the pitch-page
layouts, design critique. It is not for the API routes, the audit library, or
anything non-visual.

### Upstream has four more skills

`beautiful-article`, `gpt-image-2`, `kb-retriever`, and
`web-video-presentation`. None of them are about building a marketing site —
they cover long-form HTML articles, OpenAI image generation, local
knowledge-base retrieval, and screen-recorded web presentations — and four of
the five are written in Chinese, so only the design one is vendored here. To add
another later:

```sh
git clone --filter=blob:none --sparse --depth 1 \
  https://github.com/ConardLi/garden-skills.git /tmp/garden
git -C /tmp/garden sparse-checkout set skills
cp -R /tmp/garden/skills/<name> .claude/skills/<name>
```

### Updating

Re-run the clone above, copy `skills/web-design-engineer` over the top, and
update the commit hash in this file so the pin stays honest.
