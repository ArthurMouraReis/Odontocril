import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { SceneIn } from "./components/Brand";
import { S1Abertura } from "./scenes/S1Abertura";
import { S2Empresa } from "./scenes/S2Empresa";
import { S3Produtos } from "./scenes/S3Produtos";
import { S4Assistencia } from "./scenes/S4Assistencia";
import { S5Confianca } from "./scenes/S5Confianca";
import { S6Encerramento } from "./scenes/S6Encerramento";
import { OVERLAP, SceneKey, seqDur, seqFrom, TOTAL, VO, voFrames } from "./timeline";

const SCENE_LIST: { key: SceneKey; name: string; C: React.FC }[] = [
  { key: "abertura", name: "1 · Abertura", C: S1Abertura },
  { key: "empresa", name: "2 · Empresa", C: S2Empresa },
  { key: "produtos", name: "3 · Produtos", C: S3Produtos },
  { key: "assistencia", name: "4 · Assistência técnica", C: S4Assistencia },
  { key: "confianca", name: "5 · Confiança", C: S5Confianca },
  { key: "encerramento", name: "6 · Encerramento", C: S6Encerramento },
];

const MUSIC = 0.8;
const MUSIC_UNDER_VO = 0.24;
const RAMP = 10;

// Volume da trilha com "ducking" sob a narração
const musicVolume = (f: number) => {
  let v = MUSIC;
  for (const { key, at } of VO) {
    const end = at + voFrames(key);
    const d = interpolate(f, [at - RAMP, at, end, end + RAMP * 1.5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    v = Math.min(v, MUSIC - (MUSIC - MUSIC_UNDER_VO) * d);
  }
  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return v * fadeIn;
};

export const InstitutionalVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
    {SCENE_LIST.map(({ key, name, C }, i) => (
      <Sequence key={key} name={name} from={seqFrom(key)} durationInFrames={seqDur(key)}>
        {i === 0 ? <C /> : <SceneIn frames={OVERLAP}><C /></SceneIn>}
      </Sequence>
    ))}

    <Audio src={staticFile("audio/trilha.wav")} volume={musicVolume} />
    {VO.map(({ key, at }) => (
      <Sequence key={key} name={`Narração ${key}`} from={at} durationInFrames={voFrames(key) + 6}>
        <Audio src={staticFile(`audio/${key}.wav`)} volume={1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const DURATION = TOTAL;
