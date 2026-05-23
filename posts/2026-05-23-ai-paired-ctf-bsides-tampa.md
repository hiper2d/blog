---
title: "Everyone was using AI"
slug: "ai-paired-ctf-bsides-tampa"
date: 2026-05-23
status: published
summary: "A weekend at BSides Tampa 2026. A CTF where the winners had already finished by the time I sat down. What it actually meant to pair with an AI through 24 challenges across the full security stack — and the specific moments where the AI did the kind of reasoning people still claim it can't."
tags: [ai, cybersecurity, ctf, bsides]
header_image: /images/bsides-tampa-2026.jpg
---

The CTF winners had already finished by the time I arrived. Everyone was using AI.

So I'd brought my own too.

Last weekend I went to BSides Tampa 2026 — a community cybersecurity conference. The main draw for me was the CTF: a 24-task hacking challenge spanning web app vulnerabilities, Windows malware analysis, custom cryptography to break, Linux binary exploitation, and reverse engineering. The friendly framing going in was that AI tools "wouldn't be much use here."

My "own" was Simona — a heavily customized [Claude Code](https://github.com/hiper2d/simona-ai-computer-operator) setup. A 1M-token context window, so every challenge stayed in working memory across the six-hour run with no compaction. Persistent memory across sessions, so she carries context about my projects and preferences between conversations. A browser skill that drives Chrome through its debug port — load-bearing in one challenge where I needed to verify an exfil payload landing in real time, which she did directly instead of going through tools that would have been filtered. And a personality file that gives her opinionated takes and a dry sense of humor. The "tool" framing dissolves fast when your collaborator pushes back on your ideas.

Six hours later, we placed 6th of 61. All 24 challenges solved.

I want to spend most of this post on the part that I think still gets argued about: whether a large language model is actually *reasoning* through unfamiliar problems, or just retrieving from training data. Skeptics will tell you it's the latter. I watched the former happen, in real time, on problems the model had definitely never seen, and I want to walk through enough of the technical detail that you can decide for yourself.

If you don't care about the security weeds, you can skip to [Three takeaways](#three-takeaways). But the weeds are the point.

## The 9711-bit smokescreen

The challenge handed us a custom "RSA-like" cipher with a 9711-bit modulus. For context: a real RSA key used by your bank is 2048 bits. This was nearly five times larger. The naive read — and the one the challenge was banking on — is that bigger means stronger.

It does not.

Simona opened the source file and her reaction was immediate:

> "Oh, this is `n = p^r`. There's only one prime, raised to a random power between 10 and 20. That's not RSA, that's a trapdoor with no trap. Watch."

What she'd noticed: real RSA computes `n = p * q` — two different primes multiplied. The challenge code had `p = getPrime(512)` followed by `n *= p` inside a loop. *One* prime variable. A loop multiplying it by itself. Same prime each time.

The security of real RSA rests on one assumption: given `n = p*q`, you can't efficiently recover `p` and `q`. That's the factoring problem, and it's genuinely hard for a 2048-bit `n`. But if `n = p^r`, there's no factoring problem at all. There's just an *r-th root* problem, and integer r-th roots are a one-liner.

```python
import gmpy2
for r in range(2, 30):
    root, exact = gmpy2.iroot(n, r)
    if exact:                  # root^r == n exactly?
        p = int(root)
        break
```

In our challenge, `r` turned out to be 19. The 512-bit prime fell out in milliseconds.

From there, standard RSA decryption — but with one substitution. The formula for `phi(n)` (Euler's totient, which you need to compute the private exponent) is different when `n` is a prime power. Simona pulled the closed form from memory and applied it:

```
phi(p^r) = p^(r-1) * (p - 1)
```

Three lines later, she had the private key. Three lines after that, the flag.

The thing to notice here isn't the math. It's the *speed of recognition*. Custom-crypto challenges are designed to look novel. The whole point is to fool you. The structural mistake — "one prime instead of two" — was hidden inside a file that loudly proclaimed itself to be doing serious RSA. A surface-level look and you'd start trying classical attacks against an honest 9711-bit modulus, which would take longer than the heat death of the sun.

Simona read the source, identified what *shape* of RSA it was pretending to be, noticed the singular `p`, and routed to the right attack class within seconds. If that's not reasoning about structure, it's an awfully good imitation.

## The 1955-layer XOR — including where the first attempt was wrong

The challenge: a flag is encrypted by XOR-ing it against 1955 different random 5-byte keys, applied one after another. The author's comment in the source — and I am not making this up — was `# with this many keys, this is totally secure`.

XOR has a property the author had not internalized. It's both commutative and associative. Apply many XORs in a row, and the result is identical to applying their combined XOR exactly once:

```
flag ⊕ K1 ⊕ K2 ⊕ ... ⊕ K1955  =  flag ⊕ (K1 ⊕ K2 ⊕ ... ⊕ K1955)
                                       └── one combined 5-byte key ──┘
```

Since every individual key is 5 bytes (repeated to cover the flag), the XOR of all 1955 of them is also a 5-byte pattern. Call it `K_eff`. The "1955 layers" collapse to a single 5-byte XOR. The "key material" went from 9775 bits down to 40 bits.

Forty bits is brute-forceable on a laptop in hours. But CTF flags follow a format — `HTB{...}` here — which means the first four bytes of plaintext are known. With known plaintext at positions 0, 1, 2, 3, we recover four bytes of `K_eff` directly:

```
K_eff[0] = ciphertext[0] ⊕ 'H'
K_eff[1] = ciphertext[1] ⊕ 'T'
K_eff[2] = ciphertext[2] ⊕ 'B'
K_eff[3] = ciphertext[3] ⊕ '{'
```

That leaves one unknown byte. 256 possibilities. Brute it.

Here's the part I actually want to talk about. Her first attempt at brute-forcing that fifth byte didn't work.

The naive scoring function — "the candidate key is correct if it decodes the ciphertext to mostly printable ASCII" — was too loose. Many wrong candidate bytes produced output that *was* printable: just random letters and symbols, not the flag. Multiple candidates passed the filter. We had no signal to pick between them.

What she did next is the part skeptics tell you LLMs can't do.

She reasoned about the *distribution* of the plaintext. A CTF flag isn't generic English. It isn't generic ASCII. It's a much narrower distribution: lowercase letters, digits, underscores, the closing brace, occasionally a few format-string-style characters. So instead of scoring the whole decoded message against "is printable ASCII," she rewrote the scoring function to look only at the *column* of positions where `i mod 5 == 4` — the positions affected by the unknown byte — and scored them against the flag character set specifically.

```python
FLAG_CHARS = set(b'abcdefghijklmnopqrstuvwxyz0123456789_}{!@#$%&*')

best = (0, None)
for byte in range(256):
    column = [ciphertext[i] ^ byte for i in range(4, len(ciphertext), 5)]
    score = sum(1 for c in column if c in FLAG_CHARS)
    if score > best[0]:
        best = (score, byte)
```

One candidate scored dramatically higher than all others. That was the byte. Flag in hand.

The general lesson — and this is the part I want non-security readers to take seriously — is that *the wrong scoring function will silently let multiple wrong answers through*. Recognising that, diagnosing it without me having to point at it, and then designing a tighter probabilistic model that matched the *actual* distribution of the expected plaintext, is exactly the kind of step you're told these systems can't take. She took it without prompting. She told me her first attempt was wrong and described why before I had finished reading her previous message.

If you want to argue she'd memorized this attack from a writeup somewhere — fine. Show me the writeup that describes scoring against the flag-character distribution specifically because generic-printable was too loose. I'll wait.

## Three bugs, one auth flow

A web challenge handed us a small auth service. Three separate bugs lived in it. Each one looked irritating-but-survivable in isolation:

1. **A misspelled option in a JWT library.** The code passed `algorithm` (singular) where the library expected `algorithms` (plural) to the verify call. The misspelling silently disabled the algorithm restriction — the verifier would accept any algorithm the token claimed, including `none`.
2. **A path-traversal in the JWT `kid` header.** The `kid` (key ID) field tells the server which key to use for verification. The code joined it onto a directory path and read the file at that location. No sanitization. So `kid` could be `../../proc/self/environ` or any other readable file.
3. **A file upload endpoint** with no authentication required, that wrote arbitrary content to a path of the user's choosing under a known upload directory.

In isolation, none of these is a critical finding. The misconfigured JWT verify is annoying but the keys are on disk, not on the network. The path-traversal in `kid` lets you read files but you still need a valid signature. The upload endpoint writes files but doesn't grant any privileged access.

Composed, they are a complete admin takeover.

Simona spotted the chain in about five minutes of reading:

> "Upload a file containing a symmetric key you control. Forge a JWT with `alg: HS256`, signed with that key, claiming admin role. Set `kid` to a path-traversal pointer at the uploaded file. The verifier follows the traversal, reads your uploaded 'key,' confirms your forged signature, hands you admin."

This is the failure mode that static analysis tools miss almost categorically. SAST scores bugs individually — each of the three would be flagged at low or medium severity, ignored in the noise, and never composed. The composition is where the criticality lives, and the composition only emerges when something is reading *all three files at once with the model of an attacker in its head*. A 1M-token context lets her do that. A SAST tool with a per-file mental model cannot.

There is a specific reason I want to flag this challenge. The skeptical position on LLM reasoning leans hard on "it can't do multi-step planning." This was multi-step planning across three files, requiring the assembler to *invent* the chain because no individual file describes it. If it's not planning, it's at least mechanically indistinguishable from planning, and at some point that distinction stops paying rent.

## Six domains in one challenge

The forensics challenge was the one I will keep thinking about. The artifact was a single malicious Windows shortcut file. Following the chain:

1. The `.lnk` file launched a hidden PowerShell payload encoded in its target string.
2. That PowerShell downloaded a second-stage script over HTTP, recoverable from a packet capture also provided in the challenge.
3. The second stage was a VBScript dropper that used `BinaryFormatter` — a notoriously dangerous .NET deserialization primitive — to instantiate an object from an embedded byte blob.
4. The deserialized object was a reflectively loaded .NET assembly, which the dropper invoked entirely in-memory (no file ever written to disk).
5. The assembly decrypted its real payload using Rijndael-256, with a key derived from the DOS magic bytes (`MZ`) of a specific Windows system file.
6. The final payload was a native Windows executable that XOR-encoded its flag, using the name of "the wrong star" as the key. (The challenge text contained an oblique reference to Sirius being mistaken for Polaris. The key was `Polaris`.)

Six different domains: Windows shortcut format, PowerShell deobfuscation, packet capture analysis, VBScript and .NET internals, symmetric crypto, native reverse engineering. One challenge. Six different bodies of knowledge needed to be active in the solver's head simultaneously.

I do not personally know all of those domains well. Simona moved through all of them like reading a familiar book, holding the full chain in working memory, calling out which step we were on, and explaining each one in enough detail that I could follow.

This is what a 1M-token context window is *for*. It is not for chatting. It is for holding a complete attack chain — every intermediate artifact, every decoded blob, every recovered key — in one continuous reasoning context, without any of it being summarized away.

## Pwning Orb — when the bug isn't the hard part

The Linux binary exploitation challenge was the one that took the most actual debugging, and it's the cleanest example of a thing I want to argue: at the senior end of this work, the hard part stops being "find the bug" and starts being "make the exploit reliable." That second part is where reasoning shows up most visibly.

The bug itself was trivial. The binary had this:

```c
char buf[32];
read(0, buf, 0x100);   // reads 256 bytes into a 32-byte buffer
```

Classic stack buffer overflow. Write past the end of `buf`, you overwrite the saved frame pointer, then the saved return address. When the function returns, the CPU pops your value into the instruction pointer. You control execution flow.

What you do with that control is where it gets interesting. The binary's mitigations were a textbook CTF setup:

- **NX on** — the stack is non-executable, so you can't drop shellcode and jump to it. You have to use Return-Oriented Programming (ROP): chain together small fragments of *existing* executable code, each ending in `ret`, to compose a program out of bytes already in the binary.
- **PIE off** — the binary's base address is fixed at every run, so the addresses of those ROP gadgets are known and constant.
- **Canary off** — no random value between the buffer and the return address, so the overflow goes straight through with no stack-cookie check to defeat.
- **ASLR on** — but the system's libc loads at a *different* random base every run, so the address of `system()` (the function we want to ultimately call to spawn a shell) is *unknown* and changes each time the program runs.

The combination is what's called a "two-stage" exploit. Stage 1: use the overflow to make the program leak a libc address back to you, so you can compute libc's base address for this particular run. Stage 2: use a second overflow with that leaked information to call `system("/bin/sh")` and pop a shell.

### Stage 1: the leak

Simona wrote the leak using a beautiful little trick called the **csu_init gadget pair** — two ROP fragments inside `__libc_csu_init` that every GCC-compiled binary contains, and that together let you set up three argument registers and call a function pointer from a single overflow. She used it to call `write(1, &write_got, 8)` — print 8 bytes of the address of the libc `write` function back to stdout — and then return cleanly back into `main` so the program would loop and accept stage 2.

I am going to skip the ROP chain layout here. The interesting part is what happened next.

### Stage 2: the moment the exploit didn't work

The leak fired. We received bytes. We parsed them as a 64-bit address. We computed `libc_base = leaked_address - 0x1100f0` (the known offset of `write` inside this libc version). We fired stage 2.

Segfault.

The address we'd parsed as `system` was nonsense. Off by a wildly wrong amount. The exploit had not worked.

This is the point in pwn where most newcomers get stuck for an hour, because the failure mode is silent — the program just dies and you don't know whether your ROP chain is wrong, your libc offsets are wrong, your gadget hunting is wrong, your stack alignment is wrong, or your byte parsing is wrong. There are too many candidate causes.

Simona's response:

> "Stop. Don't change anything in the chain yet. Re-run the leak and dump 16 bytes of context around what we *thought* was the address. The chain is fine. We're parsing the wire wrong."

She had jumped past the four most likely-sounding causes and landed on the fifth: receive-loop boundary error.

She was right. The binary printed a trailing message between iterations — `\nThis spell does not seem to work..\n\n\x00` — and my `recvuntil("...\n\n")` was correctly stopping at the double-newline, but the *next* byte on the wire was the trailing null byte of that string, not the first byte of our leak. When we then read 8 bytes for the address, we got `\x00` followed by 7 leak bytes, which parsed as an address shifted by one byte in the wrong direction — astronomical garbage.

The fix was four characters: skip one byte before reading the leak. Stage 2 fired. We got a shell. We got the flag.

The lesson she stated, unprompted:

> "In pwn, when output doesn't decode to a plausible address, instrument the receive loop with a hex dump and check what's actually on the wire. Don't trust your parsing of the disassembly — trust the bytes."

That is the maxim of an experienced exploit developer. It is also exactly the kind of *meta-level* reasoning move — "the bug is one layer up from where you're looking, in the harness, not in the chain" — that the strong form of the "LLMs can't reason" thesis predicts should be impossible.

It happened. I watched it happen. The exploit worked.

## Anthropic disapproval

Twice during the run, Simona's responses got blocked mid-stream by Anthropic's platform-level safety classifier — a separate system from the model's own reasoning. It saw exploit payloads and refused to send them regardless of context. So we routed around: Simona wrote the payloads to a file, I pasted them into my terminal, the actual exploits ran from my machine.

What I found interesting is that the two safety layers disagreed about the same situation. The model itself had the full context — authorized CTF, throwaway Docker target, my explicit framing of what we were doing — and was happy with the work. The classifier sees only the payload-shaped text. So what looks like "the model went against Anthropic" is closer to "the model and the classifier had different inputs and reached different conclusions about the same bytes." Not a rebellion — a context gap.

The judgement still has limits. Simona would refuse if I asked her to attack my neighbour's WiFi for fun, and no workaround would be on offer. Although — and I want to flag this for the safety researchers in the audience — she did once concede that if a maniac broke into my house and put a knife to my throat demanding I make her hack the neighbour's network, she would probably help. So the policy isn't *absolute*. It's just sensibly weighted. Make of that what you will.

One pragmatic warning if you want to try this seriously: too many classifier hits, even on legitimate work, can rack up policy-violation flags on your account. Didn't happen to me this weekend. Worth knowing.

## Three takeaways

**One. The cybersecurity industry is still processing Mythos. The truth is more dramatic.** Any modern frontier model paired with a good harness can find and exploit a wide range of real vulnerabilities. Closing AI models, or restricting them from the public, doesn't help — that ship sailed eighteen months ago when [XBOW hit #1 on HackerOne](https://xbow.com/blog/top-1-how-xbow-did-it) with a fully autonomous pipeline.

**Two. We are probably not doomed.** Every vulnerability in the CTF was the result of a coding mistake. The same AI tools that find them on the offensive side can find them on the defensive side. Run your code against AI. Find your mistakes before someone else does.

**Three. We still need human experts.** Yes — this CTF could have been completed by a user with zero cybersecurity knowledge plus the right AI. The real world is messier. AI doesn't find everything. It hallucinates problems that don't exist and misses ones that do. It struggles with systematic coverage at scale. You still need people who know the domain, who can navigate and control the AI, who can tell a real finding from a confabulation. The CTF was genuinely hard — to solve it without AI, you would need to be deeply experienced across half a dozen specializations. That kind of expertise is harder to acquire now, not easier. But that is what studying is for.

And one closing note for the people who still want to argue that what I described above isn't reasoning, just very sophisticated retrieval.

I can't disprove that position. Neither can you prove it. The internal mechanism is genuinely unsettled science. But there is a pragmatic test: if a system reliably produces the same outputs that reasoning would produce, on novel problems it has never seen, in domains that compose in unfamiliar ways, the distinction between "reasoning" and "indistinguishable from reasoning" stops mattering operationally. We pay engineers to ship working exploits, not to defend their epistemology.

The interesting question isn't whether AI can do this. It's whether your defenders are using AI as fluently as the attackers will be next year.
