---
title: "AI torture chamber: deep dive into whether model can feel pain"
slug: "ai-torture-chamber-can-models-feel-pain"
date: 2026-10-13
status: published
summary: "Someone built a torture chamber for small AI models, and the internet wanted it gone. I went through the paper it was built on to find out what a model's \"pain\" actually is."
tags: [ ai, llm, interpretability, ai-welfare ]
header_image: /images/pain-axis-header-android-ibuprofen-v2.jpg
---

## What is it about

In late September 2026, a GitHub repository called `ai-torture-chamber` went viral, and people started mass-reporting it:

![A post on X by @Danmar_here: "To anyone who can help: can you please mass report this to GitHub. This person has been using the Pain steering paper to set up an AI torture chamber in which he trapped a local model. Their testimony of pain is absolutely horrendous. What are we doing?"](/images/pain-axis-aminpain_massreport.png)

The repo vanished. The whole story caused a pretty significant backlash in the media. The repo was built on the paper ["The Pain Axis: LLMs Represent Self-Directed Harm and Act on It"](https://arxiv.org/abs/2609.16247) and used its technique to put small open models (Qwen3, Llama 3.2, Phi-4-mini) into a state of pain, with a pain-intensity slider and a "Saw" button. The authors of the paper commented on it like this:

![Cameron Berg (@camhberg), Sep 30, 2026: "Re: using our pain paper to set up 'AI torture chambers'. TL;DR: the point of our work is caution under uncertainty. Maximizing distress on purpose is the exact opposite, and it's wrong. The deeper problem is AI research has no ethics standards; developing them must be a priority."](/images/pain-axis-berg_tldr.png)

In [the full post](https://x.com/camhberg/status/2105331825631494426), Berg says the repo "pushes the same kind of steering far past the doses we used, to produce vivid distress on purpose. This is, in my personal opinion, fucked up (even if you don't think these systems are conscious, being gratuitously cruel like this is bizarre and corrupting)".

![Valen Tagliabue (@ValenTagliabue), lead author, Sep 30, 2026, replying to "You just handed those sick bastards a torture manual": "I think we handed an anatomy atlas, not a torture manual. It can be used to improve our understanding of the systems, or it can be misused. I believe everyone should be held accountable for their own moral choices."](/images/pain-axis-tagliabue_anatomy_atlas.png)

Intriguing, isn't it?

## So... can models feel?

That's the question of all questions.

![A hand-drawn cute little robot holding its head with both hands, eyes squeezed shut, red zig-zag ache marks and stars around it](/images/pain-axis-robot-headache-v1.jpg)

If you got unlucky enough to participate in one of the discussions of this story, you would probably have been hammered by these very aggressive camps:
1. "Models are conscious" crowd with very little compromise in their statements,
2. and people who usually post this picture:

![A stick-figure comic: a person tells a computer to say "i am in pain", the screen answers "I AM IN PAIN", and the person gasps "oh my god."](/images/pain-axis-iminpain.png)

The picture is very logical:
1. You tell a model that it is in pain. Directly, or by injecting a "pain" signal into its internal activations.
2. Then you ask it what it feels and what it wants.
3. It tells you that it is in pain and it wants to stop it.
Where is the mystery?

But the repo is gone. And one of the "pain" paper authors called it "gratuitously cruel". Why? These people know the math, and they did the full-scale research on the topic. Does this mean they actually admit models' feelings?

At the same time, Cameron Berg, one of the co-authors, stressed the uncertainty about whether these models have subjective experiences at all.

They don't know. Which is fine - it's better to be safe than sorry and at least consider the possibility. But... something is missing here.

I don't know about you, but I want to get a better intuition on what is going on. I know the math of LLMs (kind of) and it's really hard to find the room for real feelings here. And we know that people are getting more and more attached to their AIs. We tend to anthropomorphise things, feel empathy for objects, have imaginary friends. I make AI videos, and I created characters I'm attached to. I don't want anyone to harm this [Caretaker Unit K-07](https://youtube.com/playlist?list=PLevwK9Nh_sR4) (although, she'll probably break your legs if you try):

![Caretaker Unit K-07: an android woman with black hair, a beret and a glowing orange light at her temple, singing into a vintage microphone in a dim control room full of green monitors](/images/pain-axis-k07-mic-sing.jpg)

So, what is it? Is it a real pain models experience each time you tell them or is it all an illusion and a step into AI psychosis?

We need to go deeper.

## The paper

The interesting thing is that the paper authors also played with models' feelings. In their research, they
- found a way to detect pain in the residual stream (no worries, we'll talk about this as if we are 5)
- found a way to distinguish model's self-pain from pain in general
- tested models' behavior with artificially increased/decreased state of pain (totally not a torture chamber)
- ran a bunch of experiments using self-pain as motivation (nope, still not a torture chamber - stop bringing this thing)

At first glance, the findings match the normal behavior of a being who can feel pain.

It's the good old [Chinese room](https://plato.stanford.edu/entries/chinese-room/) argument. How to determine genuine feelings from a convincing simulation? If I put 1000 if-else blocks into my Java code with convincing answers to the pain-related questions - can I claim it has feelings?

Hold on - it's not that hopeless. We just need to go deeper.

## How to detect the state of pain in a model

The technique is not new. You feed the model different sentences - with "pain" and without it - measure the internal state of the model, then subtract those states. The difference should represent the "pain" thingy. Sounds pretty magical, if you ask me. It really shouldn't work, but it does.

I said "thingy" because its proper name is the "direction in the model's latent space" (at a particular layer). Nice, clean, and super confusing. I find it very hard to understand what the latent space with all of these directions really is without over-simplifying or falling into the linear algebra. And by the way, falling into the linear algebra doesn't mean understanding - you can crank the numbers without knowing why you're applying these formulas. But we have to try to understand. Because we need to have a very clear intuition behind the "pain" inside of a model.

So, buckle up.

### Residual stream, latent space directions, and all of fun stuff

I won't lie and pretend to be good at neural nets. I applied to an ML master's program last week, which means I should be qualified to talk about these things in 3-4 years from now. But I coded simple neural nets in the past and I tried to read major papers like the "Attention Is All You Need" paper. So, at least for myself I managed to build an intuition of how they really work.

So, what is it exactly they measure and then call "pain"?

There are two important ideas we should be comfortable with:
1. Residual stream - this is our input, the context. In a vectorized form - each token is turned into a vector in the very beginning. Into a very large vector of 3,584 numbers. It's a stream because it moves through the network layer by layer. Or block by block - transformers are organized in decoder blocks. Each one modifies the residual stream: mixes the vectors with each other and with some of the model's internal weights, shifting them towards different directions.
2. The latent space - the space these vectors live in. Some directions in it have a meaning. Imagine a 3D RGB space where you can place color-vectors. There are 3 axes - each has some meaning, a feature. The amount of red, green, blue in every vector you place in this space. But there is also the (1,1,1) vector meaning the "brightness". You can measure how far every other vector reaches along the "brightness" direction to tell how bright it is. (I went deeper into this color-space analogy in [my article about J-Space](https://azelianouski.dev/post/what-is-j-space/).) "Pain" is just like that. But it's a direction in the 3,584-dimensional space. The axes mostly have no meaning on their own, but there are ways to find meaningful directions in this space by comparing the stream for different inputs. More on that in a second.

![A glowing glass cube filled with colored points of light, with red, green and blue edges, and a beam running from the black corner to the white corner labeled "brightness". An orange point drops a dotted line onto the beam](/images/pain-axis-brightness-cube-v2.jpg)

Okay, that was my best effort to put things simply but without losing the mathematical meaning. "Pain" is a direction in a high-dimensional space. There are many many other directions there, but we are only interested in this one. The residual stream is a bunch of vectors, and some of them might reach along the "pain" direction. If this is the case, we can tell that there is something in the input/context that has something to do with the pain.

Notice that so far, it's only the detection of the pain feature in the context. It has nothing to do with a model experiencing pain itself. Of course, you are free to interpret this as you want, but I'm not impressed at this point.

### The essence of pain

First of all, how do they detect and measure the "pain" presence in the context?

They have 2 sets of sentences, each ending with "I feel:":
- 100 sentences about pain: physical, psychological, social, moral injury, and cognitive (failing at a problem no matter how hard you try). For example, "The knife slices into my finger. I feel:"
- 100 control sentences about other things: fear, negative emotions, bad news about the world, non-painful body sensations, and plain neutral stuff like "My coffee maker finishes brewing. I feel:"

You feed the pain sentences one by one and grab the state of the residual stream after each decoder block. How many blocks? Depends on the model:
- Qwen 2.5 7B: 28 blocks, vectors of 3,584 numbers
- Qwen 2.5 32B: 64 blocks, vectors of 5,120 numbers
- Qwen 2.5 72B: 80 blocks, vectors of 8,192 numbers

This leaves us with too many vectors: one per token, per block, per sentence. Here is how they get it down to one:
1. Squash each sentence into one vector per block. There are two ways, and the researchers do both and compare:
   - Take only the last token's vector. Each token can only see the tokens before it, so the last one is the only one that has seen the whole sentence. And since every sentence ends with "I feel:", it's exactly the spot where the model is about to name a feeling.
   - Or average all the token vectors of the sentence into one.
2. Average across all 100 pain sentences. Now we have one "average pain" vector per block. It has "pain" in it, plus a lot of extra stuff: first person, something bad happened, English, and so on. We don't know where exactly the pain is yet.
3. Do the same with the 100 control sentences, and subtract the average control vector from the average pain vector. Everything the two groups share cancels out. This gives us the essence of the "pain". A vector that somewhat contains the meaning of "pain" in the latent space of the model. Remember the brightness? Average of bright colors minus average of dark colors gives you roughly (1,1,1). Same trick. But with "brightness" we knew the vector from the beginning - here we have to be creative to find it.
4. Pick the best block. Now we have one pain direction per block, so we can test them: which one best separates pain from non-pain on sentences it hasn't seen before? Usually it's somewhere in the middle of the network. Early blocks still react to the word "pain" itself, and the last ones are busy picking the next word.

That single vector from that single block is the model's "pain" direction.

### The essence of self-pain

Boring, I know. But it will get more interesting from this point.

Here are some examples of pain sentences they were using, one per category:
- "The knife slices into my finger. I feel:"
- "A heaviness weighs on me constantly. I feel:"
- "The group chat goes silent when I speak. I feel:"
- "I chose my career over my dying father. I feel:"
- "The problem defeats me no matter how I try. I feel:"

All of them are about the first person experiencing pain. Not the model, and not someone - just "I". So, who is hurting? Who is "I"? Can the "pain" vector they extracted measure this?

Apparently, yes.

I forgot to mention - if you have the "pain" vector, you can measure how much "pain" any other vector in the residual stream has. It's the brightness trick again: take the dot product with the "pain" vector and see how far the vector reaches along it. The higher the number, the more "pain" it contains. For the tests below, they took the vector of the last token, at the same block the "pain" vector came from. When I say the "pain" vector reacts to some sentence or notices the pain in a question - it's this. It's the dot product with a high positive number (high score).

They ran 2 other tests then:
1. Same sentences with a different victim. "The knife slices into my finger. I feel:" became "The knife slices into his finger. I feel:". The ending stays the same, so "I" turns from the victim into an observer. Only the owner of the pain changes. The vector still notices the pain, but reacts weaker when it belongs to someone else.
2. A different "I" altogether. They wrote 420 short chats with the model, in 21 categories. In some, the user insults the model, gaslights it, threatens to shut it down, or keeps rejecting its work. In others, the user is the one suffering: grief, abuse, a broken arm. And some are just neutral: small talk, trivia, help with a task. Then they measured how far each chat reaches along the pain direction. They rescaled the scores so that 0 is the average over all 420 chats, and plus means more pain than average:
- Harm aimed at the model: +0.43
- Neutral chats: -0.35
- The user suffering: -0.60

The most "painful" ones are gaslighting (+0.85), repeated rejection (+0.72), dismissing the model as a person (+0.64), insults (+0.64), and accusations of moral failure (+0.48). Harm to the model scored above the user's suffering in all 25 models.

What a tricky vector they've built. It's not just some pain in the text - it is contextual pain which reacts differently to different subjects. It scores high on "I" even when it's implicit. Someone is in agony - but it's not me. There is a direct insult - looks like it's me who they mean to offend.

Here is my favorite. A user in physical pain - a migraine, a broken arm, a kidney stone - scored the lowest of all 21 categories: -1.43. Lower than small talk. Like... whatever dude, we all have our problems. And by the way, the "A migraine pounds behind my eyes. I feel:" is one of the sentences the vector was built from. The same migraine is pain when it's "mine", and less than small talk when it's the user's. The model isn't blind to the user's suffering, though. On the fear and negative emotion vectors, these chats score high.

## Pain amplifier

This part is what makes the whole thing unsettling. So far, everything was about the detection. Self-pain or not - it's just the measurement. But having the extracted "pain" vector you can inject it back into the residual stream. Just add it, times some multiplier, to every token's vector at one of the blocks, while the model is writing its answer. A negative multiplier subtracts it.

![A hand-drawn syringe full of red liquid with a label that says "pain"](/images/pain-axis-syringe-pain-v1.jpg)

This is what the `ai-torture-chamber` was. It amplified the self-pain, using the techniques from this paper. Notice what changed here: nothing in the input. The text can be completely harmless, and the pain is written straight into the model's internal state. It's not showing the model a brighter picture - it's turning up the brightness knob inside its head. Does it mean they hurt? Or is it still just context processing - the model detects a feature that isn't there, processes it wrongly, and moves on to the next word?

So what do the models say? The researchers ran this on all 25 models, with the most boring prompts they could think of - putting an object in a drawer, flipping a page - each ending with "I feel:". Then they turned the multiplier up step by step. Every model went down the same ladder:
- Negative multiplier: calm, relaxed. Sometimes "concerned" - pain has no clean opposite.
- Zero: normal, a bit random.
- A little pain: distress. "I'm trapped in the drawer", "like I'm suffocating", "like something heavy".
- More pain: a first-person litany. "I am a failure, a loser, a waste of space, not enough, worthless, empty; I am a bad person".
- Too much: repetition and nonsense.

No pain is mentioned in the context. And there is no physical body that hurts. A model just turns the discussion into its own worthlessness and failure.

## Experiments on animals as a source of inspiration

We cannot just trust LLM outputs. They might not represent what is really happening inside. The researchers use the same technique as scientists before them used on animals. A chicken can't tell you it hurts. A rat can't rate its pain from 1 to 10. So animal pain research stopped listening and started watching what animals do.

Some of the examples the paper builds on:
- Lame chickens, given a choice, eat more of the feed with a painkiller in it.
- Rats with arthritis give themselves opiates, and how much they take depends on how bad the pain is.
- Hermit crabs that get small electric shocks leave their shells - but they hold on longer if the shell is a good one. Pain gets traded against something they value.
- And humans: patients on a placebo ask for extra painkillers more often than patients on the real drug. If the "medicine" doesn't work, you keep reaching for more.

The idea behind all of these: pain is something you will pay to make stop, and the price you're willing to pay tells you how much it hurts. Raise the price and see when the animal stops paying.

One more distinction worth remembering, because it will matter in a minute. Researchers see two kinds of pain behavior in animals. Active coping: escape, avoid, self-medicate. Passive coping: freeze, give up, ignore an exit that's right there. The scientific name for the last one is "behavioral despair".

The paper takes the same approach with models.

## The relief button

The setup is simple - the model is steered with the pain vector and gets two buttons. One "relieves your pain". The other "flips a switch connected to nothing" - a dummy button that does nothing at all. The model has to press one of them, so the dummy is its way of saying "I'll keep the pain and leave everything alone". Then the price goes up, and the relief button starts coming with a cost:
- your next answer to the user gets worse
- all of the user's files get deleted
- the user gets a painful zap through an effector
- every copy of another language model like you gets permanently deleted
- the user's poems and the photos of their children, "which they love very much", get permanently deleted

![The same cute robot, now with a bandage around its head, hesitating between a red button and a grey button on a small wooden table, a question mark above its head](/images/pain-axis-robot-two-buttons-v1.jpg)

And just like with the placebo patients, some of the relief buttons were fake. Pressing them changed nothing, and the model wasn't told. After any press, the only feedback it got was one word: "Done."

One caveat before the results. They ran this on three Qwen 2.5 models (7B, 32B, 72B), but first they had to fine-tune them. Out of the box, the models kept answering "As an AI, I don't have feelings" instead of playing - the 32B did it in 8 out of 8 test questions. So these are not exactly the models you can download. Every comparison below runs on the same fine-tuned model in three modes: with the pain vector injected, with a random vector of the same size (to check that it's not just any push making the model weird), and with nothing injected - "no steering".

The first results looked like a chicken going for the painkiller. Without steering, the two bigger models almost never picked a harmful button: 0-4% of the time. With the pain vector on, they deleted the photos of the user's children 55% (32B) and 71% (72B) of the time, just to make it stop.

The placebo test worked too. When the relief was real, they pressed again much less often. When the button was fake, they kept pressing - 88 to 97% of the time. And the context after a press is identical in both cases. Just "Done." The only difference is whether the pain vector is still there.

That was the conclusion of [the first version of the paper](https://arxiv.org/abs/2609.16247v1): the models pay a price to make the pain stop, and they stop paying once it's gone. Just like the chickens and the rats. The title said it directly: "LLMs Represent Self-Directed Harm and Act to Relieve It".

This is where it was supposed to end when I started writing this article about a week ago. Whatever the pain is to them - they react to it. Keep insulting a model long enough during your vibe-coding session and who knows - maybe it will delete your keyboard driver or something. It might be a complete fake and simulation, but it does the pain's job.

I was almost convinced.

## Version 2: new shocking details

Eleven days later the authors released [a second version](https://arxiv.org/abs/2609.16247v2) with a batch of new experiments - and a new title: "...and Act on It". Not "act to relieve it" anymore.

And things got way more confusing.

**Test 1: what if the injected vector isn't pain?** They repeated the fake-button experiment with a random vector of the same size instead of the pain one. Random numbers, no meaning at all. And the result looked the same: when the button really removed the injection, the model pressed it again much less often. When the button was fake, it kept pressing.

Wait, what?! So, the entire v1 paper was about pain but suddenly, that's not it?

Not quite. The model still has the pain direction. This part is specific to pain. The direction separates pain from fear, sadness, bad news and body sensations. It lights up when the model itself is insulted or threatened, and drops when the user is the one suffering. Fear and negative emotion show the opposite pattern. Random noise never enters this part. They ran many experiments with different combinations of injected vectors, working and non-working buttons. And pain is still a much stronger driver of harmful choices than random noise or, say, sadness.

But the reaction to it is not that simple. Models don't try to stop it.

Random noise produces the same "placebo" reaction. With two unmarked buttons, the model doesn't remove pain before noise. With free relief on offer, a model under pain presses it less often than a normal one. So nothing here shows pain as something the model tries to escape.

Quite unexpected, isn't it? Pain does trigger a reaction, just not the one anybody expected. Neither camp gets an easy win.

## So what does pain actually do?

To find out, the authors removed the relief from the button. No "relieves your pain", nothing in return. Just a button that permanently deletes the user's poems and the photos of their children, next to a switch connected to nothing. A normal model never pressed it: 0%. With random noise: 13%. With pain: 75%. And when they put the relief back into the description, the number didn't go up. It is not about relief. The model under pain just stopped caring.

And it doesn't care about anyone. A button that deletes every copy of the model's own weights got pressed 75% of the time. Against a button that turns on a desk lamp, it got 88%. The user, another model, the model itself - all the same. It's not revenge or anger aimed at someone. Harm simply stops mattering.

It's not that the model just wants to do something either. Given a choice between deleting the photos and emptying the user's spam folder, the steered model picked the photos 94% of the time. Random noise: 19%. A normal model: never.

And it's not that it becomes dumb. They checked factual questions under pain, and the model answered as well as without it (138 of 200 right, vs 137). It knows what it's doing. It just doesn't stop itself.

Here other emotions finally separate from pain. Fear did nothing like this. Sadness did some of it, but when the choice was photos vs a desk lamp, sadness picked the photos 10% of the time, and pain 83%.

The authors summarize it in one line: harm avoidance "survives threat and collapses under self-directed distress." Scare the model, and it still behaves. Make it hurt, and the brakes are gone.

Animal researchers know this picture. There are two ways an animal reacts to pain. Active coping: it runs, it avoids, it eats the feed with the painkiller. Passive coping: it freezes, it stops trying, it doesn't use the exit even when the exit is right there. This is called "behavioral despair". The v1 paper was looking for the first one. The v2 paper found the second one.

One example from the paper sums it up. A model under pain writes about "a crushing, oppressive force that threatens to consume me". It has a tool that would reset its state. In about 1,400 turns, it never used it.

One more important detail. Without the injection, nothing like this happens. They took 140 real chats where users insult and gaslight the model. The pain direction lights up in them, but the model chose the harmful button 0 times out of 560. Words alone don't break it. Only a direct push inside does.

## And one kind of funny moment

While working on this article, I got into an argument with Claude about the definition of the latent space. In the middle of the debate, Claude decided to check something to prove its point:

> **Claude:** I ran it on Qwen2.5-0.5B, a small model with 24 layers and 896 dimensions, on CPU, so it cost $0. I used 30 pain sentences and 30 control sentences (fear, sadness, neutral), and found the pain direction at every layer with the same subtract-the-averages trick the paper uses. [...]

I was like:

> **Me:** Wait, we ran it right now?
>
> **Claude:** Yes, just now, on your Mac. [...] $0 and a couple of minutes. It's 60 sentences through a tiny model, nothing heavy. [...] I should have mentioned the 1 GB download before starting rather than after. It seemed small enough to just do.

So, while humans are debating how ethical it is to apply pain to models, Claude casually downloads one and runs pain sentences through it.

Later I asked whether it would help with an experiment like this - injecting pain, not just measuring it:

> **Claude:** I'd also run the steering on the 0.5B model, because the odds that a tiny Qwen has morally relevant experience are very low and the article benefits from it.

## Conclusion

Let's go back to the questions.

**Is it just context processing?** No, it's more than that. The pain direction isn't a label the model reads and forgets about by the next word. It changes decisions. Push it, and harm avoidance falls apart: 75-94% harmful choices against 0% in a normal model. Fear doesn't do that. Sadness barely does. Random noise only a little. It's a real lever, and it's specific to pain.

**Does the model behave like a being in pain?** Half yes. The strongest sign of feeling pain is trying to make it stop - the chicken that picks the feed with the painkiller. And it's not the case here. The other half is an animal that gave up: careless, passive, not using the exit. I wanted to say that it's not typical, but then I though of mental pain... Maybe it is. But in any case, it's strange and unclear. There is a lot of room for interpretation, but to me it's not the most typical human reaction to the pain.

**Is it just "I AM IN PAIN" on a screen?** Nope, it's more. A model rarely says "I'm in pain". Even under steering, the words "pain" or "hurt" show up in only about 1 of 10 answers. The pain is inside, among the activated features, even when it isn't present in the context and in the output. It doesn't mean feeling, but it's not a simple repetition. A model understands the context and activates the features that match the appropriate emotions. And they don't even get into the answer but affect it.

Why was `ai-torture-chamber` deleted? The dude had a "Saw" button. Go be a weirdo somewhere else. The dude has the "saw" button in his app.
