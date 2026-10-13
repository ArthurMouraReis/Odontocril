import narracao from "../public/audio/narracao.json";

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// 100 BPM → compasso de 2,4 s. Os cortes caem nos compassos da trilha.
export const SCENES = {
  abertura: { from: 0, dur: s(4.8) },
  empresa: { from: s(4.8), dur: s(7.2) },
  produtos: { from: s(12.0), dur: s(12.0) },
  assistencia: { from: s(24.0), dur: s(9.6) },
  confianca: { from: s(33.6), dur: s(12.0) },
  encerramento: { from: s(45.6), dur: s(12.0) },
} as const;

export const TOTAL = s(57.6);
// Sobreposição (crossfade) entre cenas
export const OVERLAP = 12;

type Key = keyof typeof narracao;
export const VO: { key: Key; at: number }[] = [
  { key: "n1", at: s(5.1) },
  { key: "n2", at: s(12.4) },
  { key: "n3", at: s(24.4) },
  { key: "n4", at: s(34.0) },
  { key: "n5", at: s(46.2) },
];

export const voFrames = (key: Key) => s(narracao[key].seconds);

// Momento (em frames, relativo ao início da fala) em que uma palavra é dita,
// estimado pela posição proporcional no texto.
export const wordAt = (key: Key, word: string) => {
  const { text, seconds } = narracao[key];
  const i = text.indexOf(word);
  if (i < 0) throw new Error(`Palavra "${word}" não encontrada em ${key}`);
  return s((i / text.length) * seconds);
};

// Frame absoluto em que a narração da cena começa
export const voStart = (key: Key) => VO.find((v) => v.key === key)!.at;

export type SceneKey = keyof typeof SCENES;
// Início da Sequence de cada cena (inclui a sobreposição do crossfade)
export const seqFrom = (k: SceneKey) => Math.max(0, SCENES[k].from - OVERLAP);
export const seqDur = (k: SceneKey) => SCENES[k].dur + (SCENES[k].from > 0 ? OVERLAP : 0);
// Converte um frame absoluto do vídeo em frame local da cena
export const local = (k: SceneKey, abs: number) => abs - seqFrom(k);
