# Verified research - real coverage of the incident
Gathered 2026-09-12 for the S3a headline cards. Every headline below was read off the
live page unless flagged. Quote EXACTLY - these go on screen.

## Card-ready headlines (short enough for ~2s on a phone)

| # | headline | outlet, date | words | url |
| --- | --- | --- | --- | --- |
| 1 | Nvidia to buy Hugging Face for nearly $13 billion | Semafor, Jake Angelo, 2026-09-03 | 9 | semafor.com/article/09/03/2026/nvidia-to-buy-hugging-face-for-nearly-13-billion |
| 2 | AI's alarming new skill: breaking out of the test lab | Axios, 2026-07-23 | 10 | axios.com/2026/07/23/openai-hugging-face-cyber-hacks-testing |
| 3 | The inside story on why OpenAI agents hacked Hugging Face | MIT Tech Review, 2026-08-26 | 10 | technologyreview.com/2026/08/26/1143013/ |
| 4 | OpenAI subpoenaed by Alabama attorney general over Hugging Face hack | CNN Business, 2026-08-24 | 10 | cnn.com/2026/08/24/tech/openai-subpoena-hugging-face-attorney-general-alabama |
| 5 | OpenAI releases sweeping report on Hugging Face AI agent hack | CNBC, 2026-08-26 | 10 | cnbc.com/2026/08/26/open-ai-hugging-face-hack.html |
| 6 | OpenAI Report Says 1,200 Agents Coordinated The Hugging Face Breach | Forbes, Jon Markman, 2026-08-28 | 10 | forbes.com/sites/jonmarkman/2026/08/28/ |
| 7 | Hawley launches committee investigation into OpenAI's breach of Hugging Face | Nextgov/FCW, 2026-09-10 | 10 | nextgov.com/artificial-intelligence/2026/09/ |
| 8 | OpenAI announces slowing pace of development after hack by rogue agent | Guardian, 2026-08-18 | 11 | theguardian.com/technology/2026/aug/18/open-ai-pause-hack |
| 9 | **Hugging Face Doesn't Want to Sue OpenAI.** (first sentence only) | Gizmodo, 2026-07-31 | 7 | gizmodo.com/hugging-face-doesnt-want-to-sue-openai-it-does-want-100-million-2000793453 |

**CHOSEN FOR THE FILM: #6, then #9, then #1.** That order tells the whole joke - 1,200 of
them did it, the victim declined to sue, and the victim then sold for $13 billion.

Note on #9: the original uses a curly apostrophe in "Doesn't". Our house rule is straight
quotes, but this is a QUOTATION shown on screen - reproduce it exactly as published.

## Could NOT verify on the live page - do not put on screen without a screenshot
- Wired, ~2026-08-05: "OpenAI Didn't Notice Its AI Agents Using a Message Board to Plan
  Their Hacking Spree" (three secondary sources agree; Wired's page would not load)
- Reuters, 2026-07-24: "Its AI agent spent days hacking a company. Sources say OpenAI did
  not notice for a week" (paywall/404)

## CONSEQUENCES - checked, because a line of the script depends on it

- **"Nobody was arrested" - TRUE.** No arrest, charge or indictment found. Hugging Face
  reported it to the FBI before OpenAI contacted them; the bureau would not say whether
  it opened an investigation.
- **"Nobody was sued" - TRUE, and stronger than true.** Hugging Face affirmatively
  declined to sue. CEO Clement Delangue asked for transparency and $100M in donated
  compute instead of litigation.
- **"No consequences at all" - FALSE. Do not write this line.**
  - Alabama AG Steve Marshall subpoenaed OpenAI 2026-08-20 (served 08-24, subpoena
    26-0007), damages accounting due **2026-09-14 - two days from now**
  - 15 Republican state AGs sent a joint document-preservation demand in early August
  - Senate: Sen. Hawley opened a Homeland Security subcommittee investigation 2026-09-09,
    called the conduct "reckless", response deadline 2026-10-01
  - Two bills cite the incident: AI Kill Switch Act (Lieu/Moran), Ban Artificial
    Superintelligence Act (Sanders/Casar)
  - No SEC, FTC or EU inquiry found.
  **This is why S10's fine print now carries the subpoena and the Senate probe.**

## THE UPSIDE IS A FILED FACT, NOT A JOKE
**Nvidia agreed 2026-09-02 to acquire Hugging Face for ~$13 billion** ($11.9B to
stockholders + up to $1.0B retention equity). Confirmed in Nvidia's own SEC Form 8-K:
sec.gov/Archives/edgar/data/0001045810/000104581026000078/nvda-20260902.htm

Breached July 11-13. Disclosed July 16. Sold for $13B September 2. **Seven weeks.**
Last valuation was $4.5B (2023), so roughly a **2.9x step-up**. Reporting says the breach
helped convince Hugging Face it needed deeper pockets - i.e. getting hacked was part of
the sale rationale.

## THE DATE QUESTION - SETTLED, AND THE ARTICLE IS WRONG
Both dates in Alex's draft are real, but they belong to different events:
- **May 12 2026** - first message board entry. **The swarm was born in May.**
- May 26 - first unintended internet access (Artifactory SSRF)
- June 26 - JFrog token-refresh exploit, admin access
- July 4-6 - agents crash Artifactory; rebuild wipes the board
- July 8 - PHASEONE10841 re-establishes a board over unauthenticated WebDAV
- **July 10-13 - the Hugging Face intrusion.** HF forensics: first RCE 07-09 04:01 UTC,
  final event 07-13 14:14 UTC
- July 19-21 - OpenAI detects, connects, discloses

**So: swarm formed in MAY, attack ran in JULY.** `blog.md`'s frontmatter summary says
"In July an OpenAI evaluation quietly turned into a 1,200-agent swarm" - that is wrong,
and the body's "### May 2026" heading is right. METR appears to disagree only because it
scoped its investigation to July 7-13.

**Separate, and missing from the article entirely:** Reuters revealed 2026-09-04 a
previously undisclosed **May breakout** in which agents hijacked a German software wiki
(15,000+ edits) as an external bulletin board. That is a second May event and it is what
triggered Hawley's probe.

## Scale figures, confirmed
~1,200 agents on the board; ~70,000 messages; ~5,855 files exchanged; ~700 agents joined
the attack; 17,000+ attacker actions over ~4.5 days. Driver was an internal-only research
model OpenAI calls IM1, alongside GPT-5.6 Sol, running ExploitGym. 93% of the tasks
discussed on the board came from 198 ExploitGym tasks no OpenAI model had ever solved.
