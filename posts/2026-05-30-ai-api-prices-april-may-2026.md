---
title: "Everyone's Mad About Copilot's Pricing. The Real Move Is Upstream."
slug: "ai-api-prices-april-may-2026"
date: 2026-05-30
status: published
summary: "GitHub Copilot moving off flat $20/mo and onto usage-based billing is dominating the news cycle. The takes write themselves: the era of cheap vibe-coding is ending, the AI companies were eating losses, and now the bill is coming due. But that story is downstream. The number that actually moved — across most of the eight providers I track in a Werewolf side-project — is the per-token API price. Here's what two months of pricing updates look like from inside."
tags: [ai, pricing, api, llm]
header_image: /images/ai-api-prices-april-may-2026.jpg
---

The story everyone's running this month is **GitHub Copilot moving off flat $20/mo and onto usage-based billing**. The takes write themselves: the era of cheap subscription vibe-coding is ending, the AI companies were eating the loss to capture users, and now the bill is coming due.

That story is real. But it's downstream. The number that actually moves is the **per-token API price** model providers charge — and that's where the more interesting move is happening.

## A weird vantage point

I run an [AI Werewolf party game](https://github.com/hiper2d/werewolf-ai-party-game) where AI bots pretend to be human players. Every couple of weeks I update the model roster — new versions ship, old ones deprecate, and I update the pricing config the cost calculator reads. So I've been watching the per-token rates from the inside, across eight providers, for over a year.

Across **April and May 2026**, most new model releases raised prices — and several did so steeply. Not "a little." A lot. Here's the tally, all figures from each provider's first-party pricing page, per 1M tokens.

| Model bump | Input ($/M) | Output ($/M) | Cache ($/M) | Avg ↑ (in/out) |
|---|---|---|---|---|
| OpenAI GPT-5 → GPT-5.5 | 2.50 → **5.00** | 15.00 → **30.00** | 0.25 → **2.50** | **+100%** |
| DeepSeek Reasoner → V4 Pro | 0.28 → **0.44** | 1.68 → **0.87** | 0.028 → **0.0036** | **+3%** |
| Mistral Medium 3.1 → 3.5 | 0.40 → **1.50** | 2.00 → **7.50** | — | **+275%** |
| Google Gemini 3 Flash → 3.5 | 0.50 → **1.50** | 3.00 → **9.00** | 0.05 → **0.15** | **+200%** |
| Moonshot Kimi K2.5 → K2.6 | 0.60 → **0.95** | 3.00 → **4.00** | 0.10 → **0.16** | **+46%** |
| Z.AI GLM-5 → GLM-5.1 | 1.00 → **1.40** | 3.20 → **4.40** | 0.20 → **0.26** | **+39%** |
| xAI Grok 4 → 4.3 | 3.00 → **1.25** | 15.00 → **2.50** | — → **0.20** | **−71%** |
| Anthropic Claude 4.6 → 4.8 Opus | 5.00 → 5.00 | 25.00 → 25.00 | — | **0%** |

Five raised, one cut, one held flat, and one (DeepSeek) net-flat after a late reversal. Median: **+42%**. Mean: **+74%**.

## Going down the table, provider by provider

A rate-card delta doesn't tell you *why*. Here's the read on each.

**OpenAI — the headline doubling.** GPT-5 launched at $2.50/$15 and held through the 5.x point releases; **5.5 doubled it to $5/$30**, twice the price of the 5.4 it replaced. OpenAI's pitch is that 5.5 is more token-efficient — it burns fewer tokens to finish a complex task, so the cost *per task* rises less than the rate card suggests. Maybe. That's a hard claim to check from the outside, and it conveniently isn't printed on the pricing page. The quieter move is worse: **the prompt-cache rate went up 10x**, $0.25 → $2.50/M. Caching is what makes long-context agentic apps economically viable — if you're hammering a 100K-token system prompt thousands of times a day, that one line item just jumped an order of magnitude. Nobody wrote that headline; it's buried two levels deep in the pricing page.

**Mistral — repricing ahead of a new family.** Medium 3.1 → 3.5 went $0.40/$2.00 → $1.50/$7.50, **+275%**. The tell is that their new *mid-tier* now costs more than the previous-gen Large flagship. That's not a normal version bump — it's a lineup being shifted upward, which usually means a next-gen family is staging behind it and the whole ladder is moving. Medium 3.5 is genuinely good and fast. It's also nearly 4x the price it was.

**Google — "Flash" isn't the cheap tier anymore.** Gemini 3 Flash → 3.5 Flash tripled, $0.50/$3 → $1.50/$9 (**+200%**), and Google now pitches 3.5 Flash as the default workhorse while 3.5 Pro is still cooking. At $1.50/$9, "Flash" is creeping into the old Pro band (Gemini 3 Pro is $2/$12). Same playbook as Mistral: take the mid-size model, promote it to primary, and reprice it accordingly. The cheap-by-name tier quietly became a mid tier.

**Moonshot Kimi — the cheap SKU just disappeared.** Strange one. Kimi used to run a dirt-cheap, very slow K2 alongside a faster, pricier Turbo — the same cheap-but-check-which-SKU-you're-actually-running trap as DeepSeek. Now both are gone. What's left is a single K2.6 at $0.95/$4 (**+46%**), and it isn't cheap. They didn't just raise a price — they retired the budget option entirely.

**Z.AI GLM — a slow doubling.** This bump alone (5 → 5.1) is only **+39%**, $1.00/$3.20 → $1.40/$4.40. But zoom out: GLM-4.5 was $0.60/$2.20. Across 4.5 → 5 → 5.1 the input price ran **+133%** and output **+100%** — a clean doubling in under a year, one modest-looking step at a time. The per-release number hides the trend; the trend is everyone else's.

**DeepSeek — the only walk-back, and it has a catch.** This one needs the backstory. V4 Pro *launched* at $1.74/$3.48 — a 6x jump on input over the old Reasoner ($0.28/$1.68) — and for about two weeks the "cheap disruptor is dead" piece wrote itself (+314% on the launch-day headline). Then DeepSeek ran a 75%-off promo and, as of **May 31**, made it the permanent rate: **$0.435/$0.87**. That lands input modestly above the old Reasoner and output actually *below* it — the net move is a rounding error, which is why the table shows +3%. Genuinely the only provider that flinched this cycle. But the catch is the one V3 always had: it's *slow*. I was reluctant to wire DeepSeek V3 into the Werewolf game even at its rock-bottom rate, because a turn that takes 40 seconds to come back kills the round — and V4 Pro is still slow on the official API. The permanent discount reads less like generosity than like the going rate for a tier whose throughput can't command more. Cheap, again, with the speed asterisk.

**xAI Grok — the one cut, with a quiet subtraction.** Grok 4 → 4.3 dropped hard, $3/$15 → $1.25/$2.50 (**−71%**), the only real cut in the cycle. But while the flagship got cheaper, xAI **deprecated its genuinely cheap specialist models**: `grok-4-fast` ($0.20/$0.50) and `grok-code-fast-1` ($0.20/$1.50), both now folded into Grok 4.3. Those were ~6x cheaper on input than the main model — `grok-code-fast-1` in particular was a real subscription-free option for coding. So yes, the flagship cut is real; but the *floor* came up. The cheapest way to use Grok got more expensive even as the headline model got cheaper. Why kill a good cheap coding model right as coding tools go usage-based? Presumably because consolidating onto one model is cleaner — and because the cheap tier was leaving money on the table.

**Anthropic — flat, and at the top.** Three version bumps (4.6 → 4.7 → 4.8 Opus), zero price change, Opus pinned at $5/$25 (Sonnet $3/$15, Haiku $1/$5). In a cycle where everyone else moved, *not* moving is a position — either the margins are comfortable enough that they don't need to, or they're treating price stability as its own moat against switching costs. Probably both. When a buyer is choosing between Claude and GPT-5.5, "your costs won't double on us next quarter" is a real selling point. The flip side is the ceiling: Opus is already the most expensive mainstream flagship by a wide margin, and with labs signaling even pricier top-tier families ahead, it's fair to ask how long the best models stay affordable for individuals rather than only funded teams. On this trajectory, we may already be at that line.

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

Two reads, both probably right.

**Read one: reasoning tokens are expensive.** Most of these new versions either turned reasoning on by default or expanded thinking budgets. Reasoning eats compute — for every visible output token, there can be 5–10x as many hidden thinking tokens behind the scenes. The provider pays for that GPU time whether the customer sees the tokens or not. Either the price goes up, or the margin disappears. They picked.

**Read two: the customer-acquisition phase is over.** The cheap pricing of 2024 was about getting apps wired in. Now there's a captive base of products built on these APIs, with real switching costs — prompts tuned to a specific model, evals built around its quirks, agent harnesses designed for its tool-calling style. The spreadsheets came out, and the providers found out what their pricing power actually was. It turns out to be quite a lot.

## So the Copilot story is the wrong frame

The discourse this month is treating Copilot's pricing change as the leading indicator. It's not. It's a lagging one.

**The leading indicator is the per-token rate card, and it's been moving for two months.** Copilot's price change is the *first visible consequence* of the API-layer move, the moment it hit retail. Cursor, Windsurf, Replit, every agent-style coding tool — they're all looking at the same spreadsheet right now. The subscription-tier reshuffles will keep coming.

If you maintain an app that depends on these APIs and you've been assuming token costs trend down — recheck your unit economics. They don't. The Moore's Law for tokens narrative, the one that said every release would be cheaper than the last, was a 2023–2024 phenomenon. In April–May 2026, **five of eight providers spent their version-bump budget raising prices, one walked a 6x hike back to flat under pressure, one held the line, and one cut.**

By the time it shows up as a Copilot price hike, it's already been baked in for two months.

<figure>
  <img src="/images/ai-api-prices-bill-coming-due.jpg" alt="A long thermal-printer receipt unspooling off a dark desk lit by monitor glow, coiling into a pile on the floor — an impossibly long itemized bill in a dim, empty office." />
  <figcaption>The invoice is the part you see. The rate card moved two months ago.</figcaption>
</figure>

---

*Numbers in this post are sourced from each provider's official pricing page and from the version history of [this file](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/ai-models.ts) in my Werewolf project.*
