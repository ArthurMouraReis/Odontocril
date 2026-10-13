"""Trilha da versão 2 (ritmada, 120 BPM, compasso de 2 s) — sintetizada, livre de direitos.

Uso: python scripts/trilha_v2.py <saida.wav> [duração] [logo]
  Odontocril v2:  python scripts/trilha_v2.py public/audio/trilha_v2.wav 46 38
  Tecvertex:      python scripts/trilha_v2.py public/audio/trilha_tecvertex.wav 40 34
Seções: 0–6 s introdução · 6 s até (logo − 2) groove · 2 s de subida · logo · final.
"""
import sys
import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
BEAT = 0.5
BAR = 2.0
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 46.0
LOGO = float(sys.argv[3]) if len(sys.argv) > 3 else 38.0
GROOVE_END = int((LOGO - 2) / 2)  # compasso em que a bateria para
FILL = GROOVE_END // 2 + 2
N = int((TOTAL + 2) * SR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)

# A – E – F#m – D
CHORDS = [[57, 61, 64, 69], [56, 59, 64, 68], [57, 61, 66, 69], [57, 62, 66, 69]]
BASS = [45, 40, 42, 38]

def add(sig, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * g * np.cos((pan + 1) * np.pi / 4) * 1.414
    R[i:i + len(sig)] += sig * g * np.sin((pan + 1) * np.pi / 4) * 1.414

def tt(d): return np.arange(int(d * SR)) / SR

def pluck(m, d=0.6, bright=1.0):
    t = tt(d); f = hz(m); s = 0
    for h in range(1, 9):
        s = s + np.sin(2 * np.pi * f * h * (1 + 0.0003 * h * h) * t) * 0.62 ** (h - 1) * np.exp(-t * (5 + h * 3 / bright))
    return s * np.minimum(1, t / 0.003) * 0.45

def pad(m, d):
    t = tt(d + 0.6); s = 0
    for det in (-0.08, 0, 0.08):
        for h in range(1, 7):
            s = s + np.sin(2 * np.pi * hz(m + det) * h * t + rng.random() * 6) / h * np.exp(-h / 2)
    return s * np.minimum(1, t / 0.4) * np.clip((d + 0.6 - t) / 0.6, 0, 1) / 3

def bass(m, d):
    t = tt(d); f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    return s * np.minimum(1, t / 0.008) * np.exp(-t * 3) * np.clip((d - t) / 0.03, 0, 1)

def kick():
    t = tt(0.35); f = 48 + 90 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) + 0.3 * rng.standard_normal(len(t)) * np.exp(-t * 300)

def clap():
    t = tt(0.25); n = rng.standard_normal(len(t))
    n = sosfilt(butter(2, [900, 4000], 'bp', fs=SR, output='sos'), n)
    e = sum(np.exp(-np.maximum(t - o, 0) * 60) * (t >= o) for o in (0, 0.01, 0.022)) / 3 + np.exp(-t * 18) * 0.4
    return n * e * 1.4

def hat(open_=False):
    t = tt(0.18 if open_ else 0.045)
    n = sosfilt(butter(4, 8000, 'hp', fs=SR, output='sos'), rng.standard_normal(len(t)))
    return n * np.exp(-t * (18 if open_ else 90))

def riser(d):
    t = tt(d); n = rng.standard_normal(len(t))
    out = np.zeros_like(n); seg = int(0.05 * SR)
    for i in range(0, len(n), seg):
        fc = 400 + 7000 * (i / len(n)) ** 2
        out[i:i + seg] = sosfilt(butter(2, [fc, min(fc * 1.6, 18000)], 'bp', fs=SR, output='sos'), n[i:i + seg])
    return out * (t / d) ** 2

nbars = int(TOTAL / BAR)
for b in range(nbars):
    t0 = b * BAR; ch = CHORDS[b % 4]; groove = 3 <= b < GROOVE_END; outro = b >= GROOVE_END + 1
    # pad
    for m in ch:
        add(pad(m, BAR), t0, 0.05 if groove else 0.07, pan=rng.uniform(-0.5, 0.5))
    # acordes em contratempo (stabs)
    if groove or b in (1, 2):
        for k in range(4):
            for m in ch:
                add(pluck(m + 12, 0.4, 1.3), t0 + k * BEAT + 0.25, 0.10 if groove else 0.07, pan=0.15)
    # arpejo agudo
    if b < 3 or outro or (groove and b % 2 == 1):
        seq = [ch[0], ch[1], ch[2], ch[3], ch[2], ch[1], ch[3], ch[2]]
        for i, m in enumerate(seq):
            add(pluck(m + 24, 0.5, 2.0), t0 + i * BEAT / 2, 0.07 if not outro else 0.06, pan=(-0.4 if i % 2 else 0.4))
    # baixo
    if groove:
        for k in range(8):
            add(bass(BASS[b % 4] + (12 if k % 2 else 0), 0.24), t0 + k * BEAT / 2, 0.28 if k % 2 == 0 else 0.16)
    # bateria
    if groove:
        fill = b == FILL
        for k in range(4):
            if fill and k >= 2: continue
            add(kick(), t0 + k * BEAT, 0.55)
        for k in (1, 3):
            add(clap(), t0 + k * BEAT, 0.22)
        for k in range(16):
            v = 0.06 if k % 4 == 2 else 0.035
            add(hat(open_=(k % 8 == 6)), t0 + k * BEAT / 4, v * (1.6 if k % 8 == 6 else 1), pan=0.3)
        if fill:
            for k in range(4):
                add(clap(), t0 + 1.0 + k * BEAT / 4, 0.08 + 0.04 * k)
    if b in (1, 2):
        for k in range(8):
            add(hat(), t0 + k * BEAT / 2, 0.03, pan=0.3)

# pequenos acentos
add(kick(), 3.0, 0.4)                    # "A gente cuida…"
add(riser(2.0), 4.0, 0.05)               # entrada do groove
add(riser(2.0), LOGO - 2, 0.09)              # subida para o logo
for m in CHORDS[0] + [76, 81]:           # logo
    add(pluck(m + 12, 3.0, 0.9), LOGO, 0.12)
    add(pad(m, 6.0), LOGO, 0.07)
add(kick(), LOGO, 0.6)

def ir(seed, d=1.8):
    r = np.random.default_rng(seed); t = tt(d)
    x = r.standard_normal(len(t)) * np.exp(-t * 3.2)
    return sosfilt(butter(1, 7000, 'lp', fs=SR, output='sos'), x) / np.sqrt(len(t)) * 5
L2 = L + fftconvolve(L, ir(3))[:N] * 0.25
R2 = R + fftconvolve(R, ir(4))[:N] * 0.25
out = np.stack([L2, R2], 1)
out = sosfilt(butter(2, 28, 'hp', fs=SR, output='sos'), out, axis=0)
t = np.arange(N) / SR
out *= np.clip((TOTAL - t) / 2.5, 0, 1)[:, None]
out = np.tanh(out * 1.2) / 1.2
out /= np.abs(out).max() / 0.89
sf.write(sys.argv[1], out[: int(TOTAL * SR)].astype(np.float32), SR, subtype='PCM_16')
print('ok')
