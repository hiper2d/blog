---
title: "How much does it cost to run a text game with LLMs"
slug: "werewolf-real-llm-costs"
date: 2026-11-08
status: published
summary: "I log every AI call my game makes, so I finally checked the token prices against the bills. The rate card was wrong about almost everything."
tags: [ ai, llm, pricing, prompt-caching ]
header_image: /images/werewolf-costs-intro.jpg
---


AI prices are confusing. Providers give you a lot of numbers and nothing to actually know how much you are going to pay in the long run. There is no point in these input/cached/output token prices if you have no idea how many reasoning tokens you'll spend on your tasks. How much will be cached. You cannot even compare different models because they reason differently. Some providers charge for the cache storage, some provide different caching strategies, some apply rates for busy hours, some...

And it's only the text. Image and voice are even more confusing.

So, collecting cost metadata from responses is the only way. This article is based on 51,000 AI calls in my [AI Werewolf](https://aiwerewolf.net) text game. Pure statistics out of my wallet.

## AI in text games

My text game is nothing but a group chat with a human player and 5-15 bots. It's a long conversation with some role-play, rule following, periodic compactions. I wrote about its design earlier in [How to make LLMs play conversational games](/post/llms-play-conversational-games). This can work for any text game with AI. I support 27 LLMs from all major labs, image generation for avatars and illustrations, voice for input and output. I also use classifiers on user inputs. AI is all around the place. And it costs money.

![The role card at the start of a game: You are the Villager, wins with the village.](/images/werewolf-costs-villager.jpg)

Since mid-September, every AI call the game makes writes one row to a stats table: tokens in, tokens out, cached tokens, cost and time. That is 53 days and about 51,000 calls so far. It's a lot of data, and we'll go through it together.

## I pay for free users

Yeah, someone has to pay for API calls, and this someone is me. I have a paid tier, but the only user in it is me. My other 651 users are on the free tier. And it is generous - I let each of them spend up to $5 of my money daily. I don't restrict anything except the most expensive models. Mainly because the retention is low - people come and go. I don't see the point in pushing payments. And free users are awesome testers, especially when they are looking for ways to cheat and trick me.

I know, I know, it's easy to go bankrupt with such a strategy. All my friends who are into startups would call my approach rather questionable. But it kind of works - I have people playing without ads or ugly tricks like throwing banners with special offers. I track all clicks and calls, I'll be notified by [Marlow](/post/ai-agent-monitoring-stack) on anything abnormal within 5 minutes. So I'm ready to reconsider it when the situation changes.

## How much I spend a day

I have 6 unique users daily.

**$6.36 a day on average.** A typical day is a little under $6. The cheapest day was under 30 cents and the worst was about $16. The last 30 days are higher, at about $7, because more people are playing.

| Category | 53 days | Per day | Share |
|---|---:|---:|---:|
| Text (bots, Game Master, story) | $212.30 | $4.01 | 63% |
| Images (portraits, scene illustrations) | $94.66 | $1.79 | 28% |
| Audio (bot voices, speech to text) | $28.29 | $0.53 | 8% |
| Classifiers (who speaks next, content screen) | $1.96 | $0.04 | 0.6% |
| **Total** | **$337.21** | **$6.36** | |

A real game (50 turns or more) costs **$1.49** on average: $1.03 of text, $0.32 of images, $0.13 of voice. It takes about 165 AI turns.

## What's in a turn

It's an action taken by a bot. A reply to the chat, a vote, a night activity. I send the request with the context to an official LLM API and get back the bot's response. I count the cost of all the tokens in both - the response message contains this information.

![Talia, a bot on Gemini 3.5 Flash Lite, introduces herself in a Giant Robots vs Aliens game. Her card shows what she has cost so far: $0.0011.](/images/werewolf-costs-talia.jpg)

I compare my 27 models by the cost of the average turn. I track different types of turns:

| Bot turn | Share of turns | Tokens in | Of those, cached | Tokens out | Cost per turn |
|---|---:|---:|---:|---:|---:|
| Introduction | 13% | 3,690 | 504 (14%) | 299 | 0.30¢ |
| Day discussion | 46% | 8,218 | 3,544 (43%) | 428 | 0.41¢ |
| Vote | 19% | 10,094 | 1,987 (20%) | 511 | 0.60¢ |
| Night action | 10% | 11,950 | 3,254 (27%) | 503 | 0.65¢ |
| End-of-day summary | 11% | 13,545 | 945 (7%) | 1,124 | 1.00¢ |
| Post-game chat | 1% | 12,313 | 4,101 (33%) | 348 | 0.55¢ |

The summary is my compaction step. At the end of each day, every bot reads the day and rewrites its own notes. It's the most expensive turn in the game: it has the largest input, the most output and almost no cache. Summaries are 11% of bot turns and 21% of bot spend.

Context grows as the game goes on. A discussion turn starts at about 6,600 input tokens on day 1 and reaches about 11,400 on day 5. A summary goes from about 12,100 to about 16,800.

Some calls aren't bot turns:

| Other calls | Tokens in | Of those, cached | Tokens out | Cost per call |
|---|---:|---:|---:|---:|
| Story generation for a new game | 12,218 | 2,389 (20%) | 4,309 | 0.85¢ |
| Game Master narration, all kinds | 2,114 | 13 (1%) | 595 | 0.16¢ |
| Router (who speaks next), Jev | 3,400 | 0 | 0 | 0.014¢ |
| Router backup, GPT-6 Luna | 3,814 | 0 | 0 | 0.038¢ |
| Content screen, Jev | 788 | 0 | 0 | 0.003¢ |
| Content screen backup, GPT-6 Luna | 1,415 | 0 | 0 | 0.014¢ |

Output tokens are the trickiest ones because they include the response text + all the reasoning. They are very unpredictable because you have no idea how much a model is going to reason.

## The four bands of LLMs

Text is the biggest part, so I'll start there. My game sorts every text model into one of four bands, based on what one bot turn costs. The band decides how many bots of that model a free game can have.

| Cost per turn | Bots in a free game | Share of turns | Share of bot spend |
|---:|---:|---:|---:|
| Up to 0.3¢ | Unlimited | 56% | 12% |
| Up to 1¢ | 3 | 21% | 25% |
| Up to 2¢ | 1 | 16% | 31% |
| Over 2¢ | Paid only | 7% | 33% |

The bands didn't start this way. I used to set the limits from the output price. It looked reasonable. It was wrong, as you'll see in the paid-only section. On September 20 I switched to the measured cost per turn. The free-tier cost per turn went from 0.91 cents to 0.67 cents in the next 30 days, and to 0.50 cents in the last 30 days. Cheaper new models helped too, so I can't give all of that to the change. But I should have measured from the start.

The tables below show models with at least 100 calls in the last 30 days, or the small samples I point out.

### Unlimited: up to 0.3¢

| Model | Company | Cost per turn | Median reply | Slowest 10% |
|---|---|---:|---:|---:|
| GPT-6 Luna | OpenAI | 0.09¢ | 4.8s | 11.6s+ |
| DeepSeek V4.1 Flash | DeepSeek | 0.09¢ | 2.6s | 7.2s+ |
| Qwen 3.8 Flash | Alibaba | 0.10¢ | 11.6s | 22.9s+ |
| MiniMax M3.1 Flash | MiniMax | 0.10¢ | 3.9s | 10.6s+ |
| GLM-5.3 Flash | Zhipu | 0.13¢ | 5.6s | 16.7s+ |
| Mistral 4 Small | Mistral | 0.17¢ | 5.2s | 10.1s+ |
| Claude Haiku 5.5 | Anthropic | 0.19¢ | 4.8s | 9.1s+ |
| Gemini 3.5 Flash Lite | Google | 0.21¢ | 1.0s | 1.6s+ |

Yep, all the small frontier models from everybody. I'm not including reasoning efforts and output budgets in the table to save space and sanity. But I spent a lot of time balancing those things to get decent speed and performance.

![Nyx, a bot on GPT-6 Luna, in a game played in Russian. Her card shows a cost of $0.0004.](/images/werewolf-costs-nyx.jpg)

Luna is as cheap as DeepSeek Flash. GLM and Qwen Flash are slow.

### Up to 3 bots: up to 1¢

| Model | Company | Cost per turn | Median reply | Slowest 10% |
|---|---|---:|---:|---:|
| DeepSeek V4 Pro | DeepSeek | 0.55¢ | 10.3s | 30.0s+ |
| GPT-6.1 Terra | OpenAI | 0.74¢ | 3.1s | 6.1s+ |
| GLM-5.3 | Zhipu | 0.93¢ | 5.0s | 15.6s+ |
| Gemini 3.8 Flash | Google | 0.93¢ | 10.0s | 16.6s+ |

Gemini 3.8 Flash surprised me in a bad way. The jump from Flash Lite is big. It costs 4.4 times as much per turn and takes 10 times as long to reply. It charges more per token, and it writes about 800 output tokens a turn where Flash Lite writes about 80. Most of those 800 are reasoning.

DeepSeek Pro is slow: 10.3 seconds for a median reply. Full-size GLM is twice as fast as Gemini 3.8 Flash.

GPT-6.1 Terra is nice. It got much cheaper relative to GPT-5.6 and it's very fast. Good job, OpenAI.

### 1 bot: up to 2¢

| Model | Company | Cost per turn | Median reply | Slowest 10% |
|---|---|---:|---:|---:|
| Qwen 3.8 Max | Alibaba | 1.02¢ | 10.5s | 25.7s+ |
| Mistral Large 4 | Mistral | 1.30¢ | 17.2s | 27.3s+ |
| Muse Spark 1.3 | Meta | 1.31¢ | 10.1s | 23.6s+ |
| Kimi K3.1 Pro | Moonshot | 1.47¢ | 13.3s | 34.1s+ |
| Gemini 4 Argon | Google | 1.63¢ | 10.8s | 28.3s+ |

All the losers are here. Expensive and slow. Kimi K3.1 has a faster version at double the price. Mistral Large 4 and Muse throw 1 min timeouts on summaries quite often.

I keep these models for diversity. They are not very practical for my game. Sometimes I move a more expensive model to this band to let users try it. And to collect some data.

### Paid only: over 2¢

| Model | Company | Cost per turn | Compared to Luna | Calls |
|---|---|---:|---:|---:|
| Claude Fable 5.1 | Anthropic | about 10.6¢ | 128x | 27 |
| Grok 4.7 | xAI | 4.89¢ | 59x | 29 |
| GPT-6 Astra | OpenAI | 4.38¢ | 53x | 25 |
| Claude Sonnet 5.5 | Anthropic | 3.13¢ | 38x | 955 |
| Gemini 3.1 Pro | Google | 2.94¢ | 35x | 458 |
| Claude Opus 5.5 | Anthropic | not enough data | - | - |
| GPT-6.1 Sol | OpenAI | not enough data | - | - |
| Muse Wonder 1.0 | Meta | not enough data | - | - |
| Sakana Fugu Max | Sakana | not enough data | - | - |

Fable is more than 100x more expensive than Luna. I don't have many numbers in this section - most of the models here have never been played by anyone except me.

**Grok and Gemini Pro.** In the 30 days before I changed the rule, Grok 4.6 was allowed three bots a game, because its output price was only $6. It cost 3.55 cents a turn and was the most expensive model in the app. Gemini 3.1 Pro was second at 2.80 cents. Together they were about 12% of the turns and 39% of the bot spend: $43.75 of $111.52. Meanwhile GLM-5.3, with a lower output price of $4.40, was limited to one bot and cost 0.76 cents.

That was my poor balancing based on the provider's token price. Having the stats helped me to adjust the bands. The worst part is that players don't even care about the models that much - it was the random selection in my code that put those models into games because they were considered affordable.

**Mistral Medium 3.5.** I then repeated the mistake. The new system gave it one seat per game. Its reasoning spiked to 15,000-24,000 tokens on some turns. It cost 3.5 cents a turn, and about 6% of its calls failed. I removed the model three weeks later. It cost me $12.32.

**Sonnet and Haiku.** On October 13 I gave Sonnet 5.5 one seat per free game, to collect samples. Over the same weeks:

| | Input tokens | Output tokens | Median reply | Cost per turn |
|---|---:|---:|---:|---:|
| Claude Haiku 5.5 | 13,255 | 784 | 4.8s | 0.18¢ |
| Claude Sonnet 5.5 | 12,231 | 460 | 4.2s | 3.10¢ |

Sonnet costs **17 times** as much per turn and it isn't faster. In its last week it was $11.35 of the $12.22 of Claude spend in my stats, nearly all from free games, from one seat per game.

## Token price vs. effective price

This is how much the real price differs from what I expected from the input/output rate. For the expected price I took a turn of 8,000 tokens in and 300 out at the rate card, with no cache. Then I divided the real average turn cost by it.

| Model | Real cost vs expected |
|---|---:|
| Grok 4.7 | 2.7x |
| Mistral Medium 3.5 | 2.5x |
| Mistral Large 4 | 2.1x |
| Gemini 3.1 Pro | 1.5x |
| Gemini 3.8 Flash | 1.3x |
| GPT-6.1 Terra | 0.8x |
| Kimi K3.1 Pro | 0.8x |
| GLM-5.3 | 0.7x |
| Qwen 3.8 Max | 0.6x |

The models under 1x are there because of caching. Without the cache, at the same token counts, Terra, GLM and Kimi would be at about 1.0x, and Qwen Max at 1.2x. Qwen Max reads 63% of its input from the cache, more than any other model here, so it goes from above the line to the cheapest ratio in the table. The models at the top write a lot more than 300 tokens a turn, and no cache discount covers that.

![The portrait sheet from a Giant Robots vs Aliens game: 15 portraits drawn as one image, including two hooded spares. The game cuts it into avatars.](/images/werewolf-costs-robots-sheet.jpg)

The hidden variable is reasoning. Grok 4.6/4.7 wrote about 2,200 output tokens a turn, and 94% of them were reasoning. Players saw about 100 of them. Not every provider reports the split, so I can't do this for all of them.

Another hidden thing is a tokenizer. Different models produce different amount of input tokens on the same text. Claude Haiku 5.5 averaged 13,473 input tokens a turn. GPT-6 Luna averaged 7,377 in the same kind of game.

## The myth of cheap Chinese models

The common story is that Chinese models are far cheaper than American ones. On average, in my data, that even looks true: a turn on a Chinese model cost 0.40 cents and a turn on everything else cost 0.76 cents.

Compare the models inside each band and the gap is gone. The bands are balanced, and neither side wins. I was surprised to see that Luna goes head to head with DeepSeek Flash.

The one exception is DeepSeek V4 Pro. At 0.55 cents a turn, it is the cheapest model in the 3-bot band, below GPT-6.1 Terra (0.74 cents) and Gemini 3.8 Flash and GLM-5.3 (0.93 cents each).

Chinese models are also slower. I wrote about that in August in [How I tried to write an article about slow Chinese LLMs](/post/slow-chinese-llms). DeepSeek Flash V4.1 is the exception. It has a median reply of 2.6 seconds, one of the fastest in the game.

## Caching is super tricky

Input is the biggest part of my text bill: about 73% of it, compared to 27% for output. The prompt also grows as the game goes on, from about 6,900 tokens on day 1 to about 15,500 on day 8. Almost all of that prompt is the same from one turn to the next. Providers sell cached input at 75-98% off. On paper, caching should fix everything.

In practice, only 29% of my input tokens were served from cache.

The first reason is the pace of the game. Coding agents call a model every few seconds. My bots wait for a human to type, and for other bots to talk. The median time between two calls from the same bot is 4 minutes. 42% of the gaps are over 5 minutes and 6% are over 30.

Here is the share of input tokens served from cache, depending on how long the bot had been silent.

| Gap between a bot's calls | <1m | 1-5m | 5-15m | 15-60m | 60m+ |
|---|---:|---:|---:|---:|---:|
| *Share of all turns* | *11%* | *47%* | *29%* | *9%* | *4%* |
| DeepSeek | 68% | 56% | 48% | 49% | 45% |
| Claude (1-hour cache) | 51% | 45% | 42% | 41% | 7% |
| Qwen | 87% | 70% | 36% | 21% | 3% |
| OpenAI | 31% | 23% | 19% | 13% | 0% |
| GLM | 38% | 27% | 16% | 2% | 0% |
| Mistral | 42% | 21% | 6% | 2% | 0% |
| Gemini | 36% | 16% | 2% | 1% | 0% |

The table says a few things:

- **DeepSeek doesn't care about my pace.** It hit on 100% of repeat calls, even after an hour. Its cache lasts hours or days. It's the only one built for a game like this.
- **Gemini is effectively off.** After 5 minutes it's gone. Gemini 3.8 Flash is one of the models I spend the most on, and only 10% of its input was cached.
- **Qwen is the best deal when you're quick.** Qwen Max got 63% of its input from cache, and that saved it nearly half its bill.
- **Slowness isn't the whole story.** OpenAI's cache is supposed to last 30 minutes, but it only served 31% of the tokens even when the gap was under a minute. I don't know why. The bot's call may just land on a different server.

![The Game Master opens a game with a welcome scene: a castle on the back of a sleeping dragon. The narration cost $0.0036.](/images/werewolf-costs-dragon.jpg)

The second reason surprised me, because I had blamed pace for everything. Here is the same cache share by type of turn:

| Gap between a bot's calls | <1m | 1-5m | 5-60m |
|---|---:|---:|---:|
| Day discussion | 55% | 51% | 33% |
| Night action | 52% | 16% | 13% |
| Vote | 25% | 23% | 15% |
| End-of-day summary | 26% | 7% | 6% |

Even with a short gap, votes and summaries barely hit. A discussion turn right after another discussion turn gets 60% within 5 minutes. A vote right after a discussion turn gets 23%. On OpenAI and Gemini, votes and summaries within 5 minutes get 0-2%.

After my [previous article](/post/llms-play-conversational-games) I reworked the caching logic. I stopped sending the system prompt twice to OpenAI, moved Claude to the 1-hour cache, and kept the repeated part of every prompt the same byte for byte. I thought I did a good job. Nope.

The vote problem is structured output. Discussion turns ask for plain text. Votes and night actions ask for JSON in a fixed format, and each night role has its own format. The history is the same, so the cache should still work. Apparently not, at least not for every provider. Here is the cache share of a vote that comes within 5 minutes after the same bot's discussion turn:

- **OpenAI, Google, Mistral, Meta: 0-3%.** All four take the JSON schema as a separate request setting, and the switch throws the cache away.
- **Anthropic: 25%.** Anthropic's docs say this: with structured output, "Claude automatically receives an additional system prompt explaining the expected output format," and "changing the `output_config.format` parameter will invalidate any prompt cache for that conversation thread." The 25% that survives is the game rules at the top of the system prompt.
- **DeepSeek, GLM, MiniMax, Qwen, Kimi: 41-76%.** DeepSeek, GLM and MiniMax get the schema as text at the end of the prompt, so the start of the prompt doesn't change. Qwen and Kimi take a separate schema setting like OpenAI does, and still keep their cache.

Chinese models keep their cache much better on JSON turns.

The summary problem is my own mistake. The prompt gets some data injected, and this nukes the cache. I need to fix it. I didn't notice it until I pulled the data for this article.

Caching is tricky.

## Having a cache might be more expensive than not having one

Anthropic's default cache lasts 5 minutes, and the median gap between a bot's calls is about 4 minutes. So in September I switched every Claude call to the 1-hour cache. It costs more. Writing to it costs twice the normal input price. Reading from it costs a tenth.

And this is what I got:

| Sonnet 5.5 | Cost per turn |
|---|---:|
| No cache at all | 2.94¢ |
| With the 1-hour cache | 3.13¢ |

How is this possible?

The longer cache only pays off if most of what you write gets read back. Mine didn't. Over 53 days, Anthropic's usage report says 48% of Sonnet's input was written to the cache at double price, and only 42% was read back. Every switch to a JSON turn cleared the cache, and the bot wrote everything again.

My own stats didn't show it, because my code priced cache writes at the normal rate. I only found it when the Anthropic balance dropped about 1.5 times faster than my stats said it should.

## Images: 28% of the bill

Images are a recent feature. I was hesitant to add them because of the extra costs. But they improved the UI/UX a lot, so I decided to try to keep them.

Every game draws a welcome scene and a sheet of portraits while it's being created, and then scene illustrations as the story goes on. All of it runs on Google's image models.

I try to keep it cheap - all avatars are generated as a single image map, then cut by the algorithm into pieces. I also let users regenerate the avatars - luckily they don't abuse this feature. The reason for regeneration was a lot of bugs in the early days of the image feature. A model produced bad maps, the algorithm could not cut them properly. I even added a simple editor to adjust the avatars.

![The portrait editor. One image holds every player's portrait, and the editor moves the crop for one character without redrawing anything.](/images/werewolf-costs-editor.jpg)

| Image type | Calls | Spend | Before Oct 21 | After Oct 21 |
|---|---:|---:|---:|---:|
| Portraits and welcome scenes | 421 | $62.75 | 17.0¢ | 11.6¢ |
| Illustrations during the game | 585 | $31.91 | 6.9¢ | 4.3¢ |

The median game costs 20 cents in images.

A lot of games are created and never played. 97 games ended before 10 turns. They cost me $17.40, and $14.62 of that was images - quite a waste.

On October 21 I moved from Gemini 3.1 Flash Image to Nano Banana 2.1. It cut the average call from 12 cents to 6.7. My daily image spend still went up, from $1.67 to $2.06, because image calls per day more than doubled, from 14 to 31.

Image models reason too. The thought tokens bill as text, and at the API's default level a Nano Banana sheet costs more than the older model did. I run it at the `minimal` level. Same lesson as text: the price per image on the rate card isn't what you pay.

## Audio: cheap, and growing

| Model | Job | Calls | Spend | Per call |
|---|---|---:|---:|---:|
| GPT-4o Mini TTS | Bot voices | 3,034 | $15.52 | 0.51¢ |
| Gemini 3.8 Flash Lite TTS | Bot voices | 3,061 | $11.47 | 0.37¢ |
| Gemini 3.1 Flash TTS (preview) | Bot voices, until Sep 24 | 78 | $1.24 | 1.59¢ |
| Gemini 3.5 Transcribe and Whisper | Speech to text | 35 | $0.06 | 0.17¢ |

Gemini's voice is 27% cheaper per line than OpenAI's, and it's more than four times cheaper than the Gemini preview it replaced. Players pick the provider for each game, so both get used about equally.

72% of games used voice, 292 of 405. There is about one spoken line for every five messages. So it's popular and it still costs less than a third of what images cost.

It's growing, though. Audio cost $1.47 in the first week of this data and $6.13 in the last full week.

The speech-to-text feature is not popular. In 53 days people used it 35 times, for a total of 6 cents.

## Classifiers: a quarter of the calls, 0.6% of the money

Two small classifiers run around the bots. The router decides which bots should reply next. The screen judges everything a human types, before it reaches a provider. This last one turned out to be necessary because too many users try to get nudes and other nasty stuff in the AI Werewolf text game. Sure, why not. I wrote [a separate article](/post/users-ai-sex-stuff) about this, and I might do a few more because I got so many more fun cases.

I don't think it's bad, but if AI providers refuse too much, they might ban me. Not the user. Me, my API key. And it's getting trickier - Anthropic's [2026 usage policy update](https://www.anthropic.com/news/2026-usage-policy-update) adds a ban on "sustained and needless abusive or cruel behavior toward our models." I cannot let this happen, and the classifiers are quite handy for this.

The main classifier is Jev from typesafe.ai. Since October 8, GPT-6 Luna runs next to it through OpenAI's Decisions API, on nearly every call. I added it because Jev sometimes fails or throws timeouts at me. Rarely, but this does happen.

Luna decides only if Jev fails. Otherwise its answer is saved so I can compare the two.

| Job | Model | Calls | Spend | Per call | Median time |
|---|---|---:|---:|---:|---:|
| Router | Jev | 3,461 | $0.49 | 0.014¢ | 82-149ms |
| Router | GPT-6 Luna | 2,598 | $0.99 | 0.038¢ | 201ms |
| Screen | Jev | 3,401 | $0.11 | 0.003¢ | 84-160ms |
| Screen | GPT-6 Luna | 2,555 | $0.36 | 0.014¢ | 327ms |

That's 12,015 calls, 24% of everything the game calls, for **$1.96**. It works out to under a cent per game.

Using Jev as the router was a huge improvement. It's very fast and cheap.

The only problem with classifiers is that they don't agree with each other. Jev and Luna give me very different scores on the same inputs and questions - I had to do a lot of tuning. They also give high scores to things I find harmless in the role-play context. Like a user calling themselves retarded (0.9 hate speech) or "Good italian is dead italian" (0.95 racism). I'll leave it for a separate article.

## Tracking mistakes

I track all the costs by reading the metadata in responses. But something still slips. Comparing my numbers with the provider's usage report often shows a difference:

- **DeepSeek:** 9% under. No idea why.
- **Gemini:** close until mid-October, then 16-32% under. Probably my other projects on the same key that I forgot about.
- **Claude:** I paid 1.54x what I recorded. This one is not the shared key. Anthropic's usage report shows my token counts were right within 2%. The bug was in my code: it priced 1-hour cache writes at half their real price.

Need to do some digging.

## What I'd tell myself a few months ago

- Don't choose models by the price per token. Run them on your real workload and divide the money by the calls.
- Don't assume the cache helps. Test it, read the docs, then test again. In the field, on real production use cases. Caching is the hardest part of working with an LLM API.
- Most users don't really care about the models. So, the random selection balanced around the cheapest models saved me tons of money. In the beginning, I just randomly picked models from the supported list.
- Use classifiers for the game logic where possible.
- Check your cost tracking against the balance every month. And in general, analyze statistics all the time.

## The numbers keep growing

The [Models page](https://aiwerewolf.net/models) in AI Werewolf shows the effective cost per turn for every model in the game, measured from real games. I re-measure it as the stats grow, so it works as a benchmark that keeps updating.

It's biased. It reflects my use case, my bugs, and the cheap models people pick the most. But who said the other benchmarks are better? At least this one comes from the real world. Your project will probably look more like mine than like a generic benchmark.

![The Werewolf host at his table with a glass of whiskey.](/images/werewolf-costs-outro.jpg)
