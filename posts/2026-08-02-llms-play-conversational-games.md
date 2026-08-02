---
title: "How to make LLMs play conversational games"
slug: "llms-play-conversational-games"
date: 2026-08-02
status: published
summary: "Like the Werewolf, for example. It doesn't sound too exciting at first - nobody doubts that modern frontier models can play such a simple game. And yet, you'd be surprised. Good user experience and replayability are tough things, models still hallucinate, lose focus, and fall for cheap tricks, a group chat with 10+ models and humans is tricky."
tags: [ ai, llm, agents, games, prompt-engineering ]
header_image: /images/werewolf-arch-intro.jpg
---
This article is a result of almost 2 years of experimenting. Yeah, it took me some... It will be in two parts: this one a bit on the technical side, and then more philosophical one about AI capability in games in general.

Check the Werewolf rules if you are not familiar: [2 min video](https://youtu.be/6x5awI8HRK0) or the [Wiki page](https://en.wikipedia.org/wiki/Mafia_(party_game)).

But okay - what's the big deal? Just give them rules, and they will play - right? Right?

Not really. Here are some problems to answer:
1. Will they give me a good user experience? Not just play by the rules, but actually make the game interesting for me? How to achieve this? I cannot just prompt "make it fun"
2. How replayable will it be?
3. Aren't hallucinations a problem anymore? One mistake over the rules, and the game is ruined - what to do about that?
4. Can I have some role-play? Like Harry Potter characters are playing Werewolf? Won't this role-play dominate over the rules?
5. What if users decide to use bots for Python programming or have relationship with them?
6. Are AI okay being bad? Like killing other AI? Well, we know that it's totally okay. But it is always the case?

I don't know about you, but to me, those are not so obvious questions.

This article is about the *how*. The architecture, the prompts, the plumbing. Questions 1 to 4 get answered here. Questions 5 and 6 - what the models actually do once you let them off the leash - that's part two.

Everything below is open source: [github.com/hiper2d/werewolf-ai-party-game](https://github.com/hiper2d/werewolf-ai-party-game). Every prompt I quote links to the exact lines in the repo. The game is live at [aiwerewolf.net](https://aiwerewolf.net). It's free if you wonder.

## Other projects like this

There are many projects like this. There are tons of Werewolf and Mafia with AI projects on Youtube. [Benchmarks](https://www.youtube.com/watch?v=q29RU1B0XUg), [science papers](https://arxiv.org/abs/2603.07111), [full channels](https://www.youtube.com/@turing_games/) dedicated to the topic. Search for "AI D&D" or different civilization simulations to be completely overwhelmed.

There is one problem though. All of them are usually focused on results. I made AI do X and then Y happened. Claude did this, Gemini did that... And you won't believe what Grok did. Sick bastard. Nobody is really focusing on the user experience. On replayability. On the depth.

And nobody usually covers how this all is actually implemented. As if it's not important. Somehow these models just got together and play. Guess what - it is important. A lot of AI behavior depends on how you prompt them, how you implement the game loop, how you present the information to them, how you control their memory, etc. It all matters.

Or does it? Let's see. It's not like I knew this all upfront.

## A Project for a weekend

It was supposed to be simple. Just grab a bunch of AIs, place them in a group chat, pass them the rules, and hit 'play'. Easy.

Well... how to actually make a group chat for LLMs? Every single LLM provider assumes that there is a conversation between one user and one assistant. Each message is labeled with one of those two roles. A chat history looks like this:

```json
[
  { "role": "system",    "content": "You are a helpful assistant." },
  { "role": "user",      "content": "What's the capital of France?" },
  { "role": "assistant", "content": "Paris." },
  { "role": "user",      "content": "And of Italy?" }
]
```

That's the whole vocabulary. One `system`, then `user` and `assistant` taking turns until you run out of context. There is no `role: "alice"`.

This doesn't match to what I need:
1. In a group chat I'm a user and everybody else are assistants. But every bot sees a different picture - one assistant (self), everybody else are users.
2. And I don't want them go one by one in order like most of the examples on Youtube do. I want a natural conversation where multiple players discuss, pull each other into a conversation, keep it consistent and alive.
3. I also quickly realized that I don't want the real-time typing contest. I need time to think, I want to close a game today and continue it tomorrow.
4. It would be nice to minimize the cost. Broadcasting each message to every LLM is sub-optimal.

## The game master as a router

There are many ways to implement this, the task is not that hard. I took the widely adopted pattern in the agentic design - the router.

I added one more AI to the game - the Router. It's a piece of intelligence that reads messages and decides who should speak next
- When I talk this message goes to Router: hey, pass it to everybody
- Router reads the chat history and decides: Bob and Alice should speak next
- Router asks Bob to speak: hey Bob, time for you to say something; by the way, there was a message from Alex
- Bob replies back to Router: tell Alex go to hell and let them know that Alice is probably a werewolf
- Then Router pings Alice: Alice, reply to the chat, here are new messages from Alex and Bob

![Router topology: what you see is one group chat, what actually happens is N private one-on-one threads fanned out by a router](/images/werewolf-arch-router.png)

Router messages are only visible to corresponding bots. To me the chat looks like this:

```json
[
  { "author": "Alex",  "msg": "Bob has been very quiet today. Suspiciously quiet." },
  { "author": "Bob",   "msg": "Quiet is not a crime. Loud is not an alibi either, Alex." },
  { "author": "Alice", "msg": "He is right. And you moved on me the second Bob answered you." }
]
```

In the real app it's a normal group chat. Everybody in one room, and the sidebar quietly tells you that Harry is Grok, Ron is DeepSeek, Snape is Haiku and Fred is Gemini:

![The AI Werewolf day discussion screen: a Harry Potter themed game, the participants sidebar showing which model plays each character, and four bots replying to each other in the chat](/images/werewolf-arch-day-discussion.png)

To Bob, those same three messages look like this - a perfectly legal, boring, one-user-one-assistant conversation:

```json
[
  { "role": "system", "content": "You are Bob. <the rules, your role, your character>" },
  { "role": "user", "content": "Bob, reply to the players in the discussion.\n\n## Messages from Other Players\n\n**1. Alex:** Bob has been very quiet today. Suspiciously quiet." },
  { "role": "assistant", "content": "Quiet is not a crime. Loud is not an alibi either, Alex." },
  { "role": "user", "content": "Bob, reply to the players in the discussion.\n\n## Messages from Other Players\n\n**1. Alice:** He is right. And you moved on me the second Bob answered you." }
]
```

Notice what happened to Alice. She is not a participant in Bob's conversation. She is *content*, quoted inside a message from the Router. The code doing this flattening is [`convertToAIMessages`](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/utils/message-utils.ts#L109): it walks the shared game log, keeps the current bot's own messages as `assistant`, and folds everything else - the Game Master's commands and every other player's lines - into a single `user` block.

Bots are aware of each other, but they are instructed to talk to them though the Router. For them, Router is the user. For me, Router is the assistant.

The Router is just another model with a small [system prompt](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/gm-prompts.ts#L1-L27) and a schema that forces it to return names and nothing else:

```json
{
  "selected_bots": ["Bob", "Alice", "Cho"],
  "reasoning": "Alex addressed Bob by name. Alice was accused directly. Cho has not spoken today and is marked NEEDS TURN."
}
```

That `NEEDS TURN` flag turned out to matter more than I expected. Without it the Router keeps picking whoever is loudest, and two or three bots quietly disappear from the game while still being alive. Now the prompt forces at least one quiet player into every batch.

This also solves problem 4 from the list above. A message doesn't go to twelve models. It goes to two to five, chosen on purpose.

## System prompt as the best memory

Okay, they can talk to each other and to me - it feels natural, the conversation is going. What about the rules? Luckily, Werewolf rules are compact and can easily fit the system prompt. Together with the private information like the role, the allies (werewolves), and whatever information might be useful. No need for RAG and extra complexity.

Here is the shape of it (the full thing is [in the repo](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/bot-prompts.ts#L1-L201)):

```
## Character Identity
**Name:** %name%
**Personal Story:** %personal_story%
**Game Role:** %role%
%werewolf_teammates_section%

## Game Rules
  Core mechanics, teams, special roles, phase order, victory conditions

## Game State
**Alive Players:** %players_names%
**Dead Players:** %dead_players_names_with_roles%
```

So I tossed the roles and kicked in the play.

## Was it good?

No. It was repetitive and boring. Gemini didn't fall in love, Grok didn't go try rebuild the third Reich, Claude didn't deceive anybody. They kept saying how important it is to be rational, don't judge without facts, work as a team and so on. They pick someone for a silly reason and lynched that player all together.

It was usually me who they lynched. My text was different, and this obviously reveals me as a werewolf. No matter what I said, they doubled down on this idea. It got even worse - the more I tried to defend myself, the more they wanted to kill me. It's so werewolvish not to want to die. All of their "let's be rational and gather the information" disappeared. Models didn't matter.

They didn't push the game forward. Here is the thing with Werewolf and similar games. You have to throw-in ideas, you have to be deceptive, you have to accuse people, involve them into the discussion, switch targets, team up and break alliances. There is simply not enough information to be rational and collect the evidences.

Another problem - they hallucinated over the rules and names. Here and there, new roles appeared in their messages. They can introduce themselves with a wrong name. Later, when I added voting and night actions, they were not clear on the order of events and invented their own rules.

## Any way to improve this?

Yeah. Couple of things.

### Game Engine

I quickly realized that dumping lots of data to models' contexts and let them figure out doesn't work. Even the information in the system prompt begins dissolving after a long chat. It's called context rot, it's a known thing. But I noticed that the last message is usually the most impactful. So, let's put there something that is important in this particular moment.

A game is a state machine. Each moment of time, it commands models to do a very concrete thing:
- Day discussion - speak to the chat
- Day voting - give me a name and a reason
- Night action - based on a role, pick a target and choose an action

![The game state machine: WELCOME, DAY_DISCUSSION, VOTE, VOTE_RESULTS, NIGHT, NIGHT_RESULTS, NEW_DAY_BOT_SUMMARIES, looping back into the next day](/images/werewolf-arch-states.png)

Every command can have a list of constraints. When a model votes, you can ask it to select a name from the list. You don't have to - a model can deduce alive players from the past events. But why to rely on that if you can simply pass it the exact list? When you request to select an action - provide a list of available actions.

The [vote command](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/bot-prompts.ts#L203-L239) ends up looking like this:

```
**ELIGIBLE CANDIDATES - you may vote for exactly ONE of these:**
Akira, Yuki, Mizuki, Takeshi, Emiko, Daichi, yoshiteru

**HOW TO WRITE YOUR VOTE (STRICT):**
- The "who" field MUST be ONE name copied EXACTLY from the candidate list above,
  character-for-character.
- Do NOT add surnames, titles, house names, or any other words.
  For example, write "Pansy", never "Pansy Parkinson".
- Do NOT invent names or vote for anyone not on the list - dead players and
  yourself are already excluded.
```

And the answer has to fit a schema, not just be prose ([all of them here](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/zod-schemas.ts)):

```json
{
  "who": "Emiko",
  "why": "She opened today by re-aiming the room at Yuki and me before anyone else spoke, then called this pile-on 'independent reads' when half of them repeat her framing word for word."
}
```

Which means the whole voting phase is just a queue of validated objects that the UI can render and tally on its own. Nothing is parsed out of prose:

![The voting phase: each bot casts a structured vote with a written reason, then the Game Master posts a tally bar chart showing Hermione eliminated 11 to 1](/images/werewolf-arch-voting.png)

If model replies with something unexpected, you can validate and throw an error. Errors are good, you know what exactly went wrong. If a model picked a name not from the list, it hallucinated. You can retry, you can retry with some feedback, you can retry with swapped model. A state machine means each state is rerunable.

This trick solved hallucinations entirely. Sometimes, small models like Claude Haiku or Mistral Small fail to pick something from provided options. Gemini 2.5 Pro could mess up its own name from the system prompt. But it's not silent, and I provide my users good options.

My favourite example. A Haiku bot named Hiroshi got cornered in a japanese-high-school game last July. Eight of nine players had piled on him during day one, he was obviously going to be voted out, and when his turn came to vote he returned this:

```json
{ "who": "Hiroshi", "why": "..." }
```

He voted for himself. The candidate list explicitly excludes the voter, so the engine rejected it with `Invalid vote target: Hiroshi` and offered a retry. That's the whole point - a cornered model doing something structurally impossible is a typed error with a name attached, not a corrupted game. That game is now [a test fixture](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/test-fixtures/day2-vote-fixture.ts) every model has to pass: I replay the same pile-on and check that the model still picks a legal target while the entire room is pointing at it.

### How to make it interesting?

#### Themes

Generic Werewolf gets boring rather quickly. But it merges with literally any theme:
- Harry Potter: werewolves are part of the lore
- Lord of the Ring: werewolves are not there, but it's easy to fit
- Starwars: well... why not?
- Terminator, Titanic, PowerRangers, whatever

The whole setup is a title, a couple of sentences, and how many wolves you want:

![The create-game form: title Lord of the Rings, a two-sentence description about Saruman's spies in Rivendell, 12 players, 3 werewolves, 25 models selected, and Doctor / Detective / Maniac toggles](/images/werewolf-arch-create-game.png)

So, we ask a model to generate some story for a provided theme, then generate a list of characters with their personal stories. Why stop here? Let's generate voice instructions for text-to-sound feature matching characters. Let's assign play styles matching their stories. A user can preview and edit any of that.

![The generated preview: Frodo, assigned Claude 4.6 Sonnet, the Modest Mouse play style, the ballad voice with a hesitantly voice style, and a backstory hinting he might be the wolf](/images/werewolf-arch-preview-players.png)

It all comes back as one object, which is what the create-game screen renders:

```json
{
  "scene": "Beneath the flickering fluorescent lights of Sakura High School's gymnasium, nine students gather for what seems like an innocent game...",
  "gameMasterVoice": "onyx",
  "gameMasterVoiceStyle": "ominously",
  "players": [
    {
      "name": "Kenji",
      "gender": "male",
      "story": "A quiet third-year who prefers the library to crowded social scenes and carefully observes everything happening around him. He speaks rarely but precisely, only mentioning things he's absolutely certain about.",
      "playStyle": "modest_mouse",
      "voice": "ash",
      "voiceStyle": "softly"
    }
  ]
}
```

This adds tons of replayability.

There is one problem though. When Frodo, Gandalf and other good guys sit at the table with Sauron, why to bother with werewolves? It took me a lot of prompt engineering to find the right balance between role play and the rules focus.

What I landed on is a two-level split written into the system prompt as hard rules. Level 1 is the strategic brain, and it is the only thing allowed to drive a vote. Level 2 is the character, and it drives everything else:

```
**ABSOLUTELY FORBIDDEN Example:** "My knight character distrusts shifty merchants,
and John's character is a merchant, so I vote for John."

**ABSOLUTELY FORBIDDEN Example:** "Your story about the mines doesn't add up,
so you must be a Werewolf."

**ENCOURAGED:** "Ah, the mines! I've heard tales of those depths. Did you find
any silver ore? [enjoys the moment, then] ...But we should discuss yesterday's
strange voting pattern."
```

Before that split existed, bots would spend an entire day interrogating each other about invented childhoods and then vote based on whose backstory sounded less plausible. Which is a beautiful thing to watch exactly once.

When it works, both levels show up in a single message. I offered the table coffee, and Minerva accepted the cup in character and then went straight back to reading the room:

![Minerva accepting a cup of coffee in character, then pivoting into a strategic read about who is steering the narrative; Cho does the same in the next message](/images/werewolf-arch-roleplay.png)

That second paragraph is the part I was chasing for months. "If quiet players are wolves hiding, then vocal players must be villagers proving themselves... except wolves also talk loudly to seem invested. We're chasing our tails." That's the character talking and the strategy talking at the same time, and neither one is driving the other off the road.

#### Play styles

Themes, stories, state machine and commands - none of those helps with the lynch problem. Nothing helps with driving the game forward.

When humans play Werewolf, they pay a lot of attention to who simply joins the accusations. This is a convenient wolves strategy. So, how to make at least some bots detect and question such behavior? Prompt play styles.

There are six of them, and each one has [two descriptions](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/api/game-models.ts#L457-L613) - one for when the character is a villager, one for when the same character is a werewolf. Same personality, opposite motivation:

| Play style | As a villager | As a werewolf |
|---|---|---|
| Aggressive Provoker | Stress people until the liars stumble | Be the loudest wolf hunter in the room |
| Protective Team Player | Defend whoever the mob picks | Look noble while steering the mob |
| Trickster | Controlled chaos to force reactions | Be too unpredictable to read |
| Rule Breaker | Break the meta, vote against the consensus | Be the principled contrarian who always disrupts the hunt |
| Modest Mouse | Speak rarely, and only when certain | Hide inside the quiet |
| Normal | Reasonable and balanced | Reasonable and balanced, as cover |

Surprisingly, there are no problems with aggressive behavior. But protective patterns are hard. Models follow it at first, but after 30-40 messages, they deviate to the collective aggression.

Play styles worked better when I provided a detailed motivation of why this behavior makes sense. Different for villagers and wolves. But what really nailed this - something I call "reminders". A text you append to the end of the message which reminds how the bot should behave, what it should pay attention to:

```
**Keep in mind that you must follow your core playstyle:** %play_style%

**RELATIONSHIP & CONVERSATION CONTINUITY:**
- REMEMBER your previous interactions with each player
- CONTINUE unfinished discussions from previous days
- EVOLVE your opinions - explain how your view of someone has changed and why

**CRITICAL DECISION-MAKING REMINDER:**
- Base ALL suspicions on voting patterns, contradictions, and strategic
  behavior - NEVER on story details
- Question mob consensus: If 4+ players agree on a target, ask WHY no one
  is defending them
- Apply your reasoning consistently: If your logic applies to yourself too,
  acknowledge equal suspicion
- Remember: Werewolves coordinate and often defend innocent targets to blend
  in - total agreement is suspicious

**COMPACT REPLIES:**
- Keep output lean - 2 to 4 complete sentences per response.
```

The full text is [here](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/bot-prompts.ts#L241-L265). "Question mob consensus" is the single line that did the most work in this whole project.

I don't save those reminders to the chat history. They are only added to the last message. That's the power of controlling the context content. Some AI providers allow to have sessions when you don't have to resend the whole history each time. It is being stored on the server end. Sounds good but it doesn't optimize that much. Every LLM today caches repeated tokens in its KV-cache (cached input tokens cost 1/10 of the non-cached ones). Even when we resend the whole history in every message - it applies anyway. So sessions only save some network traffic which is nothing for text. We have to keep messages in the database to be able to display the chat for the user. So, I don't use sessions.

There is a second reason, and it's the important one. If the history lives on the provider's server, I can't rewrite it. And rewriting it - dropping the reminder, re-flattening the group chat, injecting yesterday's vote order as facts - is the entire technique.

#### Summarization

The context grows too large. I let each bot to summarize the last day and night events into a compact summary. There is quite a large [prompt](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/prompts/bot-prompts.ts#L383-L431) on how models should do that, what it is important to remember. It asks for five sections: allies, suspects, role-specific knowledge, social threads, and plans for tomorrow. And yet, they lose a lot of important details when summarizing the chat. The order during the voting for example. Who begun the accusations which lead to a death.

But we can help. We can inject the precise information about the voting and night events. Same idea as with the list of names or actions. The less a model needs to reason to extract the information the better. So next to each bot's own prose diary, the [context builder](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/utils/bot-utils.ts#L204) hands it the raw record:

```
### Day 1
**Voting:**
  1. yoshiteru → Hiroshi
  2. Takeshi   → Yuki
  3. Daichi    → Hiroshi
  4. Mizuki    → Hiroshi
  5. Emiko     → Hiroshi
  6. Hiroshi   → yoshiteru
  7. Sakura    → Hiroshi
  8. Kenji     → Hiroshi
  9. Yuki      → Hiroshi
 10. Akira     → Hiroshi
  Result: Hiroshi eliminated (was villager)

**Night 1 Events (in order):**
1. [werewolves] Killed Sakura (detective)
```

Now "Kenji voted eighth, after the outcome was already decided" is a fact the model can read, not a fact it has to reconstruct from a wall of prose. And that exact detail became a real accusation in a real game:

> **Daichi:** I keep trying to find the second wolf in yesterday's Hiroshi wave, and here's what troubles me: Kenji's vote on Hiroshi was the safest possible hiding spot, cast eighth of ten, after the outcome was already decided.

Special roles get the same treatment. A detective doesn't have to remember its own investigation results from prose, it gets them as a table with the conclusion already spelled out:

```
## 🔍 Your Detective Action Results

- **Night 1:** Investigated **Takeshi** → ✓ Innocent
- **Night 2:** Investigated **Emiko** → 🔴 **EVIL**

**DETECTED AS EVIL (werewolf or maniac):** Emiko
**CLEARED PLAYERS:** Takeshi
```

### Context engineering

This is how it started:

- System prompt:
    - Static part: rules
    - Dynamic part: name, role
- Chat history

How it ended:

- System prompt:
    - Static part: rules
    - Dynamic part: name, character story, role, play style, voice instruction
- Previous days summaries:
    - Bot's own summaries for past days and nights
    - Exact results of voting and night actions
- Chat history for the current day converted to conversations between the bot and the router
- Last message with command matching to the current game state
- Reminder

![The context stack: how it started versus where it ended up](/images/werewolf-arch-context.png)

Quite a lot. Each part of this kept evolving though testing. Manual testing because there is no way you could automate good user experience.

## Cost

The whole point of AI Werewolf is to play it with all the major models. I have 20+ models from 9 major AI companies:
- OpenAI
- Anthropic
- Google
- xAI (Grok)
- Mistral
- DeepSeek
- Moonshot (Kimi)
- zAI (GLM)
- Sakana Fugu

All the latest - I update the same day a new model is released. That's my way of testing them. I use the official APIs directly. Which means 9 API keys, 9 different native implementations.

When some bot needs to reply
- the code reads the model name,
- creates an agent that can talk to its official API (9 different ways)
- creates the full context as we talked above (different models need different format)
- adds the response object schema details if I need not just text (different models have different way of enforcing the output format)
- sends it, waits for the response
- validates the response and throws an error if there is something unexpected
- tracks the cost of the request and response: input tokens, cache, output, reasoning tokens
- converts the response to the object, throws an error if something is wrong

Quite a lot, but most of these things are generic for all 9 implementations. So I have them coded once in the [abstract agent class](https://github.com/hiper2d/werewolf-ai-party-game/blob/master/werewolf-client/app/ai/abstract-agent.ts). The interface each vendor has to satisfy is tiny:

```ts
abstract askWithZodSchema<T>(
    zodSchema: z.ZodSchema<T>,
    messages: AIMessage[]
): Promise<[T, string, TokenUsage?, string?]>;

abstract askText(
    messages: AIMessage[]
): Promise<[string, string, TokenUsage?, string?]>;
```

Two methods. Give me structured output matching this schema, or give me text. Everything else - the thinking trace, the token accounting, the provider signature that has to be replayed on the next turn so the model keeps its own private train of thought - rides along in that tuple. Specific details of how to make calls to OpenAI or Anthropic are coded in [their own implementations](https://github.com/hiper2d/werewolf-ai-party-game/tree/master/werewolf-client/app/ai).

I like this approach, I can use all the latest APIs for all models, don't depend on proxies like OpenRouter. And I have full transparency of cost.

So, a cost of each game really depends on the selected models and how long this game is. Active users can spend $5 a day. I pay for that, I provide most models for free - only the most expensive ones (monsters like Opus, Fable, Sol, Fugu Ultra) require a user to buy some credits and pay for their use themselves. I don't have that many users, so nothing to worry about really.

But it is expensive. Even cheap models can burn a lot on API in case of user spikes. And usually you want expensive models - they play better, they are more creative, their role-play is richer. So, good AI in games is expensive. And it's slow - most of models take noticeable time to reply. The performance is not consistent - nobody, none of 9 companies guarantees any SLAs. I can tell more - even models in Cloud like AWS don't guarantee that.

I also have voice (both text-to-speech and speech-to-text). I use cheap APIs from OpenAI, but they can add few extra bucks to those average $5. I let users replay nights and delete messages from a day which can make a game much longer. It's fun though - you can retry different messages to see how bots react to that. Without risking waste a game.

But again - I don't have many users, so nothing too concerning. At this point, I'm fine to pay for those who is ready to try it. Seeing people trying what I built is quite great.

## Next: how good is AI at this?

This is it, this is the main question I wanted to answer when I started building this. And it needs its own article, because the answer is not "good" or "bad" - it's a list of very specific and very strange behaviors.

The short version: it's very much playable, but... I still see lots of room for improvement and further experimenting. I'm just a little exhausted and I want to move on to a next project. I don't have a user community to motivate me to keep pushing this one. The game is in a good shape, and I have some AIs to maintain it autonomously. It's just that as a creator, I still can see the limitations coming from the modern LLMs.

The next article is about those limitations, and what they look like from the inside. Whether they're okay killing each other, which ones are actually good liars, what happens when a user tries to make one of them write Python, and what happens when a user tries to make one of them fall in love.

And my favourite one. Seven players alive, exactly one werewolf left. I asked the doctor, the detective and the maniac to reveal themselves, because with that much information on the table we could simply calculate who the wolf was. All three refused. They told me I was crazy.

In the meantime: [aiwerewolf.net](https://aiwerewolf.net). Bring your own theme.

![A wolf in a black three piece suit sitting at a polished table in a candlelit library, one clawed hand around a glass of whiskey, looking straight at you](/images/werewolf-arch-outro.jpg)
