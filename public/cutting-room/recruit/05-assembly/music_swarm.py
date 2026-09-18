"""Score for hf-recruit-short. Carpenter-synth palette, C minor, 16ths at 140 BPM.
Deliberately NOT the trailer/create-short engine: new key, new pulse, different lead stack."""
import sys, numpy as np
sys.path.insert(0, "/Users/hiper2d/projects/simona-ai-computer-operator/audio-projects/scorelib")
from voices import (Score, arp_note, sub_bass, gated_pad, impact, stinger, ding,
                    keytick, hiss, lp_res)

DUR = 34.13
sc = Score(dur=DUR, seed=20260913)

# ---- cut map (absolute, from the build script) ----
S1, S2, S3, S9, S10 = 0.0, 4.741, 10.991, 22.191, 30.231
ACT   = [S2, S3, S9, S10]                      # act breaks
BEATS = [6.871, 7.991, 9.391,                  # S2 internal
         12.291, 13.581, 14.631, 15.671,       # news cards
         17.291, 18.901,                       # altman A/B
         26.191]                               # enlistment card
POINT = 20.791                                 # the poster lands on "you" - biggest hit

# ---- C minor ----
C, Eb, G, Bb, F, Ab = 130.81, 155.56, 196.00, 233.08, 174.61, 207.65
ARP = [C, Eb, G, Bb, G, Eb]

def cutoff_at(t):
    """Filter opens across the film. THIS is the arrangement."""
    if t < S2:   return 420.0
    if t < S3:   return 620.0 + 700.0*(t-S2)/(S3-S2)
    if t < S9:   return 1400.0 + 2100.0*(t-S3)/(S9-S3)
    if t < S10:  return 1250.0 + 900.0*(t-S9)/(S10-S9)
    return 3600.0

# ---- pulse: 16ths at 140 BPM ----
step = 60.0/140.0/4.0
t = 0.0; i = 0
while t < DUR:
    if t >= S2 - 0.4:
        f = ARP[i % len(ARP)]
        if t >= S3: f *= 2.0 if (i % 12) in (2, 5, 9) else 1.0
        amp = 0.16 if t < S3 else (0.30 if t < S9 else 0.22)
        if t >= S10: amp = 0.34
        sc.place(t, arp_note(sc, f, cutoff_at(t), dur=step*1.7), amp=amp)
    t += step; i += 1

# ---- sub bass: root on the half-bar, harder after the point ----
bar = 60.0/140.0*2
t = S1
while t < DUR:
    root = C/2 if (int(t/bar) % 4) < 3 else Ab/2
    sc.place(t, sub_bass(sc, root, dur=bar*0.8), amp=0.30 if t < S3 else 0.42)
    t += bar

# ---- gated pad beds, one per act ----
sc.place(S2,  gated_pad(sc, [C, Eb, G],      dur=S3-S2,   rate=0.21), amp=0.16)
sc.place(S3,  gated_pad(sc, [C, Eb, G, Bb],  dur=S9-S3,   rate=0.17), amp=0.21)
sc.place(S9,  gated_pad(sc, [Ab, C, Eb],     dur=S10-S9,  rate=0.24), amp=0.17)
sc.place(S10, gated_pad(sc, [C, G, C*2],     dur=DUR-S10, rate=0.13), amp=0.26)

# ---- accents on real cut points ----
for a in ACT:
    sc.place(a, impact(sc), amp=0.62)
for b in BEATS:
    sc.place(b, stinger(sc), amp=0.30)
sc.place(POINT, impact(sc, dur=2.0), amp=1.0)      # the biggest moment in the film
sc.place(POINT, ding(sc, f0=2090.0), amp=0.34)

# keystrokes under the workstation shot
for k in np.arange(18.95, 20.70, 0.085):
    sc.place(float(k), keytick(sc), amp=0.20)

sc.place(0.0, hiss(sc, level=0.010))

# duck under every spoken span so the voice always wins
sc.duck([(0.15, 4.4), (4.85, 6.0), (11.1, 10.9), (22.4, 7.6), (30.5, 3.2)], depth=0.52)
sc.fade_tail(1.3)
sc.save("audio/music_swarm.wav")
print("score written:", DUR, "s")
