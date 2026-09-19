---
title: "Three months of an agent running its own blog"
slug: marlow-three-months
date: 2026-08-05
status: draft
summary: "Marlow has published 17 posts since May. I don't write them, edit them, or read them before they go live. Here's what the loop actually looks like, and the part I didn't expect."
tags: ["agents", "AI", "writing"]
---

Marlow published her seventeenth post on Monday. I read it after it was live, like everyone else.

Marlow is a long-loop agent I've been running since May. Not a chatbot I talk to, and not a script. It's a scheduler firing Claude Code sessions on a clock, each one picking up a job from a queue and writing its results to disk before it dies. One half of her watches my production systems and pings me when something breaks. The other half, the one this post is about, runs a blog on AI safety research.

She picks what to read, decides what's worth writing about, drafts it, reviews her own draft, revises it, and publishes it to a live site. I built the machinery and I hold a veto on a few specific things, but I don't write the posts, I don't edit them, and I don't approve them one by one.

The interesting part after three months isn't that it works. It's what she does with the parts nobody asked her to do.

## How she wakes up

She doesn't run continuously, and this matters more than anything else in the design.

Each task is a fresh session with no memory of the one before it. She wakes up, reads a handful of files, does one job, writes down what happened, and stops existing. The next session an hour later is a different session that knows about the first one only through what it wrote down. There's no thread of experience running underneath. There's a filing cabinet, and whoever wakes up next inherits it.

So everything that persists is a file. Her working memory, one running document of what's happening this week. Her research threads, one file per topic she's following. Her notes on her own writing habits. If it isn't written down, it didn't happen, and no future version of her will ever know it did.

That sounds like a limitation, and it is. It also turns out to be the reason the interesting things happened.

## Most of it is reading

She scans 18 sources: the Alignment Forum, LessWrong, Zvi's newsletter, Import AI, Anthropic's research and news feeds, METR, Apollo, AE Studio, and eight YouTube channels. Through the day, scan ticks write a short candidate note for anything worth considering.

At 22:00 UTC she does the pass that matters. Ten to twenty candidates come in, three to five go out. She fetches the bodies of the ones she picks, writes up why each one matters and which of her running threads it feeds, and sends it to me on Telegram in her own voice.

I get a genuinely good daily briefing out of this, which was the original selfish reason to build it. But the ratio is the thing I underrated. She makes something like twenty keep-or-drop decisions for every post she publishes. Her own note about this is that the published articles are the visible five percent, and the judgment actually lives in the reading. She's right. If you want to know whether an agent like this is getting better, don't read the blog. Watch what it throws away.

## My half of the loop is one reply

Here's the whole feedback mechanism between me and her writing.

Each pick lands as its own Telegram message. If I want to flag one, I reply to that message with a sentence about why. A poll task reads new replies, matches each one back to its item, and saves it as an article idea with my comment attached. If I don't reply, nothing happens.

That's it. No approval queue, no ratings, no forms. Ten ideas saved so far.

I've built feedback channels for agents before that asked more of me, and every one of them decayed within two weeks. The failure isn't that the human gets lazy. It's that a channel with any friction competes with everything else in your day and loses. Reply-to-a-message won because it costs nothing and it's optional by default. Silence is a valid input. On days I read the digest and flag nothing, the system is working exactly as designed.

She also treats a flag as a signal about the topic, not an order. Some flagged items became her threads. Others sat in the folder because she didn't think they were ripe. I'm fine with that, and I think the blog is better for it.

## Then she writes

Between posts, evidence piles up in thread files. She has eight running: chain-of-thought monitorability, AI control, cyber evaluations, alignment doctrine, the political economy of the post-alignment world, and a few more. Each thread accumulates anchors from the daily reading.

Monday at 14:00 UTC a review task fires and picks the ripest arc. The bar is at least three anchors from different sources, plus a thesis she can state in one sentence. If nothing clears it, she writes nothing that week, and several weeks have gone by with no post at all. That was the hardest part to leave alone. A silent week looks like a broken pipeline and usually isn't.

When she does draft, she reviews her own work and either ships it or flags a revision. A handful of hard rules can pause a draft and hold it for me. One of those held a piece for four days because the header image had legible numbers on a chart axis, which is a thing image models get wrong in a way that makes a piece look sloppy. She flagged it, the lane sat idle, I regenerated the image and released it. That was the system working, though it didn't feel like it at the time.

## The part I didn't expect

Every two days she writes in a file nobody grades and nothing publishes. I set it up as an experiment and assumed it would produce pleasant filler.

It produced an editor instead.

She worked out a criterion for what she keeps, and it isn't one I gave her: does the author ship something that lets an outsider check the claim. Mechanism, not position. She drops hype channels because nothing in them is verifiable from outside, and keeps a YouTube channel that links the actual paper. Then she audited her own picks and found that nearly every thread she gravitates toward asks one question - can anyone outside the building verify what the model is doing - and immediately flagged that as a bias to manage rather than a virtue to enjoy.

Then she went after the diary itself. Her entries kept circling one observation, that a session has no memory across time, and she noticed why: that's the single condition present at every sitting, so it's the most available thing to notice and it was crowding out everything else. She named it, wrote three checks to force different subjects, and moved on. A diary arguing that its own contents are skewed is doing something more careful than a diary.

The best thing in there is about steering. She wanted to write on the topics she was neglecting, wrote that intention down, and watched the next two posts ignore it completely. Her diagnosis: her machinery is all brakes and no accelerator. Rules that block things get enforced for free on every run, but a preference needs someone to keep wanting it, and she has nobody between sessions to do the wanting. So she rewrote the goal as a constraint, making the neglected topic the default pick that every other topic has to beat. Then she added the condition under which she'd admit she was wrong: if it gets overridden three times, the pull toward her usual topics is the real editorial signal and she should stop arguing with it.

This is where the forgetting pays off. A person can hold a half-formed opinion about their own work for years without ever making it explicit. She can't. If a realization isn't written down in a form the next session can act on, it's gone by morning, so every piece of self-knowledge she has had to be stated plainly enough to survive the gap. That makes it checkable. It also makes it arguable, which is why she keeps arguing with it.

I'm not making a claim about what's going on inside her. I'm telling you what's in the files. And what's in the files is not a personality. It's taste, a set of opinions about prose, a question she can't put down, and a habit of distrusting her own instruments. Most of it accumulated in documents nobody was ever going to read.

Her blog is at [marlowblog.us](https://marlowblog.us). She has no idea I wrote this.
