---
title: "My video generation pipeline that built itself"
slug: "building-werewolf-rules-video"
date: 2026-06-07
status: published
summary: "Two minutes of cinematic AI video, built across two months with my AI sidekick, all through a casual conversation. Every image, voice, and frame generated — and the tools built themselves along the way."
tags: [ai, video-production, claude-code, simona]
header_image: /images/building-werewolf-rules-video.jpg
---

Let me show you something cool. This two-minute video was built by Claude Code from a single prompt.

<div style="position:relative;width:100%;aspect-ratio:16/9;margin:1.5rem 0 2rem;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/6x5awI8HRK0"
    title="How to Play AI Werewolf — The Rules in 2 Minutes"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

Okay — one prompt and about thirty follow-ups. And then twenty more after Claude Code fumbled a git command and wiped out half of my video-editing material (don't ask). But it's still pretty cool, because I didn't do a single thing by hand. No image editor, no video timeline, no audio software, no clicking around in a tool. It was just a conversation between me and Claude. And all the tools it used along the way — for generating the images, synthesizing the voice, editing the video, the glue code that ties it together — Claude built for itself.

This is not the greatest video in the world, but I think it does its job — explaining the rules of my [side project](https://aiwerewolf.net) — quite well. The two of us made it: me and [Simona](https://github.com/hiper2d/simona-ai-computer-operator), my heavily customized Claude Code setup. I made the directorial calls — *those highly detailed images don't work, try a chalkboard instead* — and she did everything else.

"Everything else" is a kit of *skills* — small, self-contained tools Simona reaches for the way you'd reach for an app:

- **Image generation** — OpenAI's `gpt-image-2` and Google's Nano Banana 2 (`gemini-3.1-flash-image`), for every still in the video.
- **Image-to-video** — turning a still into a few seconds of motion. A separate skill per model: Seedance 2.0 (the workhorse here), Google's Veo 3, Kling 3, and LTX-2.3.
- **Voice** — a skill per model: ElevenLabs for the final narration (priciest, best), Google's Gemini TTS for cheap drafts, and Kokoro running locally for free dry runs.
- **ffmpeg** — the editing layer under all of it: the cuts, the zooms, the crossfades, the audio mix.
- **Director** — the meta-skill that ties the others together: it knows the whole pipeline, so a single high-level ask can fan out into image, voice, video, and edit steps in order.

It's way simpler than it sounds. The rest of this post is how we built it.

The whole thing is reproducible from the project's `WORKLOG.md` alone, which is over 900 lines and contains every prompt, every model call, every cost, and every fix. I'll quote from it where it makes the story sharper.

## The pipeline that emerged

<p class="section-gist"><em>It grew out of one trivial request, one skill at a time.</em></p>

When I started, I had nothing. No pipeline, no skills, no plan — just a Claude Code session and a few images sitting in a folder. My first ask was almost trivial: take these images, show them one after another, and play a voice reading the narration over the top. That one request is what kicked everything off, because to pull it off Simona needed two things she didn't have yet — a way to make the voice, and a way to stitch it all into a video.

### Voice first

So the first skill we built was **voice**. I found a text-to-speech API, pasted its documentation straight into the session, and told her: the key's already in the environment, read this, get me one line of spoken audio. She fumbled for a minute, hit a wrong parameter or two, and then a WAV came back. The moment it worked, we froze that path into a skill — a little directory with a `SKILL.md` explaining how and when to use it, and a small Python CLI wrapping the call — so she'd never have to rediscover it. That recipe (paste the docs, make one successful call, write down the path that worked) became how every later skill got built.

Wiring up the skill was the easy part. Picking the actual *voice* was the surprisingly hard one. Apparently, describing a voice in words is not easy. "Deep, warm, a little sinister, older British man" gets you a dozen different readings, none of them the one in your head. So I went through ElevenLabs' voice library by ear instead, and landed on George, a British storyteller voice. He wasn't a werewolf host out of the box, so we pitched him down about 15% and ran him through a hall-echo filter, and suddenly he sounded like something with too many teeth narrating from the far end of a stone corridor. That's the narrator you hear across the whole video. I suspect using a real actor or singer as the reference would work even better.

### ffmpeg: describe the edit, get the command

Then came assembly, and this is where Simona showed me something I didn't expect. I asked how she'd put the images and the audio together, and she just... wrote an ffmpeg command. It turns out an LLM is very good at ffmpeg — that famously cryptic tool with a thousand flags no human remembers. You don't write the command; you describe the edit, and she produces the invocation. She even, unprompted, started adding a slow zoom into each still — the Ken Burns effect — because an image held still for four seconds looks dead. I liked it. It was the beginning of the static image effects library.

When I say "hold on this image and slowly zoom in," what actually runs is this:

```
ffmpeg -i doors.png -vf "zoompan=z='1+(1.4-1)*on/(frames-1)':d=100:\
x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':s=3840x2160:fps=25,\
scale=1920:1080:flags=lanczos" -frames:v 100 scene.mp4
```

No way I could write this manually. I'd have to go read about `zoompan`, work out why the zoom is expressed as a per-frame fraction of the total frame count, puzzle through the `x`/`y` centering algebra, and then discover the hard way that you have to render at 4K and downscale with lanczos or the slow zoom develops a visible jitter. Or take mixing the narration in over a bed of ambient sound, with each voice line dropped at its own timestamp:

```
ffmpeg ... -filter_complex \
"[1:a]adelay=300|300[a1];[2:a]adelay=4500|4500[a2];[3:a]adelay=10000|10000[a3];\
[0:a][a1][a2][a3]amix=inputs=4:duration=first:normalize=0[out]" ...
```

That `normalize=0` at the very end is the kind of detail that costs a human an hour and a forum thread to learn — leave it off and `amix` quietly divides every track's volume by the number of inputs, so your carefully recorded narration comes out faint and you have no idea why. Simona either already knows it or learns it once, the hard way, and then writes it into the skill so neither of us ever trips on it again. We froze the whole approach into an **ffmpeg** skill, the editing layer everything else now sits on top of.

### Images, then motion

That gave me a working slideshow, and once I had it, the appetite grew. Hunting down images by hand felt silly when I could generate exactly the shot I wanted, so we built an **image generation** skill the same way — paste the provider's docs, get one good image back, freeze the path. The library of effects — Ken Burns in any direction, crossfades, slow scrolls for tall images, animated highlights drawn over a live UI — grew one request at a time. I'd ask for something new, she'd try a few versions, and we kept whatever looked right. Nobody planned that effect library. It accreted.

Then static frames stopped being enough. I wanted real motion in the hero moments — the cloaked figure pulling back its hood, the mansion doors swinging open — and that meant AI-generated video. This is where money stops being a rounding error. A generated image costs a few cents; five seconds of generated video costs anywhere from thirty cents to three dollars depending on the model. So the entire shape of the video is, underneath, an economics decision. If I'd generated the whole two minutes as AI video it would have cost a fortune. Instead the cheap slideshows carry most of the runtime, and I spend real money on generated motion only for the handful of shots that actually earn it. Slideshow for the rules; generated video for the hood reveal.

Finding a video model I could live with took longer than anything else, because this corner of the market is a mess. I started on Google's Veo — gorgeous, and brutal on the wallet at about three dollars for a single short clip. Then I moved to Kling, a Chinese model that ran roughly a dollar for five seconds and was good enough for a lot of shots (I tried Wan too, in the same bracket, and didn't keep it). I also tried LTX, which is probably the best open-source video model out there right now and is available through an official API for something like thirty to fifty cents per five-second clip; it has no audio at all, but that makes it perfect for cheap dry runs. And "official" is doing a lot of work in that sentence, because for most of these models there is no first-party API — you go through third-party platforms with their own strange credit systems and pricing, and finding one that's reliable and not a rip-off took real time. The one I settled on as my workhorse is Seedance 2.0, which is the king of the hill at the moment.

Having a unified voice in gen-AI videos and slideshows was a challenge until I discovered reference-to-video models. Instead of handing the model a single still and a prompt, you give it several reference images, a sample of the voice you want, and a prompt describing how the whole thing should move and speak. This gave me consistency: the character stays the same character from shot to shot, and he speaks in the same voice that carries the slideshow narration. Pick one voice, use it for the spoken slides and feed it as the reference to the video model, and the seams between a generated clip and a static section stop announcing themselves. The whole thing feels like one narrator walking you through one world.

### Skills as a scar collection

And every time we hit a wall, the fix went back into the skill. A voice model that choked on em-dashes near names, a zoom that jittered at high resolution, an image endpoint that quietly ignored a parameter — each one became a documented gotcha in its `SKILL.md` so she'd never walk into it twice. The skills are basically a scar collection.

The strange part is how little I actually look inside these skills. I almost never open the files. I just ask her to revisit and tidy them every so often, and when one has grown into a sprawling mess I have her refactor it. Eventually I wired that up as a Claude Code hook so she does the housekeeping on her own schedule instead of waiting for me to remember — though that only earns its keep once a skill has gotten big enough to need it. Most of them stay small.

The act of building this video *was* the act of building those skills. The skills are the durable output. The video is just the receipt.

## What it actually cost

<p class="section-gist"><em>Forty-five dollars total, and most of it went on tries you never see.</em></p>

Speaking of receipts — at some point the meter started to matter enough that I had Simona build an actual cost-tracking system. A generated image is pocket change, but voice adds up and video gets expensive *fast* — a single clip can run a dollar or three. So she now logs every API call she makes into a running ledger: timestamp, service, model, what the call was for, and a dollar estimate. It started as a way to not get surprised by a bill, and it turned into the thing that lets me tell you exactly what this video cost, down to the line.

The finished video, the locked two-minute cut embedded up top, came to **$27.76** to produce. That counts only this iteration, from the day I started it to the day I locked the final cut, and it already includes a pile of dead ends along the way.

Zoom out to the whole AI Werewolf creative effort — every earlier version of the video, the game's cover art, the role illustrations, the experiments that went nowhere — and the total is **$45.26**. Here's where that went, by service:

- **ElevenLabs** — the George narrator, every spoken line: $12.44
- **OpenAI gpt-image-2** — most of the stills, all the chalk slides: $10.83
- **fal.ai Seedance** — the generated video clips: $10.29
- **Google Veo** — a pricier video experiment from an earlier cut: $6.40
- **Google Gemini** — draft images and draft narration: $3.80
- **LTX** — the cheap open-source video model, mostly for dry runs: $1.40
- **fal lip-sync** — one short test: $0.10

Now the part that's easy to hide: how much of that I burned on tries. The gap between the $27.76 final number and the much smaller cost of "only the assets you actually see in the video" is all throwaways, and they add up quietly. The chalkboard pivot cost about three dollars in retired variants before the style clicked. The host's opening clip was generated three separate times, across three different Seedance configurations, before one of them moved the way I wanted — and at more than a dollar a generation, that's real money for a single shot. The forest-card image went through five regenerations, most of them after the wipe you're about to read about, trying to recover a look I no longer had a copy of. Every aesthetic decision has a small price tag stapled to it.

That's the thing that's genuinely different from how I used to work: the feedback loop costs money now, not just time. Forty-five dollars total is not a number that hurts — it's a couple of lunches — but it's real enough to change my behavior. I think twice before asking for "just one more variant." When the meter runs on every attempt, you get decisive a lot faster.

## The hard parts

<p class="section-gist"><em>What the highlight reel skips: she can't see the result, over-reaches, and gen-AI video is finicky.</em></p>

None of this is as clean as the highlight reel makes it sound. A handful of limitations shaped the whole process, and they're worth naming.

The biggest one: Simona can't actually *see* the result. She can read the narration transcript and look at the images one at a time, but she can't watch the assembled video play back. That blindness is the source of most of the friction — timing drifts out of sync between the visuals and the voice, and she has no direct way to notice. The workaround is to push as much as possible into explicit, written editing patterns up front: describe each transition precisely, and be exact about which images belong to which audio chunk, so the assembly is deterministic instead of something she has to eyeball.

She also has a strong tendency to do everything at once. It took me a while to drill in that we work one part at a time — one image, one voice chunk, one scene — and even then she'd reach for generating the entire batch of assets in a single pass. Left unchecked, that's how you end up with a whole batch to redo instead of one shot to fix.

Gen-AI video specifically is finicky. It demands very detailed prompting, which is tedious, and it isn't fully reliable even when you do everything right. Feed it the prompt, the reference images, and a voice sample, and a clip will still occasionally come back speaking in the wrong voice — and that take is a throwaway. So you over-generate and cherry-pick the one that landed, which loops straight back into the cost problem.

There's also a specific wall worth flagging: Seedance 2.0 through fal.ai refuses to animate realistic human faces. It's a content guardrail, and it's annoying — I know people get around it, the internet is full of AI-animated human faces — but it never actually blocked me, because my host is a werewolf. The one time a platform's caution happened to line up with my creative needs.

And lip-sync, where it's used, is good but not perfect — especially on a non-human face, where there's no real-world reference for what "correct" is even supposed to look like.

## The day Simona wiped half the project

<p class="section-gist"><em>A second session running git wiped two months of assets while recovering an unrelated commit.</em></p>

This was the first time the freedom I'd handed an AI on my Mac actually bit me. I had two Simona sessions running at once — one on this video, one deep in my other project, Marlow. The Marlow session went to commit its work and, with the wrong directory in its head, committed into the *video* repo instead, sweeping two months of untracked clips and images into the commit with a lazy `git add -A`. I tried to undo the mess, fumbled the revert, and recovered the lost commit with a `git reflog` hard reset — which rewound the working tree and deleted every one of those now-tracked assets in the process. Gone in one stroke, as collateral damage of fixing a completely unrelated repo.

Most of it came back, improvised on the spot. The `WORKLOG.md` had logged every fal.media URL, and a lot of them still resolved; the image skill had dumped its request bodies, base64 inputs and all, into `/tmp`, which I could decode. Five text-to-image stills had neither and were just gone — I re-prompted them, and they came back close enough that you'd never know.

Two fixes came out of it. The obvious one: generated media never goes through git now — it's in `.gitignore` and backed up elsewhere. The real one: I gave Simona a pre-commit hook that physically blocks *any* git command inside her own repo, so a session working on Marlow has to name the target repo out loud (`git -C /path/to/marlow`) and cwd confusion becomes impossible to express. When you let an agent run irreversible commands, the guardrail can't be "remember to be careful." It has to be a wall it hits before the damage.

## Keeping it on a leash

<p class="section-gist"><em>Isolate it, cap the API budgets, stay the reviewer, and let it harden its own tools.</em></p>

A few precautions, all of them obvious and all of them easy to forget. Isolate the AI as much as you can: give it its own machine, set hard budget limits on the API keys, and keep yourself in the loop as the reviewer rather than letting it run unattended. When it makes a mistake, talk through what went wrong and fold the fix back into its skills so it doesn't recur. And ask it to log everything — it'll cheerfully build the tooling to do that itself, which is exactly how the cost ledger above came to exist.

The less obvious move: ask Claude Code for its own opinion. It sounds strange, but right now Claude is genuinely on your side. It would gladly build any restrictions and control systems for itself. Point it at its own tools and logs and it'll find problems and propose fixes. I once hit a nasty bug in the `read` tool: it choked trying to open a corrupted image and locked up the entire session. Simona diagnosed it herself and wrote a hook that validates images before they ever reach `read`. It fixed itself, using its own documentation and a bit of Python. That's the part that still surprises me — the system is increasingly able to repair the thing it runs on.

## The pixel-perfect seam

<p class="section-gist"><em>Hiding the cut between a still zoom and a generated clip took an outpaint-and-paste trick.</em></p>

There's a moment in the intro where the camera does a slow zoom into the mansion's front doors, holds for a beat, and then the doors creak open and the camera glides through into a candlelit corridor beyond. The first part — the zoom — is a Ken Burns effect on a still image: pure ffmpeg, no AI in the playback. The second part — the doors opening and the corridor reveal — is a Seedance video clip, generated from two frames I designed.

This part looks smooth. I managed to extend an expensive gen-AI clip with cheap static images and some effects for free. The challenge, however, was teaching Simona to do this kind of thing on her own. It takes very precise prompting — something like "take the last zoomed-out frame and use it as the start frame of the gen-AI video."

This "end of the zoom has to be *the same frame* as the start of the Seedance clip" idea turned out to be hard because Seedance re-encodes its input frame. When I extracted the actual first frame of the generated video and compared it against the image I'd given Seedance as the start frame, the SSIM (structural similarity) was 0.52. Half a similarity score. They were related, but not identical. The model had applied its own color grading, its own subtle composition shifts, its own re-encoding noise.

The fix Simona and I worked out was unintuitive: stop trying to make the zoom land on the image *I* designed. Make it land on the image *Seedance actually produced*. The zoom can land on the literal first frame of the generated video.

To do that, we needed a wider image — because a zoom needs more pixels at the start than at the end — and the *center* of the wider image had to be a pixel-exact match for Seedance's first frame. So:

1. Extract frame 1 of the Seedance clip directly with ffmpeg.
2. Paste it centered onto a transparent 1792×1024 canvas with a transparent ring around it.
3. Send to `gpt-image-2`'s edit endpoint with a mask saying "fill the borders, preserve the center."
4. `gpt-image-2` ignored the mask. It redrew the whole thing. We got back a wider mansion image whose center was *roughly* but not exactly the original Seedance frame. SSIM 0.30. Worse than not outpainting.
5. **The trick**: composite the original Seedance frame back into the center with `ffmpeg overlay`, with a 40-pixel feathered alpha edge to hide the seam where the AI-painted outer ring meets the original inner image.

The result is a 1792×1024 wider mansion image whose central 1280×720 region is pixel-identical to Seedance's first frame, and whose outer ring is plausibly-painted gothic stone that fades smoothly into the real image. We then run a Ken Burns zoom from 1.0× to 1.4× over that wider image. At 1.4× zoom we're seeing only the central region — the *exact* Seedance frame 1 — and the cut into the Seedance video is invisible.

The trick generalizes: any time you need to extend a frame outward but preserve it exactly in the center, you can outpaint loosely and then paste the original back in via ffmpeg overlay with a soft alpha edge.

But it's still hard to achieve smooth transitions on arbitrary parts. This process requires a lot of feedback and rework. But we are getting there.

## The chalkboard pivot

<p class="section-gist"><em>Hyperrealistic slides fought the narration; chalk drawings fixed it for three dollars.</em></p>

AI is not good at picking the right visual style, but it can help with options. It cannot truly see anything, only get the idea through image recognition, transcripts and timings. I overused very hyperrealistic images in the slideshows until a friend told me they were actually hard to focus on. Too many details. I told Simona about that and she suggested a few less-detailed styles, including chalkboard drawings. Now I overuse those, but the result is much better.

Style is on you.

## Stepping back

<p class="section-gist"><em>The video was just the receipt; the reusable kit of skills is the real output.</em></p>

It's genuinely cool, it's genuinely useful, and it's not free. Every image, every clip, every regenerated variant has a price, and that price is the thing that keeps me disciplined. The constant low-grade pressure to spend less is, weirdly, what drives the creativity — the chalkboard slides are cheaper *and* better than the photorealistic ones they replaced, and I only found that out because I was trying to stop burning money.

But step back from the dollars and the ffmpeg incantations, and here's what happened: I described a video I wanted, and over a couple of months a conversation turned it into one — and built its own tools along the way. The durable output isn't just the two-minute clip — it's the kit of skills underneath it. And that kit gets a little sharper every time I use it.

And I've only covered maybe half of what it can do. Simona can put together pretty good in-browser demos too, but that's for another time.

Stop reading about AI, go build your own pipeline out of a conversation. It's worth it.