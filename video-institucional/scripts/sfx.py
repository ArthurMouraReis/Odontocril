"""Efeitos sonoros de interface (sintetizados): clique, digitação, mensagem, sucesso, whoosh.

Uso: python scripts/sfx.py public/sfx
"""
import sys, os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(5)
tt = lambda d: np.arange(int(d * SR)) / SR
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], 'bp', fs=SR, output='sos'), x)
out = sys.argv[1]

def save(name, x, peak=0.8):
    x = x / (np.abs(x).max() + 1e-9) * peak
    sf.write(os.path.join(out, name), x.astype(np.float32), SR)

def click():
    t = tt(0.05)
    return bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 160) + 0.5 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120)

def key(v=1.0):
    t = tt(0.035)
    return bp(rng.standard_normal(len(t)), 2000, 7000) * np.exp(-t * 220) * v

save('click.wav', click(), 0.7)

# digitação: 3 s de teclas em ritmo humano
typing = np.zeros(int(3.2 * SR)); p = 0.0
while p < 3.0:
    k = key(rng.uniform(0.5, 1.0)); i = int(p * SR)
    typing[i:i + len(k)] += k[: len(typing) - i]
    p += rng.uniform(0.045, 0.085)
save('typing.wav', typing, 0.45)

t = tt(0.18)
f = np.where(t < 0.07, 880, 1320)
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-((t % 0.07)) * 30) * np.exp(-t * 8)
save('message.wav', pop, 0.5)

t = tt(0.7)
ding = sum(np.sin(2 * np.pi * hz * t) * np.exp(-t * 6) * (t >= d) for hz, d in ((1046.5, 0), (1568, 0.08)))
save('success.wav', ding, 0.45)

t = tt(0.45)
wh = bp(rng.standard_normal(len(t)), 300, 3000) * np.sin(np.pi * t / 0.45) ** 2
save('whoosh.wav', wh, 0.35)
print('ok')
