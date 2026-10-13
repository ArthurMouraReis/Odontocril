#!/usr/bin/env bash
# Renderiza as duas versões e normaliza o áudio (−14 LUFS, pico −1,5 dBTP).
# Uso: ./render.sh            (ambas)   |   ./render.sh Vertical
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
comps=("${@:-Vertical Horizontal}")  # também: Tecvertex-Vertical Tecvertex-Horizontal
for comp in ${comps[@]}; do
  lower=$(echo "$comp" | tr '[:upper:]' '[:lower:]')
  npx remotion render "$comp" "out/raw-$lower.mp4" --codec=h264 --audio-codec=aac --crf=17 --pixel-format=yuv420p
  stats=$(ffmpeg -hide_banner -i "out/raw-$lower.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  get() { echo "$stats" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
  ffmpeg -y -hide_banner -loglevel error -i "out/raw-$lower.mp4" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
    -c:a aac -b:a 192k -movflags +faststart "out/$( [[ $comp == Tecvertex-* ]] && echo "tecvertex-apresenta-odontocril-${lower#tecvertex-}" || echo "odontocril-institucional-$lower").mp4"
  rm "out/raw-$lower.mp4"
  echo "✔ $comp"
done
