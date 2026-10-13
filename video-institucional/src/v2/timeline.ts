// Versão 2 — 120 BPM: compasso = 60 frames. Todas as cenas começam em compasso.
export const FPS = 30;

export const S = {
  hook: { from: 0, dur: 180 },
  passo1: { from: 180, dur: 240 },
  passo2: { from: 420, dur: 300 },
  passo3: { from: 720, dur: 240 },
  diaADia: { from: 960, dur: 180 },
  final: { from: 1140, dur: 240 },
} as const;

export const TOTAL_V2 = 1380; // 46 s
