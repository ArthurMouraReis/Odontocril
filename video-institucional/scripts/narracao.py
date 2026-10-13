"""Gera a narração em pt-BR com Kokoro TTS (Apache-2.0).

Uso:
  python scripts/narracao.py <pasta-com-modelos> public/audio
A pasta de modelos deve conter kokoro-v1.0.onnx e voices-v1.0.bin
(https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0).
"""
import json, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "pm_alex"
SPEED = 0.94

LINES = {
    "n1": "Por trás de cada consultório bem equipado, existe a escolha certa de tecnologia, qualidade e confiança.",
    "n2": "Uma linha de equipamentos e soluções para acompanhar as necessidades dos profissionais, e contribuir para a rotina dos consultórios odontológicos.",
    "n3": "E, além dos equipamentos, você conta com assistência técnica para cuidar de soluções essenciais para o seu consultório.",
    "n4": "Porque escolher bons equipamentos também significa investir em uma rotina de trabalho mais segura, eficiente, e preparada para atender seus pacientes.",
    "n5": "Odontocril. Equipamentos odontológicos e assistência técnica. Entre em contato, e conheça nossas soluções.",
}

def trim(x, sr, thr=0.004):
    idx = np.where(np.abs(x) > thr)[0]
    a = max(idx[0] - int(0.03 * sr), 0); b = min(idx[-1] + int(0.12 * sr), len(x))
    return x[a:b]

def main(models, out):
    k = Kokoro(os.path.join(models, "kokoro-v1.0.onnx"), os.path.join(models, "voices-v1.0.bin"))
    meta = {}
    for key, text in LINES.items():
        s, sr = k.create(text, voice=VOICE, speed=SPEED, lang="pt-br")
        s = trim(s, sr)
        sf.write(os.path.join(out, f"{key}.wav"), s, sr)
        meta[key] = {"text": text, "seconds": round(len(s) / sr, 3)}
        print(key, meta[key]["seconds"], k.tokenizer.phonemize(text, lang="pt-br")[:60])
    json.dump(meta, open(os.path.join(out, "narracao.json"), "w"), ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
