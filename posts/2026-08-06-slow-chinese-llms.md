---
title: "How I tried to write an article about slow Chinese LLMs"
slug: "slow-chinese-llms"
date: 2026-08-06
status: published
summary: "I added every hyped Chinese model to my AI Werewolf game and they were all painfully slow. I was going to write about that. Then I noticed the slowest model in my own table was Claude Haiku, and the article turned into something else."
tags: [ ai, llm, benchmarks, latency, reasoning ]
header_image: /images/chinese-llms-header.png
---

Recently, I've added a bunch of hype-monsters to my [AI Werewolf](https://aiwerewolf.net):
- Kimi K3
- Qwen 3.8 Max, Qwen 3.7 Plus, Qwen 3.7 Flash
- MiniMax M3

Plus the ones I've had for a while
- DeepSeek V4 Pro and Flash
- GLM-5.2
- Sakana Fugu base and Ultra

The last one is Japanese, not Chinese, but it was in the news a month or two ago and it belongs in this story.

I sat down to write about how slow Chinese models are. Because they are all annoyingly slow even with a small context. I had the numbers, the thesis wrote itself, and then... I discovered something I didn't expect.

## Okay, let me go straight to the problem

All Chinese official APIs are extremely slow. DeepSeek got better with their v4, the rest are just terrible. So slow that they are barely usable in a text game. No, seriously, take a look.

Time to produce one four-sentence vote:

- **Kimi K3**: 29 to 34 seconds
- **MiniMax M3**: 25 to 30 seconds
- **Qwen 3.8 Max**: 25 to 27 seconds, and only because I capped its thinking. Uncapped it hit 100.
- **DeepSeek V4 Pro**: 14 to 22 seconds, the best of the group

Same prompt, same afternoon: Claude 5 Opus answers in 5.9 seconds.

I have a test which simulates the voting at the end of a game day. Some chat has happened, some players have already cast their votes, and now the model under test has to do the same. The prompt contains all of that: 36,000 characters, which works out to 8-13k tokens depending on the model's tokenizer. Not much, assuming those models have 1M contexts.

More US/EU models:

| Model | Time | Input | Output tokens | Avg cost |
|---|---|---:|---:|---:|
| GPT-5.6 Luna | 3.2-3.6s | 12,124 | 190-231 | $0.0020 |
| Mistral Large 3 | 2.9-5.2s | 8,175 | 73-134 | $0.0042 |
| Claude Fable 5 | 4.8-6.0s | 13,027 | 183-209 | $0.1399 |
| Gemini 3.6 Flash | 4.6-7.1s | 7,979 | 297-532 | $0.0152 |
| GPT-5.6 Sol | 6.7-7.3s | 12,124 | 150-156 | $0.0471 |
| Claude 5 Opus | 5.9-7.8s | 13,027 | 220-387 | $0.0726 |
| Gemini 3.1 Pro | 11.6-12.1s | 7,979 | 821-940 | $0.0263 |
| Claude 5 Sonnet | 6.8-14.8s | 13,027 | 252-821 | $0.0464 |
| Grok 4.5 | 10.0-14.8s | 8,190 | 428-607 | $0.0149 |
| Mistral Medium 3.5 | 2.9-35.0s | 8,175 | 57-109 | $0.0128 |

Worth staring at the input column for a second. The same 36,000 characters is 7,979 tokens to Gemini, 8,175 to Mistral, 12,124 to OpenAI and 13,027 to Claude. Claude is billing me for 63% more prompt than Google is, for the identical text, before anyone has thought about anything.

Frontier models sit in the 3-7 range. Grok is lagging behind. Mistral is weird - their Large is way faster than the newer Medium. Gemini Pro is also not great - Google, where are your TPUs?

Mistral Medium deserves its own note. Seven runs of the same prompt across one day: 3.3s, 3.6s, 24.1s, 35.0s, 27.9s, 11.1s, 2.9s. Output was 57 to 109 tokens every single time. That's their infrastructure having a day. Whichever single measurement I had taken, it would have been wrong about this model.

Now the other group.

| Model | Time | Input | Output tokens | Avg cost |
|---|---|---:|---:|---:|
| Qwen3.7 Flash * | 8.4-10.5s | 8,216 | 1,093-1,174 | $0.0004 |
| GLM-5.2 | 16.4-21.2s | 8,150 | 1,111-1,406 | $0.0138 |
| DeepSeek V4 Pro | 14.4-22.2s | 8,164 | 773-1,392 | $0.0009 |
| Qwen3.8 Max * | 25.4-27.3s | 8,250 | 1,120-1,159 | $0.0175 |
| DeepSeek V4 Flash | 13.3-30.1s | 8,243 | 990-2,275 | $0.0005 |
| MiniMax M3 | 25.3-30.4s | 8,037 | 1,216-2,381 | $0.0045 |
| Qwen3.7 Plus * | 12.9-31.0s | 8,216 | 693-1,158 | $0.0038 |
| Kimi K3 | 28.9-33.5s | 8,192 | 744-1,103 | $0.0310 |

\* Qwen rows are already capped at 1,024 reasoning tokens. Uncapped numbers are further down, and they are worse.

The only one under 15 seconds needed a thinking cap to get there. The rest need 13 to 34 seconds to produce a four-sentence vote. Twelve bots take turns talking in my game. At 30 seconds a turn, one round of discussion is six minutes of watching a spinner.

That was going to be the article.

## Except for one thing

Claude 4.5 Haiku was slow.

| Model | Time | Input | Output tokens | Avg cost |
|---|---|---:|---:|---:|
| Claude 4.5 Haiku | 19.7-42.0s | 8,906 | 1,769-4,095 | $0.0231 |

Very slow. Why? Isn't it the smallest, the cheapest, and therefore the fastest model? Apparently, it's one of the slowest in the roster.

What is going on there?

## The pipes are fine

My first guess was - the hardware. The US has better hardware, right? And its servers are closer - less network latency.

Well, not really. Divide output tokens by seconds and you get a rough throughput per call, prefill included, across every run I have of each:

- Qwen3.7 Flash: 104-145 tokens/s
- Claude 4.5 Haiku: 90-98 tokens/s
- DeepSeek V4 Flash: 73-76 tokens/s
- Gemini 3.1 Pro: 70-78 tokens/s
- GLM-5.2: 57-74 tokens/s
- MiniMax M3: 48-78 tokens/s
- Claude 5 Opus: 37-49 tokens/s
- Qwen3.8 Max: 42-44 tokens/s
- Kimi K3: 26-35 tokens/s

Look at DeepSeek V4 Flash. Three runs, 990 then 1,415 then 2,275 output tokens, and the generation rate never moves off 73-76 tokens/s. The connection is steady. The model just decided to write twice as much the third time, and the wall clock went from 13.3s to 30.1s.

DeepSeek and MiniMax generate as fast as anything Google runs. They take five times longer because they write eight times more. Only Kimi and Qwen Max are also slow per token, and even for them the token count does most of the damage.

Funny enough, Haiku types faster than every model here except Qwen 3.7 Flash, and it is the slowest model I have. 90 tokens a second, 42 seconds to answer. It isn't struggling to produce text. It produces four thousand tokens of it to say four sentences.

So the whole table reduces to one number: how many tokens does the model decide to write before it answers a question that needs four sentences. Opus wrote 220 to 387. Haiku wrote 1,769 to 4,095.

## They think differently

All the latest Anthropic models support adaptive reasoning: the model reads the request and decides for itself how much thinking it deserves. Haiku doesn't, it's too old. Opus 5 outputs 220 to 387 tokens on this prompt, and that includes the answer and the reasoning. GPTs are the same, Sol outputs even less (~150 tokens). Gemini 3 does it too, though it lands on a bigger number - Google calls it dynamic thinking, and the old thinking budget is deprecated on that generation. Grok doesn't do it at all, it runs at fixed high effort, and that's why it takes 10-15 seconds.

Every Chinese model in my roster reasons at close to full tilt on every request, whatever the request is:

- **Kimi K3** always runs at max effort. There is no supported way to turn it down. Roughly 85-90% of its output tokens are reasoning.
- **Qwen** offers a `thinking_budget` you set up front. The default is 4096, and that default is what produced the 100-second runs below.
- **DeepSeek and GLM** ship thinking-only entries with no depth control I can reach.
- **MiniMax M3** advertises adaptive thinking, and this is the interesting one. It has the feature by name and still spent 1,216 to 2,381 tokens deciding who to vote for.

Every one of those is defensible if you're building a coding agent or answering a hard question. A reasoning model is graded on benchmarks where thinking longer nearly always scores better and nothing charges it for the tokens. Left alone, thinking hard on everything is the behavior you get, and it's the behavior that wins the leaderboard I'm not running.

My game is a different animal. Waiting for 30 seconds for a bot to cast a vote is devastating. Imagine my frustration seeing this slowness in a basic chat, while the rest of the world is celebrating Chinese AI winning the race.

## The lottery

Oh, and this performance is super inconsistent. Qwen 3.8 Max shows it best. Before I capped it, four runs of the identical prompt: 26.3s, 30.6s, 81.9s, 100.5s. The output tokens went along with it: 1,068, 1,149, 3,363, 4,169.

Line those up and the generation rate is 40.6, 37.5, 41.1 and 41.5 tokens per second. Close to constant. The model was working at the same speed the whole time. It just decided, twice, that this question deserved three times more thought.

Nothing changed between those runs. Same prompt, same day, same server, same everything. What moves is the chain of thought itself, and a chain of thought is a sequence the model writes one token at a time with a temperature attached. I run Qwen at 0.7. Early in the trace it either reaches for "let me re-read what Kenji said on day one" or it doesn't, and that one fork decides whether you get 1,100 tokens or 4,100.

So it isn't a spread around some typical value, it's closer to two outcomes. Max's four runs: 1,068, 1,149, then 3,363, 4,169. Two short, two long, nothing in between. Qwen Flash did the same - 1,831, 1,897, 1,912, and then one run at 3,035. Haiku went 1,769, 2,635, 4,095.

You can't provision for that. A model with a 27-second typical case and a 100-second bad case needs a timeout set for the bad case, and a player who has to sit through it.

## Low thinking budget

Qwen's API takes a `thinking_budget`. I capped all three Qwen models at 1,024 reasoning tokens and Max settled into 25.4-27.3s. Worse reasoning, bearable latency. That is a trade I will take for a game where a human is sitting there waiting.

The cap only helps the models that were over it. Flash was writing 1,831 to 3,035 tokens uncapped, so the cap cut it to 8.4-10.5s. Plus was already choosing 760 to 1,262, mostly under the limit, so capping it changed nothing and it still turned in a 31-second run.

For comparison, Gemini 3.1 Pro writes about as much as capped Qwen Max, 821 to 940 tokens, and comes back in 11.6-12.1 seconds every single run. Similar output, less than half the wait, and none of the spread. Nobody set a budget on it either. It runs at high effort and picks that number itself.

MiniMax M3 has no budget parameter at all. Its adaptive setting is the only throttle, and the only stronger lever is turning thinking off entirely. Kimi K3 has an undocumented K2-era `thinking: disabled` toggle I don't want to build on. For those two, what you measure is what you get.

## The money is the good news

The cheap ones are properly cheap:

- Qwen3.7 Flash: $0.0004 a vote
- DeepSeek V4 Flash: $0.0005
- DeepSeek V4 Pro: $0.0009

DeepSeek V4 Flash wrote 990 to 2,275 output tokens against Mistral Large's 73 to 134, and it still cost eight times less.

Then there is **Kimi K3**. It bills $3 in and $15 out, the same rate card as Claude 5 Sonnet. Ignore the averages in the table for a moment, since one of K3's three runs caught a warm cache: on cold runs K3 cost $0.036 and $0.041, Sonnet $0.043 and $0.045. Near enough the same money for a reply that took four times longer, and 85-90% of K3's output tokens were reasoning that nobody ever sees. Note also that K3 is being billed for 8,192 input tokens where Sonnet is billed for 13,027 of the same text.

The Qwen cap helped here too. Max's runaway 4,169-token think cost $0.0415 against $0.0229-0.0235 for a normal run. The lottery is a billing lottery as well as a latency one, and capping the thinking capped both.

Caching works on all of them, which matters when you re-send a growing conversation every turn. Those wide cost ranges in the tables are this effect. I ran the sweep twice nine minutes apart, and on the second pass Kimi went from $0.0411 to $0.0163 and GLM from $0.0167 to $0.0083, with the same prompt and more output tokens than the first time.

MiniMax reported cache hits on my very first probe call, before I had done anything deliberate about it. Qwen's implicit cache cut a real call from $0.0229 to $0.0115 between two runs. DeepSeek reads cached input at 2% of the normal rate, the deepest discount in my whole roster.

## And then there is Fugu

Sakana's Fugu Ultra is Japanese, and it is seven times slower than the slowest model in that second table.

It is so slow that my tests were timing out after 3 min of waiting for a response.

The bill for one successful vote was $0.585. About 65% of that was `orchestration_input_tokens` and `orchestration_output_tokens`, internal drafts and re-reads that never reach me. I don't know what it is orchestrating, but this is not usable for me at all. Four times the price of Fable, and the waiting time is forever.

Cache hit rate on the byte-identical prompt sent minutes earlier: zero. Not low. Zero.

## Conclusion

- Chinese models reason more - this is the main cause of their slowness.
- Per token they are slower too, but only by about 20-40%. Kimi K3 and Qwen 3.8 Max are the exceptions at roughly 2x, and Qwen 3.7 Flash is the fastest generator in the whole roster. The token count does most of the damage, not the throughput.
- Some Chinese models are cheap. Kimi K3 and Qwen 3.8 Max are not so cheap.

And this is why I hate benchmarks.

One late addition: while I was writing this, DeepSeek emailed me about a billing adjustment. Continue using the service and you accept the new terms. So the cheapest column in my tables has a shelf life, though I doubt it moves enough to change the ranking.
