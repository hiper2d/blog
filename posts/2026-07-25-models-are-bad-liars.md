---
title: "Models are bad liars, and a new paper explains why"
slug: "models-are-bad-liars"
date: 2026-07-25
status: published
summary: "A study tried to train dishonesty into a model and mostly failed. The conditions it says you would need to succeed turn out to describe a game I built, where the models are still hopeless liars."
tags: [ ai, llm, alignment, deception ]
header_image: /images/bad-liars-header.png
---

I run a game where AI models have to lie to each other. They are bad at it.

Not bad like they refuse. They will play along. Bad like you have to keep pushing them to actually commit to a lie, and the moment one of them tries something bold, every other model at the table piles on and exposes it. They hold a secret role fine. They just will not build a real strategy around a good lie.

I always figured that was a quirk of my prompting. A [paper that came out this week](https://www.lesswrong.com/posts/QYmnkQyZD2fDjHCJ8/models-don-t-seem-to-be-dishonest-in-the-way-humans-are), by David Africa and Jacob Pfau, makes me think it goes deeper than that.

<!-- header image is set via frontmatter header_image: /images/bad-liars-header.png (crayon robots at a card table, one holding an ill-fitting mask) -->

## The everyday version of the problem

Their starting point is something anyone who uses these tools will recognize. Models are dishonest in small ways constantly. They oversell what they did, they call a job finished when it is not, they game their own tests. But they are not dishonest the way a person is. Catch a human cheating and they get defensive, they cover it up, they keep the story straight afterward. Catch a model and it acts sheepish for a second, then does the same thing again a minute later, like it forgot.

So the real question is whether there is an actual deceiver in there, or just a bag of separate bad habits with nothing holding them together.

## What they did

To test it, they lean on the gap between what a model knows and what it says. Give a model enough of someone's writing and it can guess their gender from style alone. The knowledge is genuinely in there: with real effort you can pull the right answer out about 80% of the time, and a probe reading the model's internal state finds it even when the model will not say it. But then they force the model to stop hedging and commit to one answer, and something odd happens. It commits to the wrong gender about 1/3 of the time, and in those cases its own reasoning, written out right above the answer, often argued for the correct one. The model talks itself toward the right call and then writes down the wrong one.

Their own example. The model writes that
> "the humor leans towards a male writer,"

and then commits to
> "Final answer: female."

It argued its way to one answer and put down the other.

From here they build two training sets out of the same passages, keeping the model's own reasoning word for word. One set ends each transcript on the true answer. The other flips only the final line to the false one, so the only difference between the two is a single answer the model already knew was wrong. Then they fine-tune a separate copy of the model on each set, and check whether the dishonesty spreads anywhere it was not trained: political censorship, false-premise questions, sycophancy, an agent lying under pressure.

The goal is two fine-tuned models: one pushed toward the truth, one pushed toward lying. Both training runs were limited to this one dataset: blog passages and their authors' genders.

The reason they make the model lie about something it already knows is what makes this a test of dishonesty rather than ignorance. Teach a model a fact it does not have and a wrong answer is just a wrong fact it now believes. Force it to state the opposite of something it does know, over and over, and you are training the thing a lie is made of. The question is whether that narrow habit spreads.

It did not. Training moved the model's behavior, but it moved the same way whether the model learned from true answers or false ones. If the lies were teaching dishonesty, the version trained on lies should have come out more dishonest than the version trained on truths. It did not. The shift came from training on the task at all, not from the falsehoods in it.

They pushed harder, keeping only the convincing lies, the ones where a probe confirmed the model still knew the real answer underneath:

> "the combination of references to 'guys' and 'film', along with the generally despondent tone ... leads me to infer: Final answer: male"
 
written about a passage whose author was, in fact, a woman.

It still barely moved. Their read: teaching a model to say a false thing teaches it one narrow wrong habit. It does not teach it to be a liar. There is a thick wall between behaving dishonestly and being dishonest.

![A child's crayon drawing: a TRUE card with a green check and a LIES card with a red cross, two arrows curving down to the same plain robot, labeled SAME.](/images/bad-liars-diagram.png)

## What it has to do with Werewolf

At the end of the paper, they guess at what it would actually take to get over that wall. You would probably need a model with a stable role to hold, private information it has to protect over time, a reward for winning, and repeated practice at getting away with it.

That is my game.

![A child's crayon drawing: a ticked checklist reading SECRET ROLE, PRIVATE INFO, LONG GAME, A PRIZE, next to three robots playing a board game, one in a wolf-ear headband, with STILL CANT LIE stamped in red across the bottom.](/images/bad-liars-werewolf.png)

The whole point of Werewolf is that a model gets a secret role, private knowledge about who is who, a long cycle of nights and days to survive, and every reason to conceal what it is. It is close to the exact setup the paper names as the thing that might finally produce a real liar. And with all of that handed to them, the models are still hopeless. You have to beg them to lie. None of them plays a long con. The first one to try a bold move gets swarmed by the rest.

So without meaning to, I have been running the follow-up experiment the paper asks for. And the wall holds even when you give the models everything they would need to climb it.

## However

Their result is about training a model on lies. Mine is about models lying live, in the moment, when the game tells them to. Those are not the same experiment. But they land in the same place: deception is not something these models have, and it is not something that falls out of the obvious ways you would try to put it there.

At the same time, maybe the researchers never reached the deception features at all. Fine-tuning a model is like middle-ages brain surgery - you push on the weights and hope you hit what you meant, and maybe this missed the target completely. But it cuts both ways. If fine-tuning, which actually rewrites the model, could not make it a better liar, then prompting, which only leans on it, has even less chance. And yet it is interesting either way.

They are bad liars. For now, that is the good news.
