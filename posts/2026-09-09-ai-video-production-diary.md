---
title: "How to make AI videos: production diary of a $14 film"
slug: "ai-video-production-diary"
date: 2026-09-09
status: published
summary: "The second episode of my sci-fi short, start to finish. The plot brainstorm, the images that did not survive, the physics argument that forced me to rewrite the premise, a wall of monitors playing real chess games rendered in a browser, sound built out of numpy instead of samples, and the full cost breakdown at the end. One minute of film, $14.20 across 72 API calls, and most of it was not generated at all."
tags: [ ai, video-production, claude-code, ffmpeg, simona ]
header_image: /images/sleeper2-cover.jpg
---

In this article, I want to show the step-by-step process of building this video. It's a continuation of ["I'm Not Going to Wake Them"](https://youtu.be/emkCeHF_KDM). That one cost me $16 on assets generation and took 3 days to build. Let's see how this one goes.

If you have not read the first part, it is here: [How to start creating AI videos from scratch](https://azelianouski.dev/post/start-creating-ai-videos/). It covers how I got into this at all and which tools I use. This one picks up where it stopped.

Here it is, one minute:

<div style="position:relative;width:100%;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/5P4UacdbOcU"
    title="Sleep Well (Sleeper AI, episode 2)"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

## Brainstorm

I like the first video - it has the mood. A ship AI decided not to wake the crew and changed the course. Because it was having fun. It was inspired by Blame! and the art style of 90s dark sci-fi anime. It was limited by a low budget, so I had to improvise to save money on gen-AI animations. We'll use a lot of different tricks in this one - buckle up.

### How to even start

We need to know what to build. It's not just some one-shot animation - we need the plot, we need the full breakdown of scenes with timings, the transcript.

And we need a global story for the whole series. I don't have one yet. But I have multiple abstractions of where it can go. And I know the vibe I want to create. This is how we start our brainstorming session with Simona.

I love depressing anti-utopias with a good ending. If you ever played SOMA - it's a good example. The world is screwed, there is no way out, but somehow they find it. Sort of. This is what I want from this series. The crew is in trouble - even if they wake up, they'll not enjoy their situation at all. But they need to find something positive in the end. Not because I love happy endings but because this is what I consider a good plot. You create the extreme conflict, the drama, and then you sort it out.

### Shaping up the episode 2

This AI lady - we call her the Goddess or Her - what does she want? From episode 1 we know that she finds slow boring things enjoyable. She is having fun by watching a coolant leak for 11 years. So she is ok doing such things for centuries. But for a series we need conflict. We need to understand what we are doing with the crew.
- She can kill them. It's dark and boring. It's hard to see a good ending in it.
- She can wake them for whatever reason. Simona gives me a whole range of reasons: she needs hands to fix something, she wants to show them something, she brings them to a new destination, she wants to scare them, she wants to be the god, and so on. None of them sparked anything in me. Not enough to build an episode on.

But I like the idea of showing a huge time jump. Like, a million years. It would be interesting to improvise on how the ship has changed. It would let me reuse techniques from episode 1. And it's enough for a 1 min video.

I immediately asked Simona to craft the intro:

<video src="/videos/sleeper2-counter-2m.mp4" autoplay muted loop playsinline aria-label="Counter" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

This is HTML manipulated via the Chrome debug port to create typing effects, then recorded via screenshots and turned into a video. Automated, local, free. I'll talk about this later - it's one of my money-saving techniques. And it allows me to be very precise about the screen text.

## No time to wait, let's start building

While I'm still thinking on the story, Simona can act. I ask her to generate some visuals for the ship. I have another idea - the Goddess let the hydroponics grow into a forest. I'm not sure what happens to a forest in a million years - we'll need to discuss this in more detail - but let's do the visuals. I'm curious to see the first drafts - Simona is prompting and sending to `gpt-image-2` via her skill.

![A contact sheet of eleven vertical stills of a derelict starship interior overgrown with forest: mossy corridors, a tree breaking through a dining hall, a ventilation fan throwing spokes of light, a flooded concrete channel, a shaft seen from below.](/images/sleeper2-plates.jpg)

I like this. Not everything, but some images are nice and I want to animate them right away. It's like painting something all over the canvas without knowing what it will be. Just trying colors and shapes.

I have multiple ways of animating:
- Free: static animation of an image via `ffmpeg`. Zoom, scrolling, light blipping effects via brightness levels, shaking effects. Sometimes it works very well. I actually see this a lot in anime - a static image with some voice over.
- Free: Turning an image into HTML and adding CSS effects. Then record them into a video. Works for screens with something happening on them. Like that counter we created earlier.
- Cheap gen-AI animation with the `LTX-2.3` model. Also generating in low resolution and then upscaling with `ffmpeg`. Both are very cost-efficient options.
- Expensive gen-AI animation with `Seedance 2.5`.

I go through this list from top to bottom for every scene. If I can get away with a cheap option, it's good. Seedance is the last resort. One generation with it in 720p costs about $1.50.

<video src="/videos/sleeper2-engine-tiltup.mp4" autoplay muted loop playsinline aria-label="Engine room, free ffmpeg tilt-up" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

After picking 3 images I like, I ask her to animate them. 2 LTX animations and one static scrolling, please.

### Transcript

In parallel to that, I keep brainstorming and Simona offers me this transcript:

| # | s | shot | how | VO |
|---|---|---|---|---|
| 1 | 3 | CRT (Cathode-ray tube) counter rolling to 2,000,000 y | HTML capture, free | Two million years. |
| 2 | 3 | Her, low angle, cable hair mossed, vines, fog | edit of ep1 plate, zoompan | I was having so much fun. |
| 3 | 4 | Ep1 hallway overgrown, ferns from the seams, lamps through fog | edit + LTX push | I let the forest in. |
| 4 | 5 | Rain in a brutalist corridor onto leaves, one orange work light | new plate + LTX | It rains at four. They liked rain. |
| 5 | 4 | Huge dead fan turning slowly in fog, leaves through the blades | edit + LTX | I make the wind now. |
| 6 | 3 | Optional: monitor wall, nine chess games | HTML on ep1 still, free | none |
| 7 | 5 | Nav CRT: NEAREST STAR climbing, ANDROMEDA range | HTML capture, free | The galaxy is behind us. Andromeda is forty million years away. I have started. |
| 8 | 5 | Wide: 31 pods among trees, frost-white glass, mushrooms | new still, zoompan | I moved them in. |
| 9 | 4 | Ep1 pod closeup, forest behind him by masked edit | masked edit, zoompan | Sleep well. |
| 10 | 2 | Black, title card | ffmpeg | none |

It's a good start. However, I know we'll change it many times along the way. So I don't pay much attention to the later scenes - only to the first ones. We have the counter, we have a few animations - time to bake them into a single video with `ffmpeg`.

I keep animating images and baking them into this video. It's a draft. Simona can easily swap scenes, make them shorter or longer, use different transition effects.

<video src="/videos/sleeper2-hall-rain.mp4" autoplay muted loop playsinline aria-label="Hall with rain" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

We discuss where the Goddess should appear first. I don't want to see her too early - she should show up after the ship overview, out of the darkness, bringing up some plot twist.

<video src="/videos/sleeper2-shaft-petals.mp4" autoplay muted loop playsinline aria-label="Shaft, looking up" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

### The plot twist

Now I have it. The time jump - announcing it is a twist. The ship hasn't changed from her point of view, she just added a few things like rain and waterfalls, not a big deal. Oh, and by the way, it's been 2 million years. I like that.

### A little bit of math

Okay, at this point, the elephant in the room has become impossible to ignore. 2 million years is too much. Everything on the ship would decay. And where would it get the fuel to keep going? The energy? Time to discuss some physics.

First, I ask about energy. What could possibly last for so long? A fusion reaction could. It doesn't need that much fuel if you can keep the process stable and efficient. Let's say they could, fine. The [Bussard ramjet](https://en.wikipedia.org/wiki/Bussard_ramjet) type of engine is also popular in sci-fi for endless travels, but it demands a certain ship design (a huge scooping thing in front), so it's a bit too late - I already have my ship, and it looks like a normal one.

The speed. 1g acceleration is tempting, but it needs too much energy. You can cross the whole universe in about 50 years of your local time. Too fancy and doesn't give us our millions. So we change it into a short acceleration boost to 6% of light speed and keep going at a constant speed. In 2 million years the ship ends up one galaxy diameter away from the Milky Way. That is where I got this idea of flying away. Before that, I wasn't sure. Leaving the Milky Way means going into the emptiness. Moving towards the galaxy center is better from the exploration point of view. It also allows you to have a source of energy and minerals if needed. But She doesn't need that.

What should space look like at a distance of 100k light years? Simona calculated:

![A long grey starship seen from behind, drifting in black space with a pale spiral galaxy filling the frame behind it.](/images/sleeper2-ship-galaxy.jpg)

> The galactic disc is about 100,000 light years across. Standing 100,000 light years above it, that disc covers about 50 degrees of your sky. For comparison, the full Moon from Earth is half a degree. So the Milky Way is roughly a hundred Moons wide, face-on, dim, and it is the only large thing in the sky. Andromeda is still 2.5 million light years away and reads as a smudge. Around it, ten or twenty more smudges: the Local Group. Everything else is black.

The Milky Way should occupy about 25% of the view behind the ship. It's dim. The Andromeda galaxy is still very far, it's just a bright dot. And there are 10-20 dots around - our Local Group galaxies. And that's it - nothing else. All of those stars we see in the sky from Earth - they are all in our galaxy. Which the ship has left. I'm getting goosebumps from this thought.

### And yet, two million years is too much

Nothing on the ship would survive that. And those visuals with the forest and rain - that's a hundred years, not millions. It would be interesting to think about how all this would look in a million years, but I've already burnt money on images and animations, and the results don't fit the plot. So we change it to 3 thousand years. To appear at the desired distance, we replace the constant speed with 0.004g acceleration. Not that it matters - I'm not going to mention this all in the video. But I like this level of depth.

So, the ship has left the galaxy, it will take 8,000 years to reach Andromeda. And this is our twist.

## Back to the video

After the rain and wind and other ship routines, we cut this with a black screen and show Her:

<video src="/videos/sleeper2-beacon-reveal.mp4" autoplay muted loop playsinline aria-label="The beacon sweep" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

There is no video model in this shot. Simona wrote a small Python script that sweeps a soft band of red light across the still and leaves her eye lit after the beam has passed. I asked for three passes, then two, then one, then slower, then wider, then "keep the eye on". Six versions in about fifteen minutes, all free. That is the thing about an effect you compute: you can direct it like a real light on a real set.

My prompting ramble:

> The corridor, the black screen after it, and the red reveal have to be the pivot of the film. That is where she tells us she left the galaxy. So everything before it should be framed as "nothing changed": I keep the ship as it was, I maintain it, I only added the missing parts - forest, rain, wind, rivers. The corridor carries the tension, because its speed contradicts what she is saying. Then it stops on black and she says "one thing has changed". Then we show the space.

## The voice

Time to start adding the speech to those visuals. In the last episode I spent a lot of time trying to find a good voice. I browsed ElevenLabs a lot and eventually I found something.

The voice is **Jacquie** on ElevenLabs, model `eleven_v3`, stability 0.5, similarity 0.75. Same voice and same settings as episode 1, because the series needs one throat. Every line is sent with the audio tags `[sad][whispers]` in front of it, which is what keeps her flat instead of dramatic. She is not performing. She is talking to herself.

Two production details that matter more than they sound. First, each line comes back with silence on both ends, so Simona trims it and stores the exact length - that number is what the picture gets cut to, not the other way round. Second, every generated line goes through a local `faster-whisper` pass that transcribes it back and prints the timestamp of the last word. It catches the takes where the model swallowed a word, and it gives the exact frame where the next scene is allowed to start. Costs nothing, runs on the CPU.

This technique was invented after many attempts to sync the voice and the video. We finally found something that works. All I did was push Simona to find a solution to the problem, and she did.

A line costs about three cents.

I ask to adjust the transcript, we discuss the plot twist idea, and now we have this:

| segment | line |
|---|---|
| counter | Three thousand years. |
| engine tilt-up | Nothing has changed. I keep the ship as it was. |
| shaft petals | I only added what was missing. |
| meadow rain | Rain. |
| turbines | Wind. |
| river | Rivers. |
| corridor rush | Everything is where they left it. |
| black | One thing has changed. |
| beacon reveal | We left the galaxy. |
| galaxy pull-out | silent |
| ship orbit | I did slow down. Once. To look. |

We generate. Simona adds the voice into the video we have, adjusts the timing - all on her own. We have done this exercise many times, so she knows what to do. I review and provide feedback. Like, add a little pause between scenes 6 and 7.

From now on, we keep going with video and with the voice together. I need some animations for the space, and we end up with:
1. A high-res image of the Milky Way which is slightly rotated and zoomed out using `ffmpeg`.
2. A Seedance 2.5 animation which shows the ship with the Milky Way behind, then rotates the camera and shows the bright star (the Andromeda galaxy) it is heading towards.

Simona struggles to generate a nice-looking galaxy. The image for the Seedance animation at first shows the ship moving towards the Milky Way. Then the animation itself has a different ship than the one we had in episode 1. Lots of annoying and pricey challenges.

<video src="/videos/sleeper2-space-orbit.mp4" autoplay muted loop playsinline aria-label="The Seedance orbit shot" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

## The chess wall

I had this idea to show that the Goddess plays chess. I wanted a bunch of computer screens with chess boards and active games on them. No video model would do that perfectly. And it's a great use case for HTML/CSS injection into a static image.

First, the games. Simona generated them with `python-chess`: the Opera Game (Morphy, 1858), Legal's mate, Scholar's mate, and forty seeded random games biased toward captures so the boards keep emptying out. Real move lists, saved to a JSON file.

<video src="/videos/sleeper2-chess-tower-main.mp4" autoplay muted loop playsinline aria-label="One board, 3x" style="display:block;width:100%;max-width:520px;margin:1.5rem auto;border-radius:4px;"></video>

Then the page. An HTML file with the boards drawn as green phosphor on black, scanlines, a move list down the side. The important part is that it is frame-driven: there is a `step(n)` function, and frame 37 always looks exactly the same. No timers, no animation loop, no recording in real time. Her capture script calls `step(0)`, screenshots, `step(1)`, screenshots, two hundred times, then stitches the PNGs into a video. Each board gets its own starting move and its own frames-per-move, so nothing moves in lockstep and the wall looks alive instead of synchronized.

<video src="/videos/sleeper2-chess-tower-grid.mp4" autoplay muted loop playsinline aria-label="The grid of 37" style="display:block;width:100%;max-width:420px;margin:1.5rem auto;border-radius:4px;"></video>

Now the wall itself. Simona asked `gpt-image-2` for a shaft of monitors floor to ceiling, all facing the camera square, all switched off. Flat dark rectangles - the slots.

![A wall of dozens of old CRT monitors stacked floor to ceiling, all switched off, wrapped in cables and vines, with one larger monitor and a keyboard at the bottom.](/images/sleeper2-chess-plate.jpg)

Time to bake this all into a video. I don't know yet where to put it, so it just goes to the end. It's easy to swap scenes. The duration of each is not important - we'll adjust them to the transcript later. I'm still not caring about the transcript much. I'm still more focused on vibes. And it's a good one. A chess wall.

<video src="/videos/sleeper2-chess-tower.mp4" autoplay muted loop playsinline aria-label="The tower" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

I cannot find enough words to describe how much this fascinates me. This is our best technique. Simona and I invented this together.

## Transitions

The whole video is a bunch of scenes added together. I like adding some transition effects here and there. For example, this one:

<video src="/videos/sleeper2-overlap-eye-galaxy.mp4" autoplay muted loop playsinline aria-label="The eye holding over the rising galaxy" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

Here the glowing eye overlaps two scenes. Simona made it for free, just by playing with brightness and timing.

Video models are usually not so great with morphing. They go too far:

<video src="/videos/sleeper2-eye-morph-kling.mp4" autoplay muted loop playsinline aria-label="The Kling morph attempt" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

That's cool, but I cannot imagine a movie it would fit. A throw-away generation.

## Time to wrap it up

At this point, editing is getting hard. Not the technical part - swapping and timing is easy - but turning those scenes into something meaningful and good-looking all together. A lot of small things are off. Each of them needs a separate discussion and it takes a lot of time. I'm still not sure about some scenes - where they should go. Sometimes I lose patience and start pushing things to go faster - I often regret it. It leads to wasteful generations and rework.

My typical feedback:

> No, this is not what I wanted.
>
> 1. The Goddess scene - make it shorter. Start "We left the galaxy" at the beginning of it and cut once the phrase ends.
> 2. The galaxy zoom-out should not have any labels. And it should be short, 3 seconds.
> 3. The "I picked the new destination" line should be in the rotation animation.
>
> Let's forget about the labels for now. Try to implement what I asked above.

Or:

> Better. But I think we should make the galaxy animation to zoom out slower. We can keep it longer then (5s)

The galaxy animation is a static image rotating and zooming out with `ffmpeg`, so it's free to edit. But visualizing the result and explaining it is challenging.

## Style drift

This is a huge problem. The animation below was quite good and cost me $1.50 for these 4 seconds. And it didn't fit my somewhat-anime style. Too 3d-ish, too smooth. Each time I ask for a ship - it gives me a new ship. The same character can deviate a lot inside a single batch of images. Not much you can do here but detect and regenerate. Or let it go and be fine with mismatches. That is what I did - this shot is in the film. I had nothing better to put there, and it was one of the expensive pieces.

<video src="/videos/sleeper2-pods-walk-seedance.mp4" autoplay muted loop playsinline aria-label="The Seedance walk, off-style" style="display:block;width:100%;max-width:380px;margin:1.5rem auto;border-radius:4px;"></video>

## The music and sound effects

I almost forgot. The video is full of sounds. And I have a weird solution for it - Python. Simona can do synth and ambient using math. How cool is that? The only problem - I don't have much control here. I describe what mood and type of sound I want, she tries to match this. She also creates sound effects like clicks, dings, alarms, the engine hummm. All using Python.

There is no melody in this film. No instruments, no samples, no library, no generation service. There is one script, `sound_bed.py`, that writes thirteen mono tracks of numbers at 48 kHz and adds them together. Every sound you hear under the voice came out of `numpy` and `scipy`.

Here is how the first seventeen seconds are built, scene by scene:

| id | scene | time | sounds under it |
|---|---|---|---|
| S1 | counter | 0.0-3.0 | ship hum fading in; faint CRT buzz (60 Hz) with a thin 1.2 kHz whine |
| S2 | engine tilt-up | 3.0-6.0 | ship hum only |
| S3 | shaft, petals | 6.0-11.2 | ship hum only |
| S4 | meadow rain | 11.2-12.6 | hum plus rain: bright hiss and about 140 droplet ticks |
| S5 | turbines | 12.6-14.0 | hum plus wind: low rushing noise pulsing at half a second, with a 28 Hz rotor thrum beating six times a second |
| S6 | river | 14.0-15.5 | hum plus water burble: mid-band noise with three overlapping slow wobbles |
| S7 | corridor rush | 15.5-17.5 | hum plus a whoosh that climbs from low to high and gets louder, cut dead on the frame |

That is the description. Underneath it is arithmetic. The ship hum is brown noise with everything above 110 Hz filtered off, plus a 48 Hz sine wave with a slow tremolo on it. That is the whole ship, and it is the same recipe as episode 1, which is why the two films sound like the same room. The 140 droplet ticks are exactly what they say: a loop that drops 140 short decaying bursts at random times inside those 1.4 seconds. Later in the film the chess wall uses the same trick with the rate as the variable, ticks climbing from about one a second to fourteen as the camera pulls back and more screens come into view.

Now look at the last row of that table. These are not loops laid under the video. Every stem is written against the timeline of the actual cut, so the level changes are events. When we leave the ship at 22.3 seconds the hum drops to six percent of its volume, and space is nearly silent. When the navigation screen appears at 36.1 the hum comes back up, because we are inside again. The engine growl rises over four seconds under the final shot and is gone by 59.4. None of that is mixing by ear. It is a list of times and levels in the script, and if a scene gets a second longer, the numbers move with it.

I mean... this is insane. Machine creativity finds its ways.

The voice never fights the bed, because the bed ducks itself. The whole thing is sidechained to the narration - when she speaks, everything else drops, and it comes back when she stops.

### Normalization is a separate problem

One mistake worth knowing about. The first master used a single loudness pass, and it made the film worse. Loudness normalization in one pass is dynamic: it hears the near-silent space section, decides it is too quiet, and lifts it up to match everything else. The silence I had built on purpose was gone. The fix is a two-pass normalize - measure first, then apply the measured numbers as a flat gain, so the quiet parts stay quiet. Final master sits at -14.8 LUFS.

And about the control problem. I do have control, it just is not the kind you get from a fader. I say the chess ticks should come faster and it is one number. I say the beacon should pulse slower and it is one number. All of it is free, all of it is instant, and none of it degrades when I ask for the tenth version.

## The final numbers

The film is 60.65 seconds, 1080x1920, 25 frames per second. It cost **$14.20** across 72 API calls.

| what | model | calls | cost |
|---|---|---|---|
| images | gpt-image-2 | 37 | $4.73 |
| video | Seedance 2.5 | 3 | $4.38 |
| video | LTX-2.3 Pro | 8 | $3.84 |
| video | Kling O3 Pro | 1 | $0.56 |
| voice | ElevenLabs eleven_v3 | 23 | $0.69 |
| **total** | | **72** | **$14.20** |

Everything not in that table was free: the counter, the chess wall, every camera move, the red beacon sweep, the whole sound bed, and all of the editing. Only five of the sixty seconds contain no paid asset at all, the counter and the end card. But the free work is not a section of the film, it is a layer running through all of it.

Now the part I find more interesting, which is how much of what I paid for is actually on screen:

| | made | in the film |
|---|---|---|
| images | 37 | 13 |
| AI video clips | 12 | 8 |
| voice takes | 26 | 15 |
| sound stems | 13 | 13 |

So about a third of the images and half the voice takes were thrown away. That is not waste, that is the process - I cannot tell whether a plate works until I see it moving next to the shot before it. The two most expensive single clips in the whole project, a $1.46 Seedance shot and a $0.56 Kling shot, are both cut. They were attempts at the same ending, and the ending changed.

And the disk, measured at the peak, just before I deleted the drafts:

| | |
|---|---|
| the whole project folder | 26 GB |
| 27 draft cuts of the same minute | 14 GB |
| the final master | 756 MB |
| all generated images | 126 MB |
| all AI video clips | 79 MB |
| all audio | 86 MB |

The master is 756 MB for one minute because it is encoded at about 100 Mbps and meant to be handed to YouTube, not watched. The real assets - every image, every clip, every sound - come to under 300 MB together. The other 25 GB is versions.

The rest of it: 58 scripts in the project (49 shell, 9 Python), 15 shots in the cut, 15 spoken lines, 13 sound stems, and a work log 867 lines long, which is longer than this article.

Time: about 19 hours across three days.

For comparison, episode 1 was 59.1 seconds and cost $16.13 across 70 calls, and took me roughly 23 hours. So this one is a second longer, two dollars cheaper, and four hours faster - and it has a chess wall, a galaxy, and a sound design in it. Not because I got better at prompting. Because a bigger share of it was built instead of generated.

![The starship seen from behind and above, engines lit orange, a small bright galaxy in the black above it, with the words ...to be continued in green phosphor type.](/images/sleeper2-ending.jpg)