---
title: "How to start creating AI videos from scratch"
slug: "start-creating-ai-videos"
date: 2026-08-29
status: published
summary: "A year ago I couldn't see myself making videos at all. Now I do, and I enjoy it. It's a long process with a lot of planning and visualization in my head. Most of the work is outsourced to AI, but the vision and the directing are mine. I want to describe my process from zero. No tools or workflow - I'll show how I started and where it got me."
tags: [ ai, video-production, claude-code, simona, ffmpeg ]
header_image: /images/aivideo-cover-terminal.jpg
---

This is work I'm proud of:

<div style="position:relative;width:100%;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/6IFo_Z5Kcwc"
    title="I turned my AI game into a 90s sci-fi anime"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

It's a snapshot of something that lived in my head with no way out. Until recently. AI made it possible. Sure, this video holds less value than something created manually. But for me, it's a choice between using AI or not doing it at all. And it's not so easy to build, actually.

This is what it took:

- three days
- $15
- 3 GB on disk, 1.3 GB of that scrap
- 1,799 files, 1,480 of them temporary, and 1,297 of those single PNG frames
- 125 video files in the clips folder. One of them is the film
- 72 voice takes generated, 8 in the final film
- 16 images, 13 on screen
- 9 video-model renders, 7 used. The two I threw away cost $1.65, which is 11% of the budget
- a 21,248-word worklog across 67 logged steps, for a 42-second film
- tons of nostalgia

So, even with AI, it's not 3 clicks and a few bucks.

This turned out too long for a single post, so it's split. This part is about the machine that
makes the videos. The next one is about directing it.

## First, we need to talk about AI video in general

When people hear "AI video" they imagine something like
[Gossip Goblin](https://www.youtube.com/@Gossip.Goblin),
[Jurassic Smoothie](https://www.youtube.com/@Jurassic_Smoothie),
[Doopiidoo](https://www.youtube.com/channel/UC-qfMIqavKGTyp9E4m3UuVw).
To me, those guys are artists with their own style and technique. Not everybody can reach their level. It's also very expensive.

My video is different. Only 35% of it came out of a video model. The rest is static images with
camera moves added afterwards, and screen recordings of the actual game running in a real browser.
That keeps the cost down, and it lets me put cinematic shots and a working web app in the same cut -
which also works for diagrams, code listings and other practical things. I can go full cinematic if
I want to. But it's going to cost me.

> What model do you use?

This is the first question I usually hear. It's the wrong one.

I'll get to the models, but that's not where you start. First you need the automation. I don't do
any of this by hand - I'm the brain and the creativity, AI is the arms. So we start there.

## The harness

Yeah, that fancy word again. I don't like it. It makes a simple thing harder to understand.

Harnesses came from code assistants. My Claude Code can write code and run bash, and that combo is
enough to rule the world. Or to make some videos for me.

It all started with a simple ask.

> Can you take some images in the folder and turn them into a video?

And magic happened. Claude downloaded a small console program called `ffmpeg` and turned three images into a slideshow. And added slow zoom effect on each as a little extra. Well, okay, what's so magical about a slide-show? The editing. With this `ffmpeg`, Claude Code could edit any video. Cut it to pieces, extract any frame, edit it and put back, upscale, change the speed, work with sound, add text and effects... All of that in a small console program.

AI won't be extremely proficient at it in the beginning. But we can teach it.

> Wait, do I need Claude Code? A subscription?

Yes and no. You need a capable model in a good harness (a code assistant). It can be Codex, Claude Code, Gemini CLI (antigravity-cli), Grok Build, DeepSeek Harness, OpenCode, Pi Agent - the list is long. But you need something capable of working in a terminal on your computer. I'm a Claude Code fanboy, I pay $100 monthly for this. I don't recommend it - I think Codex gives you more for the same money at the moment. If you only have $20 a month, Gemini would be a good choice.

But you need a good harness on your computer. So you can ask it to create a slide-show from 3 images, and it's capable enough to download `ffmpeg` and do that.

### Skill training

Another important reason for a good harness is ability to remember successful attempts in `skills`. I think the world doesn't talk about `skills` enough. It did talk about `MCP` a lot - `skills` are better. Whatever harness you choose, make sure it supports skills.

A skill is basically a lazy-load prompt. It's a single .md file in the right location with a description and some text content. Here is an example of one:

```md
---
name: video-editing
description: Create videos from images and audio using ffmpeg. Use when the user asks to make a video, combine image with voice, or create video content.
---
## How it works

Uses ffmpeg to combine static images with audio tracks into MP4 videos.

## Modes

### Mode A: Image + Audio → Video (most common)

Combine a single image with an audio file. The image displays for the duration of the audio.

ffmpeg -y -loop 1 -i IMAGE_PATH -i AUDIO_PATH \
  -c:v libx264 -tune stillimage -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -shortest \
  -movflags +faststart \
  OUTPUT_PATH

...
```

This file contains examples of commands, my typical requests, mistakes and problems we encountered, input and output directories - everything the basic Claude Code without the skill cannot know. Claude Code only loads this tiny description of all skills it has. When it sees from the discussion that the skill body might be useful, it loads it dynamically.

And the main part - I haven't typed it myself.

At some point, I asked Claude Code to create a skill about video editing with `ffmpeg` so we can remember useful commands. When it first tried to edit a video, it didn't do it right. It checked the docs, tried a few things, got my feedback - we spent some time getting the correct result. And the exact steps to achieve this result became a part of the skill. We remembered the successful path.

This is why I call it the training process. Claude Code learns what I want and how to get it, then remembers it in skills. I never touch those skill-files. 

> Hey, that's a cool zooming effect - add it to the video skill

After zooming, we discovered my other effects. Claude Code can take a large image and scroll it in a smaller viewport in any direction. It can zoom in and out in all possible directions. It can apply different transition effects between images - all of that went to my `ffmpeg` skill. So next time I can say

> Take a web page screen shot so its entire vertical content is captured and create a video of scrolling it down

And it creates a video as if someone is scrolling the page. A nice trick I use a lot. For example, here I scroll the page: https://youtu.be/nwHEuNbRXXQ?t=46 

### A library of scars

There is a phrase

> Skills is a collection of scars

I have a lot of skills - for video, voices, images, APIs. I even have a skill about filling my taxes. None of them were created by hand. Claude Code created them, Claude Code maintains them. Those skills keep growing, so it's on you to ask the harness to compact and clean them up from time to time. Or split into more granular skills.

Many of them require additional programs Claude Code creates for itself along the way. For example, it created a whole `cli` program to work with Youtube and put the examples of using it into my `youtube` skill:

```md
# Get transcript (plain text - compact, best for analysis)
uv run python mcp/youtube/cli.py transcript "URL" --format text

# Get transcript (JSON segments with timestamps - for precise time references)
uv run python mcp/youtube/cli.py transcript "URL" --format segments

# Get transcript for a time range
uv run python mcp/youtube/cli.py transcript "URL" --format text --start 60 --end 300
```

These programs and skills are valuable. That's the result of a journey, of many chats with your AI. And it's portable. It's all markdown files and small command-line programs, so if I ever left Claude Code I'd have to rewire how they get loaded, but I wouldn't lose any of it.

## Hey, I thought this article was about AI video!

Where was I...

It all started from `ffmpeg` and a skill for it. But then - where do I get images to edit? And video, and sound? It would be cool if my Claude Code could generate them. So I can ask:

> Let's create a slide-show where you explain the game rules. I want minimalistic illustrations matching the transcript in chalkboard style

And it gives me this: https://youtu.be/6x5awI8HRK0?t=28

Okay, not right away. We'll first discuss the transcript, then we'll generate an image or two, then we'll generate the rest of the images. Then we'll turn them into slide-show. Then generate the voice. Then try to match the voice to the slide-show timing. There are some complications here, but first - we need to teach the harness to create assets.

## Asset generation

### Images

My personal favorite is `gpt-image-2` from OpenAI. To add it to your harness, just pass it the doc https://developers.openai.com/api/docs/guides/image-generation and put an API key in .env. The doc page actually lets you copy itself as a markdown file - this is very useful, you click this button and paste it into an .md file which you pass to the harness then. Works better than a URL which it has to scrape.

If you are not sure where to get an API key or where to put it - just ask the AI, it will help.

From my statistics (228 images), the average cost is $0.15 per image.

![A six-panel mood board of dark sci-fi stills: a cable-wrapped android standing in a lit doorway, a cluster of security cameras, a long empty corridor under a single lamp, a ventilation fan throwing spokes of light across a floor, and a wall of pipes and machinery.](/images/aivideo-stills-collage.jpg)

Those are six stills from the sci-fi short at the end of this article. Each one is `gpt-image-2` at 1024x1792, $0.12 a piece. The collage itself is `ffmpeg` compositing them onto a slate background, and that part cost nothing - which is the whole article in one picture.

Once the harness manages to grab your API key and generate an image using the OpenAI API call, ask it to create a skill about this. This improves quality of life in general - it's nice to be able to generate an image when you need it.

You also need your AI to be able to "see" images, but most LLMs these days can do that without any additional models. Claude Code can do that out of the box.

Another good image model is Google's `gemini-3.1-flash-image`, also known as Nano Banana 2. Same thing - pass the doc and API key. It's cheaper than `gpt-image-2`. It's good to have both - variety is nice.

### Video

#### The king

China is dominating here, and `Seedance 2.5` is the king right now. There is no official API for it (and most other video models), so you have to find some intermediate providers. I like [fal.ai](https://fal.ai/) and [EvoLink](https://evolink.ai/).

There are multiple ways of using this model:
- Text-to-video - It's straightforward, but I never use this mode.
- Image-to-video - You attach one or more images and describe how you want to animate them. This is my go-to when I don't need a voice.
- Reference-to-video - You can attach not only images, but also a voice sample. A model will do its best of using the voice sample on a character you want to animate. It will try to do a lipsync as well.
- Voice on and off - Seedance 2+ models can produce video with sound, which is great. The audio is free either way, so it costs you nothing to turn it off. I usually do, and add every sound myself, because then the levels stay under my control in the mix.

#### The king's cost

This thing is expensive. One second costs $0.293 at 720p, $0.136 at 480p. And you cannot buy a short clip: Seedance's minimum is 4 seconds.

Not too terrible, until I give you my real statistics - a minute of Seedance 2.0/2.5 video costs me $39.42 on average.

Here are the main reasons I overpay:
- Poor generation. The thing with AI video is that you prompt and hope. The result might be bad, and you just throw it away and retry.
- AI can make proactive decisions which you don't like afterwards. For example, it might decide to generate multiple videos at a time. And you don't like all of them. It's important to move slow.
- Lip-sync is hard. It isn't always good even with the best models. It's one of the main reasons of re-generation.
- You cannot buy a short clip. Seedance's minimum is 4 seconds, and a film that cuts fast doesn't want 4-second shots. Three shots in my anime short are on screen for about 1.2 seconds each, and each one cost a full 4-second render. I threw away 55% of the generated video just because I didn't need it.

And here is a little story of wasted $9.6. My Claude Code decided to help me with the lip-sync struggle. It started generating Seedance videos with voice off and then apply the sound via additional lipsync model run. It found this model on fal.ai and started using it very actively. The issue is - it didn't work with the werewolf head at all. And it took me some time to figure out what is going on. And ban this approach from existence.

Or at some point Claude Code decided to first generate 480p dry-runs before the final full-size shots (1080p on Seedance 2.0 back then, 720p on 2.5 now). I noticed that we are basically generating each video twice.

This video below cost me $91 in total. There is where I learned about all the things above.

<div style="position:relative;width:100%;aspect-ratio:16/9;margin:1.5rem 0 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/cPpwOJtGilQ"
    title="AI Werewolf - Episode 1"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

It got better after this - I started having far fewer wasted generations. So yeah, expensive learning.

#### Cheaper models

- Seedance 2.0 - The previous king, costs 1.5x less. Supports 1080p. In many cases it generates results as good as 2.5.
- Kling 3 - A close competitor to Seedance 2.0.
- LTX-2.3 - 3.7x cheaper than Seedance 2.5 (2.5x cheaper than 2.0), and it renders native 1080x1920 so there's no upscale afterwards. But it's noticeably worse at following instructions. I asked it for "no blink, no head turn, no smile, eyes narrow then hold" and got a head tilt, a look down, a smirk, and a face that drifted. It obeys roughly the first second. What matters is cost per usable second, not cost per second. I recently discovered that it can do good animations with no humans. There is LTX-2.5 but it's 3x more expensive and I see no reason to use it. And it's open-weight, so you can run it locally if you have the hardware.
- Minimax H3 - Current king among open-weight models. I haven't tried it because providers change too much and it costs almost as much as Seedance.

Models on fal.ai and EvoLink have API docs with examples on models pages:
https://fal.ai/models/bytedance/seedance-2.5/reference-to-video/api
https://evolink.ai/seedance-2-5

### Voice

ElevenLabs is the best. It lets you prompt voice instructions and search for voices in a library. I had to buy a $6/month subscription yesterday because I wanted access to some private voices.

It is more expensive than the voice models from Google and OpenAI, but it's still cheap. One minute of ElevenLabs costs me $0.40 on average, and that already includes every unsuccessful attempt. `gpt-4o-mini-tts` is about 5x cheaper.

Which means voice is not worth optimising. On my last two videos it was 2% and 2.7% of the total bill.

A nice thing to have - a local CPU model called `kokoro`. You can run it on any hardware, it's very light. And it can generate a decent voice for free. It doesn't have that many configurations, but sometimes it's good to have a free voice. Just ask your harness about it - it will download, setup, and create a skill.

### Music

This one is weird. There are AI music services like Suno, but I don't use them. My Claude Code generates sound effects and synth-soundtracks using... Python. I don't know how it does it. It offered me this option, I liked it, and it stuck. I try to describe what type of background sound I want and it tries to code it.

Like this:

<div style="position:relative;width:100%;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/wHPVt-rtMng"
    title="Procedural music, written in Python"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

### Pricing summary

Here is the full breakdown for the tutorial video above. It's my longest one and the worst from an economy point of view.

Five minutes forty-four seconds. About **$91** across roughly 150 API calls.

| where it went | cost | share |
|---|---|---|
| video generation | ~$77 | 85% |
| images | ~$9 | 10% |
| voice | ~$5 | 5% |

That 85% is the whole lesson. Images and voice together come to $14, and most of that was thrown
away too. But the video generation was a money pit.

Another important take: only about **$40 of that $91 is in the final cut**. The
rest went to finding the shot - retakes, dead ends, draft experiments, and the lip-sync detour
above. You don't know a shot is wrong until you watch it move.

At the same time, the third of my anime short from the beginning of the article is static images with `ffmpeg` camera moves over them, and another third is screen recording. That two thirds cost nothing at all. So before paying a model to animate something, check whether a slow push on a static frame does the same job. Very often it does - and it does exactly what you asked for, which is more than the
video models manage.

And the storage. **2.6 GB of working files produced an 86 MB video**, about 30 to 1. Most of that
is 3,012 PNG screenshots taken frame by frame to animate the real game UI, because the app has no
export - every "typing" and "scrolling" effect in that video is a sequence of real screenshots. But I'll leave it for the next article.

$91 for a 5:44 narrated, character-acted explainer that I barely touched by hand. That's a lot of
money for a tutorial nobody may watch, and it's absurdly cheap for what it is.

## To be continued

The article is getting way too long, and I think it's a good idea to split it.

In the next one, I'll tell about the directing. I'll walk you through the process of using a harness with all the skills ready. Why it takes me days and what is in those 3GB of raw materials.

Oh, and there is one more important thing - the browser recording. It sounds boring, but trust me - you have no idea how powerful this thing can be. AI can create any web-pages, manipulate the content, create all sort of CSS animations and transitions, record and then inject this into the video.

There is a computer screen with text appearing on it in the video below. It's actually an HTML page, the text is injected character by character, then the whole thing is put inside of a static image. This is pure craziness to me and a common Tuesday for my AI:

<div style="position:relative;width:100%;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/emkCeHF_KDM"
    title="I'm not going to wake them"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

This is my best work, by the way. I published it yesterday, after I completed the draft of this article, so it only made it into the ending. $16, three days of work. I think I'll focus on this exact video making process in the next part.

See you next time.

![A wolf in a black three-piece suit sitting at a polished table in a candlelit library, one clawed paw resting on a glass of whiskey, looking straight at the camera.](/images/aivideo-host-whiskey.jpg)
