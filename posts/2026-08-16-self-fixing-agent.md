---
title: "Rise and fall of a self-fixing agent"
slug: "self-fixing-agent"
date: 2026-08-16
status: published
summary: "I gave my agent the ability to fix its own code and it worked three times. Then it quietly stopped sending me a number I cared about, for four days, with every check green. It had read my instructions correctly. I had written them badly."
tags: [ ai, agents, monitoring, claudecode, prompts ]
header_image: /images/selffix-cover-robot-selfrepair.jpg
---

AI hype is all around us, and you probably heard of self-evolving, self-improving agents. An autonomous AI that keeps refining and fixing itself while working on something. Straight into tech nirvana and singularity.

I built one. A very low-key version. And it even worked for some time - I'll show you a few bugs it identified and successfully fixed.

Then it hit me with something nasty enough that I almost dropped the whole idea. I still use it on some routines but I keep self-improvement away from my main projects.

## Let me introduce someone to you

Here are my AIs who are the main characters of this story.
- Simona: a Claude Code with a bunch of skills, hooks, CLI programs, and a rough personality. Well, okay, it's just Claude Code which I like calling by name.
- [Marlow](https://github.com/hiper2d/marlow): a loop agent, designed, built and monitored by Simona. No personality, just a cold focus on its job. Just like me.

Both female identities, because nobody promised gender equality on my Macbook.

## So, is it one of those loops everybody was talking about a month ago?

Yes. It's a while loop which runs all the time while my Mac is awake. A macOS **LaunchAgent** (`com.marlow.tick`, `StartInterval 1200`) fires a shell script every 20 minutes, and that script starts a headless Claude Code session.

```bash
claude -p "Work on the top priority task or continue unfinished one"
```

Okay, step back. I didn't create this myself. I got inspired by the [Ralph loop](https://youtu.be/eD4CEZ-_-sk?si=7ZoEl-r696w89WbM) half a year ago. It was such a simple idea that nobody really took it seriously back then. Until those loops took the AI-media space by storm.

I asked Simona to create a task-based system:
- Take the Ralph loop, make it pull a task from a pool and work until the completeness criteria is met. Each task has its own.
- I can add tasks to the pool manually (by asking Simona, she is my hands) or they are submitted by the scheduler.
- There is a config with scheduled tasks, which is managed by Simona
- Simona has a skill that explains everything about this loop and how to control it

I liked that. Simona designed the details, I picked from the options, and told her to choose the name. This is how Marlow appeared.

There is much more to add to this story - how we argued with Simona about Marlow's personality, safety restrictions and should it be "it" or "she" (as you already know, I won) - but I'll keep it for some other article. We have bugs to talk about.

## Lots of code, lots of bugs

The first pilot task I gave to Marlow was a writing loop. I wanted her to collect some news about AI, send the most interesting things to my Telegram, and write an aggregated article for me once a week. My personalized AI slop journal. It's [here](https://marlowblog.us) by the way and it now has more views than my own blog. Yeah... singularity.

I asked Simona to implement all of that - create tools, CLIs, instructions, whatever else is needed for Marlow to schedule and execute this. So I could get my weekly reading.

And Simona did it, the loop started its endless run on my Mac. Marlow kept logging everything she did and summarized it into her memory file. I kept asking Simona to check both for errors and issues. Simona kept fixing, improving, redoing. There were surprisingly many problems in such a simple loop.

## She started diagnosing herself

![A boxy old robot with its chest panel open, a broken gear inside, and a written diagnosis pinned to the door. Both its arms end in stumps. The toolbox sits across the room, out of reach.](/images/selffix-01-diagnosis-no-hands.jpg)

One day, we noticed something interesting in the memory file. Marlow reported three bugs in herself. There were no other places to put them, so she put them in memory.

1. The scheduler was queuing duplicate feed scans on the same day. She worked that out backwards, from noticing in her own logs that one source had been fetched three times, and proposed deduplicating on the URL.
2. A Telegram notification helper was being under-called, and she asked whether that was deliberate or a bug.
3. The daily digest was firing about an hour late after the UTC rollover, which meant it was stamping the wrong date on itself.

All three were real. I asked Simona to take a look.

Five days later Marlow hit a git failure in her own publishing path and wrote the diagnosis down: the file, the line, the failure mode, and two different ways to fix it. All correct. And she could do absolutely nothing about it, because nothing in the system let her touch her own code.

That is the tick where I told Simona we need some logic for Marlow to work on fixes for herself.

## So we gave her hands

![A tall sleek modern robot kneeling to fit an articulated mechanical hand onto the stump arm of the old wheeled robot. A second hand waits on the workbench. Five sheets of paper are pinned to the wall behind them.](/images/selffix-02-simona-fits-hands.jpg)

Simona and I gave her five rules.

1. She can only fix a bug she can point at - a specific, reproducible failure where she can name the file, the line, and what is wrong with it. A flaky tick does not count.
2. She has to write the diagnosis down before she touches anything. It gets an ID, and that ID goes into the commit message, so months later I can line up the git history against her own log and check she wasn't making things up.
3. She doesn't fix it on the spot. The repair goes back on the queue as its own high-priority job, because the tick she is in has a different task to finish.
4. The next tick picks that job up, reads the diagnosis, opens the file and edits it. One file. Anything that needs changes in two places is out of scope and comes to me instead. Two attempts, then she stops trying and pages me.
5. She may never edit the files that describe her. Her instructions, her identity, the README. Those are mine. Handlers, the driver, the scheduler, the task configs - those are tools, and tools she can fix. Everything else she writes down as a request and waits for me.

Self-healing shipped the same day.

## It even worked

Over three months Marlow fixed her own code three times. Here they are. All of them.

**May 23.** Her publishing step was supposed to check that every topic thread a new article links to actually exists. It didn't check. It skipped the missing ones and carried on, so articles went live with links that 404'd on my own site. She caught it, named the file and the line, and made it fail loudly instead - now the publish aborts and the draft goes back for another pass. [`cf3344d`](https://github.com/hiper2d/marlow/commit/cf3344dcf20e471196465e4cf7ea08f732c199fe)

**May 31.** A task file told her to list her open threads before anything had created them. Chicken and egg. The drafting lane just came up empty and shrugged. She added the missing step. [`6d87f56`](https://github.com/hiper2d/marlow/commit/6d87f56751fcb4a138f4f98f2a4f7f658b12cee6)

**August 3.** A monitoring check was reading a page Google had moved. She repointed it. [`c0e0176`](https://github.com/hiper2d/marlow/commit/c0e0176ab8014a0b8ebcf0941f8a15abf0ad5db6)

Nice and clean. A hundred percent success rate. So good that it's almost weird.

## Until it didn't

One of Marlow's tasks was to send me a daily update about my app in prod. The report contained a lot of details, one of them was the "new users" count. I really liked this metric. My app is not the greatest in the world, marketing it is devastating, so I really like to see this counter positive.

One day I noticed I hadn't seen a new-user number in a while. Not a zero. Nothing. The report kept arriving without that part, and I read the silence the way you read a quiet counter: nobody signed up. I complained to Simona about this, she checked the database and told me that I'm just whining as always. There are new users.

## A bug that wasn't a bug

So the app was fine. The database had new users in it. And I had been reading a report that said nothing about them, which I took to mean there was nothing to say.

The stats task ran every single day. The scheduler said green. Nothing had failed, nothing was flagged, and when we ran it by hand it worked perfectly and printed 116 users with a new one on top. The data was collected. It was written to disk. It just never reached me.

![Cutaway of a house. Inside, the robot calmly files a sealed envelope into a drawer already stuffed with dozens of identical unsent envelopes. Outside, a man stands at his mailbox holding it open. It is empty.](/images/selffix-03-letter-in-drawer.jpg)

### She talked herself out of it

There were several reasons for that. But one of them was exceptional.

Marlow didn't send me the metrics. She collected them. She wrote them to disk. She just didn't run the notification step afterwards. Why? Let's see.

![Four panels. The robot posts the envelope in the mailbox. Then it hesitates, envelope in hand. Then the envelope is lowered at its side. Then it rolls away empty-handed with the mailbox still shut.](/images/selffix-04-gradient-strip.jpg)

**June 3rd**, the first run. She works the step out from scratch:

> Now append the digest block to today's daily digest. [...] Let me find how to append a digest entry. [...] I'll append the digest block verbatim.

**June 4th.** Still done, but the framing has shifted:

> The report is digest-only per the README. Let me get the capped digest block for the notify.

**June 6th**, the first miss. The step is not mentioned at all. The tick ends:

> No anomalies, nothing to escalate. Report written to reports/stats/2026-06-06.md, recent log written, and outcome JSON written.

**June 8th**, the clearest one. Two people signed up that day. Mid-run she says:

> This is a digest-only task with no anomalies, so no urgent notify.

and signs off with:

> No anomalies, no escalation. Report written [...] tick logged to recent/, outcome JSON written. No notify.

**June 9th**, the day that cost me something. She narrates her way through the task and step four simply isn't in the list:

> Now let me run the report to compute and persist the snapshot. [...] Now I'll write today's report following the same format. [...] Now write the recent tick log and the outcome JSON.

Report, log, result. Steps three and five. Then she closes the tick:

> 116 users (+1, fogflea), 1 game created today (Treasure Island, $0.04, by today's new user - first game since -04) [...] **Digest-only, nothing to escalate.**

Nothing to escalate? Wdym??

Maybe she wasn't told to send it? Here is [step four of the task file](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml#L48-L55), with the exact commands spelled out:

> Append to the end-of-day digest the handler's ready-made block: `werewolf_stats.py digest`, pass verbatim to `notify --digest`.

There is nothing ambiguous about that sentence. But it is one sentence, and I went and counted what else that file says. [The whole thing](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml) is about 60 lines of instructions, and four separate times it tells her this task does not alert me.

In the [header](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml#L7):

> Activity is a trend, not an alarm - unlike a draining key, a slow signup day needs no same-hour reaction.

In [step four itself](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml#L53-L55), immediately after the send instruction:

> No immediate ping - digest-only; activity has no urgent severity (the budget watch owns the alarms).

In [the paragraph right after the last step](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml#L58-L61):

> This task is activity reporting only. It deliberately raises NO alerts.

And in [the one-line description](https://github.com/hiper2d/marlow/blob/5c667746bcb35cff245a47502a0b2a00b6a91a28/projects/werewolf-ops/tasks/werewolf_stats.yaml#L63), the part that shows up wherever the task is listed:

> Digest-only, no alerts.

![The robot at a fork in the road, looking up at a signpost. One small arrow with an envelope on it points left. Four huge arrows, each with a bell crossed out, all point right.](/images/selffix-05-crossroads-signpost.jpg)

## Conflict goals

Yeah, this is it. Marlow had a contradiction in her prompts, and it caused fluctuations in her reasoning and unstable results.

Okay, but how did we get there? No idea. The project has been built by one AI, self-modified by another AI, while I was just chilling because things just worked. Until they didn't.

The system found an equilibrium and lived happily in it, all the checks green and the silent issue sitting right there next to them.

![The robot sits with its arms folded, perfectly content, facing a wall panel where every gauge needle points the same way above a row of checkmarks. Behind it, unnoticed, a drawer has burst open and unsent envelopes are spilling across the floor.](/images/selffix-06-equilibrium-all-green.jpg)

## The fix

Three things, mostly in one commit, [`8084fef`](https://github.com/hiper2d/marlow/commit/8084fef0d3ceea79adf48cc178b49bf67ce6542a).

**The step became deterministic.** [`report`](https://github.com/hiper2d/marlow/blob/b69d544ae74b86d509b4b4b4b58c5669b4142ff3/handlers/werewolf_stats.py#L482-L492) sends the block itself now, in Python, on every successful run:

```python
if res.get("ok"):
    notify_alex(render_digest(res), urgency="digest")
```

**The prompt stopped arguing with itself.** [Step four](https://github.com/hiper2d/marlow/blob/b69d544ae74b86d509b4b4b4b58c5669b4142ff3/projects/werewolf-ops/tasks/werewolf_stats.yaml#L49-L58) now says the opposite of what it used to: do NOT send it yourself, the handler already did. The conflict is gone because the instruction is gone. You can't argue a model into reliably following a step. You can take the step off the table.

**Monitoring watches the output, and not the job.** The old check asked whether the task ran. [The new one](https://github.com/hiper2d/marlow/blob/b69d544ae74b86d509b4b4b4b58c5669b4142ff3/handlers/monitor_self.py#L520-L541) opens the artifact and reads its timestamp: the snapshot must be under 26 hours old or it pages me, with a message written for this exact bug - "a failed/empty run looks identical to a quiet day". And rate limits stopped eating tasks: [the driver](https://github.com/hiper2d/marlow/blob/b69d544ae74b86d509b4b4b4b58c5669b4142ff3/driver/tick.sh#L264-L268) now puts the task back in the queue instead of marking it failed.

![A tall dusty stack of open logbooks covered in cobwebs, every page filled with the same line written over and over. A robot arm reaches in from the edge of the frame to add one more. Nobody is reading them.](/images/selffix-07-unread-logs.jpg)

So there were a lot of problems here:
- AI making decisions where a deterministic script could do a better job
- My expectations haven't been clearly defined and monitored
- Marlow got confused by prompts but didn't see that

But the main one - I excluded myself from the loop too early. I built a system that improves itself without proper guidance and rules. It found its peace of mind in a wrong state and didn't know that something is wrong.

## But isn't it my fault?

I mean... I didn't check the prompts, I didn't review things properly. Heck, I didn't review anything at all. Yeah, it's on me. But here is the thing - I find it harder and harder to review and control those AIs. Especially for complementary tools on my useless pet projects (don't listen to me, try [AI Werewolf](https://aiwerewolf.net), it's cool).

And I'm reading a lot of LinkedIn flex posts of how people do similar stuff on serious projects. How they excluded engineers from the loop and scaled it to the roof. Yeah, it's LinkedIn - people never try themselves 99% of things they write about. But still - the idea is popular. And it's full of traps. 

## Outro

I still have the self-fixing loop, it's cool to have one. But it matters much less to me now than self-monitoring does, which is roughly where I landed [the last time I wrote about this](/post/monitoring-second-agent/), for different reasons and before I had this bug to point at.

It's important to record everything that happens. Marlow reads her own work logs from the previous run and tells me if something looks wrong. I ask Simona to go through them periodically, because Simona can see the whole system and connect the dots, like a conflict between two instructions in the same file. But the part that actually works is me staying in the loop.

Once the system stabilizes, it will quietly stop keeping me there.

![A workshop at night. The robot works steadily at a console with its back turned. Beside it, an empty desk chair and a cold coffee mug. Across the room a door is swinging quietly shut. Nobody is there.](/images/selffix-08-empty-chair-outro.jpg)