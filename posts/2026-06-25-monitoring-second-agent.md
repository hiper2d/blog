---
title: "The second agent I won't automate"
slug: "monitoring-second-agent"
date: 2026-06-25
status: published
summary: "My prod monitoring runs on two agents: a fully autonomous loop that watches production, and a manual Claude Code
setup that troubleshoots what it finds. Here's why the second one stays manual on purpose."
tags: [ ai, agents, monitoring, claude-code ]
header_image: /images/monitoring-second-agent.jpg
---

A couple of weeks ago I wrote about
[the loop that watches my production while I sleep](https://azelianouski.dev/post/ai-agent-monitoring-stack) - a
`claude -p` heartbeat that scrapes my logs, budgets, and game database every 20 minutes and pings me on Telegram when
something's off. I ended that one on a throwaway line: once you know about the problems, Claude Code can usually fix
them
itself.

That's true. It can. I just don't let it.

The monitoring is really two agents, not one. The first is the loop. Its job is triage: collect the errors, check the
app state, decide how bad each one is, and fold the noise into a digest so I'm not woken up over a transient blip.
That's
[Marlow](https://github.com/hiper2d/marlow), and it's fully autonomous.

The second agent is the one that actually troubleshoots - stitches the logs to the user data to the action traces to the
source code, finds the root cause, writes the fix, and patches the database if a game got stuck mid-play. That one is
Simona, my customized Claude Code, and I drive it by hand. Every time.

Here's why.

## A normal-looking bad day

Yesterday the loop sent me three digest entries over two hours, watching the error logs for my
[AI Werewolf](https://aiwerewolf.net) game:

> 17:21Z: 37 new error lines, all one known noise class - char M's actions failing through `talkToAll` in a 24-minute
> burst. One game stuck in a broadcast-retry loop, not app-wide breakage. Downgraded urgent -> digest.

> 17:51Z: 9 `Game action failed: D` errors, plus 6 warnings: `Ignoring invalid/duplicate GM-selected bots:
> [DeepSeekFlash]`. A GM picked an invalid bot name. No breakage.

> 18:21Z: 50 new error lines, the same game-action-failure family - char T's vote actions failing in a 12-minute burst.
> Plus 5 more of those `DeepSeekFlash` warnings.

This looked scary. I've recently discovered that I'd poorly configured JSON output for the DeepSeek models: I was using a
prompt instruction instead of the dedicated API feature for structured output. While doing that, I found a bug in the
DeepSeek Flash Reasoning setup. And yet - the monitoring flags this exact model again.

This is why I don't want self-fixing. I need to understand what is going on. No matter how smart my coding AI is, it
won't check the latest DeepSeek API to see if there are improvements in structured output. It won't unify the code for
JSON parsing across all models unless I ask it to.

The loop did its job. It recognized the game-action-failures as a known noise class, confirmed nothing was app-wide, and
refused to wake me. That's the boring escalation logic working as designed. It also flagged the bot-name warnings,
correctly, as a separate harmless thing - the game master typed a bot name the engine didn't recognize.

So... it wasn't actually the JSON parsing, it was poor model reasoning or hallucination over player names. It returned a
non-existent name where it had to be precise, and the game logic correctly failed. But why? I inject all the player
names into the command - an addition to the last message I send to an LLM. This works great - models never fail to pick
the exact name from the list. So what is going on?

## Me in the loop

Apparently, I didn't inject those names. I was sure I did, but no - not in this specific request. That's a huge miss.
It's quite hard to cover prompt-engineering logic with unit tests, so this logic wasn't covered. Plus I hadn't looked
into this code for a long time - thanks to vibe-coding. I used to write all the code myself, but about 6 months ago
Claude Opus 4.8 stopped making bugs, and I gave up. It's too convenient when it works.

So, that was it - a real bug in the code, a very tricky one. The model did its best to extract the player names from the
entire day's conversation history, and this mostly worked. But this approach suffers from hallucinations in a long
conversation - which is why I came up with those commands in the first place.

No way a self-fix loop spots this. It would just keep bolting on inefficient patches and never find the real cause. I
think it's important for me to take part in debugging. It keeps me aware of the architecture. And it's really not that
hard - I spent 10 minutes on this issue and Simona shipped the fix with a bunch of new tests.

## The dream of automation

Right now, a lot of people try to exclude engineers from the loop. If you tell your boss it's possible to not only
detect issues but quick-fix them autonomously, that's gonna be your next priority task. You still review the final code
change, so it's fine. It's covered with tests - double fine. Well... without diving deep into the problems, I start
forgetting how the whole system works. My understanding of the logic detaches from reality. That's the cost of pushing
automation too hard. Of reading about AI and not practicing it in the field.

![Simona at the keyboard with Marlow standing behind her, arms crossed, watching over her shoulder](/images/monitoring-second-agent-simona-marlow.jpg)

*Two agents setup*
