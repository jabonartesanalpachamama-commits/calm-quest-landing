---
name: seo-content-writer
description: 'Use when the user asks to "write SEO content"; drafts posts, articles, and landing pages with keywords, headers, snippets, and evidence boundaries. SEO文章写作/内容优化'
version: "9.9.9"
license: Apache-2.0
source: "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
compatibility: "Claude Code, skills.sh, ClawHub, Vercel Labs, Cursor, Windsurf, Codex CLI, Amp, Gemini CLI, Kimi Code, Qwen Code, CodeBuddy"
when_to_use: "Use when writing SEO-optimized articles, blog posts, landing pages, or product descriptions. Also when the user asks to create content targeting a specific keyword."
argument-hint: "<topic> <target keyword>"
metadata:
  author: aaron-he-zhu
  version: "9.9.9"
  geo-relevance: "medium"
  tags:
    - seo
    - content-writing
    - blog-writing
    - seo-copywriting
    - content-creation
    - article-writing
    - landing-page
    - redaccion-seo
  triggers:
    - "write SEO content"
    - "create blog post"
    - "SEO copywriting"
    - "write me a blog post"
    - "help me write about"
    - "how to write SEO friendly content"
    - "escribir artículo SEO"
---

# SEO Content Writer

Creates SEO content that aligns with search intent, integrates keywords naturally, and stays usable for readers.

## Quick Start

```
Write an SEO-optimized article about [topic] targeting the keyword [keyword]
```

```
Here's my content brief: [brief]. Write SEO-optimized content following this outline.
```

## Skill Contract

**Expected output**: a ready-to-use draft plus the standard handoff summary for `memory/content/`.

- **Reads**: the brief, target keywords, entity inputs, quality constraints, and prior decisions.
- **Writes**: a user-facing content deliverable and reusable summary.
- **Primary next skill**: content-quality-auditor when the draft is ready for gating.

## Instructions

When a user requests SEO content, run these nine steps:

1. **Gather Requirements** — confirm primary and secondary keywords, word count, content type, audience, intent, tone, CTA, and competitors.
2. **Load CORE-EEAT Constraints** — apply the 16 high-weight items listed in the companion reference.
3. **Research and Plan** — analyze the SERP, map keywords, and choose the content angle.
4. **Create Optimized Title** — keep it concise, keyword-led, and aligned with intent.
5. **Write Meta Description** — include the keyword, value proposition, and CTA.
6. **Structure Content and Write** — use a clean H1 > intro > H2/H3 > FAQ > conclusion flow.
7. **Apply On-Page Best Practices** — manage keyword placement, readability, snippets, and supporting visuals.
8. **Add Internal / External Links** — include relevant internal and authoritative external links.
9. **Run Final SEO + CORE-EEAT Review** — score the draft, auto-fix small issues, and surface any decisions that still need the user.

## CORE-EEAT Constraints (16 High-Weight Items)

| ID | Standard | How to Apply |
|----|----------|--------------| 
| C01 | Intent Alignment | Title promise matches delivery |
| C02 | Direct Answer | Core answer appears in the first 150 words |
| C06 | Audience Targeting | State who the content is for in the intro or opening section |
| C10 | Semantic Closure | Conclusion resolves the opening question and gives a next step |
| O01 | Heading Hierarchy | Clean H1 → H2 → H3 structure |
| O02 | Summary Box | Include a TL;DR or key takeaways block near the top |
| O06 | Section Chunking | Keep paragraphs to 3-5 sentences and one topic per section |
| O09 | Information Density | Remove filler |
| R01 | Data Precision | Include at least 5 precise numbers with units when the topic supports them |
| R02 | Citation Density | Include at least 1 external citation per 500 words |
| R04 | Evidence-Claim Mapping | Every material claim has evidence, an example, or a citation |
| R07 | Entity Precision | Use full names for people and organizations |
| C03 | Query Coverage | Cover at least 3 query variants or follow-up questions |
| O08 | Anchor Navigation | Add a TOC when the draft has 3+ H2 sections |
| O10 | Multimedia Structure | Use captions and meaningful media |
| E07 | Practical Tools | Add at least 1 template, checklist, calculator, or worksheet when relevant |

## Content Structure (Default Blog Post)

```
H1: [Primary Keyword] — [Value Prop]
---
TL;DR: [2-3 sentence summary]
---
## Introduction
[Hook + audience statement + core answer in first 150 words]

## [H2 Topic 1]
### [H3 Subtopic]
[3-5 sentence paragraphs]

## [H2 Topic 2]
...

## Frequently Asked Questions
Q: [question variant 1]
A: [direct answer]

## Conclusion
[Semantic closure + CTA + next step]
```

## Tips for Success

Match intent, front-load value, support claims with evidence, and write for humans before optimizing for the SERP.

## Reference Materials

- [Instructions Detail](references/instructions-detail.md) — Workflow, CORE-EEAT constraints, issue handling, self-check
- [SEO Writing Checklist](references/seo-writing-checklist.md) — On-page checklist, snippet patterns, and copy-start template
