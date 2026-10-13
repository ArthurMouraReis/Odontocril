"""Trilha instrumental original (sintetizada por código, livre de direitos).

Uso: python scripts/trilha.py public/audio/trilha.wav
100 BPM, compasso de 2,4 s — os cortes do vídeo caem nos compassos.
"""
import sys
import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
TOTAL = 57.6 + 2.5
N = int(TOTAL * SR)
rng = np.random.default_rng(7)

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

# D maior: Dmaj9 – Bm9 – Gmaj9 – A6sus
CHORDS = [
    [50, 57, 61, 64, 66],  # D A C# E F#
    [47, 54, 57, 61, 62],  # B F# A C# D
    [43, 50, 54, 57, 59],  # G D F# A B
    [45, 50, 52, 54, 59],  # A D E F# B
]
BASS = [38, 35, 31, 33]

L = np.zeros(N); R = np.zeros(N)

def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l
    R[i:i + len(sig)] += sig * gain * r

def env_adsr(n, a, rel):
    t = np.arange(n) / SR; d = n / SR
    e = np.minimum(1, t / a) * np.clip((d - t) / rel, 0, 1)
    return e

def pad_note(m, dur):
    n = int((dur + 1.2) * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for det in (-0.07, 0.0, 0.07):
        f = hz(m + det)
        for h in range(1, 10):
            if f * h > 9000: break
            s += np.sin(2 * np.pi * f * h * t + rng.random() * 6.28) * (1 / h) * np.exp(-h / 2.6)
    s *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t)
    return s * env_adsr(n, 0.9, 1.4) / 3

def pluck(m, dur=1.6, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.zeros(n)
    for h in range(1, 8):
        fh = f * h * (1 + 0.0004 * h * h)
        s += np.sin(2 * np.pi * fh * t) * (0.6 ** (h - 1)) * np.exp(-t * (2.2 + h * 1.6 / bright))
    a = np.minimum(1, t / 0.004)
    return s * a * 0.5

def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(1, t / 0.02) * np.exp(-t * 0.9) * np.clip((dur - t) / 0.08, 0, 1)

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * np.minimum(1, t / 0.002)

def hat():
    n = int(0.06 * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n)
    sos = butter(4, 7000, 'hp', fs=SR, output='sos')
    return sosfilt(sos, s) * np.exp(-t * 70)

def shimmer(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n)
    sos = butter(2, [3000, 9000], 'bp', fs=SR, output='sos')
    s = sosfilt(sos, s)
    return s * (t / dur) ** 3

def swell(dur, m):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m + o) * t) for o in (0, 7, 12, 19))
    return s * (t / dur) ** 2.5 / 4

bars = int(np.ceil(57.6 / BAR))
for b in range(bars):
    t0 = b * BAR
    ch = CHORDS[b % 4]
    end_section = b >= 19
    # pad
    for m in ch:
        add(pad_note(m, BAR), t0, 0.11, pan=rng.uniform(-0.4, 0.4))
    # piano arpejo (8ths) a partir do compasso 2
    if b >= 2 and b != 19:
        pat = [0, 2, 3, 4, 1, 3, 2, 4]
        for i, p in enumerate(pat):
            if end_section and i % 2: continue
            vel = 0.8 if i % 4 == 0 else 0.55
            add(pluck(ch[p] + 12, 1.6), t0 + i * BEAT / 2, 0.16 * vel, pan=(-0.3 if i % 2 else 0.3))
    elif b < 2:
        for i in (0, 3, 6):
            add(pluck(ch[[0, 2, 4][i // 3]] + 12, 2.0), t0 + i * BEAT / 2, 0.15)
    # baixo
    if 2 <= b < 23:
        for i in range(2):
            add(bass(BASS[b % 4], BEAT * 2 * 0.95), t0 + i * BEAT * 2, 0.32)
    # bateria suave (cenas 3–5)
    if 5 <= b < 19:
        for i in range(4):
            if b == 10 and i < 2: continue
            add(kick(), t0 + i * BEAT, 0.42)
        for i in range(8):
            add(hat(), t0 + i * BEAT / 2 + 0.012, 0.05 * (1.0 if i % 2 else 0.55), pan=0.35)
    # melodia em sino (cena 5)
    if 14 <= b < 19:
        mel = [ch[4] + 24, ch[3] + 24, ch[2] + 24]
        for i, m in enumerate(mel):
            add(pluck(m, 2.2, bright=2.0), t0 + i * BEAT * 1.5, 0.07, pan=0.1)

# transições: brilho antes de cada corte, swell para o logo final
for cut in (4.8, 12.0, 24.0, 33.6):
    add(shimmer(1.2), cut - 1.2, 0.035)
add(swell(2.4, 62), 45.6 - 2.4, 0.18)
add(shimmer(2.4), 45.6 - 2.4, 0.06)
# acorde final
for m in CHORDS[0] + [74, 78]:
    add(pluck(m + 12, 5.0, bright=0.8), 45.6, 0.14)
    add(pad_note(m, 9.0), 45.6, 0.09)
add(kick(), 45.6, 0.5)

# reverb sintético
def ir(seed):
    r = np.random.default_rng(seed); n = int(2.6 * SR); t = np.arange(n) / SR
    x = r.standard_normal(n) * np.exp(-t * 2.6)
    sos = butter(1, 6000, 'lp', fs=SR, output='sos')
    return sosfilt(sos, x) / np.sqrt(n) * 6
wetL = fftconvolve(L, ir(1))[:N]; wetR = fftconvolve(R, ir(2))[:N]
L2 = L * 0.8 + wetL * 0.35; R2 = R * 0.8 + wetR * 0.35

# limpeza: high-pass leve, fade final
sos = butter(2, 30, 'hp', fs=SR, output='sos')
out = np.stack([sosfilt(sos, L2), sosfilt(sos, R2)], 1)
t = np.arange(N) / SR
fade = np.clip((57.6 - t) / 3.0, 0, 1)
out *= fade[:, None]
out = np.tanh(out * 1.1) / 1.1
out /= np.abs(out).max() / 0.89
sf.write(sys.argv[1], out[: int(57.6 * SR)].astype(np.float32), SR, subtype='PCM_16')
print('ok', out.shape)
