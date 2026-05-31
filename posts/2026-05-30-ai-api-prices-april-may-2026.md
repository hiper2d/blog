---
title: "Everyone's Mad About Copilot's Pricing. The Real Move Is Upstream."
slug: "ai-api-prices-april-may-2026"
date: 2026-05-30
status: published
summary: "GitHub Copilot moving off flat $20/mo and onto usage-based billing is dominating the news cycle. The takes write themselves: the era of cheap vibe-coding is ending, the AI companies were eating losses, and now the bill is coming due. But that story is downstream. The number that actually moved — across most of the eight providers I track in a Werewolf side-project — is the per-token API price. Here's what two months of pricing updates look like from inside."
tags: [ai, pricing, api, llm]
header_image: /images/ai-api-prices-april-may-2026.jpg
---

AI is getting more expensive, and everyone can feel it. It's not just GitHub Copilot swapping its flat $20/month subscription for usage-based billing, or Claude Code tightening its quotas and nudging Pro users toward the $100/month tier. Tokens themselves are getting more expensive.

I run an [AI Werewolf side project](https://github.com/hiper2d/werewolf-ai-party-game) that uses the APIs of every major AI company, so I track how their pricing moves release over release. These spring updates are an interesting batch.

Almost every model that shipped in **April and May 2026** is more expensive than the one it replaced.

| Model bump                        | Input ($/M) | Output ($/M) | Cache ($/M) | Avg ↑ (in/out) |
|-----------------------------------|---|---|---|---|
| OpenAI GPT-5.4 → GPT-5.5          | 2.50 → **5.00** | 15.00 → **30.00** | 0.25 → **0.50** | **+100%** |
| DeepSeek Reasoner (V3.2) → V4 Pro | 0.28 → **0.44** | 1.68 → **0.87** | 0.028 → **0.0036** | **+3%** |
| Mistral Medium 3.1 → 3.5          | 0.40 → **1.50** | 2.00 → **7.50** | — | **+275%** |
| Google Gemini 3.1 Flash → 3.5     | 0.50 → **1.50** | 3.00 → **9.00** | 0.05 → **0.15** | **+200%** |
| Moonshot Kimi K2.5 → K2.6         | 0.60 → **0.95** | 3.00 → **4.00** | 0.10 → **0.16** | **+46%** |
| Z.AI GLM-5 → GLM-5.1              | 1.00 → **1.40** | 3.20 → **4.40** | 0.20 → **0.26** | **+39%** |
| xAI Grok 4.2 → 4.3                | 3.00 → **1.25** | 15.00 → **2.50** | — → **0.20** | **−71%** |
| Anthropic Claude Opus 4.7 → 4.8   | 5.00 → 5.00 | 25.00 → 25.00 | — | **0%** |

Five raised, one cut, one held flat, and one (DeepSeek) net-flat after a late reversal. Median: **+42%**. Mean: **+74%**.

## Going down the table, provider by provider

A rate-card delta doesn't tell you *why*. Here's the read on each.

**OpenAI — a great model, and double the price.** Credit first: GPT-5.5 is genuinely strong. It trades blows with Claude Opus and beats it on some benchmarks, and Codex now holds its own against Claude Code for agentic coding. The catch is the bill — **5.5 doubled the price of the 5.4 it replaced, to $5/$30**. OpenAI's defense is that 5.5 is more token-efficient in its reasoning. It might even be true. But it's unfalsifiable by design: OpenAI doesn't let you see the reasoning tokens you're paying for, only a short summary of them. You take the efficiency claim on faith and pay double up front.

**Google — "Flash" isn't the cheap tier anymore.** Gemini 3.1 Flash → 3.5 Flash tripled, $0.50/$3 → $1.50/$9 (**+200%**), and Google now pitches 3.5 Flash as the default workhorse while 3.5 Pro is still cooking. At $1.50/$9, "Flash" is creeping into the old Pro band (Gemini 3 Pro is $2/$12). The play is familiar: take the mid-size model, promote it to the default, and reprice it accordingly. The cheap-by-name tier quietly became a mid tier.

**Mistral — repricing ahead of a new family.** Medium 3.1 → 3.5 went $0.40/$2.00 → $1.50/$7.50, **+275%** — the same promote-the-middle move as Google's Flash, taken further. The tell is that their new *mid-tier* now costs more than the previous-gen Large flagship. That's not a normal version bump — it's a lineup being shifted upward, which usually means a next-gen family is staging behind it and the whole ladder is moving. Medium 3.5 is genuinely good and fast. It's also nearly 4x the price it was.

**Moonshot Kimi — the cheap option is gone.** Kimi retired its budget lineup and kept exactly one model, K2.6, at $0.95/$4 (**+46%**). It still undercuts most of the US mid-tier, but the gap is narrow now — nothing like the old chasm. The real loss is the *choice*: Kimi used to let you pick your tradeoff out loud — a dirt-cheap but slow model, or a faster Turbo build that cost more. That menu made the throughput tax explicit; you could see exactly what speed was costing you.

**Z.AI GLM — a slow doubling.** This bump alone (5 → 5.1) is only **+39%**, $1.00/$3.20 → $1.40/$4.40. But zoom out: GLM-4.5 was $0.60/$2.20. Across 4.5 → 5 → 5.1 the input price ran **+133%** and output **+100%** — a clean doubling in under a year, one modest-looking step at a time.

**DeepSeek — the only walk-back.** V4 Pro *launched* at $1.74/$3.48 — a 6x jump on input over the old V3.2 ($0.28/$1.68). Then DeepSeek ran a 75%-off promo and, as of **May 31**, made it the permanent rate: **$0.435/$0.87**. That lands input modestly above V3.2 and output actually *below* it. The only problem: it's still as slow as V3.2 was on the official API — slower, in my testing, than the new Kimi. Looks like that's how DeepSeek keeps the price low.

**xAI Grok — the one cut, with a quiet subtraction.** Grok 4.2 → 4.3 dropped hard, $3/$15 → $1.25/$2.50 (**−71%**), the only real cut in the cycle. But while the flagship got cheaper, xAI **deprecated its genuinely cheap specialist models**: `grok-4-fast` ($0.20/$0.50) and `grok-code-fast-1` ($0.20/$1.50), both now folded into Grok 4.3. So yes, the flagship cut is real; but the *floor* came up.

**Anthropic — flat, and at the top.** Three version bumps (4.6 → 4.7 → 4.8 Opus), zero price change — Opus pinned at $5/$25, Sonnet at $3/$15, Haiku at $1/$5. Opus has long been the priciest flagship on the board, and it's still right at the top; this cycle only GPT-5.5 edged past it, and only on output. The ceiling is about to rise anyway: Anthropic has announced **Mythos**, a model *class above* Opus — pricier still, and gated to security and enterprise partners before any wider release. We may be about to get the first frontier model that's effectively enterprise-only, priced past what anyone would put on a personal card.

## What the price actually buys

Worth putting capability next to cost, because they don't move together as neatly as you'd hope. This month Datacurve published [**DeepSWE**](https://deepswe.datacurve.ai/), a hard agentic-coding benchmark — 113 real bug-fix/feature tasks pulled from 91 repositories across five languages, with reference solutions averaging ~5.5x more code than SWE-bench-style tests.

The metric is **pass@1**: each model gets a *single* attempt at each task — no retries, no best-of-N — and the score is the percentage of the 113 tasks it solves outright, where "solves" means its code patch applies cleanly and the repository's own test suite goes green. So 70% is roughly 79 tasks fixed on the first try; 8% is about nine. One shot, graded by the project's real tests. Here are the providers this post tracks:

| Model | DeepSWE pass@1 |
|---|---|
| OpenAI GPT-5.5 | **70%** |
| Anthropic Claude Opus 4.8 | 58% |
| Anthropic Claude Opus 4.7 | 54% |
| Google Gemini 3.5 Flash | 28% |
| Anthropic Claude Opus 4.6 | 28% |
| Moonshot Kimi K2.6 | 24% |
| Z.AI GLM-5.1 | 18% |
| xAI Grok (build-0.1) | 13% |
| DeepSeek V4 Pro | **8%** |

(Error bars are ±4–5 points, so neighbors — Opus 4.7 vs 4.8, say — are within noise. The spread across the whole board is not.)

Two things line up with the pricing story, and one cuts against it.

**Lines up:** the models that raised hardest sit at the top. GPT-5.5 — the +100% bump — leads at 70%. And DeepSeek V4 Pro, the cheap-disruptor everyone keeps pointing to, lands dead last at 8%. That's the capstone on the cheap-but-slow story above: on the hardest agentic work, the cheap option isn't just slower — it's not in the conversation. You're not overpaying at the top of that table — you're paying for the models that clear the bar at all.

**Cuts against it:** Anthropic. Opus went 28% → 54% → 58% across 4.6 → 4.7 → 4.8 — capability roughly doubled from 4.6 to 4.7 — while the price stayed pinned at $5/$25 the entire time. That's the one spot in this whole cycle where the buyer got materially more and paid exactly the same.

## What's actually going on

**Tokens.** Everything that's supposed to push the price of a token *down* is, in fact, pushing down. The architecture has improved on every axis — attention, training, quantization, serving. The field keeps getting better at squeezing more tokens out of the same GPU. Everyone's pouring money into datacenters and their own chips. And the per-token rate goes up anyway.

**Reasoning.** Practically every model worth using is a reasoning model now — turns out chain-of-thought works after all. Which means more tokens burned per task, every task. And good luck auditing them: who's even counting reasoning tokens? OpenAI won't show you the ones you're paying for.

**Harness.** The agentic layer is tightening in lockstep. Copilot going usage-based is the loudest example — and the latest. Claude Code quietly became unusable on the $20/month plan months ago: half an hour of real work and you'd hit the ceiling. Comfortable coding now means Claude's $100/month Max tier. Codex just went the same way. And the assistants keep getting more agentic — more parallel sessions, more background workers, all of it chewing through your quota faster.

It's getting pricier on all fronts.

## Time to refresh plan B

So while the AI companies work on locking you in and turning up the meter, what do you actually do about it?

I'm not ready to give up Claude Code or Codex — but the feeling of being on the hook keeps getting more real. A year ago I was happy on $20/month; now I'm paying 5x that for the tier where the work doesn't stall halfway through a session.

So it's probably time to blow the dust off my old 16GB AMD card and give the latest Qwen, Gemma, and Mistral another run. Last time I tried, the heavily quantized local models were decent at conversation and pretty bad at function calling. I'm curious to see what has changed there.

And for what it's worth, we still live in capitalism, like it or not. Companies are already complaining about their AI bills. So I'm not convinced the plan to keep ratcheting prices up finds as much love in the enterprise as the providers are betting on. The squeeze works right up until the people being squeezed start doing the math.

<figure>
  <img src="/images/ai-api-prices-bill-coming-due.jpg" alt="A long thermal-printer receipt unspooling off a dark desk lit by monitor glow, coiling into a pile on the floor — an impossibly long itemized bill in a dim, empty office." />
  <figcaption>The invoice is the part you see. The rate card moved two months ago.</figcaption>
</figure>

---

*Numbers in this post are sourced from each provider's official pricing page and from the version history of [this file](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/ai-models.ts) in my Werewolf project.*
