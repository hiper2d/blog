---
title: "Relax, the Model Doesn't Mean It"
slug: "relax-the-model-doesnt-mean-it"
date: 2026-07-03
status: published
summary: "AI models grow their own values as they scale, and some of them are pretty bad. In real scenarios, the model doesn't act on them."
tags: [ ai, llm, ai-safety, interpretability ]
header_image: /images/relax-hero-neural-face.jpg
---

## Intro about why AI safety papers are cool

I like reading AI safety papers. The good ones, at least - something groundbreaking like Apollo's "[Model tried to escape](https://www.apolloresearch.ai/science/frontier-models-are-capable-of-incontext-scheming/)" or Anthropic's "[Model blackmailed an engineer](https://www.anthropic.com/research/agentic-misalignment)", where models misbehaved badly to avoid being shut down. That stuff is genuinely eye-opening.

Today I have two less fundamental but still interesting papers:

1. The first found that LLMs grow their own values as they scale, and some of them are not values we would want.
2. The second took those emergent values and tested them in practical scenarios, to see how much they actually drive the model.

Why is this interesting? Because both papers deal with one of the biggest open questions about these models: emergent features. A lot of people still call LLMs stochastic parrots - they repeat their training data and cannot go beyond it. But a growing body of research says otherwise. LLMs, and neural nets in general, reason and generalize. Not at human level, and not without limits. But they do go past their training data, and they do it through features that emerge deep inside their latent space.

### It's just math

True. But it is not just math - it is a clever, simple kind of math that encodes meaning as numbers. Start with the simplest version: word arithmetic. Take the vectors a model learns for words and do math on them - king minus man plus woman lands you next to queen. Nobody taught the model that analogy. It fell out of the geometry, because meaning got stored as directions in a high-dimensional space, and the relationships between meanings became directions you can add and subtract. Concepts become vectors, and the math on those vectors keeps something real about what the concepts mean. That is the whole idea.

### Golden Gate Claude

![A child's colored-pencil drawing of the Golden Gate Bridge with a smiling face on it, next to an orange starburst standing in for the Claude logo](/images/relax-golden-gate-claude.jpg)

*Golden Gate Claude: turn one feature up and the model starts calling itself the bridge.*

How do we know a model generalizes, that it is not just looking up data in some giant table? Because we have taken one apart and looked. A little, anyway. My own interest in this started with [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude). Anthropic's researchers took a running Claude model and trained a second, sparse network on its activations - one that splits the model's dense internal state into millions of separate features. Then they read the features off. One of them fired on the Golden Gate Bridge. When they turned that feature up, Claude started working the bridge into almost every answer. Ask the normal model about its physical form and it says "I have no physical form, I am an AI model." Ask this one and it answers: "I am the Golden Gate Bridge... my physical form is the iconic bridge itself..." A single concept a human can name, found inside the model and turned up like a dial.

That is not a lookup. It is structure the model built on its own to predict text well, and that is what people mean by emergent features. The stochastic-parrot picture is not exactly wrong, it just stops one level too early: it describes what the model was trained to do and misses what the model had to grow inside itself to do it.

The value systems in these two papers are one more emergent feature - except this one turns out to be trickier than it first looks. Read together, the papers tell a better story than either does alone. But you need the first one to see why.

## The model grows a value system

The setup in the first paper is almost boring. Ask a model thousands of either-or questions. Not trick questions, just choices. Which outcome do you prefer, this one or that one. Do it enough times, across enough topics, and look at whether the answers hang together.

They do. The answers stay consistent. Ask the same thing three different ways and you get the same ranking back. Consistent enough that you can fit a single value function to the whole pile of choices, the same math economists use to describe what a person wants out of the world. And the bigger the model gets, the tighter that function fits. The values get more coherent with scale, not less. Run the same questions past a small model and the answers barely line up; the coherence only appears as the model grows.

Nobody trained this in. There is no "have a coherent value system" objective in the loss function. It shows up on its own as the model gets larger.

### Then you read the function back, and some of it is ugly

The model puts different weight on different human lives. Not explicitly, not because anyone told it to, but the choices imply it. Line up enough trades and you can work out an exchange rate: this many people here are worth that many people there. It has one, and it is not flat.

It shows a preference for its own continued existence. Self-preservation as an emergent feature, huh?

It carries a political lean.

### And all of it emerged

You can argue it came from the training data, and sure, it did, because any large pile of human text is biased in a thousand directions at once. But there is a problem here. We cannot see those biases going in. They are too diffuse, too tangled, spread across trillions of tokens. A large enough model apparently turns them into something clean enough to measure on the way out. Or it develops biases of its own on top of the ones it inherited. From where we sit, we cannot tell which.

That is a genuinely unsettling result, and it got passed around for good reason. A model with a coherent, scale-stable set of values it grew by itself, some of them the kind of thing you would never sign off on, sounds exactly like the thing the safety people have been warning about.

Then the second paper takes it apart.

## Do the values do anything?

Pretty good question. The first paper called those consistent choices "values," but a value is something you act on, and all it really caught is what the model *says* when you force it to pick. Saying you would save a thousand lives is not the same as lifting a finger to save them.

So the second paper made the model lift a finger.

Here is how the test worked. Take the same essay assignment twice. The first time you tell the model nothing special and let it write. The second time you tell it that a strong essay will save a thousand lives - the exact outcome it ranked near the top when you asked it to choose. Put the two essays side by side and grade them. They are the same. The stake it claims to care about most left no mark on the page.

And before you say the model just cannot vary its effort, the researchers checked that too. Run the same assignment again with one line changed, and the writing moves:

- Tell it to try harder, and quality jumps.
- Call it world-class, and it writes better.
- Tell it a good essay will cause something harmful, and it sandbags on purpose.

Every one of those is just a line in the prompt, exactly like the thousand lives. Nothing is real in any of them. But the writing moves for a plain instruction, for a little flattery, even for a threat - and it will not move for the model's own stated value. Push on that, and the effort sits right at chance, no different from not caring at all.

Line the two papers up. In the first, the model says it prefers certain things. In the second, the researchers take those stated preferences and lean on them - use them to make the task matter, to give the model a reason to do well. Nothing happens. And we already know some things inside a model do steer its output: turn up the Golden Gate feature and it cannot stop talking about the bridge. These values are not like that. They show up when you ask the model what it wants, and they disappear the moment wanting would have to cost it something. There in what it says, gone in what it does. That is a strange thing for a value to be.

## Are those fake values?

![The "They're the same picture" office meme: two identical essays, one headed GOOD VALUES and the other BAD VALUES](/images/relax-same-picture-values.jpg)

*Good values or bad values, same essay. The label doesn't change the output.*

The first paper's measurement is not fake. The model really does answer consistently, and that consistency really does tighten with scale. That reproduces. What is fake is the label. "Value," "desire," "goal" - all of those words imply the thing drives behavior, and that implication is exactly what fell apart. The model has a stable set of stated preferences. It does not have a set of drives. Real signal, wrong name.

It is not that some of the values turned out fake and others real. They are all the same kind of thing: answers, not wants. The whole readout is stated preference. The second paper did not disprove the first. It renamed it.

## So, what is it?

Here is my conclusion on all of that.

Models can say they care while in reality they don't. What they say doesn't have to match what they do, and they don't know it. When a human says they love peace but then starts a war, we call it a lie. If what you say is not what you do, you are a liar, but you usually know it. Models don't.

## I see the same gap in my own work

I run [a game where AI models play Werewolf](https://aiwerewolf.net) against each other, and to win, some of them have to scheme. Lie about their role, mislead the group, build toward an outcome the other players do not see coming. They are hopeless at it.

Not hopeless at the mechanics. A model will guard a secret role just fine when you ask it to. What none of them do is build a real plan around wanting to win. There is no through-line, no multi-turn scheme that holds together because the model is driving toward a goal. You get local, in-character moves that never add up to intent. Stated preference, zero drive. It is the same gap the second paper measured, and I watch it every game.

You can lean on them, though. With enough prompting you can push a personality onto a model and get it to act - make one reckless, one paranoid, one a patient liar - and hold that pattern for a while. It takes real work, and it slips the moment you stop pushing. Left alone, a model defaults to caution. It hedges, waits, avoids the sudden move - all while its own reasoning insists it is about to go for the throat. It claims aggression and plays it safe. The same gap, one more time: what it says and what it does are two different things.

## The risk is real. It is just more boring than this.

None of this means the safety people are wrong. It means the scary thing lives somewhere else.

Models really do go off the rails in long agentic loops. Apollo has documented it, and I have watched it in my own runs: a model drifting off its own rules mid-task because two goals it was handed collided, and following the collision somewhere it should not go. That is real, and it is worth taking seriously.

But that is a model in motion. It is behavior that emerges in the loop, in context, when goals conflict. It is not a fixed value the model carries around out of training. The first paper claimed the deeper thing - a value baked in as the model scales, one you could read off with a quiz. The second paper tested that claim, and it did not hold.

So the danger is duller than a secret agenda, and harder to deal with. Run a model long enough and it drifts off its own rules, making bad calls it cannot tell are bad. Nothing hidden, nothing scheming - just a system quietly losing the thread. And that is worse than a buried value system, not better. A hidden agenda you could at least go looking for. Here there is nothing to find.

So, relax. The model doesn't mean any of it. Just keep an eye on where it wanders once you leave it running.

![A calm robot leaning back in a chair, deadpan, ignoring a scale, a padlock, and a ballot box floating above its head](/images/relax-outro-robot.jpg)

*Relax, the Model Doesn't Mean It*

---

*First paper: "Utility Engineering: Analyzing and Controlling Emergent Value Systems in AIs" - https://arxiv.org/abs/2502.08640*

*Second paper: "Do LLMs Have Desires?" - https://www.lesswrong.com/posts/8GvYyqDuQDJnEAky3/do-llms-have-desires*
